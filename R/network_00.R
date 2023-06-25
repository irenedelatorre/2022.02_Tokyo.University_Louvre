library(readr)
library(dplyr)


## network_01_agg ------ get aggregated results -----=--------------------------

create_networks <- function(this_source, date, path = "output/") {

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
      path,
      "network_agg_",
      date,
      ".csv"),
    row.names = FALSE
    )
  
  write.csv(
    nodes,
    paste0(
      path,
      "network_nodes_agg_",
      date,
      ".csv"),
    row.names = FALSE
  )
  
  message("File saved")
}


# ---- by total

all_agg_network <- function(path = "output/", path_output = "output/") {
  message("Importing files")
  file_1 <- read_csv(paste0(path, "f10_Louvre_MIT_1_2017_11.csv"))
  file_2 <- read_csv(paste0(path, "f10_Louvre_MIT_1_2017_12.csv"))
  file_3 <- read_csv(paste0(path, "f10_Louvre_MIT_1_2018_1.csv"))
  file_4 <- read_csv(paste0(path, "f10_Louvre_MIT_1_2018_2.csv"))
  
  message("Binding files")
  data <- rbind(file_1, file_2, file_3, file_4)
  
  message("Creating network data")
  network <- create_agg_network(data) %>%
    mutate("date" = "All")
  
  message("Creating nodes")
  nodes <- create_agg_nodes(data) %>%
    mutate("date" = "All")
  
  write.csv(
    network,
    paste0(
      path_output,
      "network_agg_all",
      ".csv"),
    row.names = FALSE
  )
  
  write.csv(
    nodes,
    paste0(
      path_output,
      "network_nodes_agg_all",
      ".csv"),
    row.names = FALSE
  )
  
  message("File saved")
}
