import sys
import geopandas as gpd
import matplotlib.pyplot as plt

def get_precinct_pop_data(test_index, df, census_blocks, county_to_census_block):
    blocks_to_check = county_to_census_block[df.iloc[test_index].COUNTYFP20]
    blocks = []
    area_percent = []
    # print(blocks_to_check)
    for i in blocks_to_check:
        series1 = gpd.GeoSeries(df.iloc[test_index].geometry).make_valid()
        series2 = gpd.GeoSeries(census_blocks.iloc[i].geometry).make_valid()
        series_int = series1.intersection(series2)
        if (not(series_int.is_empty.item())):
            blocks.append(i)
            area_percent.append(series_int.area.item() / series2.area.item())
    
    g = open("/gpfs/scratch/mborczuk/gerrychain/prop_list_ur.txt", "r")
    for k in g.readlines():
        prop = k[:-1]
        data = []
        for j in range(0, len(blocks)):
            data.append([df.iloc[test_index].UNIQUE_ID, getattr(census_blocks.iloc[blocks[j]], prop) * area_percent[j]])
        f = open(f"/gpfs/scratch/mborczuk/gerryfiles/{prop}/{test_index}.txt", "w")
        sum = 0
        for d in data:
            f.write(f"{d[0]},{d[1]}\n")
            sum += d[1]
            f.flush()
        f.write(str(sum))
        f.close()


file = "./alabama_census_block_ur.geojson"
census_blocks = gpd.read_file(file)

# set file path
file = "./alabama_precincts.json"

# read in all geodata
df = gpd.read_file(file)
print(len(df))
county_to_census_block = {}
for i in range(0, len(census_blocks)):
    county = census_blocks.iloc[i].COUNTYFP20
    if county in county_to_census_block.keys():
        county_to_census_block[county].append(i)
    else:
        county_to_census_block[county] = [i]

print("Done reading")

test_index = int(sys.argv[1])

get_precinct_pop_data(test_index, df, census_blocks, county_to_census_block)


        
    
