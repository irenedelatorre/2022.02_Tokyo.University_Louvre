library(readr)
library(readxl)
library(dplyr)

source <- "../network_data/"

# Matrix file ------------------------------------------------------------------

f1_Louvre_network <- read_csv(
  paste0(source, "Rooms.Matrix/Louvre_network.csv")
  )

# Room data --------------------------------------------------------------------
f2_Louvre_network_Wi_Fi_miyajima_200528fin <- read_excel(
  paste0(
    source,
    "Rooms.Access.Points/Louvre_network+Wi-Fi_miyajima_200528fin.xlsx"
    )
  ) %>%
  rename(id_ap_1 = "ID_Access_Point")

f3_WiFi_rename_miyajima_200528fin <- read_excel(
  paste0(
    source,
    "Rooms.Access.Points/Wi-Fi_rename_miyajima_200528fin.xlsx"
    )
  ) %>%
  rename(id_ap_1 = "No.") %>%
  select(c(id_ap_1, memo, mac)) %>%
  drop_na(id_ap_1)

f4_WIFI_LOUVRE_TRUE <- read_excel(
  paste0(source, "Rooms.Access.Points/WIFI_LOUVRE_TRUE.xlsx")
) %>%
  rename(
    id_ap_2 = Borne,
    mac_eth = "MAC ETH",
    mac_radio = "range MAC Radio", 
    location = "Emplacement") %>%
  select(c(id_ap_2, mac_eth, mac_radio, location))

# user data --------------------------------------------------------------------

f5A_Louvre_MIT_1_2017_11 <- read_csv(
  paste0(source,"Users.Locations/Louvre_MIT(11-2017)_v1.csv"))

f5A_Louvre_MIT_1_2017_12 <- read_csv(
  paste0(source,"Users.Locations/Louvre_MIT(12-2017)_v2.csv"))

f5A_Louvre_MIT_1_2018 <- read_csv(
  paste0(source,"Users.Locations/Louvre_MIT(1-2018)_v3.csv"))

