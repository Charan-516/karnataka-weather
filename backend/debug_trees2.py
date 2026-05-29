import json, pandas as pd, numpy as np, xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE

FEATURES = ['MinTemp','MaxTemp','Humidity','Pressure','WindSpeed','TempRange','TempMean','HumidityWind','PressureAnomaly','StormIndex','HeatDryIndex','FogIndex','HumidityHigh','HumidityLow','WindPower']
def engineer_features(df):
    out = df.copy()
    out['TempRange'] = out['MaxTemp'] - out['MinTemp']
    out['TempMean'] = (out['MaxTemp'] + out['MinTemp']) / 2.0
    out['HumidityWind'] = out['Humidity'] * out['WindSpeed'] / 100.0
    out['PressureAnomaly'] = 1013.25 - out['Pressure']
    out['StormIndex'] = (out['Humidity']/100.0)*(out['WindSpeed']/75.0)*(np.clip(out['PressureAnomaly'],0,None)/25.0+0.3)
    out['HeatDryIndex'] = (out['MaxTemp']/45.0)*(1.0-out['Humidity']/100.0)
    out['FogIndex'] = np.clip(1.0-(out['MinTemp']-10.0)/18.0,0,1)*(out['Humidity']/100.0)*np.clip(1.0-out['WindSpeed']/75.0,0,1)
    out['HumidityHigh'] = (np.clip(out['Humidity']-70,0,None)/30.0)**2
    out['HumidityLow'] = (np.clip(50-out['Humidity'],0,None)/50.0)**2
    out['WindPower'] = (out['WindSpeed']/75.0)**1.5
    return out

df = pd.read_csv('karnataka_weather_500.csv')
le = LabelEncoder()
df_eng = engineer_features(df)
X = df_eng[FEATURES].values
y = le.fit_transform(df['Condition'])
smote = SMOTE(random_state=42, k_neighbors=5)
X_res, y_res = smote.fit_resample(X, y)

m = xgb.XGBClassifier(n_estimators=100, max_depth=8, learning_rate=0.05, subsample=0.85, colsample_bytree=0.85, min_child_weight=3, gamma=0.1, reg_alpha=0.1, reg_lambda=1.0, objective='multi:softprob', num_class=6, eval_metric='mlogloss', random_state=42)
m.fit(X_res, y_res)
booster = m.get_booster()

test_df = engineer_features(pd.DataFrame([[22,30,65,1012,15]], columns=['MinTemp','MaxTemp','Humidity','Pressure','WindSpeed']))
test_arr = test_df[FEATURES].values
dtest = xgb.DMatrix(test_arr)

# Use the booster to compute leaf contributions and understand the format
margin = booster.predict(dtest, output_margin=True)[0]
print('Margin:', margin)

# Load the full model
booster.save_model('xgboost_full.json')
with open('xgboost_full.json') as f:
    full = json.load(f)

gbt = full['learner']['gradient_booster']['model']
trees = gbt['trees']
tree_info = gbt['tree_info']

# Check: maybe for leaf nodes, the value is in base_weights, not split_conditions
def walk_tree_baseweights(tree_arr, features):
    idx = 0
    while True:
        if tree_arr['left_children'][idx] == -1:
            return tree_arr['base_weights'][idx]
        feat_idx = tree_arr['split_indices'][idx]
        threshold = tree_arr['split_conditions'][idx]
        if features[feat_idx] <= threshold:
            idx = tree_arr['left_children'][idx]
        else:
            idx = tree_arr['right_children'][idx]

# Also check: maybe split_conditions for leaves is NOT the leaf value
def walk_tree_splitcond(tree_arr, features):
    idx = 0
    while True:
        if tree_arr['left_children'][idx] == -1:
            return tree_arr['split_conditions'][idx]
        feat_idx = tree_arr['split_indices'][idx]
        threshold = tree_arr['split_conditions'][idx]
        if features[feat_idx] <= threshold:
            idx = tree_arr['left_children'][idx]
        else:
            idx = tree_arr['right_children'][idx]

# Get leaves from pred_leaf
leaves = booster.predict(dtest, pred_leaf=True)[0]
print('pred_leaf first 6:', leaves[:6])

