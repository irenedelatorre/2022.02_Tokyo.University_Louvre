const floors = d3.selectAll("svg")
    .selectAll("#louvre-blueprint")
    .selectAll(".floor");

const rooms_museum = [];
const geometry = [];

floors.each(function(d, i) {

    // floor
    const this_floor = this.id;

    // go through the base
    const id_base = i === 0 ? "" : `_${i+1}`;
    const base = d3.select(`#ground${id_base}`).attr("d");
    geometry.push({type: "ground", floor: this_floor, d: base});

    // go through the rooms_blueprint 
    const floor = d3.selectAll(`#rooms_blueprint${id_base}`)
        .selectAll("path")
        .attr("d");
    pushToArray(floor, "rooms_blueprint", this_floor);

    // go through the stairs 
    const stairs = d3.select(`#stairs${id_base}`)
        .selectAll("path");
    if (!stairs.empty()) {
        pushToArray(stairs.attr("d"), "stairs", this_floor);
    }

    // go through the rooms
    const rooms = d3.selectAll(`#rooms${id_base}`)
        .selectAll("g");
    
    rooms.each(function(c, j) {
        const this_id = this.id;
        const room = d3.select(this)
            .selectAll("circle");
        rooms_museum.push({
            floor: this_floor,
            room: this_id,
            x: room.attr("cx"),
            y: room.attr("cy")
        })
    })

})

const geometry_keys = ["type", "floor", "d"];
const rooms_keys = ["floor", "room", "x", "y"];

d3.select("#download_geom")
    .on("click", downloadBlob);

d3.select("#download_rooms")
    .on("click", downloadBlob);

function pushToArray(array, type, floor) {
    if (array !== "M") {
        geometry.push({
            type: type,
            floor: floor,
            d: array
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
