const clean_network = {
    nodes : function(metadata_wifi, all_nodes, all_floors, map_rooms) {
        all_nodes.forEach(d => {
            parse.merge_wifi_node(metadata_wifi, d);

            // cluster goes to main floor in the wifi dataset
            d.cluster = all_floors.indexOf(d.floor.split(", ")[0]);

            // give a new id for the network layout
            d.id = map_rooms.indexOf(d.id_ap_3);
        });

        return all_nodes.filter((d) => d.id >= 0);
    },

    links: function(metadata_wifi, all_links, all_floors, map_rooms) {
        all_links.forEach(d => {
            parse.merge_wifi_link(metadata_wifi, d);
    
            // give a new id for the network layout
            d.source = map_rooms.indexOf(d.room_source);
            d.target = map_rooms.indexOf(d.room_target);
        });

        return all_links.filter((d) => d.target >= 0 && d.source >= 0);
    }

}