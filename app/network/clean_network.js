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


            d.id_ap_3_source = clean_network.get_Museum_n(
                d.room_source,
                metadata_wifi
            );

            d.id_ap_3_target = clean_network.get_Museum_n(
                d.room_target,
                metadata_wifi
            );
    
            // give a new id for the network layout
            d.source = map_rooms.indexOf(d.room_source);
            d.target = map_rooms.indexOf(d.room_target);
            d.isNan = clean_network.bouncer(d.id_ap_3_source) &&
                clean_network.bouncer(d.id_ap_3_target);
        });

        return all_links.filter((d) => d.target >= 0 && d.source >= 0);
    },

    get_Museum_n(id, metadata_wifi) {
        const this_room = metadata_wifi.filter((d) => d.id_ap_3 === id);
        if (this_room.length > 0) {
          return +this_room[0].museum_room;
        }
      },

    bouncer(id) {
        const array = [id];
        const filtered = array.filter(Boolean);
        return filtered.length > 0 ? false : true;
      }

}