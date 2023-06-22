const clean_network = {
    nodes : function(metadata_wifi, all_nodes, all_floors, map_rooms) {
        all_nodes.forEach(d => {
            parse.merge_wifi_node(metadata_wifi, d);

            // cluster goes to main floor in the wifi dataset
            d.cluster = all_floors.indexOf(d.floor.split(", ")[0]);

            // give a new id for the network layout
            d.id = map_rooms.indexOf(d.id_ap_3);
        });

        return all_nodes;
    },

    links: function(metadata_wifi, all_links, map_rooms) {
        all_links.forEach(d => {
            // check if the source and target appear in the museum 
            d.mRoom_source = clean_network.get_Museum_n(
                d.id_source,
                metadata_wifi
            );

            d.mRoom_target = clean_network.get_Museum_n(
                d.id_target,
                metadata_wifi
            );

            parse.merge_wifi_link(
                metadata_wifi,
                d
            );
            const bouncer_s = clean_network.bouncer(d.mRoom_source);
            const bouncer_t = clean_network.bouncer(d.mRoom_target);
            const isNaN = !bouncer_s || !bouncer_t ? false : true;
    
            // give a new id for the network layout
            d.source = map_rooms.indexOf(d.id_source);
            d.target = map_rooms.indexOf(d.id_target);
            d.change_floor = d.main_floor !== d.main_floor_target ?
                true : false;
            d.isNaN = isNaN;
        });

        return all_links;
    },

    get_Museum_n(id, metadata_wifi) {
        const this_room = metadata_wifi.filter((d) => d.id_ap_3 === id);
        const ids = d3.groupSort(
            this_room,
            g => g.length,
            d => d.museum_room
        );
        // filter out NaN
        const ids_noNan = ids.filter(d => d >= 0);

        // if there is only one match get the room, whatever the value
        if (ids.length === 1) {
            return ids[0];
        // if there is more than one match, pick the first room in the list
        } else if (ids.length > 1 && ids_noNan.length > 0) {
            return ids_noNan[0];
        } else if (ids.length > 1 && ids_noNan.length === 0) {
            return NaN;
        }
      },

    bouncer(id) {
        const array = [id];
        const filtered = array.filter(Boolean);
        // if the array is longer than 0
        // then the room is not NaN
        return filtered.length > 0 ? false : true;
      }

}