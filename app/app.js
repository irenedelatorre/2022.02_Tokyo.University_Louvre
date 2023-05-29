// load data
Promise.all([
    d3.csv('./assets/data/f9_ap_rooms.csv', parse.parseF9_ap_rooms),

    // NETWORK
    d3.csv('./assets/data/network_nodes_agg_all.csv', parse.parseNodesNW),
    d3.csv('./assets/data/network_agg_all.csv', parse.parseLinksNW),

])
.then(function(files) {
    const metadata_wifi = files[0];
    const all_nodes = files[1];
    const all_links = files[2];

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
    const links = clean_network.links(
        metadata_wifi,
        all_links,
        all_floors,
        map_rooms
        );

    //// 0 COMMON SCALES ////
    const colors_floors = [
        {level: 2, name: "N2 - Level 2", c: "#6D0000", short: "Level 2"},
        {level: 1, name: "N1 - Level 1", c: "#BC4900", short: "Level 1"},
        {level: 0, name: "RC - Level 0", c: "#F7992E", short: "Level 0"},
        {level: -1, name: "S1 - Level -1", c: "#2373AF", short: "Level -1"},
        {level: -2, name: "S2 - Level -2", c: "#003468", short: "Level -2"},
    ];

    const core_colors = {links: "#666", nodes_s: "#032122", nodes_f: "#fff"};

    const scaleColor = d3
        .scaleOrdinal()
        .domain(colors_floors.map(d => d.name))
        .range(colors_floors.map(d => d.c))
        .unknown(core_colors.links)

    // 2 CREATE NETWORK ---
    const network = new networkClass({
        nodes: nodes,
        links: links,
        floors: all_floors,
        scaleColor: scaleColor,
        core_colors: core_colors,
        id: "network"
    });

    const checkbox_network = new checkbox({
        scaleColor: scaleColor,
        options: colors_floors,
        id: "network-controls",
        type: "network",
        module: network
    })
})