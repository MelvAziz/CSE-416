import numpy as np
import pymc as pm
import pyei
import json
import requests
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from pyei.two_by_two import TwoByTwoEI


df = pd.read_csv("alabama.csv")

group_fraction_2by2 = np.array(df["pct_white_vote"])
votes_fraction_2by2 = np.array(df["pct_republican"])
total_pops = np.array(df["total_pops"])

demographic_group_name_2by2 = "white"
party_name_2by2 = "Republican"
precinct_names = df['precinct']

ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=15, pareto_shape=2)

ei_2by2.fit(group_fraction_2by2, 
       votes_fraction_2by2, 
       total_pops, 
       demographic_group_name=demographic_group_name_2by2, 
       party_name=party_name_2by2, 
       candidate_name=precinct_names, 
       draws=1200,        # optional
       tune=3000,         # optional
       target_accept=.99  # optional
)

ei_2by2.plot()

fig, ax = plt.gcf(), plt.gca()  # Get the current figure and axes
plot_data = []

for line in ax.lines:
    x_data, y_data = line.get_data()
    plot_data.append({
        "x": x_data.tolist(),  
        "y": y_data.tolist()   
    })

json_payload = json.dumps(plot_data)

url = "http://localhost:8000"

headers = {'Content-Type': 'application/json'}

response = requests.post(url, data=json_payload, headers=headers)