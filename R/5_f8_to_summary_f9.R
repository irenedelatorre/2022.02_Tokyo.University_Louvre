#' create_f9
#' Summarizes all the rooms with their new id and location
#'
#' @param f8 f8 file with new set of ids and rooms
#' @param path path to save the file
#'
#' @return a data frame
#' @export
#'
#' @examples
#' 
#' 
create_f9 <- function(f8, path = "output/f9_ap_rooms.csv") {
  f9 <- f8 %>%
    select(c(
      id_ap_3, Room_Number, Area, Floor, Museum_room,
      Type, Collection, Highlight
      )
    )
  
  write.csv(
    f9,
    file = path,
    row.names = FALSE,
    fileEncoding = "UTF-8"
    )
  
  f9
}
