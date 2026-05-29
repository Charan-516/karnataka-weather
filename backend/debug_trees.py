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
test_input = np.array([[22.0, 30.0, 65.0, 1012.0, 15.0]])
test_df = engineer_features(pd.DataFrame(test_input, columns=['MinTemp','MaxTemp','Humidity','Pressure','WindSpeed']))
test_arr = test_df[FEATURES].values

dtest = xgb.DMatrix(test_arr)

# Get margin
margin = booster.predict(dtest, output_margin=True)[0]
print('Margin:', margin)

# Get pred_leaf - which leaf each tree lands on
leaves = booster.predict(dtest, pred_leaf=True)[0]
print('Number of trees (leaves):', len(leaves))

# Get tree dumps
trees = booster.get_dump(dump_format='json')
trees_parsed = [json.loads(t) for t in trees]
print('Number of dumped trees:', len(trees_parsed))

# Compare: for each tree, get the leaf value from get_dump and from save_model
with open('xgboost_full.json') as f:
    full = json.load(f)
full_trees = full['learner']['gradient_booster']['model']['trees']

def walk_tree_dump(tree_json, features):
    node = tree_json
    while 'leaf' not in node:
        feat_idx = int(node['split'][1])
        val = features[feat_idx]
        child_id = node['yes'] if val <= node['split_condition'] else node['no']
        child = next(c for c in node['children'] if c['nodeid'] == child_id)
        node = child
    return node['leaf']

def walk_tree_savemodel(tree_arr, features):
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

# Compare first 12 trees
print('\nTree-by-tree comparison (first 12):')
num_class = 6
for i in range(12):
    cls = i % num_class
    leaf_dump = walk_tree_dump(trees_parsed[i], test_arr[0])
    leaf_save = walk_tree_savemodel(full_trees[i], test_arr[0])
    match = 'OK' if abs(leaf_dump - leaf_save) < 1e-6 else 'DIFF'
    print(f'  Tree {i:3d} (class {cls}): dump={leaf_dump:.6f}, save={leaf_save:.6f} {match}')

# Compute full scores from both formats
scores_dump = np.zeros(num_class)
scores_save = np.zeros(num_class)
for i in range(len(trees_parsed)):
    cls = i % num_class
    scores_dump[cls] += walk_tree_dump(trees_parsed[i], test_arr[0])
    scores_save[cls] += walk_tree_savemodel(full_trees[i], test_arr[0])

print('\nScores from get_dump:', scores_dump)
print('Scores from save_model:', scores_save)
print('Margin:', margin)
print('\nDiff dump vs margin:', scores_dump - margin)
print('Diff save vs margin:', scores_save - margin)

# Check: does pred_leaf give us the leaf index, and can we look up the value?
print('\nFirst 6 leaf indices:', leaves[:6])
# These are leaf indices within each tree

# Let me also get contribs to understand
contribs = booster.predict(dtest, pred_contribs=True)
print('\nContributions shape:', contribs.shape)
print('Contributions bias:', contribs[0, -1, :])
print('Feature contributions sum + bias:')
for c in range(num_class):
    total = contribs[0, :-1, c].sum() + contribs[0, -1, c]
    print(f'  Class {c}: {total:.6f} (margin: {margin[c]:.6f})')
