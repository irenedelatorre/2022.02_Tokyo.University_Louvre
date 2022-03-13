#' create_new_user_track
#' Summarizes all id_ap_2 in the data and creates a third id.
#' Then matches it with f6_id_1_2_matched using id_ap_2
#'
#' @param data user data frame (a f5)
#' @param f8 data frame with id_ap_2 and id_ap_3
#'
#' @return data frame with new mac id
#' @export
#'
#' @examples

create_new_user_track <- function(data, f8) {
  id_room <- f8 %>%
    select(c(id_ap_2, id_ap_3))
  
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

#' final_format_f10
#' Prepares the user data for extraction and removes unnecesary information
#'
#' @param data user data frame (a f10)
#' @param name name of the export file
#' 
#' @return data frame with new mac id
#' @export
#'
#' @examples
final_format_f10 <- function(data, name) {
  data <- data %>%
    drop_na(id_ap_3) %>%
    select(user_id, id_ap_3, date, start, end, weekday)
  
  write.csv(
    data,
    file = paste0("output/", name),
    row.names = FALSE
  )
}

#' summary_f10
#' Summarizes the matching of the new user data
#'
#' @param f10_1 user data frame (a f10)
#' @param f10_2 user data frame (a f10)
#' @param f10_3 user data frame (a f10)
#'
#' @return data frame with new mac id
#' @export
#'
#' @examples

summary_f10 <- function(f10_1, f10_2, f10_3) {
  f5_total <- nrow(f10_1) + 
    nrow(f10_2) + 
    nrow(f10_3)
  
  f10_1 <- f10_1 %>%
    drop_na(id_ap_3)
  
  f10_2 <- f10_2 %>%
    drop_na(id_ap_3)
  
  f10_3 <- f10_3 %>%
    drop_na(id_ap_3)
  
  message(
    paste0(
      "Match rooms, ap_ids and users: ",
      nrow(f10_1) + nrow(f10_2) + nrow(f10_3),
      " out of ",
      f5_total,
      " movements matched (",
      round(100 * (nrow(f10_1) + nrow(f10_2) + nrow(f10_3)) / f5_total),
      "%)"
    )
  )
}
