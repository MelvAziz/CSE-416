import geopandas as gpd
import json
import csv

# set file path
file = "./alabama_precincts.json"

# read in all geodata
df = gpd.read_file(file)

final_dict = {}
final_dict["directed"] = False
final_dict["multigraph"] = False
final_dict["graph"] = []
final_dict["nodes"] = []
final_dict["adjacency"] = []

out_csv = open("./alabama.csv", "w")
csvWriter = csv.writer(out_csv, delimiter=',')
prop_list_file = open("/gpfs/scratch/mborczuk/gerrychain/prop_list.txt", "r")
prop_list = prop_list_file.readlines()
header = ["UNIQUE_ID", "NODE_ID", "COUNTYFP"]
for j in prop_list:
    header.append(j[:-1])
csvWriter.writerow(header)

for i in range(0, len(df)):
    # f = open(f"/gpfs/scratch/mborczuk/gerryfiles/{i}.txt", "r")
    # population = int(f.readlines()[-1])
    precinct_series = gpd.GeoSeries(df.iloc[i].geometry)
    center = precinct_series.centroid
    node = {}
    # node["TOTPOP"] = population
    node["x"] = center[0].x
    node["y"] = center[0].y
    node["id"] = i
    # prop_list_file = open("/gpfs/scratch/mborczuk/gerrychain/prop_list.txt", "r")
    # prop_list = prop_list_file.readlines()
    row = [df.iloc[i].UNIQUE_ID, i, df.iloc[i].COUNTYFP]
    for j in prop_list:
        prop = j[:-1]
        h = open(f"/gpfs/scratch/mborczuk/gerryfiles/{prop}/{i}.txt", "r")
        prop_sum = int(float(h.readlines()[-1]))
        node[prop] = prop_sum
        row.append(prop_sum)
    csvWriter.writerow(row)
    final_dict["nodes"].append(node)
    f = open(f"/gpfs/scratch/mborczuk/gerryintersections-alabama/{i}.json", "r")
    adj_dict = json.load(f)
    final_dict["adjacency"].append(adj_dict["adjacency"])
g = open("./alabama.json", "w")
json.dump(final_dict, g)
