import addRRatioSpan from './onLayout/addRRatioSpan';
import { initQuadrants } from './onLayout/initQuadrants';
import { initRugs } from './onLayout/initRugs';
import { initVisitPath } from './onLayout/initVisitPath';
import { initParticipantDetails } from './onLayout/initParticipantDetails';
import { initResetButton } from './onLayout/initResetButton';
import { initDisplayControlLabels } from './onLayout/initDisplayControlLabels';
import { layoutPanels } from './onLayout/layoutPanels';
import { initTitle } from './onLayout/initTitle';
import { initFilterLabel } from './onLayout/initFilterLabel';

export default function onLayout() {
    addRRatioSpan.call(this);
    layoutPanels.call(this);
    initTitle.call(this);
    initQuadrants.call(this);
    initRugs.call(this);
    initVisitPath.call(this);
    initParticipantDetails.call(this);
    initResetButton.call(this);
    initDisplayControlLabels.call(this);
    initFilterLabel.call(this);
}
