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

test_arr = engineer_features(pd.DataFrame([[22,30,65,1012,15]], columns=['MinTemp','MaxTemp','Humidity','Pressure','WindSpeed']))[FEATURES].values[0]

# Get trees from both formats
trees_dump = [json.loads(t) for t in booster.get_dump(dump_format='json')]

booster.save_model('xgboost_full.json')
with open('xgboost_full.json') as f:
    full = json.load(f)
trees_save = full['learner']['gradient_booster']['model']['trees']

# Compare first 12 trees root node
print('Root node comparison (first 12 trees):')
for i in range(12):
    td = trees_dump[i]
    ts = trees_save[i]
    
    # get_dump root
    root_dump = f"f{td['split']}={td['split_condition']}" if 'split' in td else f"leaf={td['leaf']}"
    
    # save_model root (node 0)
    lc0 = ts['left_children'][0]
    if lc0 == -1:
        root_save = f"leaf={ts['split_conditions'][0]}"
    else:
        feat = ts['split_indices'][0]
        thresh = ts['split_conditions'][0]
        root_save = f"f{feat}={thresh}"
    
    match = 'OK' if root_dump == root_save else 'DIFF'
    print(f'  Tree {i:3d}: dump={root_dump:40s} save={root_save:40s} {match}')

# Check tree 3 more carefully - walk both formats step by step
print('\n\nDetailed walk of Tree 3:')
print('=' * 60)

print('\n--- get_dump format ---')
node = trees_dump[3]
steps = 0
while 'leaf' not in node:
    feat_idx = int(node['split'][1])
    feat_name = FEATURES[feat_idx]
    val = test_arr[feat_idx]
    child_id = node['yes'] if val <= node['split_condition'] else node['no']
    print(f'  Node {node["nodeid"]}: {feat_name}[{feat_idx}]={val:.4f} <= {node["split_condition"]}? -> node {child_id}')
    child = next(c for c in node['children'] if c['nodeid'] == child_id)
    node = child
    steps += 1
    if steps > 20:
        print('  ... (too deep)')
        break
print(f'  LEAF node {node["nodeid"]}: value = {node["leaf"]}')

print('\n--- save_model format ---')
tree = trees_save[3]
idx = 0
steps = 0
while True:
    lc = tree['left_children'][idx]
    if lc == -1:
        print(f'  LEAF node {idx}: value = {tree["split_conditions"][idx]} (base_weights: {tree["base_weights"][idx]})')
        break
    feat_idx = tree['split_indices'][idx]
    feat_name = FEATURES[feat_idx]
    threshold = tree['split_conditions'][idx]
    val = test_arr[feat_idx]
    direction = 'left' if val <= threshold else 'right'
    next_idx = lc if direction == 'left' else tree['right_children'][idx]
    print(f'  Node {idx}: {feat_name}[{feat_idx}]={val:.4f} <= {threshold}? -> {direction} -> node {next_idx}')
    idx = next_idx
    steps += 1
    if steps > 20:
        print('  ... (too deep)')
        break

# Wait - I just realized something. Let me check if `pred_leaf` indices for tree 3 actually match
# With the WALKED leaf from both formats
print('\n\npred_leaf[3] =', end=' ')
import xgboost as xgb
dtest = xgb.DMatrix(engineer_features(pd.DataFrame([[22,30,65,1012,15]], columns=['MinTemp','MaxTemp','Humidity','Pressure','WindSpeed']))[FEATURES])
leaves = booster.predict(dtest, pred_leaf=True)[0]
print(leaves[3])
print('Tree 3 has', trees_save[3]['left_children'].count(-1), 'leaves out of', len(trees_save[3]['left_children']), 'nodes')
