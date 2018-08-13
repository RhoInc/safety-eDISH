export function updateQuadrantData() {
    const chart = this;
    const config = this.config;

    //add "eDISH_quadrant" column to raw_data
    const x_var = this.config.x.column;
    const y_var = this.config.y.column;

    this.raw_data.forEach(function(d) {
        var x_cat = d[x_var] >= config.quadrants.cut_data.x ? 'xHigh' : 'xNormal';
        var y_cat = d[y_var] >= config.quadrants.cut_data.y ? 'yHigh' : 'yNormal';
        d['eDISH_quadrant'] = x_cat + ':' + y_cat;
    });

    //update Quadrant data
    config.quadrants.quadrant_data.forEach(function(quad) {
        quad.count = chart.raw_data.filter(d => d.eDISH_quadrant == quad.dataValue).length;
        quad.total = chart.raw_data.length;
        quad.percent = d3.format('0.1%')(quad.count / quad.total);
    });
}
