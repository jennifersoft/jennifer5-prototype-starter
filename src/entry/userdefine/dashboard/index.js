import '@entry/dashboard/layout.js';

import { readDashboard } from '@entry/userdefine/dashboardEdit/http';
import {
    buildGeneralDashboard,
    commonProvideProperties,
} from '@entry/dashboard/common';
import { saveThumbnail } from '@entry/userdefine/dashboardEdit/thumbnail';
import storeInDashboard from '@entry/dashboard/storeInDashboard';
import '@entry/dashboard/realtimeAdmin/index.scss';

const buildElementAfterGetDashboardData = async () => {
    const urlParams = new URLSearchParams(location.search);
    const paramKey = urlParams.get('key');

    let dashboardProp;
    if (paramKey) {
        const dashboardAxiosData = await readDashboard(paramKey);
        dashboardProp =
            typeof dashboardAxiosData.data === 'string'
                ? JSON.parse(dashboardAxiosData.data)
                : dashboardAxiosData.data;
    }
    dashboardProp = dashboardProp ?? { title: '' };

    storeInDashboard.commit('dashboard/setTitle', dashboardProp.title);

    buildGeneralDashboard(
        storeInDashboard,
        dashboardProp,
        commonProvideProperties,
        false
    );

    if (paramKey) {
        setTimeout(() => {
            saveThumbnail(
                document.querySelector('#defineContentArea'),
                paramKey
            ).then(r => console.log('save userdefineDashboard to thumbnail'));
        }, 1000 * 20);
    }
};

buildElementAfterGetDashboardData().then(r => console.log('Loaded Dashboard'));
