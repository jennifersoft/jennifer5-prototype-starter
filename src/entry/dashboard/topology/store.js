import storeInDashboard from '@entry/dashboard/storeInDashboard';
import axios from '@library/axios';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { i18n } from '@common/utility';
import _ from '@library/lodash';

export const topologyConfigStore = {
    namespaced: true,
    state: {
        mapConfigTime: -1,
        saveList: [],
        nodeScale: 1,
        loading: false,
        notificationMessage: '',
        showNotification: false,
        showXView: false,
    },
    mutations: {
        updateMapConfigTime: (state, time = -1) => {
            state.mapConfigTime = time;
        },
        updateSaveList: (state, list = []) => {
            state.saveList = list;
        },
        updateNodeScale: (state, scale = 1) => {
            state.nodeScale = scale;
        },
        updateLoading: (state, loading = true) => {
            state.loading = loading;
        },
        updateNotificationMessage: (state, message = '') => {
            state.notificationMessage = message;
        },
        toggleNotification: (state, flag = true) => {
            state.showNotification = flag;
        },
        toggleXView: (state, _) => {
            state.showXView = !state.showXView;
        },
    },
    actions: {
        // 노드 사이즈는 0.4 ~ 2.5 배율로 픽스하자
        plusScale({ commit }) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.plusNodeScale();
            commit('updateNodeScale', topologyChart.nodeScale);
        },
        minusScale({ commit }) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.minusNodeScale();
            commit('updateNodeScale', topologyChart.nodeScale);
        },
        autoReplacement() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.model.applyAutoLocation();
        },
        async loadMapConfigTime({ commit }) {
            const { data } = await axios.get('/topology/mapConfigTimeMin');
            commit('updateMapConfigTime', data);
        },
        saveMapConfigTime(_, val) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.model.sendMapConfigTimeMin(val);
        },
        async loadSaveList({ commit }) {
            const { data } = await axios.get('/topology/saveList');
            commit(
                'updateSaveList',
                Object.keys(data).map(e => ({ text: e, value: data[e] }))
            );
        },
        async saveDashboard({ state, commit, rootGetters }, index) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            const locationInfo = JSON.stringify(
                topologyChart.model.currentLocationInfo()
            );
            const target = state.saveList[index];
            const sids = rootGetters['domain/sidList'];

            const form = new FormData();
            form.append('key', target.value);
            form.append('sids', sids);
            form.append('nodeScale', topologyChart.nodeScale);
            form.append('locationInfo', locationInfo);

            await axios.post('/topology/save', form);
            commit(
                'updateNotificationMessage',
                `${target.text} ${i18n.get('M0186')}`
            );
            commit('toggleNotification');

            setTimeout(() => {
                commit('updateNotificationMessage');
                commit('toggleNotification', false);
            }, 2000);
        },
        async saveNewDashboard({ state, commit, rootGetters }, title) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            const locationInfo = JSON.stringify(
                topologyChart.model.currentLocationInfo()
            );

            const sids = rootGetters['domain/sidList'];

            const form = new FormData();
            form.append('title', title);
            form.append('sids', sids);
            form.append('nodeScale', topologyChart.nodeScale);
            form.append('locationInfo', locationInfo);

            await axios.post('/topology/save', form);
            commit(
                'updateNotificationMessage',
                `${title} ${i18n.get('M0186')}`
            );
            commit('toggleNotification');

            setTimeout(() => {
                commit('updateNotificationMessage');
                commit('toggleNotification', false);
            }, 2000);
        },
        async loadDashboard({ commit }, key = null) {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];

            commit('updateLoading');
            const { data } = await axios.get('/topology/read', {
                params: { key },
            });
            if (data !== '') {
                const json = JSON.parse(data);
                topologyChart.model.applyLocationInfo(json.locationInfo);

                if (!_.isUndefined(json.nodeScale)) {
                    topologyChart.nodeScale = json.nodeScale;
                    commit('updateNodeScale', json.nodeScale);
                }

                commit(
                    'updateNotificationMessage',
                    `${json.title} ${i18n.get('M0323')}`
                );
                commit('toggleNotification');

                setTimeout(() => {
                    commit('updateNotificationMessage');
                    commit('toggleNotification', false);
                }, 2000);
            } else {
                // 저장된 것이 없다면 기본 배치
                topologyChart.model.applyAutoLocation();
                commit('updateLoading', false);
            }
        },
        async deleteDashboard({ state }, index) {
            const key = state.saveList[index].value;
            await axios.post('/topology/delete', null, { params: { key } });
        },
        addGroupNode() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            // topologyChart.toNonEditGroupNode();
        },
        removeGroupNode() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.model.removeGroupNode();
        },
    },
};

export const NAMESPACE = 'topologyConfig';

storeInDashboard.registerModule(NAMESPACE, topologyConfigStore);
export default storeInDashboard;
