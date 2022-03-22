#' find_f3_in_f4
#' Loops through f3 finding the match in f4
#' match is when mac's from f3 and f4 are the same, or when
#' mac from f3 falls into the range of f4. In this case, it matches with
#' closest mac.
#'
#' @param f3 is the data frame with initial id (ap_id_1)
#'   WiFi_rename_miyajima_200528fin
#' @param f4 is the data frame with the second id and location (ap_id_2)
#'   WIFI_LOUVRE_TRUE.
#'
#' @return a data frame f6 with matched ids
#' @export
#'
#' @examples
#' 
find_f3_in_f4 <- function(f3, f4) {
  
  # restart file
  f6 <- f3
  f6$id_ap_2 <- ""
  f6$location <- ""
  
  # file where we're going to look up for the data - f4
  look_up_f <- f4
  
  # loop through the items
  for (i in 1:nrow(f6)) {
    item <- f6[i, ]
    item_mac_hex <- item$mac_hex
    
    # FIRST MATCH - mac is the same in F4 and F3
    this_filtered <- look_up_f %>%
      filter(mac_hex == item_mac_hex)
    
    # SECOND MATCH - by mac range
    if (nrow(this_filtered) == 0) {
      this_filtered <- look_up_f %>%
        filter(lower_bound <= item_mac_hex, item_mac_hex <= upper_bound)
      
      # THIRD MATCH - by distance to mac range
      # currently none
      # if(nrow(this_filtered) > 1) {
      #   
      #   message("more than 1")
      #   
      #   # calculate minimum distance
      #   this_filtered_dist <- this_filtered %>%
      #     mutate(
      #       distance_l = item_mac_hex - lower_bound,
      #       distance_u = upper_bound - item_mac_hex
      #     ) %>%
      #     mutate(distance = abs(item_mac_hex - mac_hex) ) %>%
      #     arrange(distance)
      #   
      #   this_filtered <- this_filtered_dist[1, ]
      #   
      # }
    }
    
    if (nrow(this_filtered) == 1) {
      f6[i, "id_ap_2"] <- this_filtered[1, "id_ap_2"]
      f6[i, "location"] <- this_filtered[1, "location"]
    }
  }
  
  f6
}

#' summary_f6
#' Summarizes the number of matches in f3 and f4
#'
#' @param f3 is WiFi_rename_miyajima_200528fin
#' @param f4 is WIFI_LOUVRE_TRUE.
#' @param f6 is final f6 dataset
#'
#' @return a message
#' @export
#'
#' @examples
#' 
summary_f6 <- function(f6, f3, f4) {
  # group f6
  # remove nas
  # how many are there in comparison to original f3?
  g_f6_id_ap_1 <- f6 %>%
    filter(!is.na(id_ap_2)) %>%
    group_by(id_ap_1) %>%
    tally()
  
  # and f4?
  g_f6_id_ap_2 <- f6 %>%
    filter(!is.na(id_ap_2)) %>%
    group_by(id_ap_2) %>%
    tally()
  
  message(
    paste0(
      "Match f3 with f4: ",
      nrow(g_f6_id_ap_1),
      " out of ",
      nrow(f3),
      " access from f3 matched (",
      round(100 * (nrow(g_f6_id_ap_1)) / nrow(f3)),
      "%)."
    )
  )
  
  message(
    paste0(
      "Match f3 with f4: ",
      nrow(g_f6_id_ap_2),
      " out of ",
      nrow(f4),
      " access from f4 matched (",
      round(100 * (nrow(g_f6_id_ap_2)) / nrow(f4)),
      "%)."
    )
  )
}

#' create_f6
#' Match between ids_1 from WiFi_rename_miyajima_200528fin and WIFI_LOUVRE_TRUE.
#' f4 --> mac_radio: 48:c0:93:00:42:28-00:42:37  mac-radio
#' f3 --> mac:       48:C0:93:00:42:28
#' to macth f3 and f4, transform to decimal
#' match is when mac's from f3 and f4 are the same, or when
#' mac from f3 falls into the range of f4. In this case, it matches with
#' closest mac.
#'
#' @param f3 is WiFi_rename_miyajima_200528fin
#' @param f4 is WIFI_LOUVRE_TRUE.
#'
#' @return a data frame f6 with matched ids
#' @export
#'
#' @examples

create_f6 <- function(f3, f4) {
  
  f3 <- f3 %>%
    mutate(
      mac_hex = as.numeric(
        as.character(paste0("0x", gsub(':', '', mac))),
        options(digits = 22)
      )
    )
  
  f4 <- f4 %>%
    mutate(new_radio = mac_radio) %>%
    separate(new_radio, c("mac", "radio"), "-") %>%
    mutate(mac_split = mac) %>%
    # separate macs (into 6)
    separate(mac_split, c("m1", "m2", "m3", "m_4a", "m_5a", "m_6a")) %>%
    # include them in new mac with range
    mutate(radio_full = paste0(m1, ":", m2, ":", m3, ":", radio)) %>%
    mutate(
      mac_hex = as.numeric(
        as.character(paste0("0x", gsub(':', '', mac))),
        options(digits = 22)),
      radio_hex = as.numeric(
        as.character(paste0("0x", gsub(':', '', radio_full))),
        options(digits = 22)
      ),
      lower_bound = mac_hex,
      upper_bound = radio_hex
    ) %>%
    select(!c("m1", "m2", "m3", "m_4a", "m_5a", "m_6a"))
  
  f6 <- find_f3_in_f4(f3, f4)
  
  summary_f6(f3 = f3, f4 = f4, f6 = f6)
  
  f6
  
}
