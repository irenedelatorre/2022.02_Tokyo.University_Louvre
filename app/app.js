// load data
Promise.all([
    // d3.json('./assets/data/tokyo_grid.json'),
    // d3.json('./assets/data/tokyo_wards_admin_level_7.json'),
    d3.csv('./assets/data/geometry.csv', parse.parseGeometry),
    d3.csv('./assets/data/f9_ap_rooms.csv', parse.parseF9_ap_rooms),
    d3.csv('./assets/data/rooms.csv', parse.parseRooms),
    // d3.csv('./assets/data/admin_grid_join.csv', parse.parseWards)
])
.then(function(files) {
    console.log(files);

    const geometry = files[0];
    const metadata_wifi = files[1];
    const all_rooms = files[2];

    // fill in information with metadata_wifi
    all_rooms.forEach(d => {
        d.id = getNodeInfo(
            nodes_all,
            "id_ap_3",
            getNodeInfo(metadata_wifi, "Museum_room", d.room, "id_ap_3"),
            "id"
          ),
          d.n_total: +getNodeInfo(
            nodes_all,
            "id_ap_3",
            getNodeInfo(metadata_wifi, "Museum_room", d.room, "id_ap_3"),
            "n_total"
          ),
          d.median_dur: +getNodeInfo(
            nodes_all,
            "id_ap_3",
            getNodeInfo(metadata_wifi, "Museum_room", d.room, "id_ap_3"),
            "median"
          ),
          area: getNodeInfo(metadata_wifi, "Museum_room", d.room, "Area"),
          type: getNodeInfo(metadata_wifi, "Museum_room", d.room, "Type"),
          collection: getNodeInfo(metadata_wifi, "Museum_room", d.room, "Collection"),
          highlight: getNodeInfo(metadata_wifi, "Museum_room", d.room, "Highlight")
    });
})