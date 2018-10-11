export default function deriveVariables() {
    var chart = this;
    var config = this.config;

    //filter the lab data to only the required measures
    var included_measures = Object.keys(config.measure_values).map(e => config.measure_values[e]);

    var sub = this.imputed_data
        .filter(f => included_measures.indexOf(f[config.measure_col]) > -1)
        .filter(f => true); //add a filter on selected visits here

    var missingBaseline = 0;

    //create an object mapping baseline values for id/measure pairs
    const baseline_records = sub.filter(f => +f[config.visitn_col] == +config.baseline_visitn);
    const baseline_values = d3
        .nest()
        .key(d => d[config.id_col])
        .key(d => d[config.measure_col])
        .rollup(d => d[0][config.value_col])
        .map(baseline_records);

    this.imputed_data = this.imputed_data.map(function(d) {
        //coerce numeric values to number
        var numerics = ['value_col', 'visitn_col', 'normal_col_low', 'normal_col_high'];
        numerics.forEach(function(col) {
            d[config[col]] = +d[config[col]];
        });
        //standardize key variables
        d.key_measure = false;
        if (included_measures.indexOf(d[config.measure_col]) > -1) {
            d.key_measure = true;

            //map the raw value to a variable called 'absolute'
            d.absolute = d[config.value_col];

            //get the value relative to the ULN (% of the upper limit of normal) for the measure
            d.relative_uln = d[config.value_col] / d[config.normal_col_high];

            //get value relative to baseline
            if (baseline_values[d[config.id_col]]) {
                if (baseline_values[d[config.id_col]][d[config.measure_col]]) {
                    d.baseline_absolute = baseline_values[d[config.id_col]][d[config.measure_col]];
                    d.relative_baseline = d.absolute / d.baseline_absolute;
                } else {
                    missingBaseline = missingBaseline + 1;
                    d.baseline_absolute = null;
                    d.relative_baseline = null;
                }
            } else {
                missingBaseline = missingBaseline + 1;
                d.baseline_absolute = null;
                d.relative_baseline = null;
            }
        }
        return d;
    });

    if (missingBaseline > 0)
        console.warn(
            'No baseline value found for ' + missingBaseline + ' of ' + sub.length + ' records.'
        );
}
