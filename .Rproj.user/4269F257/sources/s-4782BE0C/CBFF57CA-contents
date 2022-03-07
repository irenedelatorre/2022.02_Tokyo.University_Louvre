library(dplyr)
library(tidyr)


## f6 = f3 + f4 ----- merge by mac id ------------------------------------------
## f4 --> mac_radio: 48:c0:93:00:42:28-00:42:37
## f3 --> mac:       48:C0:93:00:42:28
## f3 + f4 = mac_radio until dash and in uppercase
f4_WIFI_LOUVRE_TRUE <- f4_WIFI_LOUVRE_TRUE %>%
  mutate(new_mac = mac_radio) %>%
  separate(new_mac, c("mac", "other"), "-") %>%
  mutate(mac = toupper(mac))

f6_id_1_2_matched <- merge(
  f3_WiFi_rename_miyajima_200528fin,
  f4_WIFI_LOUVRE_TRUE,
  by = "mac",
  all = T)

# count missmatches
f6_id_1_2_missmatch <- merge(
  f3_WiFi_rename_miyajima_200528fin,
  f4_WIFI_LOUVRE_TRUE,
  by = "mac",
  all = T) %>%
  filter(is.na(id_ap_1) | is.na(id_ap_2))
 
f6_total <- nrow(f6_id_1_2_matched)

f6_id_1_2_matched <- f6_id_1_2_matched %>%
  drop_na(id_ap_1) %>%
  drop_na(id_ap_2)

message(
  paste0(
    "Match mac ids, id_ap1 and id_ap2: ",
    f6_total - nrow(f6_id_1_2_matched),
    " out of ",
    f6_total,
    " access points lost (",
    round(100 * (f6_total - nrow(f6_id_1_2_matched)) / f6_total),
    "%). ",
    nrow(f6_id_1_2_matched),
    " matched"
    )
  )

f6_id_1_2_group <- f6_id_1_2_matched %>%
  group_by(id_ap_2) %>%
  tally()

message(
  paste0(
    "You have matched ",
    nrow(f6_id_1_2_group),
    " out of ",
    nrow(f4_WIFI_LOUVRE_TRUE),
    " ids (",
    round(100 * (nrow(f4_WIFI_LOUVRE_TRUE) - nrow(f6_id_1_2_group)) / nrow(f4_WIFI_LOUVRE_TRUE)),
    "%)"
  )
)

remove(f6_id_1_2_group)

## f8 = f5 + f6 ------ merge by id_ap_2 ----------------------------------------
# pick single names of the id_ap_2
f7_ap_ids <- f5_Louvre_MIT %>%
  group_by(id_ap_2) %>%
  tally() %>%
  mutate(id_ap_3 = row_number()) %>%
  select(c(id_ap_2, id_ap_3))

f8_rooms_ap_ids <- merge(
  f6_id_1_2_matched,
  f7_ap_ids, 
  by = "id_ap_2",
  all=T
)

f8_total <- nrow(f8_rooms_ap_ids)

f8_rooms_ap_ids <- f8_rooms_ap_ids %>%
  drop_na(id_ap_1) %>%
  drop_na(id_ap_2)

# count missmatches
f8_rooms_ap_ids_missmatch <- merge(
  f6_id_1_2_matched,
  f7_ap_ids, 
  by = "id_ap_2",
  all=T
  ) %>%
  filter(is.na(id_ap_1) | is.na(id_ap_2))

message(
  paste0(
    "Match rooms and ap_ids: ",
    f8_total - nrow(f8_rooms_ap_ids),
    " out of ",
    f8_total,
    " access points lost (",
    round(100 * (f8_total - nrow(f6_id_1_2_matched)) / f8_total),
    "%). ",
    nrow(f8_rooms_ap_ids),
    " matched"
  )
)

f8_rooms_ap_ids <- merge(
  f8_rooms_ap_ids,
  f2_Louvre_network_Wi_Fi_miyajima_200528fin,
  by = "id_ap_1"
)

remove(f8_total)

f9_ap_rooms <- f8_rooms_ap_ids %>%
  select(c(id_ap_3, Room_Number, location))

## new user location -----------------------------------------------------------
# merge f8 with f5

id_room <- f8_rooms_ap_ids %>%
  select(c(id_ap_2, id_ap_3))

createUser <- function(data) {
  
  data <- data %>%
    rename(
      user_id = ID,
      id_ap_2 = ACCESS_POINT_HOSTNAME,
      ip_address = ACCESS_POINT_IP_ADDRESS,
      date = DATE,
      start = TIME_DEB,
      end = TIME_END,
      duration = TIME_DUR,
      weekday = WEEKDAY
    )
  
  data <- merge(
    data, 
    id_room, 
    by = "id_ap_2",
    all = T
  )
  
  data
}   

final_format_f10 <- function(data) {
  data <- data %>%
    select(user_id, id_ap_3, date, start, end, weekday)
}

f10_Louvre_MIT_1_2017_11 <- createUser(f5A_Louvre_MIT_1_2017_11)
remove(f5A_Louvre_MIT_1_2017_11)
f10_Louvre_MIT_1_2017_12 <- createUser(f5A_Louvre_MIT_1_2017_12)
remove(f5A_Louvre_MIT_1_2017_12)
f10_Louvre_MIT_1_2018 <- createUser(f5A_Louvre_MIT_1_2018)
remove(f5A_Louvre_MIT_1_2018)
remove(f5_Louvre_MIT)

f5_total <- nrow(f10_Louvre_MIT_1_2017_11) + nrow(f10_Louvre_MIT_1_2017_12) + nrow(f10_Louvre_MIT_1_2018)

f10_Louvre_MIT_1_2017_11 <- f10_Louvre_MIT_1_2017_11 %>%
  drop_na(id_ap_3)

f10_Louvre_MIT_1_2017_12 <- f10_Louvre_MIT_1_2017_12 %>%
  drop_na(id_ap_3)

f10_Louvre_MIT_1_2018 <- f10_Louvre_MIT_1_2018 %>%
  drop_na(id_ap_3)

message(
  paste0(
    "Match rooms, ap_ids and users: ",
    f5_total - 
      nrow(f10_Louvre_MIT_1_2017_11) - 
      nrow(f10_Louvre_MIT_1_2017_12) - 
      nrow(f10_Louvre_MIT_1_2018),
    " out of ",
    f5_total,
    " movements lost (",
    round(100 * (f5_total - 
                   nrow(f10_Louvre_MIT_1_2017_11) - 
                   nrow(f10_Louvre_MIT_1_2017_12) - 
                   nrow(f10_Louvre_MIT_1_2018)) / f5_total),
    "%)"
  )
)

f10_Louvre_MIT_1_2017_11 <- final_format_f10(f10_Louvre_MIT_1_2017_11)
f10_Louvre_MIT_1_2017_12 <- final_format_f10(f10_Louvre_MIT_1_2017_12)
f10_Louvre_MIT_1_2018 <- final_format_f10(f10_Louvre_MIT_1_2018)

write.csv(f9_ap_rooms, file = "output/f9_ap_rooms.csv", row.names = FALSE)
write.csv(
  f10_Louvre_MIT_1_2017_11,
  file = "output/f10_Louvre_MIT_1_2017_11.csv",
  row.names = FALSE
  )
write.csv(
  f10_Louvre_MIT_1_2017_12,
  file = "output/f10_Louvre_MIT_1_2017_12.csv",
  row.names = FALSE
)
write.csv(
  f10_Louvre_MIT_1_2018,
  file = "output/f10_Louvre_MIT_1_2018.csv",
  row.names = FALSE
)


