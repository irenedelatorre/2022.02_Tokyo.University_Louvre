class blueprintClass {
    constructor(item) {
        this.geometry = item.geometry;
        this.floors = d3.groups(this.geometry, (d) => d.floor);
        this.rooms = item.rooms;
        this.links = item.links;
        this.id = item.id;
        this.selectPlot = d3.select(`#${this.id}`);
        this.size_w = item.size_w;
        this.size_h = item.size_h;
        this.ratio = Math.round((100 * this.size_h) / this.size_w) / 100;
        this.scaleColor = item.scaleColor;
        this.options = item.options;
        // this.container = document.querySelector(`#${item.id}`);
        // new p5(this.sketch.bind(this), this.container);
        this.selected_level = "RC - Level 0";
    }

    async execute(){
        console.log("init")
        // Code for the first class
        this.init();
        this.createSVG();
        this.drawFloors();

        // create the controls
        const checkbox_network = new checkbox({
            scaleColor: this.scaleColor,
            options: this.options,
            id: `${this.id}-controls`,
            type: this.id,
            module: this
        })
    }
    
    init() {
        this.margin = {t: 20, l: 20, r: 250, b: 20};
        this.w = 
            document.getElementById(this.id).clientWidth - 
            this. margin.r - 
            this.margin.l;
        this.h = 
            document.getElementById(this.id).clientHeight - 
            this.margin.t - 
            this.margin.b;

        this.scaleStroke = d3
            .scaleLinear()
            .domain(d3.extent(this.links, (d) => d.n_total))
            .range([0.01, 15]);
    }

    createSVG() {
        if (this.selectPlot.selectAll("svg").empty()) {
            this.plot = this.selectPlot.append("svg");
        } else {
            this.plot = this.selectPlot.select("svg");
        }

        this.plot
            .attr("width", this.w)
            .attr("height", (this.w * this.ratio))
            .attr("viewBox", `0 0 ${this.size_w} ${this.size_h}`)
            .attr("xmlns", "http://www.w3.org/2000/svg");
    }

    drawFloors() {
        const this_level = this.floors.filter((e) => 
            e[0] === this.selected_level
        );
        this.plotFloors = this.plot
            .selectAll("g")
            .data(this_level)
            .join("g")
            .attr("id", (d) => `level_${d[0]}`);

        // ground
        this.drawGeom("ground");
        this.drawGeom("stairs");
        this.drawGeom("rooms_blueprint");
        this.drawLinks();
        this.drawRooms();
    }

    drawGeom(name) {
        const g = this.plotFloors
            .selectAll(`.${name}`)
            .data((d) => [d])
            .join("g")
            .attr("class", name);

        g.selectAll("path")
            .data((d) => d[1].filter((e) => e.type === name))
            .join("path")
            .attr("class", name)
            .attr("id", (d) => `${d.floor}_${name}`)
            .attr("d", (d) => d.path)
            .attr("fill-rule", (d) => d.fill_rule);
      }

    drawRooms() {
        this.plotFloors
            .append("g")
            .attr("class", "rooms")
            .selectAll(".room")
            .data(this.rooms.filter((d) => d.floor === this.selected_level))
            .join("circle")
            .attr("class", d => (d.id_ap_3 >= 0 ?
                "room r_known" :
                "room r_unknown"
            ))
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => (d.id_ap_3 >= 0 ? 2 : 1));
    }

    drawLinks(links) {
        this.plotFloors
            .append("g")
            .attr("class", "movements")
            .selectAll(".link")
            .data(this.links.filter((d) => d.floor === this.selected_level))
            .join("line")
            .attr("class", "link")
            .attr("stroke", (d) =>
                d.change_floor ? "black" : this.scaleColor(d.floor)
            )
            .attr("x1", (d) => {
                if (isNaN(d.x_source)){
                    console.log(d)
                }
                return d.x_source
            })
            .attr("x2", (d) => d.x_target)
            .attr("y1", (d) => d.y_source)
            .attr("y2", (d) => d.y_target)
            .style("stroke-width", (d) => this.scaleStroke(d.n_total));
      }

      updateVisual(type, value) {
        
        if (type === "checkbox") {
            this.selected_level = value;
        } else if (type === "toggle") {
            this.hideNaN = value;
        }

        // // filter by level && this NaN
        // if (this.selected_level !== "All" || this.hideNaN) {
        //     filtered_links = filtered_links.filter(d => {
        //         if (this.selected_level !== "All" && !this.hideNaN) {
        //             // filter selected level
        //             return d.source.main_floor === this.selected_level;
        //         } else if (this.selected_level !== "All" && this.hideNaN) {
        //             // filter selected level + isNan
        //             return d.source.main_floor === this.selected_level &&
        //                 !d.isNaN;
        //         } else if (this.selected_level === "All" && this.hideNaN) {
        //             // filter isNan
        //             return !d.isNaN;
        //         }
        //     });
        // }

        // ground
        this.drawFloors();
    }
    // async sketch(p) {
    //     const object = this;
    //     let canvas;
    //     let context;

    //     p.setup = () => {
    //         this.w = document.getElementById(this.id).clientWidth;
    //         this.h = document.getElementById(this.id).clientHeight;
    //         canvas = p.createCanvas(
    //             this.w,
    //             this.h,
    //             p.WEBGL
    //         );
    //         // prepare for 2d drawing later
    //         canvas.id('canvas');
    //         const this_canvas = document.getElementById('canvas');
    //         context = this_canvas.getContext("2d");

    //         p.background("red");
    //         p.noLoop();
    //     };

    //     p.draw = () => {
    //         p.translate(-this.w / 2, -this.h / 2);
    //         const this_floor = this.floor === undefined ? 0 : this.floor;
    //         const this_floor_g = this.geometry.filter(d => d.floor_n === this_floor);


    //         p.scale(0.3);
    //         draw_geometry(this_floor_g);
    //         console.log(this_floor, this_floor_g)

    //     }

    //     function draw_geometry (geom) {
    //         drawGround(geom.filter(d => d.type === "ground"));
    //         console.log(geom)
    //     }

    //     function drawGround(ground) {
    //         ground.forEach(d => {
    //             const svgGround = createPathFromSVG(d.path);
    //         // console.log(svgGround)
    //         // Draw a custom shape
    //         p.fill("black")
    //         p.beginShape();
    //         for (let i = 0; i < svgGround.length; i++) {
    //             const command = svgGround[i];
    //             if (command.type === "M") {
    //                 p.vertex(command.x, command.y);
    //             } else if (command.type === "L") {
    //                 p.vertex(command.x, command.y);
    //             } else if (command.type === "Z") {
    //                 p.endShape(p.CLOSE);
    //             }
    //         }
    //         });
            
    //         // p.endShape(p.CLOSE);

    //     }

    //     function createPathFromSVG(pathString) {
    //         const commands = [];
    //         const segments = pathString.split(/(?=[A-Z])/);
    
    //         segments.forEach((segment) => {
    //             const type = segment.charAt(0);
    //             const coords = segment.substring(1).trim().split(" ");
    //             const x = parseFloat(coords[0]);
    //             const y = parseFloat(coords[1]);
            
    //             commands.push({ type, x, y });
    //           });
            
    //           return commands;
    //     }
    // }

    // setup() {
    //     this.w = document.getElementById(this.id).clientWidth;
    //     this.h = document.getElementById(this.id).clientHeight;
    //     createCanvas(
    //         this.container.width,
    //         this.container.height,
    //         this.WEBGL
    //     );
    //     background("black");
    // }

    // draw() {

    // }
}