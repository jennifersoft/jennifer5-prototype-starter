import '@entry/dashboard/layout.js';
import {
    buildGeneralDashboard,
    commonProvideProperties,
} from '@entry/dashboard/common';
import { dashboardProp } from '@data/business';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
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
