# 2022.02_Tokyo.University_Louvre

The original datasets are not included in this repository.
Nor the final output.

## Original Files from Tokyo University and Louvre Museum

![datasets](img/link_between_datasets.png)

## R Scripts in this Repository

### Match f3 with f4 = f6

- f3: Wi-Fi_rename_miyajima_200528fin.xlsx
- f4: WIFI_LOUVRE_TRUE.xlsx
- **f6: id_1_2_matched**

Merge by `mac id`.

Values in `mac_radio` is a shorthand notation. 
e.g. that the value 48:c0:93:00:42:28-00:42:37
means a range between 48:c0:93:00:42:28 and 48:c0:93:00:42:37

**Summary**

- Match f3 with f4: 154 out of 154 access from f3 matched (100%).
- Match f3 with f4: 83 out of 114 access from f4 matched (73%).

### Match f5 with f6 = f8

Merge by id_ap_2. Pick single names of the id_ap_2

- f5 (user data): Louvre_MIT(11-2017)_v1, Louvre_MIT(12-2017)_v2,
  Louvre_MIT(1-2018)_v3
- f6: new data frame with id1 and id2
- f8 (new id -id3-): matched rooms with id_ap_1 and id_ap_2. It has 
  `mac`, location, id_ap_3 (new) and room number.

**Summary**

- Match rooms and ap_ids: 154 out of 176 access points matched (88%).
- When merging f2 (room numbers), the file increases to 237 rows.

Question: It's interesting that is the same number of ids, 
so maybe there was a mismatch somewhere?

ids with missmatches:

- From f6: ap110, ap111, ap112, ap113
- From f5: ap116, ap119, ap124, ap129

### Summary of f8 = f9. ROOMS / NODES.

- f9: f9_ap_rooms.csv

**These are the nodes of the network. It includes:**

- id_ap_3 - eg. 42
- Room_Number - eg. 1. From https://www.dropbox.com/home/wifi_data/network_figs
- Area - eg. Richelieu
- Floor - eg. RC - Level 0
- Museum_room - eg. 219
- Type - if normal room, NA; otherwise stairs.
- Collection - eg. Egyptian Antiquities
- Highlight - eg. The Venus de Milo

### f8 + f5 = f10. Modify users and include new ids

- f8 rooms with new ids and locations
- f5 visitors' movements.

**These are the visitor's movements. It includes:**
- id - visitor's id. eg. user_hexnumber
- id_ap_3 - id of the room
- date - date of the visit
- start - time when the user connected to a wifi
- end - time when the user disconnected from a wifi

**Summary**

- Match rooms, ap_ids, and users: 14410328 out of 17198520 
  movements matched (84%)

Questions: 

- do the errors come from those rooms that were a mismatch?
- There are a few ap_ids in the users without a match to rooms.
  AP090, AP091, or AP091, for example. These ids appear in 
  WiFi_rename_miyajima_200528fin but they don't appear in 
  Louvre_network_Wi_Fi_miyajima_200528fin

### Final steps

- Remove users without matches to rooms from the final datasets. 
- Modify user ids to make them shorter and reduce final size
  of the file.

### Network - Links and Nodes

##### Nodes

See **Summary of f8 = f9. ROOMS / NODES.**

#### Aggregated links - Overall results

`create_agg_network.R` summarizes all movements (initial room to target room) 
and calculates the total number of similar changes, the total sum in 
seconds and the mean and median duration. It doesn't remove duplicates of 
people doing the same movement more than once.

The file `network_agg_all.csv` has:

- source - start room (id_ap_3)
- target - end room (id_ap_3)
- n_total - total number of visitors that shared this same movement
- total_duration_sec - sum of all the visits, in seconds
- mean - mean duration of the visit, in seconds
- median - median duration of the visit, in seconds
- date - date. For now, "All" since it's aggregrated information of 
  November 2017, December 2017 and January 2018