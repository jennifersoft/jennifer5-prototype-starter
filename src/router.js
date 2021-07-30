import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './views/Main';
import DashboardAdmin from './views/dashboard/Admin';
import DashboardFront from './views/dashboard/Front';
import AnalysisXView from './views/analysis/XView';
import StatisticsDaily from './views/statistics/Daily';
import Report from './views/Report';
import Setting from './views/Setting';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { path: '/', component: Main },
        {
            path: '/dashboard',
            component: { template: '<router-view />' },
            children: [
                {
                    path: 'realtimeAdmin',
                    component: DashboardAdmin,
                },
                {
                    path: 'realtimeAdmin_front',
                    component: DashboardFront,
                },
            ],
        },
        {
            path: '/analysis',
            component: { template: '<router-view />' },
            children: [
                {
                    path: 'xview',
                    component: AnalysisXView,
                },
            ],
        },
        {
            path: '/statistics',
            component: { template: '<router-view />' },
            children: [
                {
                    path: 'dailySystem',
                    component: StatisticsDaily,
                },
            ],
        },
        {
            path: '/report',
            component: Report,
        },
        {
            path: '/setting',
            component: Setting,
        },
    ],
});
