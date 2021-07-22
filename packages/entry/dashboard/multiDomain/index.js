import '@entry/dashboard/layout.js';
import {
    buildGeneralDashboard,
    commonProvideProperties,
} from '@entry/dashboard/common';
import { dashboardProp } from '@data/multiDomain';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import '@entry/dashboard/realtimeAdmin/index.scss';

const provideProperties = Object.assign(commonProvideProperties, {
    useExtendOrOriginInChartPosition: true,
});

document.addEventListener('DOMContentLoaded', () => {
    buildGeneralDashboard(
        storeInDashboard,
        dashboardProp,
        provideProperties,
        true
    );
});
