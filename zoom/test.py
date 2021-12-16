import json

with open("./files/alphabet_to_housename", "r") as f:
    json_load = json.load(f)
    print(json_load)