const parse = {
    parseF9_ap_rooms: function(d){
        return {
            id_ap_3: +d.id_ap_3,
            museum_room: +d.Museum_room,
            // handwritten unofficial room number 
            // Room_Number: +d.Room_Number, 
            floor: d.Floor,
            area: d.Area,
            type: d.Type,
            collection: d.Collection,
            highlight: d.Highlight,
        };
    },

    //// NETWORK ////
    parseNodesNW: function(d) {
        return {
            id_ap_3: +d.id_ap_3,
            n_total: +d.n_total,
            median:  Math.round((100 * +d.median) / 60) / 100, // minutes
        };
    },

    parseLinksNW: function(d) {
        return {
            id_source: +d.source,
            id_target: +d.target,
            n_total: +d.n_total,
            median: Math.round((100 * d.median) / 60) / 100,
          };
    },

    merge_wifi_node: function(wifi, node) {
        const position = wifi.filter((e) => e.id_ap_3 === node.id_ap_3);
        const areas = d3.groupSort(position, g => g.length, d => d.area);
        const floors = d3.groupSort(position, g => g.length, d => d.floor);
        const museum_rooms = d3.groupSort(
            position,
            g => g.length,
            d => d.museum_room
        );
        const highlights = d3.groupSort(
            position, g => g.length,
            d => d.highlight
            );

        node.area = parse.toString(areas, "areas");
        node.floor = parse.toString(floors, "floors", true);
        node.main_floor = floors[0];
        node.highlight = parse.toString(highlights, "highlights");
        node.museum_room = parse.toString(museum_rooms, "rooms");
        node.isNaN = node.museum_room === "" ? true : false;

    },

    merge_wifi_link: function(wifi, link) {
        const position = isNaN(link.mRoom_source) ?
            wifi.filter((e) => e.id_ap_3 === link.id_source) :
            wifi.filter((e) => e.museum_room === link.mRoom_source);

        const areas = d3.groupSort(position, g => g.length, d => d.area);
        const floors = d3.groupSort(position, g => g.length, d => d.floor);


        // source
        link.area = parse.toString(areas);
        link.floor = parse.toString(floors);
        link.main_floor = floors[0];

        // target
        const position_target = isNaN(link.mRoom_target) ? 
            wifi.filter((e) => e.id_ap_3 === link.id_target) :
            wifi.filter((e) => e.museum_room === link.mRoom_target);
        const floors_target = d3.groupSort(position_target, g => 
            g.length, d => d.floor
        );
        link.main_floor_target = floors_target[0];
    },

    parseGeometry: function(d) {
        return {
            floor: d.floor,
            type: d.type,
            path: d.d,
            fill_rule: d.fill_rule === null ? "inherit" : d.fill_rule
        }
    },

    parseGeomRooms: function(d) {
        return {
            floor: d.floor,
            mRoom: +d.room,
            id_ap_3: +d.id_ap_3,
            x_svg: +d.x,
            y_svg: +d.y,
            type: d.type
        }
    },

    merge_geom_nodes: function(rooms, metadata_wifi) {
        const geom_rooms = rooms;
        console.log(metadata_wifi, rooms)

        geom_rooms.forEach(d => {

            // get room info
            const this_room = metadata_wifi.filter(e =>
                e.museum_room === d.mRoom
            );

            d.area = this_room.length > 0 ?
                this_room[0].area :
                NaN;
            d.collection = this_room.length > 0 ?
                this_room[0].collection :
                NaN;
            d.highlight = this_room.length > 0 ?
                this_room[0].highlight :
                NaN;
        });

        return geom_rooms;
    },

    merge_geom_links: function(rooms, links) {
        const geom_links = links;

        geom_links.forEach(d => {
            // get source info
            const this_room_s = rooms.filter(e =>
                e.mRoom === d.mRoom_source &&
                e.floor === d.main_floor.split(" - ")[0]
            );
            const this_room_t = rooms.filter(e =>
                e.mRoom === d.mRoom_target &&
                e.floor === d.main_floor_target.split(" - ")[0]
            );

            d.x_source = this_room_s.length > 0 ?
                this_room_s[0].x_svg :
                NaN;
            d.y_source = this_room_s.length > 0 ?
                this_room_s[0].y_svg :
                NaN;
            d.x_target = this_room_t.length > 0 ?
                this_room_t[0].x_svg :
                NaN;
            d.y_target = this_room_t.length > 0 ?
                this_room_t[0].y_svg :
                NaN;
        });

        return geom_links.filter(d =>
            !isNaN(d.mRoom_source) ||
            !isNaN(d.mRoom_target)
        );
    },

    getNodeInfo: function(array, param, roomN, info, type) {
        const real_param =
          type === "other" && param === "Museum_room" ? "Room_id" : param;
      
        const this_node = array.filter((d) => +d[real_param] === +roomN);
      
        return this_node.length === 0 ? undefined : this_node[0][info];
      },
    
    
    toString: function(array, place) {
        let value = "";

        for (var n in array) {
            if (array[n] === "NA" || (place === "rooms" && isNaN(array[n]))) {
                value = value;
            } else {
                value =
                value.length < 1 ? array[n] : `${value}, ${array[n]}`;
            }
          }

        return value;
    }
}