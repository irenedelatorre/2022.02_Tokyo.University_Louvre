class networkClass {
    constructor(item) {
        this.nodes = item.nodes.map((d) => Object.create(d));
        this.links = item.links.map((d) => Object.create(d));
        this.floors = item.floors;
        this.id = item.id;
        this.selectPlot = d3.select(`#${this.id}`);
        this.selected_level = "All";
        this.scaleColor = item.scaleColor;
        this.core_colors = item.core_colors;
        this.options = item.options;
        this.hideNan = false;
        this.r = 5;
        this.padding = 25;

        console.log(this.links)
    }

    async execute() {
        // Code for the first class
        this.init();
        this.createSVG();
        this.buildSimulation();
        this.drawNetwork();

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
        this.margin = {t: 150, l: 16, r: 16, b: 150};
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
            .domain([1000, d3.max(this.links, (d) => d.n_total)])
            .range([0.1, 5])
            .clamp(true)
            .interpolate(function (a, b) {
                const c = b - a;
                return function (t) {
                    return +(a + t * c).toFixed(2);
                };
            });

        this.scaleR = d3
            .scaleSqrt()
            .domain(d3.extent(this.nodes, (d) => d.median))
            .range([1, 15])
            .interpolate(function (a, b) {
                const c = b - a;
                return function (t) {
                    return +(a + t * c).toFixed(1);
                };
            });
    }

    createSVG() {
        if (this.selectPlot.selectAll("svg").empty()) {
            this.plot = this.selectPlot
                .append("svg")
                .attr("viewBox", [0, 0, this.w, this.h]);
            
                console.log(this.options)
            // Build Arrows ====
            this.plot
                .append("defs")
                .selectAll("marker")
                .data(this.options) // Different link types can be defined here
                .join("marker") // This section adds in the arrows
                .attr("id", (d) => `arrow_${d.c.split("#")[1]}`)
                .style("fill", (d) => d.c)
                .style("stroke-width", 0)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 1 + this.r * 2)
                .attr("refY", 0)
                .attr("markerWidth", this.r)
                .attr("markerHeight", this.r)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");

            this.plot_links = this.plot.append("g").attr("class", "links");
            this.plot_nodes = this.plot.append("g").attr("class", "nodes");
            this.plot_labels = this.plot.append("g").attr("class", "labels");

        } else {
            this.plot = this.selectPlot.select("svg");
        }

    }

    drawNetwork() {
        this.drawLinks = this.plot_links
            .selectAll(".link")
            .data(this.links)
            .join("path")
            .attr("class", "link")
            .attr("marker-end", `url(#arrow_${this.scaleColor("All").split("#")[1]})`)
            .style("stroke", this.scaleColor("All"))
            .style("stroke-width", (d) => this.scaleStroke(d.n_total))
            .style("mix-blend-mode", "multiply")
            .style("opacity", (d) => {
                if (this.selected_level === "All") {
                    return 0.15;
                } else if (this.selected_level === d.floor_source) {
                    return 1;
                } else {
                    return 0.025;
                }
            })
            .style("fill", "none");

        this.drawNodes = this.plot_nodes
            .selectAll(".node")
            .data(this.nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", (d) => this.scaleR(d.median))
            .style("stroke-width", (d) => (d.highlight !== "" ? 3 : 0.5))
            .style("fill", (d) => this.scaleColor(d.main_floor))
            .style("stroke", this.core_colors.nodes_s);

        this.drawLabels = this.plot_labels
            .selectAll(".labels_floors")
            .data(this.floors)
            .join("text")
            .attr("class", "labels_floors")
            .text((d) => d);
        
          for (let i = 0; i < 1000; i++) {
            this.simulation.tick();
          }


        this.ticked();
    }

    buildSimulation() {
        const forceCollide = d3
            .forceCollide()
            .radius((d) => this.scaleR(d.median) + this.padding)
            .strength(1);

        // Instantiate the forceInABox force
        const groupingForce  = forceInABox()
            .size([this.w, this.h]) // Size of the chart
            .template("force")
            .groupBy("cluster") // Nodes' attribute to group
            .strength(0.29) // Strength to foci
            .links(this.links) // The graph links. Must be called after setting the grouping attribute
            .enableGrouping(true)
            .linkStrengthInterCluster(0.25) // linkStrength between nodes of different clusters
            .linkStrengthIntraCluster(0.076) // linkStrength between nodes of the same cluster
            .forceLinkDistance(360) // linkDistance between meta-nodes on the template
            .forceLinkStrength(0.4) // linkStrength between meta-nodes of the template
            .forceCharge(-700) // Charge between the meta-nodes
            .forceNodeSize((d) => this.scaleR(d.median) + this.padding + 5); // Used to compute the template force nodes size;

        const forceLinks = d3
            .forceLink(this.links)
            .strength(groupingForce.getLinkStrength) // depends on cluster
            .distance(360);

        this.simulation = d3
            .forceSimulation()
            .nodes(this.nodes)
            .force("group", groupingForce)
            .force("collide", forceCollide)
            .force("charge", d3.forceManyBody().strength(-4))
            .force("link", forceLinks);
    }

    ticked() {
        this.drawLinks
            .attr("d", d => {
                let direction_x = 1;
                let direction_y = 1;
                if (d.target.x < d.source.x) direction_x = -1;
                if (d.target.y < d.source.y) direction_y = -1;
            
                const end_x = d.target.x;
                const end_y = d.target.y;
                const dx = end_x - d.source.x;
                const dy = end_y - d.source.y;
                const dr = Math.sqrt(dx * dx + dy * dy);
                return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${end_x},${end_y}`;
        });

        this.drawNodes
            .attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        this.drawLabels
          .attr("y", (d) => {
            const y = d3.extent(
                this.nodes.filter((e) => e.floor === d),
                (d) => d.y
            );
            return y[0] <= this.h / 2 ? y[0] - 30 : y[1] + 30;
          })
          .attr("x", (d) => {
            const max_x = d3.mean(
                this.nodes.filter((e) => e.floor === d),
                (d) => d.x
            );
            return max_x;
          });
      }

    updateVisual(type, value) {
        
        if (type === "checkbox") {
            this.selected_level = value;
        } else if (type === "toggle") {
            this.hideNan = value;
        }

        // update links
        this.drawLinks
            .attr("marker-end", (d) => {
                const color = this.selected_level === d.source.main_floor
                    ? this.scaleColor(d.source.main_floor)
                    : this.scaleColor("All");
                return `url(#arrow_${color.split("#")[1]})`;
            })
            .style("stroke", (d) =>
                this.selected_level === d.source.main_floor
                    ? this.scaleColor(d.source.main_floor)
                    : this.scaleColor("All")
            )
            .style("opacity", (d) => {
                if (this.selected_level === "All") {
                    return 0.15;
                } else if (this.selected_level === d.source.main_floor) {
                    return 1;
                } else {
                    return 0.025;
                }
            })
            .style("display", d => this.hideNan && d.isNan ? "none" : "inherit");

    }
}