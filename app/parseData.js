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
            room_source: +d.source,
            room_target: +d.target,
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
        const position = wifi.filter((e) => e.id_ap_3 === link.room_source);
        const areas = d3.groupSort(position, g => g.length, d => d.area);
        const floors = d3.groupSort(position, g => g.length, d => d.floor);

        // source
        link.area = parse.toString(areas);
        link.floor = parse.toString(floors);
        link.main_floor = floors[0];

        // target
        const position_target = wifi.filter((e) => 
            e.id_ap_3 === link.room_target
        );
        const floors_target = d3.groupSort(position_target, g => 
            g.length, d => d.floor
        );
        link.main_floor_target = floors_target[0];
    },

    // parseGeometry: function(d) {
    //     return {
    //         floor: d.floor,
    //         type: d.type,
    //         d: d.d,
    //         fill_rule: d.fill_rule === null ? "inherit" : d.fill_rule
    //     }
    // },


    // parseRooms: function(d) {
    //     return {
    //         floor: d.floor,
    //         type_id: d.type,
    //         museum_room: +d.room,
    //         x_svg: +d.x,
    //         y_svg: +d.y,
    //         id_ap_3: +d.id_ap_3,
    //     }
    // },

    getNodeInfo: function(array, param, roomN, info, type) {
        const real_param =
          type === "other" && param === "Museum_room" ? "Room_id" : param;
      
        const this_node = array.filter((d) => +d[real_param] === +roomN);
      
        return this_node.length === 0 ? undefined : this_node[0][info];
      },
    
    
    toString: function(array, place, test) {
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