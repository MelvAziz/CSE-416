def get_aggregatable_attributes(filter, aggregating):
    attribute_file_prefix = "/gpfs/projects/CSE416/Owls/scripts/attribute-lists"
    race_attribute_file = open(
        f"{attribute_file_prefix}/attribute_list_hispanic.txt")
    economic_attribute_file = open(
        f"{attribute_file_prefix}/attribute_list_economic.txt")
    pop_density_attribute_file = open(
        f"{attribute_file_prefix}/attribute_list_pop_density.txt")
    race_attribute_list = race_attribute_file.read().splitlines()
    economic_attribute_list = economic_attribute_file.read().splitlines()
    pop_density_attribute_list = pop_density_attribute_file.read().splitlines()
    # The UR20 attribute is split into URB_POP20 and RUR_POP20 after preprocessing.
    # This function is run both before and after preprocessing, so we need
    # a variable to check this.
    if aggregating:
        pop_density_attribute_list.remove("UR20")
        pop_density_attribute_list.append("URB_POP20")
        pop_density_attribute_list.append("RUR_POP20")
    all_attributes = race_attribute_list \
        + economic_attribute_list \
        + pop_density_attribute_list
    if filter == "race":
        return race_attribute_list
    elif filter == "economic":
        return economic_attribute_list
    elif filter == "pop_density":
        return pop_density_attribute_list
    else:
        return all_attributes


def get_non_aggregatable_attributes(state):
    attribute_file_prefix = "/gpfs/projects/CSE416/Owls/scripts/attribute-lists"
    if state != "alabama" and state != "mass":
        return []
    election_attribute_file = open(
        f"{attribute_file_prefix}/attribute_list_election_{state}.txt")
    election_attribute_list = election_attribute_file.read().splitlines()
    return election_attribute_list
