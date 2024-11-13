#!/usr/bin/env bash

#SBATCH --ntasks=1
#SBATCH --nodes=1
#SBATCH --cpus-per-task=40
#SBATCH --time=48:00:00
#SBATCH --partition=extended-40core
#SBATCH --job-name=popgen-serial
#SBATCH --output=popgen_serial_output.txt

# load required modules

module load gerrychain
module load gnu-parallel/6.0

# parallelize the calculation across each input, running 40 processes at a time

python /gpfs/scratch/mborczuk/gerrychain/test-population-gen-serial.py
