library(readr)
library(dplyr)

url <- "D:/Documents/2 - Work/3.1 - Freelance - Proyectos/2021 University of Tokyo/202202 Louvre/01 data/Louvre_Irene_wifi/"

Louvre_MIT_1_2018 <- read_csv(
  paste0(url,"Louvre_MIT(1-2018)_v3.csv"))

Louvre_MIT_1_2017_11 <- read_csv(
  paste0(url,"Louvre_MIT(11-2017)_v1.csv"))

Louvre_MIT_1_2017_12 <- read_csv(
  paste0(url,"Louvre_MIT(12-2017)_v2.csv"))

louvre_data <- rbind(
  Louvre_MIT_1_2017_11,
  Louvre_MIT_1_2017_12,
  Louvre_MIT_1_2018)

louvre_data <- louvre_data %>%
  select(!c("TIME_SLOT"))

ids <- louvre_data %>%
  group_by(ACCESS_POINT_HOSTNAME) %>%
  summarise()


louvre_data_short <- louvre_data %>%
  head(100)
