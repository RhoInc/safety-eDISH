import addParticipantLevelMetadata from './flattenData/addParticipantLevelMetadata';
import calculateRatios from './flattenData/calculateRatios';

//Converts a one record per measure data object to a one record per participant objects
export function flattenData() {
    var chart = this;
    var config = this.config;

    //make a data set with one row per ID

    //get list of columns to flatten
    var colList = [];
    var measureCols = [
        'measure_col',
        'value_col',
        'visit_col',
        'visitn_col',
        'studyday_col',
        'unit_col',
        'normal_col_low',
        'normal_col_high'
    ];

    measureCols.forEach(function(d) {
        if (Array.isArray(d)) {
            d.forEach(function(di) {
                colList.push(di.hasOwnProperty('value_col') ? config[di.value_col] : config[di]);
            });
        } else {
            colList.push(d.hasOwnProperty('value_col') ? config[d.value_col] : config[d]);
        }
    });

    //merge in the absolute and relative values
    colList = d3.merge([
        colList,
        ['absolute', 'relative_uln', 'relative_baseline', 'baseline_absolute']
    ]);

    //get maximum values for each measure type
    var flat_data = d3
        .nest()
        .key(f => f[config.id_col])
        .rollup(function(d) {
            var participant_obj = {};
            participant_obj.days_x = null;
            participant_obj.days_y = null;
            config.measure_details.forEach(function(m) {
                //get all raw data for the current measure
                var matches = d.filter(f => m.measure == f[config.measure_col]); //get matching measures

                if (matches.length == 0) {
                    console.log('No matches found');
                    participant_obj.drop_participant = true;
                    return participant_obj;
                } else {
                    participant_obj.drop_participant = false;
                }

                //get record with maximum value for the current display type
                participant_obj[m.label] = d3.max(matches, d => +d[config.display]);

                var maxRecord = matches.find(d => participant_obj[m.label] == +d[config.display]);
                //map all measure specific values
                colList.forEach(function(col) {
                    participant_obj[m.label + '_' + col] = maxRecord[col];
                });

                //determine whether the value is above the specified threshold
                if (m.cut[config.display]) {
                    config.show_quadrants = true;
                    participant_obj[m.label + '_cut'] = m.cut[config.display];
                    participant_obj[m.label + '_flagged'] =
                        participant_obj[m.label] >= participant_obj[m.label + '_cut'];
                } else {
                    config.show_quadrants = false;
                    participant_obj[m.label + '_cut'] = null;
                    participant_obj[m.label + '_flagged'] = null;
                }

                //save study days for each axis;
                if (m.axis == 'x') participant_obj.days_x = maxRecord[config.studyday_col];
                if (m.axis == 'y') participant_obj.days_y = maxRecord[config.studyday_col];
            });

            //Add participant level metadata
            addParticipantLevelMetadata.call(chart, d, participant_obj);

            //Calculate ratios between measures.
            calculateRatios.call(chart, d, participant_obj);

            //calculate the day difference between x and y
            participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);

            return participant_obj;
        })
        .entries(this.imputed_data.filter(f => f.key_measure));

    var flat_data = flat_data.filter(f => f.values.drop_participant == false).map(function(m) {
        m.values[config.id_col] = m.key;

        //link the raw data to the flattened object
        var allMatches = chart.imputed_data.filter(f => f[config.id_col] == m.key);
        m.values.raw = allMatches;

        return m.values;
    });
    return flat_data;
}
