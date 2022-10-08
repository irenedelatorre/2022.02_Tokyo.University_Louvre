# 2022.02_Tokyo.University_Louvre

The original datasets are not included in this repository.
Nor the final output.

## Original Files from Tokyo University and Louvre Museum

![datasets](img/link_between_datasets.png)

## R Scripts in this Repository

### Match f3 with f4 = f6

Values in `mac_radio` is a shorthand notation. 
e.g. that the value 48:c0:93:00:42:28-00:42:37
means a range between 48:c0:93:00:42:28 and 48:c0:93:00:42:37

**Summary**

- Match f3 with f4: 154 out of 154 access from f3 matched (100%).
- Match f3 with f4: 83 out of 114 access from f4 matched (73%).

### Match f5 with f6 = f8

- f5 (user data)
- f6 (file with id1 and id2)
- f8 (new id -id3-)

**Summary**

- Match rooms and ap_ids: 154 out of 176 access points matched (88%).
- When merging f2 (room numbers), the file increases to 237 rows.

Question: It's interesting that is the same number of ids, 
so maybe there was a mismatch somewhere?

ids with missmatches:

- From f6: ap110, ap111, ap112, ap113
- From f5: ap116, ap119, ap124, ap129

### Modify users and include new ids

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
