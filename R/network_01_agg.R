#' create_agg_network
#' Summarizes all movements (initial room to target room) and calculates
#' the total number of similar changes, the total sum in seconds and the mean
#' and median duration.
#' It doesn't remove duplicates of people doing the same movement more than
#' once.
#'
#' @param data user data frame (final f10)
#'
#' @return data frame with source and target rooms, total people, mean duration, 
#' median duration and total duration. Time in seconds
#' 
#' @import "dplyr"
#' 
#' @export
#'
#' @examples
#' 
#' f10_Louvre_2017_11 <- read_csv("output/f10_Louvre_MIT_1_2017_11.csv")
#' movements_2017_11 <- create_agg_network(f10_Louvre_2017_11)

create_agg_network <- function(data, date) {
  # 1 sort by user id and then by date and time
  # create new start date to sort by time
  # create new end date to calculate duration in seconds
  data_agg <- data %>%
    drop_na() %>%
    mutate(
      start_t = as.POSIXlt(paste0(date, " ", start)),
      end_t = as.POSIXlt(paste0(date, " ", end))
    ) %>%
    #sort by id and then by start_t
    arrange(id, start_t)
  
  # create new column with the id of the next row
  data_agg <- transform(data_agg, next_id = c(id[-1], NA))
  
  # create new column with the room of the next row
  data_agg <- transform(data_agg, next_id_ap_3 = c(id_ap_3[-1], NA))
  
  # check if the next row contains the same user id
  # if not, it's the end of the movement --> add an NA
  data_agg$next_id_ap_3 <- ifelse(
    data_agg$next_id == data_agg$id,
    data_agg$next_id_ap_3,
    NA
  ) 
  
  data_agg <- data_agg %>%
    mutate(
      movement = paste0(id_ap_3, "_", next_id_ap_3),
      duration_secs = as.numeric(difftime(end_t, start_t))
    )
  
  # 1 - by movement, check beginnings and ends
  group_movements <- data_agg %>%
    group_by(movement) %>%
    summarise(
      n_total = n(),
      total_duration_sec = sum(duration_secs),
      mean = round(mean(duration_secs)),
      median = round(median(duration_secs))
    ) %>%
    separate(movement, c("source", "target"))
}

#' create_agg_nodes
#' Summarizes all room information, and calculates how many people were in a
#' specific room, for how long (as total duration, mean and median in seconds)
#' It doesn't remove duplicates of people doing the same movement more than
#' once.
#'
#' @param data user data frame (final f10)
#'
#' @return data frame with source rooms, total people, mean duration, 
#' median duration and total duration. Time in seconds
#' 
#' @import "dplyr"
#' 
#' @export
#'
#' @examples
#' 
#' f10_Louvre_2017_11 <- read_csv("output/f10_Louvre_MIT_1_2017_11.csv")
#'  nodes_2017_11 <- crate_agg_nodes(f10_Louvre_2017_11)

create_agg_nodes <- function(data, date) {
  # 1 sort by user id and then by date and time
  # create new start date 
  # create new end date to calculate duration in seconds
  # calculate duration in sec
  nodes_agg <- data %>%
    drop_na() %>%
    mutate(
      start_t = as.POSIXlt(paste0(date, " ", start)),
      end_t = as.POSIXlt(paste0(date, " ", end))
    ) %>%
    # duration in a specific wifi point
    mutate(
      duration_secs = as.numeric(difftime(end_t, start_t))
    )
  
  # 1 - by room check beginnings and ends
  nodes <- nodes_agg %>%
    group_by(id_ap_3) %>%
    summarise(
      n_total = n(),
      total_duration_sec = sum(duration_secs),
      mean = round(mean(duration_secs)),
      median = round(median(duration_secs))
    )
}