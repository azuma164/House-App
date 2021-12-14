import json

dic = {}
dic["name"] = "flare"

dic_list = [{} for i in range(13)] 
dic_list[0]["name"] = "valuable"
dic_list[1]["name"] = "name"
dic_list[2]["name"] = "sacred"
dic_list[3]["name"] = "topography"
dic_list[4]["name"] = "animals & plants"
dic_list[5]["name"] = "abstraction"
dic_list[6]["name"] = "people"
dic_list[7]["name"] = "beauty"
dic_list[8]["name"] = "house"
dic_list[9]["name"] = "nature"
dic_list[10]["name"] = "city"
dic_list[11]["name"] = "familiar"
dic_list[12]["name"] = "daily life"

print(dic_list)

dic_list[0]["children"] = [
    {"name": "valuable", "value": 22},
    {"name": "palace", "value": 22}
]
dic_list[1]["children"] = [
    {"name": "name", "value": 9}
]
dic_list[2]["children"] = [
    {"name": "sacred", "value": 5},
    {"name": "god", "value": 6}
]
dic_list[3]["children"] = [
    {"name": "nature", "value": 31},
    {"name": "topography", "value": 22}
]
dic_list[4]["children"] = [
    {"name": "animals", "value": 10},
    {"name": "plants", "value": 11}
]
dic_list[5]["children"] = [
    {"name": "valuable", "value": 62}
]
dic_list[6]["children"] = [
    {"name": "people", "value": 18}
]
dic_list[7]["children"] = [
    {"name": "beauty", "value": 22},
    {"name": "excel", "value": 32}
]
dic_list[8]["children"] = [
    {"name": "house", "value": 31}
]
dic_list[9]["children"] = [
    {"name": "inside nature", "value": 5},
    {"name": "outside nature", "value": 4}
]
dic_list[10]["children"] = [
    {"name": "urban", "value": 6},
    {"name": "suburbs", "value": 7}
]
dic_list[11]["children"] = [
    {"name": "family", "value": 4},
    {"name": "friends", "value": 3}
]
dic_list[12]["children"] = [
    {"name": "daily life", "value": 9}
]

dic["children"] = dic_list

with open("./files/categoryfile", "w") as outfile:
    json.dump(dic, outfile, indent=1)
# {
#  "name": "flare",
#  "children": [
#   {
#    "name": "analytics",
#    "children": [
#     {
#      "name": "cluster",
#      "children": [
#       {"name": "AgglomerativeCluster", "value": 3938},
#       {"name": "CommunityStructure", "value": 3812},
#       {"name": "HierarchicalCluster", "value": 6714},
#       {"name": "MergeEdge", "value": 743}
#      ]
#     },