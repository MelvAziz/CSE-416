import sys
import geopandas as gpd
import matplotlib.pyplot as plt
import json

file = "./mass_counties.geojson"
counties = gpd.read_file(file)
print(len(counties))

# set file path
file = "./mass_precincts.geojson"

# read in all geodata
df = gpd.read_file(file)
print(len(df))

print("Done reading")

precinct_to_county_dict = {}

for i in range(0, len(df)):
    precinct_to_county_dict[i] = []
    series1 = gpd.GeoSeries(df.iloc[i].geometry).make_valid()
    for j in range(0, len(counties)):
        series2 = gpd.GeoSeries(counties.iloc[j].geometry).make_valid()
        series_int = series1.intersection(series2)
        if (not(series_int.is_empty.item())):
            precinct_to_county_dict[i].append(counties.iloc[j].COUNTYFP)

g = open("./mass_precincts_to_counties.json", "w")
json.dump(precinct_to_county_dict, g)
        
    