# Now let me compute scores from different sources
num_class = 6

# Method 1: split_conditions (original approach)
scores_sc = np.zeros(num_class)
for i in range(len(trees)):
    cls = i % num_class
    scores_sc[cls] += walk_tree_splitcond(trees[i], test_arr[0])

# Method 2: base_weights
scores_bw = np.zeros(num_class)
for i in range(len(trees)):
    cls = i % num_class  
    scores_bw[cls] += walk_tree_baseweights(trees[i], test_arr[0])

print('\nScores from split_conditions:', scores_sc)
print('Scores from base_weights:', scores_bw)
print('Margin:', margin)
print('\nDiff SC vs margin:', scores_sc - margin)
print('Diff BW vs margin:', scores_bw - margin)

# Hmm, base_weights doesn't seem right either for the non-matching classes
# Let me check: does the number of trees match the iteration structure?
# Maybe some trees are "useless" and skipped?

# Check iteration_indptr
indptr = gbt['iteration_indptr']
print(f'\niteration_indptr length: {len(indptr)} (should be 101)')
print(f'Total trees: {indptr[-1]} (should be 600)')

# Check tree_info more carefully
print(f'First 12 tree_info values: {tree_info[:12]}')

# Try: maybe the issue is that the leaf values from get_dump() are the CORRECT ones
# but the save_model trees are just stored differently and need different indexing?
# Let me compare leaf values for a specific tree where get_dump and save_model disagree

# Tree 3 comparison
trees_dump = booster.get_dump(dump_format='json')
td3 = json.loads(trees_dump[3])

# Walk tree 3 in get_dump format
node = td3
while 'leaf' not in node:
    feat_idx = int(node['split'][1])
    val = test_arr[0][feat_idx]
    child_id = node['yes'] if val <= node['split_condition'] else node['no']
    child = next(c for c in node['children'] if c['nodeid'] == child_id)
    node = child
dump_leaf_3 = node['leaf']

# Walk tree 3 in save_model using pred_leaf index
leaf_idx_3 = int(leaves[3])
save_leaf_sc_3 = trees[3]['split_conditions'][leaf_idx_3]
save_leaf_bw_3 = trees[3]['base_weights'][leaf_idx_3]

print(f'\nTree 3 comparison:')
print(f'  get_dump leaf: {dump_leaf_3}')
print(f'  pred_leaf index: {leaf_idx_3}')
print(f'  save_model split_conditions[{leaf_idx_3}]: {save_leaf_sc_3}')
print(f'  save_model base_weights[{leaf_idx_3}]: {save_leaf_bw_3}')

# Wait - pred_leaf returns leaf indices per tree, but these indices might
# be relative (0-based within the tree) or absolute (index into arrays)?
# Actually, the leaf_idx_3 is 3 (from leaves = [225, 154, 3, 3, 185, 151])
# Tree 3 has leaf_idx = 3, which is a very small index.
# Let me check if node 3 in tree 3 is actually a leaf
print(f'  Tree 3, node 3 left_children: {trees[3]["left_children"][3]}, right_children: {trees[3]["right_children"][3]}')

# Check: does node 3 have left_children == -1?
if trees[3]['left_children'][3] == -1:
    print(f'  -> Node 3 is a leaf! split_conditions[3] = {trees[3]["split_conditions"][3]}, base_weights[3] = {trees[3]["base_weights"][3]}')
else:
    print(f'  -> Node 3 is NOT a leaf, it has children')
    # Walk to find the actual leaf
    idx = 3
    path = [3]
    while True:
        if trees[3]['left_children'][idx] == -1:
            print(f'  Found leaf at node {idx}: val={trees[3]["split_conditions"][idx]}')
            break
        feat_idx = trees[3]['split_indices'][idx]
        threshold = trees[3]['split_conditions'][idx]
        if test_arr[0][feat_idx] <= threshold:
            idx = trees[3]['left_children'][idx]
        else:
            idx = trees[3]['right_children'][idx]
        path.append(idx)
        if len(path) > 20:
            print('  Too many steps, aborting')
            break
    print(f'  Path: {path}')
