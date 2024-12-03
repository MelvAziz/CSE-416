import os

f = open("/gpfs/scratch/mborczuk/gerrychain/prop_list_ur.txt")

for i in f.readlines():
    os.mkdir(f"/gpfs/scratch/mborczuk/gerryfiles/{i[:-1]}")
