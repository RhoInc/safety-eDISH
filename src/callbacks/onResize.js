import { addPointMouseover } from './onResize/addPointMouseover';
import { addPointClick } from './onResize/addPointClick';
import { addTitle } from './onResize/addTitle';
import { formatPoints } from './onResize/formatPoints';
import { setPointSize } from './onResize/setPointSize';
import { setPointOpacity } from './onResize/setPointOpacity';
import { updateParticipantMarks } from './onResize/updateParticipantMarks';

import { updateSummaryTable } from './onLayout/quadrants/updateSummaryTable';
import { drawQuadrants } from './onResize/drawQuadrants';
import { init as addLineDrag } from './onResize/addLineDrag/init';

import { toggleLegend } from './onResize/toggleLegend';

import { init as initBoxPlots } from './onResize/addBoxPlots/init';

import { adjustTicks } from './onResize/adjustTicks';

export default function onResize() {
    //add point interactivity, custom title and formatting
    addPointMouseover.call(this);
    addPointClick.call(this);
    addTitle.call(this);
    formatPoints.call(this);
    setPointSize.call(this);
    setPointOpacity.call(this);
    updateParticipantMarks.call(this);

    //draw the quadrants and add drag interactivity
    updateSummaryTable.call(this);
    drawQuadrants.call(this);
    addLineDrag.call(this);

    // hide the legend if no group options are given
    toggleLegend.call(this);

    // add boxplots
    initBoxPlots.call(this);

    //axis formatting
    adjustTicks.call(this);
}
