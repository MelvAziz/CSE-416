import numpy as np
import pymc as pm
import pyei
import json
import requests
import pandas as pd
import matplotlib.pyplot as plt
from pyei.two_by_two import TwoByTwoEI
import plotly.graph_objects as go
from scipy.stats import gaussian_kde

def ei_analysis(type, state, precincts, elec_type):
  '''
  Provides ei analysis for candidates within a district by
  regional, economic, or racial distinctions

  Args:
  type - a string indicating "racial", "economic", or "regional" distinction
  state - a string indicating which state we are looking for "mass" or "bama"
  precincts - a list of precinct names to pull from the state's dataset
  elec_type - a string indicating which election type we are looking for "general" or "senator"
  '''

  if state == "mass":
    df = pd.read_csv("mass.csv")
    column_mapping = {
    "P0020001": "Total",
    "P0020002": "Hispanic",
    "P0020003": "Not Hispanic",
    "P0020005": "White",
    "P0020006": "Black",
    "RUR_POP20": "Rural",
    "URB_POP20": "Urban",
    "G20PREDBID": "Biden",
    "G20PRERTRU": "Trump",
    "G20USSROCO": "Oconnor_R",
    "G20USSDMAR": "Markey_D",
    }
    df.rename(columns=column_mapping, inplace=True)
  elif state == "bama":
    df = pd.read_csv("alabama.csv")
    column_mapping = {
    "P0020001": "Total",
    "P0020002": "Hispanic",
    "P0020003": "Not Hispanic",
    "P0020005": "White",
    "P0020006": "Black",
    "RUR_POP20": "Rural",
    "URB_POP20": "Urban",
    "G22USSDBOY": "Boyd_D",
    "G22USSRBRI": "Britt_R",
    "G22GOVDFLO": "Flowers_D",
    "G22GOVRIVE": "Ivey_R",
    }
    df.rename(columns=column_mapping, inplace=True)
  else:
    raise ValueError

  if df.isnull().values.any():
    print("There are NaN values in the DataFrame.")
  else:
      print("No NaN values in the DataFrame.")

  df = df[df['UNIQUE_ID'].isin(precincts)]

  if type == "racial":
    df["adjusted_total"] = (df["White"]
                          + df["Black"]
                          + df["Hispanic"])
    df['pct_white'] = df['White'] / df['adjusted_total']
    df['pct_black'] = df['Black'] / df['adjusted_total']
    df['pct_hispanic'] = df['Hispanic'] / df['adjusted_total']
    values = df[['pct_white', 'pct_black', 'pct_hispanic']]
    row_sums = values.sum(axis=1)  # Compute the sum of each row
    print(row_sums.shape)
    # Check if each row sum is close to 1.0
    is_close = np.isclose(row_sums, 1.0)
    values_clean = values[is_close]
    df = df[is_close]

    demographic_group_names_rbyc = ['white', 'black', 'hispanic']

  elif type == "regional":

    # Initialize the new columns with 0
    df[['rural_pop', 'suburban_pop', 'urban_pop']] = 0

    # Use .loc to set values conditionally
    df.loc[df['REGION'] == 'S', 'suburban_pop'] = df['Total'].astype(int)
    df.loc[df['REGION'] == 'U', 'urban_pop'] = df['Total'].astype(int)
    df.loc[df['REGION'] == 'R', 'rural_pop'] = df['Total'].astype(int)

    # Check for "U" regions and non-zero sum
    if df['REGION'].isin(['U']).any():
        print("Regions with 'U' exist.")
        urban_sum = df.loc[df['REGION'] == 'U', 'urban_pop'].sum()
        if urban_sum != 0:
            print("The sum of urban populations for 'U' regions is not zero.")
        else:
            print("Warning: The sum of urban populations for 'U' regions is zero.")
    else:
        print("No regions with 'U' found.")

    df['adjusted_total'] = df['rural_pop'] + df['suburban_pop'] + df['urban_pop']
    df['pct_rural'] = df['rural_pop'] / df['adjusted_total']
    df['pct_suburban'] = df['suburban_pop'] / df['adjusted_total']
    df['pct_urban'] = df['urban_pop'] / df['adjusted_total']

    values = df[['pct_rural', 'pct_suburban','pct_urban']]
    row_sums = values.sum(axis=1)

    # Check if each row sum is close to 1.0
    is_close = np.isclose(row_sums, 1.0)
    rows_not_close = df[~is_close]
    print("\nRows where the sum is not close to 1.0:")
    print(rows_not_close)
    values_clean = values[is_close]

    # Identify columns with sum equal to 0
    zero_sum_columns = values_clean.columns[values_clean.sum(axis=0) == 0]

    # Drop columns with sum equal to 0
    values_clean = values_clean.drop(zero_sum_columns, axis=1)

    # Get a list of remaining column names
    remaining_columns = values_clean.columns.tolist()

    print(values_clean.head(10))
    df = df[is_close]

    demographic_group_names_rbyc = remaining_columns

  elif type == "economic":
    '''
     29  E100_125K22  2173 non-null   float64
 30  E10K_15K22   2173 non-null   float64
 31  E125_150K22  2173 non-null   float64
 32  E150_200K22  2173 non-null   float64
 33  E15K_20K22   2173 non-null   float64
 34  E200K_MOR22  2173 non-null   float64
 35  E20K_25K22   2173 non-null   float64
 36  E25K_30K22   2173 non-null   float64
 37  E30K_35K22   2173 non-null   float64
 38  E35K_40K22   2173 non-null   float64
 39  E40K_45K22   2173 non-null   float64
 40  E45K_50K22   2173 non-null   float64
 41  E50K_60K22   2173 non-null   float64
 42  E60K_75K22   2173 non-null   float64
 43  E75K_100K22  2173 non-null   float64
 44  LESS_10K22   2173 non-null   float64
 45  TOT_HOUS22
    '''
    df['0-25K'] = (df['LESS_10K22'] + df['E10K_15K22'] + df['E15K_20K22'] + df['E20K_25K22'])
    df['25-50K'] = (df['E25K_30K22'] + df['E30K_35K22'] + df['E35K_40K22'] + df['E40K_45K22']
                    + df['E45K_50K22'])
    df['50-75K'] = (df['E50K_60K22'] + df['E60K_75K22'])
    df['75-100K'] = (df['E75K_100K22'])
    df['100-125K'] = df['E100_125K22']
    df['125-150K'] = df['E125_150K22']
    df['150K+'] = (df['E150_200K22'] + df['E200K_MOR22'])

    df['adjusted_total'] = (df['0-25K'] + df['25-50K'] + df['50-75K'] + df['75-100K']
                       + df['100-125K'] + df['125-150K'] + df['150K+'])

    df['pct_0-25K'] = df['0-25K'] / df['adjusted_total']
    df['pct_25-50K'] = df['25-50K'] / df['adjusted_total']
    df['pct_50-75K'] = df['50-75K'] / df['adjusted_total']
    df['pct_75-100K'] = df['75-100K'] / df['adjusted_total']
    df['pct_100-125K'] = df['100-125K'] / df['adjusted_total']
    df['pct_125-150K'] = df['125-150K'] / df['adjusted_total']
    df['pct_150K+'] = df['150K+'] / df['adjusted_total']

    values = df[['pct_0-25K', 'pct_25-50K', 'pct_50-75K', 'pct_75-100K', 'pct_100-125K', 'pct_125-150K', 'pct_150K+']]
    print(values.head())
    row_sums = values.sum(axis=1)
    print(row_sums)

    # Check if each row sum is close to 1.0
    is_close = np.isclose(row_sums, 1.0)
    values_clean = values[is_close]
    df = df[is_close]


    demographic_group_names_rbyc = ['0-25K', '25-50K', '50-75K', '75K-100K', '100-125K','125K-150K', '150K+']

  else:
    raise ValueError

  if state == "mass":
    if elec_type != "senator":
      df['vote_total'] = df['Biden'] + df['Trump']
      df['pct_vote_biden'] = df['Biden'] / df['vote_total']
      df['pct_vote_trump'] = df['Trump'] / df['vote_total']
      values = df[['pct_vote_biden', 'pct_vote_trump']]
      candidate_names_rbyc = ['biden', 'trump']
    else:
      df['vote_total'] = df['Markey_D'] + df['Oconnor_R']
      df['pct_vote_markey'] = df['Markey_D'] / df['vote_total']
      df['pct_vote_oconnor'] = df['Oconnor_R'] / df['vote_total']
      values = df[['pct_vote_markey', 'pct_vote_oconnor']]
      candidate_names_rbyc = ['markey', 'oconnor']

    row_sums = values.sum(axis=1)

    # Check if each row sum is close to 1.0
    is_close = np.isclose(row_sums, 1.0)
    votes_clean = values[is_close]
    df = df[is_close]

  else:
    if elec_type == "senator":
      df['vote_total'] = df['Boyd_D'] + df['Britt_R']
      df['pct_vote_boyd_d'] = df['Boyd_D'] / df['vote_total']
      df['pct_vote_britt_r'] = df['Britt_R'] / df['vote_total']
      candidate_names_rbyc = ['boyd', 'britt']
      values = df[['pct_vote_boyd_d', 'pct_vote_britt_r']]
    else:
      df['vote_total'] = df['Flowers_D'] + df['Ivey_R']
      df['pct_vote_flowers'] = df['Flowers_D'] / df['vote_total']
      df['pct_vote_ivey'] = df['Ivey_R'] / df['vote_total']
      candidate_names_rbyc = ['flowers', 'ivey']
      values = df[['pct_vote_flowers', 'pct_vote_ivey']]
    row_sums = values.sum(axis=1)

    # Check if each row sum is close to 1.0
    is_close = np.isclose(row_sums, 1.0)
    votes_clean = values[is_close]
    values_clean = values_clean[is_close]
    df = df[is_close]

    



  precinct_pops = np.array(df['adjusted_total'].astype(int))
  precinct_names = np.array(df['UNIQUE_ID'])
  #percentage of groups
  group_fractions_rbyc = np.array(values_clean).T
  votes_fractions_rbyc = np.array(votes_clean).T

  print(f"group_fractions_rbyc shape: {group_fractions_rbyc.shape}")
  print(f"votes_fractions_rbyc shape: {votes_fractions_rbyc.shape}")



  # ei = RowByColumnEI(model_name='multinomial-dirichlet-modified', pareto_shape=100, pareto_scale=100)
  # ei.fit(group_fractions_rbyc,
  #      votes_fractions_rbyc,
  #      precinct_pops,
  #      demographic_group_names=demographic_group_names_rbyc,
  #      candidate_names=candidate_names_rbyc,
  #      #precinct_names=precinct_names,
  # )
  ei = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)
  ei.fit(
    group_fractions_rbyc,
    votes_fractions_rbyc,
    precinct_pops,
    demographic_group_names=demographic_group_names_rbyc,
    candidate_names=candidate_names_rbyc,
    precinct_names=precinct_names,
    draws=100,
    tune=100,
  )

  #ei.plot()

  data = ei.sampled_voting_prefs
  processed_data = []
  for candidate_idx in range(data.shape[2]):
      candidate_data = {"candidate": f"Candidate {candidate_idx + 1}", "groups": []}

      for group_idx in range(data.shape[1]):
          # Extract data for this group and candidate
          group_data = data[:, group_idx, candidate_idx]

          # Calculate KDE using SciPy
          kde = gaussian_kde(group_data)
          x_vals = np.linspace(0, 1, 500)  # Define the range for KDE
          y_vals = kde(x_vals)

          # Append processed data
          candidate_data["groups"].append({
              "group": f"Group {group_idx + 1}",
              "x_vals": x_vals.tolist(),  # Convert to list for JSON serialization
              "y_vals": y_vals.tolist(),
          })

      processed_data.append(candidate_data)
      ei_json = json.dumps(processed_data)
      return ei_json
