## Load data

``` r
source <- "../network_data/"
source_users <- "../../network_data/"
```

### Matrix file

``` r
f1_Louvre_network <- read_csv(
  paste0(source, "Rooms.Matrix/Louvre_network.csv")
  )
```

### Room data

``` r
f2_Louvre_network_Wi_Fi_miyajima_200528fin <- read_excel(
  paste0(
    source,
    "Rooms.Access.Points/Louvre_network+Wi-Fi_miyajima_200528fin.xlsx"
    )
  ) %>%
  rename(id_ap_1 = "ID_Access_Point")
```

    ## New names:
    ## * `` -> `...1`

``` r
head(f2_Louvre_network_Wi_Fi_miyajima_200528fin)
```

    ## # A tibble: 6 x 3
    ##   ...1  Room_Number id_ap_1
    ##   <chr>       <dbl> <chr>  
    ## 1 <U+3042>              1 M16    
    ## 2 <U+3042>              2 M16    
    ## 3 <U+3042>              3 M16    
    ## 4 <U+3042>              4 M16    
    ## 5 <U+3042>              5 -      
    ## 6 <U+3042>              6 M21

### Room data

``` r
f2_Louvre_network_Wi_Fi_miyajima_200528fin <- read_excel(
  paste0(
    source,
    "Rooms.Access.Points/Louvre_network+Wi-Fi_miyajima_200528fin.xlsx"
    )
  ) %>%
  rename(id_ap_1 = "ID_Access_Point")
```

    ## New names:
    ## * `` -> `...1`

``` r
f3_WiFi_rename_miyajima_200528fin <- read_excel(
  paste0(
    source,
    "Rooms.Access.Points/Wi-Fi_rename_miyajima_200528fin.xlsx"
    )
  ) %>%
  rename(id_ap_1 = "No.") %>%
  select(c(id_ap_1, memo, mac)) %>%
  drop_na(id_ap_1)
```

    ## New names:
    ## * `` -> `...3`

``` r
f4_WIFI_LOUVRE_TRUE <- read_excel(
  paste0(source, "Rooms.Access.Points/WIFI_LOUVRE_TRUE.xlsx")
) %>%
  rename(
    id_ap_2 = Borne,
    mac_eth = "MAC ETH",
    mac_radio = "range MAC Radio", 
    location = "Emplacement") %>%
  select(c(id_ap_2, mac_eth, mac_radio, location))

f12_room_names_ids <- read_excel(
  paste0(source, "Rooms - museo and ids.xlsx")
)
```

### User data

It takes quite a long time to load

``` r
f5A_Louvre_MIT_1_2017_11 <- read_csv(
  paste0(source_users,"Users.Locations/Louvre_MIT(11-2017)_v1.csv"))
```

    ## Rows: 1665198 Columns: 12
    ## -- Column specification --------------------------------------------------------
    ## Delimiter: ","
    ## chr  (6): ID, ACCESS_POINT_HOSTNAME, ACCESS_POINT_IP_ADDRESS, DEVICE_CLASS_T...
    ## dbl  (2): TIME_DUR_MIN, WEEKDAY
    ## date (1): DATE
    ## time (3): TIME_DEB, TIME_END, TIME_DUR
    ## 
    ## i Use `spec()` to retrieve the full column specification for this data.
    ## i Specify the column types or set `show_col_types = FALSE` to quiet this message.

``` r
f5A_Louvre_MIT_1_2017_12 <- read_csv(
  paste0(source_users,"Users.Locations/Louvre_MIT(12-2017)_v2.csv"))
```

    ## Rows: 1661420 Columns: 12
    ## -- Column specification --------------------------------------------------------
    ## Delimiter: ","
    ## chr  (6): ID, ACCESS_POINT_HOSTNAME, ACCESS_POINT_IP_ADDRESS, DEVICE_CLASS_T...
    ## dbl  (2): TIME_DUR_MIN, WEEKDAY
    ## date (1): DATE
    ## time (3): TIME_DEB, TIME_END, TIME_DUR
    ## 
    ## i Use `spec()` to retrieve the full column specification for this data.
    ## i Specify the column types or set `show_col_types = FALSE` to quiet this message.

``` r
f5A_Louvre_MIT_1_2018_1 <- read_csv(
  paste0(source_users,"Users.Locations/Louvre_MIT(1-2018)_v3.csv"))
```

    ## Rows: 1826189 Columns: 12
    ## -- Column specification --------------------------------------------------------
    ## Delimiter: ","
    ## chr  (6): ID, ACCESS_POINT_HOSTNAME, ACCESS_POINT_IP_ADDRESS, DEVICE_CLASS_T...
    ## dbl  (2): TIME_DUR_MIN, WEEKDAY
    ## date (1): DATE
    ## time (3): TIME_DEB, TIME_END, TIME_DUR
    ## 
    ## i Use `spec()` to retrieve the full column specification for this data.
    ## i Specify the column types or set `show_col_types = FALSE` to quiet this message.

``` r
f5A_Louvre_MIT_1_2018_2 <- read_csv(
  paste0(source_users,"Users.Locations/Louvre_MIT(2-2018).csv"))
```

    ## Rows: 1921807 Columns: 12
    ## -- Column specification --------------------------------------------------------
    ## Delimiter: ","
    ## chr  (6): ID, ACCESS_POINT_HOSTNAME, ACCESS_POINT_IP_ADDRESS, DEVICE_CLASS_T...
    ## dbl  (2): TIME_DUR_MIN, WEEKDAY
    ## date (1): DATE
    ## time (3): TIME_DEB, TIME_END, TIME_DUR
    ## 
    ## i Use `spec()` to retrieve the full column specification for this data.
    ## i Specify the column types or set `show_col_types = FALSE` to quiet this message.

