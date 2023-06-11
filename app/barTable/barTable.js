// i need link data!
class barTableClass {
    constructor(item) {
        this.links = item.links;
        this.scaleColor = item.scaleColor;
        this.options = item.options;
        this.id = item.id;
        this.bar_head = item.bar_head;
        this.format = d3.format(",");
        this.margin = {t: 2, b: 2};
        this.headers = item.headers;
        this.barIndex = item.barIndex;
        this.rowHeight = item.rowHeight;
        this.div_id = item.div_id;
        this.selected_level = "All";
        this.hideNaN = false;
    }
    
    async execute() {
        // Code for the first class
        this.init();
        this.createTable(this.links);
        // create the controls
        const checkbox_network = new checkbox({
            scaleColor: this.scaleColor,
            options: this.options,
            id: `${this.div_id}-controls`,
            type: this.div_id,
            module: this
        })
      }


    init() {
        // table info
        this.table = d3.select(`#${this.id}`);
        this.height = this.rowHeight - this.margin.t - this.margin.b;

        this.table
            .append("thead")
            .append("tr")
            .selectAll("th")
            .data(this.headers)
            .join("th")
            .text((d, i) => i !== this.headers.length - 1 || i !== 0 ? d : "")
            .attr("id", d => `t-${d.replace(/\s/g, "")}`);
    }

    createTable(links) {

        this.thisRow = this.table.selectAll("tbody")
            .selectAll("tr")
            .data(links.sort((a, b) => b.n_total - a.n_total))
            .join("tr")
            .attr("class", "row-table");

        this.thisRow 
            .selectAll("td")
            .data((d, i) => [
                {
                    key: `From ${d.room_source} to ${d.room_target}`,
                    text: i + 1,
                    class: "index",
                    source: d.room_source,
                    target: d.room_target
                },
                {
                    key: `From ${d.room_source} to ${d.room_target}`,
                    text: `From ${isNaN(d.room_target) ? "?" : d.room_target} to ${isNaN(d.room_target) ? "?" : d.room_target}`,
                    class: "name",
                    target: d.room_target
                }, {
                    key: `From ${d.room_source} to ${d.room_target}`,
                    value: d.n_total,
                    text: "",
                    class: "visitors-bar svg-data",
                    floor: d.main_floor,
                    change_floor: d.change_floor,
                    target: d.room_target
                }, {
                    key: `From ${d.room_source} to ${d.room_target}`,
                    text: d.n_total,
                    class: "visitors_number",
                    target: d.room_target
                }
            ])
            .join("td")
            .attr("class", d => d.class)
            .html(d => d.class === "visitors_number" ?
                this.format(d.text) :
                d.text
            );

        this.width = document
            .getElementById(`t-${this.headers[this.barIndex - 1].replace(/\s/g, "")}`)
            .clientWidth;

        // scales
        const max = d3.max(this.links, d => d.n_total)
        this.scaleX = d3.scaleLinear().domain([0, max]).range([0, 100]);

        this.plotSVGs = this.thisRow
            .selectAll(".svg-data")
            .selectAll(".svg")
            .data(d => [d])
            .join("div")
            .attr("class", d => `svg svg_${d.floor.replace(/\s/g, "")}`)
            .attr("margin-left", 0)
            .attr("margin-top", this.margin.t)
            .style("width", d => `${this.scaleX(d.value)}%`)
            .style("height", `${this.height}px`)
            .style("margin", `${this.margin.t}px 0`)
            .style("background-color", d => this.scaleColor(d.floor))
    }

    updateVisual(type, value) {
        let filtered_links = this.links;

        if (type === "checkbox") {
            this.selected_level = value;
        } else if (type === "toggle") {
            this.hideNaN = value;
        }

        // filter by level && this NaN
        if (this.selected_level !== "All" || this.hideNaN) {
            filtered_links = filtered_links.filter(d => {
                if (this.selected_level !== "All" && !this.hideNaN) {
                    // filter selected level
                    return d.main_floor === this.selected_level;
                } else if (this.selected_level !== "All" && this.hideNaN) {
                    // filter selected level + isNan
                    return d.main_floor === this.selected_level &&
                        !d.isNaN;
                } else if (this.selected_level === "All" && this.hideNaN) {
                    // filter isNan
                    return !d.isNaN;
                }
            });
        }

        this.createTable(filtered_links);
    }

}