const floors = d3.selectAll("svg")
    .selectAll("#louvre-blueprint")
    .selectAll(".floor");

const rooms_museum = [];
const geometry = [];

floors.each(function(d, i) {

    console.log(d)

    // floor
    const this_floor = this.id;

    // go through the base
    const id_base = i === 0 ? "" : `_${i+1}`;
    const base = d3.selectAll(`#ground${id_base}`);
    pushToArray(base, "ground", this_floor); 

    // go through the rooms_blueprint 
    const floor = d3.selectAll(`#rooms_blueprint${id_base}`)
        .selectAll("path");
    pushToArray(floor, "rooms_blueprint", this_floor); 

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
        let id = this_id;

        if (type.length === 2) {
            id = type[1];
        } else if (multi.length === 2) {
            id = multi[0];
        }
        console.log(this_id, id)
        const room = d3.select(this)
            .selectAll("circle");
        rooms_museum.push({
            floor: this_floor,
            room: id,
            x: room.attr("cx"),
            y: room.attr("cy"),
            type: type.length === 2 ? "other" : "room"
        })
    })

})

const geometry_keys = ["type", "floor", "d", "fill_rule"];
const rooms_keys = ["floor", "room", "x", "y", "type"];

d3.select("#download_geom")
    .on("click", downloadBlob);

d3.select("#download_rooms")
    .on("click", downloadBlob);

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
