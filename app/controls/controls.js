class checkbox {
    constructor(item) {
        this.scaleColor = item.scaleColor;
        this.options = item.options;
        this.id = item.id;
        this.type = item.type;
        this.module = item.module;
        this.select = d3.select(`#${this.id}`);

        this.createCheckbox();
        this.createToggle();

        // send information to visual
        this.checkbox.on("change", function() {
             item.module.updateVisual("checkbox", this.value);
        });

        this.toggle.on("change", function() {
            const isChecked = d3.select(this).property("checked");
            if (isChecked) {
                // Perform actions when the toggle is ON
                item.module.updateVisual("toggle", true);
            } else {
                item.module.updateVisual("toggle", false)
            }
        })
    }

    createCheckbox() {
        this.checkboxes = this.select
            .selectAll(".levels")
            .data(this.options)
            .enter()
            .append("label")
            .attr("class", d => d.level === "All" ? "" : "levels");

        this.checkbox = this.checkboxes
            .append("input")
            .attr("type", "radio")
            .attr("id", d => `${this.type}_${d.level}`)
            .attr("name", this.type)
            .attr("value", d => d.name)
            .property("checked", (d) => {
                return d.level === "All";
            });

        this.checkboxes
            .append("span")
            .attr("class", d => `dot level_${d.level}`)
            // .text("\u26AB")
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
            .attr("name", `${this.type}_toggleSwitch`);

        const label = this.toggles
            .append("span")
            .text("Hide unknown rooms");

        // // Add event listener to handle toggle functionality
        // checkbox.on("change", function() {
        // var isChecked = d3.select(this).property("checked");
        // if (isChecked) {
        //     console.log("Toggle is ON");
        //     // Perform actions when the toggle is ON
        // } else {
        //     console.log("Toggle is OFF");
        //     // Perform actions when the toggle is OFF
        // }
        // });
    }
}