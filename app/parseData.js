const parse = {
    parseGeometry: function(d) {
        return {
            floor: d.floor,
            type: d.type,
            d: d.d,
            fill_rule: d.fill_rule === null ? "inherit" : d.fill_rule
        }
    },

    parseF9_ap_rooms: function(d){
        return {
            id_ap_3: +d.id_ap_3,
            museum_room: +d.Museum_room,
            // handwritten unofficial room number 
            // Room_Number: +d.Room_Number, 
            area: d.Area,
            type: d.Type,
            collection: d.Collection,
            highlight: d.Highlight,
        }
    },

    parseRooms: function(d) {
        return {
            floor: d.floor,
            type_id: d.type,
            museum_room: +d.room,
            x_svg: +d.x,
            y_svg: +d.y,
            id_ap_3: +d.id_ap_3,
        }
    },

    getNodeInfo: function(array, param, roomN, info, type) {
        const real_param =
          type === "other" && param === "Museum_room" ? "Room_id" : param;
      
        const this_node = array.filter((d) => +d[real_param] === +roomN);
      
        return this_node.length === 0 ? undefined : this_node[0][info];
      }
}