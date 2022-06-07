library(readr)
library(dplyr)


## network_01_agg ------ get aggregated results -----=--------------------------

source("R/network_01_agg.R")

create_networks <- function(this_source, date) {

  message("Importing file")

  #import file
  data <- read_csv(this_source)
  
  # creating network and nodes
  message("Creating network")
  network <- create_agg_network(data) %>%
    mutate("date" = date)
  
  message("Creating nodes")
  nodes <- create_agg_nodes(data) %>%
    mutate("date" = date)
  
  # writing files
  write.csv(
    network,
    paste0(
      "output/",
      "network_agg_",
      date,
      ".csv"),
    row.names = FALSE
    )
  
  write.csv(
    nodes,
    paste0(
      "output/",
      "network_nodes_agg_",
      date,
      ".csv"),
    row.names = FALSE
  )
  
  message("File saved")
}

# --- by month
create_networks("output/f10_Louvre_MIT_1_2017_11.csv", "2017-11")
create_networks("output/f10_Louvre_MIT_1_2017_12.csv", "2017-12")
create_networks("output/f10_Louvre_MIT_1_2018.csv", "2018-01")

# ---- by total

all_agg_network <- function() {
  message("Importing files")
  file_1 <- read_csv("output/f10_Louvre_MIT_1_2017_11.csv")
  file_2 <- read_csv("output/f10_Louvre_MIT_1_2017_12.csv")
  file_3 <- read_csv("output/f10_Louvre_MIT_1_2018.csv")
  
  message("Binding files")
  data <- rbind(file_1, file_2, file_3)
  
  message("Creating network data")
  network <- create_agg_network(data) %>%
    mutate("date" = "All")
  
  message("Creating nodes")
  nodes <- create_agg_nodes(data) %>%
    mutate("date" = "All")
  
  write.csv(
    network,
    paste0(
      "output/",
      "network_agg_all",
      ".csv"),
    row.names = FALSE
  )
  
  write.csv(
    nodes,
    paste0(
      "output/",
      "network_nodes_agg_all",
      ".csv"),
    row.names = FALSE
  )
  
  message("File saved")
}

all_agg_network()
