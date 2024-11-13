#!/usr/bin/env bash

#SBATCH --nodes=1
#SBATCH --time=8:00:00
#SBATCH --partition=hbm-1tb-long-96core
#SBATCH --job-name=popgen
#SBATCH --output=popgen_output.txt

# load required modules

module load gerrychain
module load gnu-parallel/6.0

# parallelize the calculation across each input, running 96 processes at a time

parallel --jobs 96 python /gpfs/scratch/mborczuk/gerrychain/test-intersect.py {} ::: {0..1938}
