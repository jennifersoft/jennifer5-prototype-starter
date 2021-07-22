import '@entry/dashboard/layout.js';

import {
    buildGeneralDashboard,
    commonProvideProperties,
} from '@entry/dashboard/common';

import { dashboardProp } from '@data/batchjob';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import '../realtimeAdmin/index.scss';

const provideProperties = Object.assign(commonProvideProperties, {
    useExtendOrOriginInChartPosition: true,
});

//배치잡은 origin 고정.
storeInDashboard.commit('dashboard/setOriginOrExtendInChartPosition', 'origin');

document.addEventListener('DOMContentLoaded', () => {
    buildGeneralDashboard(
        storeInDashboard,
        dashboardProp,
        provideProperties,
        true
    );
});
