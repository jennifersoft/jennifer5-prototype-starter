import { DashboardChartHandler } from '@module/common/DashboardChartHandler.js';

import {
    buildGeneralDashboard,
    commonProvideProperties,
} from '@entry/dashboard/common';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import '@entry/dashboard/layout.js';
import './index.scss';

//.jsp 내에서  dashboardDataJSON 값이 뒤쪽에서 로드를 한다. 그래서 'DOMContentLoaded' 에서 호출함.
document.addEventListener('DOMContentLoaded', () => {
    const dashboardProp = DashboardChartHandler.redefineStringToVariable(
        dashboardDataJSON
    );

    const provideProperties = Object.assign(commonProvideProperties, {
        useExtendOrOriginInChartPosition: true,
    });

    buildGeneralDashboard(
        storeInDashboard,
        dashboardProp,
        provideProperties,
        true
    );
});
