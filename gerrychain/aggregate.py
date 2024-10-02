import geopandas as gpd
import json

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
    prop_list_file = open("/gpfs/scratch/mborczuk/gerrychain/prop_list.txt", "r")
    prop_list = prop_list_file.readlines()
    for j in prop_list:
        prop = j[:-1]
        h = open(f"/gpfs/scratch/mborczuk/gerryfiles/{prop}/{i}.txt", "r")
        prop_sum = int(f.readlines()[-1])
        node[prop] = prop_sum
    final_dict["nodes"].append(node)
    f = open(f"/gpfs/scratch/mborczuk/gerryintersections/{i}.txt", "r")
    adj_dict = json.load(f)
    final_dict["adjacency"].append(adj_dict["adjacency"])
g = open("./alabama.json", "w")
json.dump(final_dict, g)
