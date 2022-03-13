#' create_f9
#' Summarizes all the rooms with their new id and location
#'
#' @param f8 f8 file with new set of ids and rooms
#'
#' @return a data frame
#' @export
#'
#' @examples
#' 
#' 
create_f9 <- function(f8) {
  f9 <- f8 %>%
    select(c(id_ap_3, Room_Number, location))
  
  write.csv(f9, file = "output/f9_ap_rooms.csv", row.names = FALSE)
  
  f9
}
