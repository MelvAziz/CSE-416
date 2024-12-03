import sys
from gerrychain import (Partition, Graph, MarkovChain,
                        updaters, constraints, accept)
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous
from functools import partial
import json
import random

state = sys.argv[1].lower()
district_plan_index = int(sys.argv[2])
random.seed(904 + district_plan_index)
num_districts = 0
graph = None
state_information_json_file = None
if (state == "alabama"):
    num_districts = 7
    graph = Graph.from_json("/gpfs/projects/CSE416/Owls/alabama/alabama.json")
    state_information_json_file = open("/gpfs/projects/CSE416/Owls/alabama/alabama.json")
elif (state == "mass"):
    num_districts = 9
    graph = Graph.from_json("/gpfs/projects/CSE416/Owls/mass/mass.json")
    state_information_json_file = open("/gpfs/projects/CSE416/Owls/mass/mass.json")
else:  
    print("State should be either 'mass' or 'alabama'.")
    exit()
state_information_dict = json.load(state_information_json_file)
aggregation_functions = {}
population_attributes = []
for population_attribute in state_information_dict["nodes"][0].keys():
    if (population_attribute != "x" and population_attribute != "y" and population_attribute != "id"):
        aggregation_functions[population_attribute] = updaters.Tally(population_attribute)
        population_attributes.append(population_attribute)
# P0010001 is the name of the property that refers to the total population of the state
initial_partition = Partition.from_random_assignment(
    graph,
    n_parts=num_districts,
    epsilon=0.1,
    pop_col="P0010001",
    updaters=aggregation_functions
)
ideal_population = sum(initial_partition["P0010001"].values()) / len(initial_partition)
proposal = partial(
    recom,
    pop_col="P0010001",
    pop_target=ideal_population,
    epsilon=0.05,
)
recom_chain = MarkovChain(
    proposal=proposal,
    constraints=[contiguous],
    accept=accept.always_accept,
    initial_state=initial_partition,
    total_steps=10000
)
partition_list = [] 
assignment_list = []
for walk_index, walk_result in enumerate(recom_chain):
    partition_list.append(walk_result)
    assignment_list.append(walk_result.assignment)
district_plan_data = {}
for district_index in range(0, num_districts):
    district_plan_data[district_index] = {}
    for population_attribute in population_attributes:
        district_plan_data[district_index][population_attribute] = partition_list[9999][population_attribute][district_index]
    district_plan_data[district_index]["PRECINCT_INDEX_LIST"] = []
    for precinct_index in list(assignment_list[9999].parts[district_index]):
        district_plan_data[district_index]["PRECINCT_INDEX_LIST"].append(precinct_index)
district_plan_output_file = open(f"/gpfs/projects/CSE416/Owls/{state}/district-plans/{state}-district-plan-{district_plan_index}.json", "w")
json.dump(district_plan_data, district_plan_output_file)
state_information_json_file.close()
district_plan_output_file.close()
