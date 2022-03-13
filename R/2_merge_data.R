library(dplyr)
library(tidyr)

## f6 = f3 + f4 ------ merge by mac id ----------------------------------------

source("R/3_match_f3_f4_to_f6.R")

f6_id_1_2_matched <- create_f6(
  f3 = f3_WiFi_rename_miyajima_200528fin,
  f4 = f4_WIFI_LOUVRE_TRUE)


## f8 = f5 + f6 ------ merge by id_ap_2 ----------------------------------------
# pick single names of the id_ap_2
source("R/4_match_f5_f6_to_f8.R")

f8_ap_matched_rooms <- create_f8(
  f5A_Louvre_MIT_1_2017_11,
  f5A_Louvre_MIT_1_2017_12,
  f5A_Louvre_MIT_1_2018,
  f6 = f6_id_1_2_matched)

## f9 = summary of 8 ----------------------------------------------------------
source("R/5_f8_to_summary_f9.R")
f9_ap_rooms <- create_f9(f8_ap_matched_rooms)

## new user location -----------------------------------------------------------
# merge f8 with f5
source("R/6_merge_f5_f8_new_user.R")

f10_Louvre_MIT_1_2017_11 <- create_new_user_track(
  f5A_Louvre_MIT_1_2017_11,
  f8_ap_matched_rooms
  )

f10_Louvre_MIT_1_2017_12 <- create_new_user_track(
  f5A_Louvre_MIT_1_2017_12,
  f8_ap_matched_rooms
  )

f10_Louvre_MIT_1_2018 <- create_new_user_track(
  f5A_Louvre_MIT_1_2018,
  f8_ap_matched_rooms
  )

summary_f10(
  f10_Louvre_MIT_1_2017_11,
  f10_Louvre_MIT_1_2017_12,
  f10_Louvre_MIT_1_2018
  )

f10_Louvre_MIT_1_2017_11 <- final_format_f10(
  f10_Louvre_MIT_1_2017_11,
  "f10_Louvre_MIT_1_2017_11.csv"
  )

f10_Louvre_MIT_1_2017_12 <- final_format_f10(
  f10_Louvre_MIT_1_2017_12,
  "f10_Louvre_MIT_1_2017_12.csv"
  )

f10_Louvre_MIT_1_2018 <- final_format_f10(
  f10_Louvre_MIT_1_2018,
  f10_Louvre_MIT_1_2017_12.csv
  )
