#' create_f11
#' Produces a new set of user ids. The new column follows the following
#' structure: `user_` and `column number in hexadecimal`
#'
#' @param f5_a user data frame (a f5)
#' @param f5_b user data frame (a f5)
#' @param f5_c user data frame (a f5)
#' @param f5_d user data frame (a f5)
#'
#' @return data frame with new user id
#' @export
#'
#' @examples

create_f11 <- function(f5_a, f5_b, f5_c, f5_d) {
  f5_Louvre_MIT <- rbind(f5_a, f5_b, f5_c, f5_d) %>%
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
  
  f5_ids <- f5_Louvre_MIT %>%
    group_by(user_id) %>%
    summarize() %>%
    mutate(id = paste0("user_", as.hexmode(1:n())))
}
