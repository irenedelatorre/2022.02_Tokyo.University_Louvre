class checkbox {
    constructor(item) {
        this.scaleColor = item.scaleColor;
        this.options = item.options;
        this.id = item.id;
        this.type = item.type;
        this.module = item.module;
        this.select = d3.select(`#${this.id}`);

        this.createCheckbox();
        const container = this;

        // send information to visual
        this.checkbox.on("change", function() {
            let view_3d = "";

            if (item.id === "blueprint-controls-3d") {
                view_3d = "iso";
            }

            item.module.updateVisual("checkbox", this.value, view_3d);

            container.checkbox
                .attr("aria-checked", d => 
                    d.name === this.value ?
                    true : 
                    false
                );
        });

        if (this.type !== "blueprint") {
            this.createToggle();
            this.toggle.on("change", function() {
                const isChecked = d3.select(this).property("checked");
                if (isChecked) {
                    item.module.updateVisual("toggle", true);
                } else {
                    item.module.updateVisual("toggle", false)
                }

                container.toggle.attr("aria-checked", isChecked);
            })
        } else {
            d3.selectAll(".accordion-button")
                .on("click", function(d) {
                    let selected = "";

                    const id = this.value === "top" ?
                        "blueprint-controls-top" :
                        "blueprint-controls-3d";

                    const otherID = this.value === "top" ?
                        "blueprint-controls-3d" :
                        "blueprint-controls-top";

                    const this_form = document.getElementById(id);

                    const other = d3.select(`#${otherID}`)
                        .selectAll("input");
                        
                    other.each(function(){
                        var isChecked = d3.select(this).property("checked");
                        selected = isChecked ?
                            d3.select(this).property("value") :
                            selected;
                    });

                    const value = selected === "All" ?
                        item.options[1].name :
                        selected;

                    this_form.querySelector(
                        `input[value="${value}"]`
                    ).checked = true;
                    
                    const view_3d = this.value  === "top" ?
                        "top" :
                        "iso";

                    item.module.updateVisual("checkbox", value, view_3d);
                })
        }

    }

    createCheckbox() {
        this.checkboxes = this.select
            .selectAll(".levels")
            .data(this.id !== "blueprint-controls-top" ?
                this.options :
                this.options.filter(d => d.level !== "All")
            )
            .enter()
            .append("label")
            .attr("class", d => d.level === "All" ? "" : "levels");

        this.checkbox = this.checkboxes
            .append("input")
            .attr("type", "radio")
            .attr("id", d => `${this.type}_${d.level}`)
            .attr("name", this.type)
            .attr("value", d => d.name)
            .attr("aria-checked", d => d.level === "All" ? true : false)
            .property("checked", (d) => {
                return d.level === "All";
            });

        this.checkboxes
            .append("span")
            .attr("class", d => `dot level_${d.level}`)
            .style("background-color", d => this.scaleColor(d.name));
        this.checkboxes
            .append("span")
            .attr("class", "label_name")
            .text(d => d.short);
    }

    createToggle() {
        this.toggles = this.select
            .selectAll(".toggleSwitch")
            .data([0])
            .join("label")
            .attr("class", "toggleSwitch");

        this.toggle = this.toggles
            .append("input")
            .attr("type", "checkbox")
            .attr("name", `${this.type}_toggleSwitch`)
            .attr("aria-checked", false);

        const info = [
            "Wifi-access points that cannot get matched with a room in the",
            "museum but appear in the data"
        ];

        const label = this.toggles
            .append("span")
            .text("Hide unknown rooms")
            .append("button")
            .attr("type", "button")
            .attr("class", "btn btn-info")
            .attr("data-bs-toggle", "tooltip")
            .attr("data-bs-placement", "top")
            .attr("data-bs-title", `${info[0]} ${info[1]}`)
            .text("i");
        
        this.tooltip();
    }

    tooltip() {
        // from https://getbootstrap.com/docs/5.3/components/tooltips/#overview
        const tooltipTriggerList = document
            .querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList]
            .map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}