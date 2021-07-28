import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '../views/Main';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Main },
        {
            path: '/dashboard',
            component: { template: '<router-view />' },
            children: [
                {
                    path: 'realtimeAdmin',
                    component: {
                        template: '<div>시스템 관리자</div>',
                    },
                },
                {
                    path: 'realtimeAdmin_front',
                    component: {
                        template: '<div>Front 통합 대시보드</div>',
                    },
                },
            ],
        },
    ],
});

export default router;
