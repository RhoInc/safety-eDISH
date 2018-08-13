import updateMarkValues from './onLayout/updateMarkValues';
import setCutpointMinimums from './onLayout/setCutpointMinimums';
import addRRatioSpan from './onLayout/addRRatioSpan';
import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';
import { initParticipantDetails } from './onLayout/initParticipantDetails';
import { initResetButton } from './onLayout/initResetButton';
import { initDisplayControlLabels } from './onLayout/initDisplayControlLabels';
import { layoutPanels } from './onLayout/layoutPanels';
import { initTitle } from './onLayout/initTitle';

export default function onLayout() {
    updateMarkValues.call(this);
    setCutpointMinimums.call(this);
    addRRatioSpan.call(this);
    layoutPanels.call(this);
    initTitle.call(this);
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initParticipantDetails.call(this);
    initResetButton.call(this);
    initDisplayControlLabels.call(this);
}
