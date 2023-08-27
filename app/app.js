// load data
Promise.all([
    d3.csv("./assets/data/f9_ap_rooms.csv", parse.parseF9_ap_rooms),

    // NETWORK
    d3.csv("./assets/data/network_nodes_agg_all.csv", parse.parseNodesNW),
    d3.csv("./assets/data/network_agg_all.csv", parse.parseLinksNW),

    // BLUEPRINT
    d3.csv("./assets/data/geometry/geometry.csv", parse.parseGeometry),
    d3.csv("./assets/data/geometry/rooms.csv", parse.parseGeomRooms),

    // CONTENT
    d3.csv("./assets/data/metadata-content.csv", parse.metadataContent)
])
.then(function(files) {
    const metadata_wifi = files[0];
    const all_nodes = files[1];
    const all_links = files[2];
    const geometry = files[3];
    const blueprint_rooms = files[4];
    const metadata_content = files[5];

    console.log(metadata_content)

    //// NETWORK DATA ////
    const all_floors = d3.groupSort(
        metadata_wifi,
        (g) => g.length,
        (d) => (d === "RC - Level 0 **" ? "RC - Level 0" : d.floor)
      );

    const map_rooms = all_nodes
      .sort((a, b) => a.id_ap_3 - b.id_ap_3)
      .map((d) => d.id_ap_3);

    const nodes = clean_network.nodes(
        metadata_wifi,
        all_nodes,
        all_floors,
        map_rooms
        );

    const geom_rooms = parse.merge_geom_nodes(
        blueprint_rooms,
        metadata_wifi
    );

    // Links (network) array has
    // area: "Denon"​​​
    // change_floor: true (if the movement goes from one floor to another)​​​
    // floor: "N1 - Level 1" (source floor)​​​
    // id_source: 51​​​ (id_ap_3)
    // id_target: 37 (id_ap_3)​​​
    // isNaN: false (if there is no match with one of the museum rooms)​​​
    // mRoom_source: 717 (museum room)​​​
    // mRoom_target: 410 (museum room)​​​​​​
    // main_floor: "N1 - Level 1" (main source floor)​​​
    // main_floor_target: "RC - Level 0" (main target floor)​​​ ​​​
    // median: 8.52​​​
    // n_total: 2861​​​
    // source: 30​​​ (force layout id)
    // target: 17 (force layout id)
    const links = clean_network.links(
        metadata_wifi,
        all_links,
        map_rooms,
        nodes
        );
    
    // Links (geometry) same information as Links (network) with svg info
    const geom_links = parse.merge_geom_links(
        blueprint_rooms, 
        links
    );

    console.log(geom_links.filter(d => isNaN(d.x_source)))

    //// 0 COMMON SCALES ////
    const core_colors = {links: "#666666", nodes_s: "#fff", nodes_f: "#fff"};

    const colors_floors = [
        {level: "All", name: "All", c: core_colors.links, short: "All"},
        {level: 2, name: "N2 - Level 2", c: "#6D0000", short: "Level 2"},
        {level: 1, name: "N1 - Level 1", c: "#BC4900", short: "Level 1"},
        {level: 0, name: "RC - Level 0", c: "#F7992E", short: "Level 0"},
        {level: -1, name: "S1 - Level -1", c: "#2373AF", short: "Level -1"},
        {level: -2, name: "S2 - Level -2", c: "#003468", short: "Level -2"},
    ];

    const scaleColor = d3
        .scaleOrdinal()
        .domain(colors_floors.map(d => d.name))
        .range(colors_floors.map(d => d.c))
        .unknown(core_colors.links);

    // 2 CREATE NETWORK ---
    // Define an async IIFE (Immediately Invoked Function Expression) 
    // to call the classes sequentially
    const blueprint_container = document.querySelector("#blueprint");
    (async () => {
        const network = await new networkClass({
            nodes: nodes,
            links: links.filter((d) => d.target >= 0 && d.source >= 0),
            floors: all_floors,
            scaleColor: scaleColor,
            core_colors: core_colors,
            id: "network",
            options: colors_floors,
            metadata: metadata_content.filter(d => d.chart === "network")[0]
        }).execute();

        // visitors by trajectory
        const bar_table = await new barTableClass({
            links: links,
            floors: all_floors,
            scaleColor: scaleColor,
            core_colors: core_colors,
            id: "visitors-by-trajectory-table",
            bar_head: "bar_width",
            div_id: "table-divs",
            options: colors_floors,
            headers: ["Index", "Rooms", "Number of Visitors", "Number"],
            barIndex: 3,
            rowHeight: 24,
        }).execute();

        //blueprints
        const blueprint = await new blueprintClass({
            geometry: geometry,
            rooms: geom_rooms,
            links: geom_links,
            id: "blueprint",
            core_colors: core_colors,
            scaleColor: scaleColor,
            // floors: all_floors,
            options: colors_floors,
            size_w: 1552,
            size_h: 793,
            metadata: metadata_content.filter(d => d.chart === "blueprint")[0]
        }).execute();

        // new p5(blueprint);

    })();

    // update on windows resize
    window.onresize = function() {

        // doesn't need it 
        // bar_table.resize();
    };

})