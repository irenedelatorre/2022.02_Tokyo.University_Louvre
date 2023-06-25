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
#' test <- f5A_Louvre_MIT_1_2017_11 %>%
#'   arrange(ID)
#'
#' data <- head(test, 5000)
#'
#' f8 <- f8_ap_matched_rooms
#' f11 <- f11_new_user_ids

create_new_user_track <- function(data, f8, f11) {
  id_room <- f8 %>%
    select(c(id_ap_2, id_ap_3)) %>%
    distinct()
  
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
    ) %>%
    mutate(id_ap_2 = case_when(
      id_ap_2 == "AP002-H-RC" ~ "AP002",
      id_ap_2 == "AP003-H-RC" ~ "AP003",
      TRUE ~ id_ap_2
    ))
  
  data_1 <- merge(
    data, 
    f11, 
    by = "user_id",
    all = F
  )

  data_2 <- merge(
    data_1,
    id_room,
    by = "id_ap_2",
    all = T
  )
  
  data_2
}   

#' final_format_f10
#' Prepares the user data for extraction and removes unnecesary information
#'
#' @param data user data frame (a f10)
#' @param name name of the export file
#' @param name name of the folder
#' 
#' @return data frame with new mac id
#' @export
#'
#' @examples
final_format_f10 <- function(data, name, path = "output/") {
  data <- data %>%
    drop_na(id_ap_3) %>%
    filter(!is.null(user_id)) %>%
    select(id, id_ap_3, date, start, end)
  
  write.csv(
    data,
    file = paste0(path, name),
    row.names = FALSE
  )
}

#' summary_f10
#' Summarizes the matching of the new user data
#'
#' @param f10_1 user data frame (a f10)
#' @param f10_2 user data frame (a f10)
#' @param f10_3 user data frame (a f10)
#' @param f10_4 user data frame (a f10)
#'
#' @return data frame with new mac id
#' @export
#'
#' @examples

summary_f10 <- function(f10_1, f10_2, f10_3, f10_4) {
  f5_total <- nrow(f10_1) + 
    nrow(f10_2) + 
    nrow(f10_3) + 
    nrow(f10_4)
  
  f10_1 <- f10_1 %>%
    drop_na(id_ap_3)
  
  f10_2 <- f10_2 %>%
    drop_na(id_ap_3)
  
  f10_3 <- f10_3 %>%
    drop_na(id_ap_3)

  f10_4 <- f10_4 %>%
    drop_na(id_ap_3)

  message(
    paste0(
      "Match rooms, ap_ids and users: ",
      nrow(f10_1) + nrow(f10_2) + nrow(f10_3) + nrow(f10_4),
      " out of ",
      f5_total,
      " movements matched (",
      round(
        100 * (nrow(f10_1) + nrow(f10_2) + nrow(f10_3) + nrow(f10_4)) /
          f5_total),
      "%)"
    )
  )
}
