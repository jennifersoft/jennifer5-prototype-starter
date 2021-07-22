import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import store from '@vuejs/vuex/store';
import CommonHeader from '@layout/container/header/CommonHeader';
import BasicApp from './basic/App';
import AccountApp from './account/App';
import NotificationApp from './notification/App';
import AutoProfileApp from './autoprofile/App';
import MonitoringDomainApp from './monitoringTarget/domain/App';
import MonitoringInstanceApp from './monitoringTarget/instance/App';
import ErrorPage from './ErrorPage';
import { i18n } from '@common/utility';
import '@layout/base';
import './index.scss';

Vue.use(Vuex);
Vue.use(VueRouter);

// TODO: 새로운 관리화면이 추가되면 해당 컴포넌트를 추가해줘야 함
const COMPONENT_MAP = {
    '/autoprofile': AutoProfileApp,
    '/monitoringTarget': {
        component: MonitoringDomainApp,
        children: [
            {
                path: '/monitoringTarget',
                component: MonitoringDomainApp,
                text: i18n.get('ui.label.domain'),
            },
            // {
            //     path: '/monitoringTarget-instance',
            //     component: MonitoringInstanceApp,
            //     text: i18n.get('ui.label.instance'),
            // },
        ],
    },
};

const routes = [
    { path: '*', component: ErrorPage },
    { path: '/', component: BasicApp },
    {
        path: '/basic',
        component: BasicApp,
        text: i18n.get('ui.label.defaultSetting'),
    },
    {
        path: '/account',
        component: AccountApp,
        text: i18n.get('ui.label.user.mng'),
    },
    {
        path: '/notification',
        component: NotificationApp,
        text: i18n.get('ui.label.alarm'),
    },
];

const router = new VueRouter({
    routes,
});

const { theme, groupId } = store.state.server;

new Vue({
    el: '#vue_app',
    store,
    router,
    provide: {
        theme,
        isAdmin: groupId === 'admin',
    },
    components: {
        CommonHeader,
    },
    methods: {
        createManualLink() {
            return `settings_${location.hash.replace('#/', '')}`;
        },
        addMenuItem(menus, key, name, route) {
            const hasChildren = route.hasOwnProperty('children');

            this.$router.addRoute({
                path: key,
                component: hasChildren ? route.component : route,
            });
            menus.push({
                path: key,
                text: name,
                isChild: false,
            });

            if (hasChildren) {
                route.children.forEach(subRoute => {
                    this.$router.addRoute({
                        path: subRoute.path,
                        component: subRoute.component,
                    });
                    menus.push({
                        path: subRoute.path,
                        text: subRoute.text,
                        isChild: true,
                    });
                });
            }
        },
        routeHandler() {
            this.menus = this.menus.map((menu, index) => {
                const mainPath = menu.path.substr(9);
                const addr = location.hash;

                return {
                    ...menu,
                    active: addr === mainPath || (index === 0 && addr === '#/'),
                };
            });

            const activeChildMenu = this.menus.filter(
                menu => menu.active && menu.isChild
            )[0];
            if (activeChildMenu) {
                const parentPath = activeChildMenu.path.split('-')[0];
                this.menus = this.menus.map(menu => {
                    return {
                        ...menu,
                        active:
                            parentPath === menu.path && !menu.isChild
                                ? true
                                : menu.active,
                    };
                });
            }
        },
    },
    data() {
        return {
            menus: routes
                .filter(r => r.path !== '/')
                .map(r => {
                    return { path: r.path, text: r.text };
                }),
        };
    },
    async created() {
        const { data } = await axios.get('/menu/accessbleList?type=management');
        const newMenus = [...this.menus];

        data.filter(item => {
            return item.url.startsWith('/settings#/');
        }).forEach(menu => {
            const key = menu.url.substr(10);
            const route = COMPONENT_MAP[key];
            if (route) this.addMenuItem(newMenus, key, menu.name, route);
        });

        // 최초 데이터 세팅하기
        this.menus = newMenus.map(menu => {
            return {
                ...menu,
                path: `/settings#${menu.path}`,
                active: false,
            };
        });

        // 최초 설정 화면 생성시 라우트 핸들러 실행하기
        this.routeHandler();

        // 해쉬 변경시 메뉴 액티브 상태 변경하기
        window.addEventListener('hashchange', this.routeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('hashchange', this.routeHandler);
    },
});
