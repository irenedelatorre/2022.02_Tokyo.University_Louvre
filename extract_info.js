// load data
Promise.all([
    d3.csv("network_data/f9_ap_rooms.csv", parseF9),
])
.then(function (files) {
    const f9 = files[0];
    console.log(f9)

    const floors = d3.selectAll("svg")
    .selectAll("#louvre-blueprint")
    .selectAll(".floor");

    const rooms_museum = [];
    const geometry = [];

    // functions
    function pushToArray(array, type, floor) {
        if (!array.empty()){
            array.each(function(c, j) {
                const this_path = d3.select(this).attr("d");
                const fill_rule = d3.select(this).attr("fill-rule");
                if (this_path !== "M") {
                    geometry.push({
                        type: type,
                        floor: floor,
                        d: this_path,
                        fill_rule: fill_rule
                    });
                }
            });
        }
    }

    function arrayToCSV(array, keys) {
        console.log(array, keys)
        const csvString = [
            keys,
            ...array.map(item => Object.values(item))
        ].map(e => e.join(",")) 
        .join("\n");

        return csvString;
    }

    function downloadBlob() {
        const data = this.id === "download_geom" ? 
            arrayToCSV(geometry, geometry_keys) : 
            arrayToCSV(rooms_museum, rooms_keys);
        const filename = this.id === "download_geom" ? "geometry.csv" : "rooms.csv";
        const contentType = 'text/csv;charset=utf-8;';

        // Create a blob
        var blob = new Blob([data], { type: contentType });
        var url = URL.createObjectURL(blob);
        
        // Create a link to download it
        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', filename);
        pom.click();
    }

    function findRoom(id, param) {
        const this_room = f9.filter(d => +d[param] === +id);
        return this_room.length > 0 ? this_room[0].id_ap_3 : "NA";
    }

    floors.each(function(d, i) {

        // floor
        const this_floor = this.id;

        // go through the base
        const id_base = `_${this_floor}`;
        const base = d3.selectAll(`#ground${id_base}`);
        pushToArray(base, "ground", this_floor); 

        // go through the rooms_blueprint 
        const floor = d3.selectAll(`#rooms_blueprint${id_base}`)
            .selectAll("path");
        pushToArray(floor, "rooms_blueprint", this_floor); 

        console.log(`#rooms_blueprint${id_base}`)

        // go through the stairs 
        const stairs = d3.select(`#stairs${id_base}`)
            .selectAll("path");
        pushToArray(stairs, "stairs", this_floor); 

        // go through the rooms
        const rooms = d3.selectAll(`#rooms${id_base}`)
            .selectAll("g");
        
        rooms.each(function(c, j) {
            const this_id = this.id;
            
            const type = this_id.split("-");
            const multi = this_id.split("_");
            let id_room = this_id;
            let param = "Museum_room";

            if (type.length === 2) {
                id_room = type[1];
                param = "Room_Number";
            } else if (multi.length === 2) {
                id_room = multi[0];
            } else{

            }
            const room = d3.select(this)
                .selectAll("circle");

            rooms_museum.push({
                floor: this_floor,
                room: id_room,
                id_ap_3: findRoom(id_room, param),
                x: room.attr("cx"),
                y: room.attr("cy"),
                type: type.length === 2 ? "other" : "room"
            })
        })


    })

    const geometry_keys = ["type", "floor", "d", "fill_rule"];
    const rooms_keys = ["floor", "room", "id_ap_3", "x", "y", "type"];

    d3.select("#download_geom")
        .on("click", downloadBlob);

    d3.select("#download_rooms")
        .on("click", downloadBlob);
})

function parseF9(d) {
    return {
        Museum_room : d.Museum_room,
        Room_Number: d.Room_Number,
        id_ap_3: d.id_ap_3
    }
}



