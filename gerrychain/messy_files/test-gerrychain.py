import sys
import matplotlib.pyplot as plt
from gerrychain import (Partition, Graph, MarkovChain,
                        updaters, constraints, accept)
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous
from functools import partial
import pandas
# import matplotlib_inline.backend_inline
import matplotlib.cm as mcm
import matplotlib.pyplot as plt
import networkx as nx
from PIL import Image
import io
# import ipywidgets as widgets
from IPython.display import display, clear_output
import json
import time

# Set the random seed so that the results are reproducible!
import random
random.seed(904 + int(sys.argv[2]))

# run many iterations
for index in range(0, 1):
    districts = 0
    graph = None
    json_file = None
    if (sys.argv[1] == "alabama"):
        districts = 7
        # load graph from JSON file
        graph = Graph.from_json("./alabama.json")
        json_file = open("./alabama.json")
    elif (sys.argv[1] == "mass"):
        districts = 9
        graph = Graph.from_json("./mass.json")
        json_file = open("./mass.json")
    else:  
        print("Valid values: alabama or mass")
        exit()

    json_dict = json.load(json_file)
    # for i in json_dict["nodes"][0].keys():
    #     print(i)
    # population tally, should be able to count different variables as well
    # fails on the last partition for some reason
    my_updaters = {}

    props = []
    for i in json_dict["nodes"][0].keys():
        if (i != "x" and i != "y" and i != "id"):
            my_updaters[i] = updaters.Tally(i)
            props.append(i)
    # randomly create initial partition
    # not sure if this should be done - maybe we are supposed to start from same place (current plan) each time
    # ask about this!!
    initial_partition = Partition.from_random_assignment(
        graph,
        n_parts=districts,
        epsilon=0.1,
        pop_col="P0010001",
        updaters=my_updaters
    )

    # print populations of initial districts
    for district, pop in initial_partition["P0010001"].items():
        print(f"District {district}: {pop}")

    # This should be 8 since each district has 1 person in it.
    # Note that the key "population" corresponds to the population updater
    # that we defined above and not with the population column in the json file.
    ideal_population = sum(initial_partition["P0010001"].values()) / len(initial_partition)

    # setup recom function with 10% epsilon
    proposal = partial(
        recom,
        pop_col="P0010001",
        pop_target=ideal_population,
        epsilon=0.1,
    )

    # build markov chain
    # contiguous constraint
    # step 1000 times for now
    recom_chain = MarkovChain(
        proposal=proposal,
        constraints=[contiguous],
        accept=accept.always_accept,
        initial_state=initial_partition,
        total_steps=100 # extra walk since aggregation doesn't work on the last partition. 10001st walk will be ignored
    )

    # store all 10000 partitions (initial -> final)
    partition_list = [] 
    assignment_list = []

    for i, item in enumerate(recom_chain):
        print(f"Finished step {i+1}/{len(recom_chain)}", end="\r")
        partition_list.append(item)
        assignment_list.append(item.assignment)
    
    save_data = {}
    # print populations for final partition
    for i in range(0, districts):
        save_data[i] = {}
        for j in props:
            save_data[i][j] = partition_list[98][j][i]
        save_data[i]["PRECINCT_LIST"] = []
        for j in list(assignment_list[98].parts[i]):
            save_data[i]["PRECINCT_LIST"].append(j)

    g = open(f"/gpfs/projects/CSE416/Owls/gerrychain-alabama/{sys.argv[1]}-district-plan-{sys.argv[2]}.json", "w")
    json.dump(save_data, g)
    json_file.close()
    g.close()

    #slider = widgets.IntSlider(value=0, min=0, max=len(frames)-1, step=1, description='Frame:')
    #slider.layout.width = '500px'
    #widgets.interactive(show_frame, idx=slider)
