

# final_dict = {}
# final_dict["directed"] = False
# final_dict["multigraph"] = False
# final_dict["graph"] = []
# final_dict["nodes"] = []
# final_dict["adjacency"] = []

# out_csv = open("./alabama.csv", "w")
# csvWriter = csv.writer(out_csv, delimiter=',')
# prop_list_file = open("/gpfs/scratch/mborczuk/gerrychain/prop_list.txt", "r")
# prop_list = prop_list_file.readlines()
# header = ["UNIQUE_ID", "NODE_ID", "COUNTYFP"]
# for j in prop_list:
#     header.append(j[:-1])
# csvWriter.writerow(header)
s = 0
for i in range(0, 2173):
    # f = open(f"/gpfs/scratch/mborczuk/gerryfiles/{i}.txt", "r")
    # population = int(f.readlines()[-1])
    h = open(f"/gpfs/scratch/mborczuk/gerryfiles/P0010001/{i}.txt", "r")
    s += int(float(h.readlines()[-1]))

print(s)