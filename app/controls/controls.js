class checkbox {
    constructor(item) {
        this.scaleColor = item.scaleColor;
        this.options = item.options;
        this.id = item.id;
        this.type = item.type;
        this.module = item.module;
        this.select = d3.select(`#${this.id}`);

        this.createCheckbox();
    }

    createCheckbox() {
        const selection = this.select
            .selectAll("input")
            .data(this.options)
            .enter()
            .append("label")
                .attr("for", d => `network_${d.level}`)
                .text(d => d.short)
            .append("input")
            .attr("type", "checkbox")
            .attr("id", d => `network_${d.level}`)
            .attr("name", d => d.name)
            .attr("value", d => d.name);
    }


}