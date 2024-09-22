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
import ipywidgets as widgets
from IPython.display import display, clear_output
import time

# Set the random seed so that the results are reproducible!
import random
random.seed(2024)

# run many iterations
for i in range(0, 3):
    # load graph from JSON file
    graph = Graph.from_json("./gerrymandria.json")

    # population tally, should be able to count different variables as well
    # fails on the last partition for some reason
    my_updaters = {
        "population": updaters.Tally("TOTPOP")
    }

    # randomly create initial partition
    # not sure if this should be done - maybe we are supposed to start from same place (current plan) each time
    # ask about this!!
    initial_partition = Partition.from_random_assignment(
        graph,
        n_parts=8,
        epsilon=0.05,
        pop_col="TOTPOP",
        updaters=my_updaters
    )

    # print populations of initial districts
    for district, pop in initial_partition["population"].items():
        print(f"District {district}: {pop}")

    # This should be 8 since each district has 1 person in it.
    # Note that the key "population" corresponds to the population updater
    # that we defined above and not with the population column in the json file.
    ideal_population = sum(initial_partition["population"].values()) / len(initial_partition)

    # setup recom function with 5% epsilon
    proposal = partial(
        recom,
        pop_col="TOTPOP",
        pop_target=ideal_population,
        epsilon=0.05,
    )

    # build markov chain
    # contiguous constraint
    # step 1000 times for now
    recom_chain = MarkovChain(
        proposal=proposal,
        constraints=[contiguous],
        accept=accept.always_accept,
        initial_state=initial_partition,
        total_steps=1000
    )

    # store all 1000 partitions (initial -> final)
    partition_list = [] 
    assignment_list = []

    for i, item in enumerate(recom_chain):
        print(f"Finished step {i+1}/{len(recom_chain)}", end="\r")
        partition_list.append(item)
        assignment_list.append(item.assignment)

    # manually aggregate since for some reason the updater for the last partition doesn't work
    dist_pops = {}

    for i in range(0, len(partition_list[999].graph.nodes)):
        node = partition_list[999].graph.nodes[i]
        if (not(node["district"] in dist_pops.keys())):
            dist_pops[node["district"]] = node["TOTPOP"]
        else:
            dist_pops[node["district"]] += node["TOTPOP"]

    # print populations for final partition
    for district in dist_pops.keys():
        print(f"District {district}: {dist_pops[district]}")

    # generate images for initial partition and final partition
    frames = []

    for j in range(0, 2):
        i = j * (len(assignment_list) - 1)
        fig, ax = plt.subplots(figsize=(8,8))
        pos = {node :(data['x'],data['y']) for node, data in graph.nodes(data=True)}
        node_colors = [mcm.tab20(int(assignment_list[i][node]) % 20) for node in graph.nodes()]
        node_labels = {node: str(assignment_list[i][node]) for node in graph.nodes()}

        nx.draw_networkx_nodes(graph, pos, node_color=node_colors)
        nx.draw_networkx_edges(graph, pos)
        nx.draw_networkx_labels(graph, pos, labels=node_labels)
        plt.axis('off')

        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image = Image.open(buffer)
        frames.append(image)
        plt.close(fig)

    def show_frame(idx):
        clear_output(wait=True)
        display(frames[idx])

    i = 0

    frames[0].show()
    time.sleep(5)
    frames[1].show()

    # slider = widgets.IntSlider(value=0, min=0, max=len(frames)-1, step=1, description='Frame:')
    # slider.layout.width = '500px'
    # widgets.interactive(show_frame, idx=slider)