``` r
head(f5A_Louvre_MIT_1_2018_1)
```

    ## # A tibble: 6 x 12
    ##   ID         ACCESS_POINT_HO~ ACCESS_POINT_IP~ DEVICE_CLASS_TY~ TIME_ASSOCIATED~
    ##   <chr>      <chr>            <chr>            <chr>            <chr>           
    ## 1 ffc06b5ea~ AP056            172.29.0.56      "\nAndroid"      "Jan 4 2018 10:~
    ## 2 ffc06b5ea~ AP041            172.29.0.41      "\nAndroid"      "Jan 4 2018 10:~
    ## 3 ffc06b5ea~ AP062            172.29.0.62      "\nAndroid"      "Jan 4 2018 10:~
    ## 4 ffc06b5ea~ AP051            172.29.0.51      "\nAndroid"      "Jan 4 2018 10:~
    ## 5 ffc06b5ea~ AP040            172.29.0.40      "\nAndroid"      "Jan 4 2018 10:~
    ## 6 ffc06b5ea~ AP040            172.29.0.40      "\nAndroid"      "Jan 4 2018 11:~
    ## # ... with 7 more variables: DATE <date>, TIME_DEB <time>, TIME_END <time>,
    ## #   TIME_DUR <time>, TIME_DUR_MIN <dbl>, WEEKDAY <dbl>, TIME_SLOT <chr>

## Merge data

### f6 = f3 + f4 —— merge by mac id

``` r
source("../R/3_match_f3_f4_to_f6.R")

f6_id_1_2_matched <- create_f6(
  f3 = f3_WiFi_rename_miyajima_200528fin,
  f4 = f4_WIFI_LOUVRE_TRUE
  )
```

    ## Match f3 with f4: 154 out of 154 access from f3 matched (100%).

    ## Match f3 with f4: 83 out of 114 access from f4 matched (73%).

### f8 = f5 + f6 —— merge by id_ap_2

It picks single names of the id_ap_2

``` r
source("../R/4_match_f5_f6_to_f8.R")

f8_ap_matched_rooms <- create_f8(
  f5A_Louvre_MIT_1_2017_11,
  f5A_Louvre_MIT_1_2017_12,
  f5A_Louvre_MIT_1_2018_1,
  f5A_Louvre_MIT_1_2018_2,
  f6 = f6_id_1_2_matched,
  f12 = f12_room_names_ids
  )
```

    ## Match rooms and ap_ids: 154 out of 176 access points matched (88%).

### f9 = summary of 8

``` r
source("../R/5_f8_to_summary_f9.R")
f9_ap_rooms <- create_f9(f8_ap_matched_rooms, "../assets/data/f9_ap_rooms.csv")
```

### f11 = new user ids

``` r
source("../R/7_f5_to_f11_new_user_ids.R")

f11_new_user_ids <- create_f11(
  f5A_Louvre_MIT_1_2017_11,
  f5A_Louvre_MIT_1_2017_12,
  f5A_Louvre_MIT_1_2018_1,
  f5A_Louvre_MIT_1_2018_2
)
```

### new user location

#### merge f8 with f5

``` r
source("../R/6_merge_f5_f8_new_user.R")

f10_Louvre_MIT_1_2017_11 <- create_new_user_track(
  f5A_Louvre_MIT_1_2017_11,
  f8_ap_matched_rooms,
  f11_new_user_ids
  )

f10_Louvre_MIT_1_2017_12 <- create_new_user_track(
  f5A_Louvre_MIT_1_2017_12,
  f8_ap_matched_rooms,
  f11_new_user_ids
  )

f10_Louvre_MIT_1_2018_1 <- create_new_user_track(
  f5A_Louvre_MIT_1_2018_1,
  f8_ap_matched_rooms,
  f11_new_user_ids
  )

f10_Louvre_MIT_1_2018_2 <- create_new_user_track(
  f5A_Louvre_MIT_1_2018_2,
  f8_ap_matched_rooms,
  f11_new_user_ids
  )

summary_f10(
  f10_Louvre_MIT_1_2017_11,
  f10_Louvre_MIT_1_2017_12,
  f10_Louvre_MIT_1_2018_1,
  f10_Louvre_MIT_1_2018_2
  )
```

    ## Match rooms, ap_ids and users: 3301788 out of 7074619 movements matched (47%)

#### Export final format

``` r
final_format_f10(
  f10_Louvre_MIT_1_2017_11,
  "f10_Louvre_MIT_1_2017_11.csv",
  "../../network_data/Users.Locations-output/"
  )

final_format_f10(
  f10_Louvre_MIT_1_2017_12,
  "f10_Louvre_MIT_1_2017_12.csv",
  "../../network_data/Users.Locations-output/"
  )

final_format_f10(
  f10_Louvre_MIT_1_2018_1,
  "f10_Louvre_MIT_1_2018_1.csv",
  "../../network_data/Users.Locations-output/"
  )

final_format_f10(
  f10_Louvre_MIT_1_2018_2,
  "f10_Louvre_MIT_1_2018_2.csv",
  "../../network_data/Users.Locations-output/"
  )
```
