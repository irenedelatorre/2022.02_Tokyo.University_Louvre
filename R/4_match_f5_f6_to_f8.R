#' create_f8
#' Summarizes all id_ap_2 in the data and creates a third id.
#' Then matches it with f6_id_1_2_matched using id_ap_2
#'
#' @param f5_a first data file from the users
#' @param f5_b second data file from the users
#' @param f5_c third data file from the users
#' @param f6 is the data frame created from matching f3 and f4
#' @param f12 is the data frame with the matched room names and room ids
#'
#' @return a data frame with new ids for the rooms, that can be used both
#'   in f6 and f5
#' @export
#'
#' @examples
#' 
create_f8 <- function(f5_a, f5_b, f5_c, f6, f12) {
  f5_Louvre_MIT <- rbind(
    f5_a,
    f5_b,
    f5_c) %>%
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
  
  f7_ap_ids <- f5_Louvre_MIT %>%
    group_by(id_ap_2) %>%
    tally() %>%
    mutate(id_ap_3 = row_number()) %>%
    select(c(id_ap_2, id_ap_3)) %>%
    mutate(id_ap_2 = case_when(
      id_ap_2 == "AP002-H-RC" ~ "AP002",
      id_ap_2 == "AP003-H-RC" ~ "AP003",
      TRUE ~ id_ap_2
    ))
  
  f8 <- merge(
    f6,
    f7_ap_ids, 
    by = "id_ap_2",
    all=T
  )
 
  summary_f8(f8)
  
  f8_rooms_ap_ids <- merge(
    f8,
    f2_Louvre_network_Wi_Fi_miyajima_200528fin,
    by = "id_ap_1"
  )
  

  f8_rooms_ap_ids <- f8_rooms_ap_ids %>%
    select(!c("...1")) %>%
    drop_na(id_ap_1) %>%
    drop_na(id_ap_2)
  
  f8_rooms_ids_names <- merge(
    f8_rooms_ap_ids,
    f12,
    by.x = "Room_Number",
    by.y = "Room_id"
  )

  f8_rooms_ids_names <- f8_rooms_ids_names %>%
    select(!c("floor"))
  
}


#' summary_f8
#' Summarizes the results of matching f5 and f6
#'
#' @param f8 the resulted f8, nas included
#'
#' @return a message
#' @export
#'
#' @examples
#' 
#'
summary_f8 <- function(f8) {
  f8_total <- nrow(f8)
  
  # remove nas
  f8_rooms_ap_ids_matched <- f8 %>%
    drop_na(id_ap_1) %>%
    drop_na(id_ap_2)
  
  message(
    paste0(
      "Match rooms and ap_ids: ",
      nrow(f8_rooms_ap_ids_matched),
      " out of ",
      f8_total,
      " access points matched (",
      round(100 * (nrow(f8_rooms_ap_ids_matched)) / f8_total),
      "%). "
    )
  )
}
