import sys
import geopandas as gpd
import matplotlib.pyplot as plt
from create_attribute_list import get_aggregatable_attributes
import os


def aggregate_census_blocks_to_precinct_level(
        state, input_precinct_index, 
        precinct_data_frame, census_block_data_frame, attribute_list):
    census_blocks_in_precinct = []
    for census_block_index in range(0, len(census_block_data_frame)):
        precinct_geodata = gpd.GeoSeries(
            precinct_data_frame.iloc[input_precinct_index].geometry).make_valid()
        census_block_geodata = gpd.GeoSeries(
            census_block_data_frame.iloc[census_block_index].geometry).make_valid()
        intersection = precinct_geodata.intersection(census_block_geodata)
        if (not (intersection.is_empty.item())):
            census_blocks_in_precinct.append(
                (census_block_index, intersection.area.item() / census_block_geodata.area.item()))
    for attribute in attribute_list:
        data = []
        if attribute == "UR20":  # Special case: Split into urban population and rural population
            for census_block in census_blocks_in_precinct:
                census_block_index = census_block[0]
                census_block_overlap_percent = census_block[1]
                population_type = getattr(
                    census_block_data_frame.iloc[census_block_index], "UR20")
                data.append((getattr(
                    census_block_data_frame.iloc[census_block_index], "POP20") 
                    * census_block_overlap_percent, population_type))
            urban_prefix = f"/gpfs/projects/CSE416/Owls/{state}/attributes/URB_POP20"
            rural_prefix = f"/gpfs/projects/CSE416/Owls/{state}/attributes/RUR_POP20"
            if not os.path.exists(urban_prefix):
                os.mkdir(urban_prefix)
            if not os.path.exists(rural_prefix):
                os.mkdir(rural_prefix)
            urban_file = open(
                f"{urban_prefix}/{input_precinct_index}.txt", "w")
            rural_file = open(
                f"{rural_prefix}/{input_precinct_index}.txt", "w")
            urban_sum = 0
            rural_sum = 0
            for d in data:
                if (d[1] == "U"):
                    urban_file.write(f"{d[0]}\n")
                    urban_sum += d[0]
                else:
                    rural_file.write(f"{d[0]}\n")
                    rural_sum += d[0]
            urban_file.write(str(urban_sum))
            rural_file.write(str(rural_sum))
            urban_file.close()
            rural_file.close()
        else:
            prefix = f"/gpfs/projects/CSE416/Owls/{state}/attributes/{attribute}"
            if not os.path.exists(prefix):
                os.mkdir(prefix)
            for census_block in census_blocks_in_precinct:
                census_block_index = census_block[0]
                census_block_overlap_percent = census_block[1]
                data.append(getattr(
                    census_block_data_frame.iloc[census_block_index], attribute)
                    * census_block_overlap_percent)
            f = open(f"{prefix}/{input_precinct_index}.txt", "w")
            sum = 0
            for d in data:
                f.write(f"{d}\n")
                sum += d
            f.write(str(sum))
            f.close()


state = sys.argv[1].lower()
filter = sys.argv[2]
input_precinct_index = int(sys.argv[3])
if state != "alabama" and state != "mass":
    print("State should be either 'mass' or 'alabama'.")
    exit()
geojson_file_path_prefix = "/gpfs/projects/CSE416/Owls/scripts/geojson-files"
precincts_geojson_file = f"{geojson_file_path_prefix}/{state}_precincts.geojson"
precincts_geopandas_data_frame = gpd.read_file(precincts_geojson_file)
if filter != "race" and filter != "economic" and filter != "pop_density":
    print("Invalid filter. Options are: race, hispanic, economic, pop_density")
    exit()
census_block_geojson_file = f"{geojson_file_path_prefix}/{state}_census_block_{filter}.geojson"
census_block_data_frame = gpd.read_file(census_block_geojson_file)
attribute_list = get_aggregatable_attributes(filter, False)
aggregate_census_blocks_to_precinct_level(
    state, input_precinct_index, precincts_geopandas_data_frame, 
    census_block_data_frame, attribute_list)
