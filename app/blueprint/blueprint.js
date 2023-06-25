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
        this.selected_level = "All";
        this.iso = true;
    }

    async execute(){
  
        // Code for the first class
        this.init();
        this.createSVG();

        if (this.iso) {
            this.drawFloorsIso();
            this.toIso();
        } else {
            this.drawFloors();
        }

        // create the controls
        const checkbox_network_iso = new checkbox({
            scaleColor: this.scaleColor,
            options: this.options,
            id: `${this.id}-controls-3d`,
            type: this.id,
            module: this
        })

        const checkbox_network_top = new checkbox({
            scaleColor: this.scaleColor,
            options: this.options,
            id: `${this.id}-controls-top`,
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
            .range([0.01, 30]);

        // options for isometric view
        this.iso_ratio = 0.7;
        this.scaleIsoX = 0.7; // scale when transforming into ISOMETRIC
        this.h_floor_iso = 822 * this.scaleIsoX; // height of a floor
        this.padding_iso = 0 * this.scaleIsoX;
        this.y_block_iso = this.h_floor_iso + this.padding_iso;
    }

    createSVG() {
        if (this.selectPlot.selectAll("svg").empty()) {
            this.plot = this.selectPlot.append("svg");
        } else {
            this.plot = this.selectPlot.select("svg");
        }

        const steps = this.floors.length - 1;
        const newHeight = 500;
        this.plot
            .attr("class", this.iso ? "iso_svg" : "top_svg")
            .attr("viewBox", this.iso ?
                `0 0 ${this.size_w} ${this.size_h + newHeight * (steps)}` :
                `0 0 ${this.size_w} ${this.size_h}`)
            .attr("xmlns", "http://www.w3.org/2000/svg");
    }

    drawFloorsIso() {
        console.log("drawFloorsIso()")
        const scale = `scale(
            ${this.scaleIsoX},
            ${this.scaleIsoX * this.iso_ratio}
        )`;

        // draw all floors
        this.plotFloors = this.plot
            .selectAll(".g-levels")
            .data(this.floors, d => d[0])
            .join("g")
            .attr("class", "g-levels")
            .attr("id", (d) => `level_${d[0]}`);

        this.drawGeom("ground");
        this.drawGeom("stairs");
        this.drawGeom("rooms_blueprint");
        this.drawLinks_sameFloor("no_change");
        this.drawLinks("down");
        this.drawLinks("up");
        this.drawRooms();
        this.drawLabels("labels");
    }

    drawFloors() {
        const this_level = this.floors.filter((e) => 
            e[0] === this.selected_level
        );

        this.plotFloors = this.plot
            .selectAll(".g-levels")
            .data(this_level, d => d[0])
            .join("g")
            .attr("class", "g-levels")
            .attr("id", (d) => `level_${d[0]}`)
            .attr("transform", "translate(0, 0) scale(1)");

        this.drawGeom("ground");
        this.drawGeom("stairs");
        this.drawGeom("rooms_blueprint");
        this.drawLinks_sameFloor("no_change");
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
            .attr("class", this.iso ? `iso ${name}` : name)
            .attr("id", (d) => `${d.floor}_${name}`)
            .attr("d", (d) => d.path)
            .attr("fill-rule", (d) => d.fill_rule);
      }

    drawRooms() {
        this.plotFloors
            .selectAll(".rooms")
            .data(d => [d[1][0].floor])
            .join("g")
            .attr("class", "rooms")
            .selectAll(".room")
            .data((d) => this.rooms.filter((e) => e.floor === d))
            .join("circle")
            .style("fill", d=> d.mRoom === 225 || d.mRoom === 130 ? "red" : "grey")
            .attr("class", d => (d.id_ap_3 >= 0 ?
                "room r_known" :
                "room r_unknown"
            ))
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", (d) => (d.id_ap_3 >= 0 ? 2 : 1));
    }

    drawLinks_sameFloor(flow) {

        const links = this.selected_level !== "All" ? 
            this.links : 
            this.links.filter(d => !d.change_floor);

        // level view
        // or iso, but same level
        this.plotFloors
            .selectAll(`.movements_${flow}`)
            .data(d => {
                if (this.selected_level !== "All" &&
                    d[1][0].floor !== this.selected_level) {
                        return "";
                    } else {
                        return [d[1][0].floor];
                    }
            })
            .join("g")
            .attr("class", `movements movements_${flow}`)
            .selectAll(".link")
            .data(d => links.filter((e) => e.floor === d && !e.change_floor))
            .join("line")
            .attr("class", d => `link ${d.mRoom_source} ${d.mRoom_target}`)
            .attr("stroke", (d) => this.scaleColor(d.floor))
            .attr("x1", (d) => d.x_source)
            .attr("x2", (d) => d.x_target)
            .attr("y1", (d) => d.y_source)
            .attr("y2", (d) => d.y_target)
            .style("stroke-width", (d) => this.scaleStroke(d.n_total));
    }

    drawLinks(flow) {

        // if flow remains in the same level, check drawLinks_sameFloor
        // if flow goes up -- draw in same level
        // source remains the same, target gets moved
        // if flow goes down -- draw in target level to include it
        // in the background
        // source gets moved, source remains the same
        this.plotFloors
            .selectAll(`.movements_${flow}`)
            .data(d => [d[1][0].floor])
            .join("g")
            .attr("class", `movements movements_${flow}`)
            .selectAll(".link")
            .data(d => {    
                let links = [];
                if (flow === "down") {
                    // 1) draw movements that go to that target
                    links = this.links.filter(e => {
                        const levels = this.checkLevel(
                            e.main_floor,
                            e.main_floor_target
                        );

                        let match = true;
                        if (this.selected_level !== "All") {
                            match = e.main_floor === this.selected_level ?
                                true :
                                false;
                        }

                        return levels.source > levels.target &&
                            e.main_floor_target === d &&
                            match;
                    });

                } else if (flow === "up") {
                   // 1) draw movements that go to that target
                   links = this.links.filter(e => {
                        const levels = this.checkLevel(
                            e.main_floor,
                            e.main_floor_target
                        );

                        let match = true;
                        if (this.selected_level !== "All") {
                            match = e.main_floor === this.selected_level ?
                                true :
                                false;
                        }
                        return levels.source < levels.target &&
                            e.main_floor === d &&
                            match;
                    });
                }


                return links;
            })
            .join("line")
            .attr("class", d =>`link ${d.mRoom_source} ${d.mRoom_target}`)
            .attr("stroke", (d) => this.scaleColor(d.floor))
            .attr("x1", (d) => d.x_source)
            .attr("x2", (d) => d.x_target)
            .attr("y1", (d) => d.y_source)
            .attr("y1", (d) => {
                if (flow === "down") {
                    const levels = this.checkLevel(
                        d.main_floor,
                        d.main_floor_target
                    );
                    const trans_y = this.moveInIso(levels);
                    return d.y_source + trans_y;
                } else if (flow === "up") {
                    return d.y_source
                }
            })
            .attr("y2", (d) => {
                if (flow === "up") {
                    const levels = this.checkLevel(
                        d.main_floor,
                        d.main_floor_target
                    );
                    
                    const trans_y = this.moveInIso(levels);
                    return d.y_target + trans_y
                } else if (flow === "down") {
                    return d.y_target;
                }
            })
            .style("stroke-width", (d) => this.scaleStroke(d.n_total));
    }

    drawLabels(name) {
        const g = this.plot
            .selectAll(`.${name}`)
            .data([name])
            .join("g")
            .attr("class", name);

        g.selectAll(".label")
            .data(this.options.filter(d => d.level !== "All"))
            .join("text")
            .attr("class", "label")
            .text(d => d.short)
            .attr("x", 0)
            .attr("y", d => this.y_block_iso * (d.level - 2) * -1 + 50);
    }

    moveInIso(levels) {
        const dif_levels = Math.abs(levels.target - levels.source);
        // hard coded -- this value only works with scale 0.7
        const extra = 595;
        // -1 because it needs to go higher
        const trans_y = (this.y_block_iso + extra) * dif_levels * -1;
        return trans_y;
    }

    checkLevel(source, target) {
        const level_t = this.options.filter((e) => e.name === target);
        const level_s = this.options.filter((e) => e.name === source);
        return {"source": level_s[0].level, "target": level_t[0].level}
    }

    toIso() {
        const scale = `scale(
            ${this.scaleIsoX},
            ${this.scaleIsoX * this.iso_ratio}
        )`;

        this.plotFloors
            .attr("transform", (d, i) => 
                `translate(200,
                ${this.y_block_iso * (d[1][0].floor_n - 2) * -1})
                ${scale}`
            );
    }

    revertIso() {
        this.plotFloors.remove();
    }

    checkHide() {
        if(!this.iso){
            this.plotFloors
                .selectAll(".link_change")
                .style("display", "none");
            this.plotFloors
                .selectAll(".movements_up")
                .style("display", "none");
            this.plotFloors
                .selectAll(".movements_down")
                .style("display", "none");
        } else {
            this.plotFloors
                .selectAll(".link_change")
                .style("display", "inherit");
            this.plotFloors
                .selectAll(".movements_up")
                .style("display", "inherit");
            this.plotFloors
                .selectAll(".movements_down")
                .style("display", "inherit");
        }
    }

    updateVisual(type, value, view_3d) {
        console.log(type, value, view_3d)
        let prev = this.selected_level;
        let prev_iso = this.iso;
        this.iso = view_3d === "iso" ? true : false;
        this.selected_level = value;

        // if view before top and now iso
        if (!prev_iso && this.iso) {
            this.createSVG();
        // if before iso and now top
        } else if (prev_iso && !this.iso) {
            this.createSVG();
            this.plot.selectAll(".movements_up").remove();
            this.plot.selectAll(".movements_down").remove();
            this.plot.selectAll(".labels").remove();
        }

        if (this.iso) {
            this.drawFloorsIso();
            
        } else {
            this.drawFloors();
        }

        // if view before top and now iso -- call at the end only
        if (!prev_iso && this.iso) {
            this.toIso();
        }
    }
}