import axios from '@library/axios';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { Instance, Business } from '@service/oidConfig';
import { createFormData } from '@common/utility';

export default {
    async loadTargetData({ commit, state, getters }) {
        const searchDates = getters.dailyChartSearchDates;
        const startTime = searchDates[0].valueOf();
        const endTime = searchDates[1].valueOf() + 1;

        return Promise.all([
            Instance.get(state.domainIds, startTime, endTime).then(res => {
                commit(
                    'updateInstanceData',
                    Array.from(normalizeOidConfigResponse(res, 'instance'))
                );
            }),
            Business.get(state.domainIds, startTime, endTime).then(res => {
                commit(
                    'updateBusinessData',
                    Array.from(normalizeOidConfigResponse(res, 'business'))
                );
            }),
        ]);
    },

    async loadTableData({ commit, state }) {
        commit('updateTableRows', []);

        const result = [];
        const { data } = await axios.post(
            `/analysis/service/${state.tableType.toLowerCase()}/key`,
            createFormData({
                oidsBySid: JSON.stringify(state.oidMap),
                otype: state.otype,
                stime: state.startDateForTable.valueOf(),
                etime: state.endDateForTable.valueOf() + 1,
            })
        );

        async function run(session) {
            const { data } = await axios.post(
                `/analysis/service/${state.tableType.toLowerCase()}/data`,
                createFormData({
                    sessionKey: session,
                })
            );

            data.partialData.forEach(row => {
                result.push(row);
            });
            commit('updateTableProgress', data.progress);

            if (data.hasNext) await run(session);
        }

        await run(data);

        commit('updateTableRows', result);
        commit('updateTableProgress', 0);
    },

    async loadDailyChartData({ commit, state, getters }) {
        const searchDates = getters.dailyChartSearchDates;

        commit('toggleDailyChartLoading', true);

        const { data } = await axios.post(
            '/standard/period/range/multi',
            createFormData({
                oidsBySid: JSON.stringify(state.oidMap),
                otype: state.otype,
                mxid: state.dailyChartMetrics,
                interval: state.dailyChartInterval,
                stime: searchDates[0].valueOf(),
                etime: searchDates[1].valueOf() + 1,
            })
        );

        commit('updateDailyChartRows', {
            date: searchDates[0].clone(),
            rows: data,
        });

        commit('toggleDailyChartLoading', false);
    },

    async loadHourlyChartData({ commit, state, getters }) {
        const searchDates = getters.hourlyChartSearchDates;

        // TODO: 적당한 초기값을 세팅해줘야 할듯 ??
        if (searchDates !== null) {
            commit('toggleHourlyChartLoading', true);

            const { data } = await axios.post(
                '/standard/period/range/multi',
                createFormData({
                    oidsBySid: JSON.stringify(state.oidMap),
                    otype: state.otype,
                    mxid: state.hourlyChartMetrics,
                    interval: state.hourlyChartInterval,
                    stime: searchDates[0].valueOf(),
                    etime: searchDates[1].valueOf() + 1,
                })
            );

            commit('updateHourlyChartRows', {
                date: searchDates[0].clone(),
                rows: data,
            });

            commit('toggleHourlyChartLoading', false);
        }
    },

    // -------------------------------------
    // 확장 윈도우 관련 데이터
    // -------------------------------------

    async loadExpandChartData({ commit, state, getters }, gtype) {
        commit('updateExpandChartRows', { gtype, rows: [] });

        const rows = [];
        const searchDates =
            gtype === 'DAY'
                ? getters.dailyChartSearchDates
                : getters.expandHourlyChartSearchDates;

        const { data } = await axios.post(
            `/analysis/service/${state.tableType.toLowerCase()}/key`,
            createFormData({
                oidsBySid: JSON.stringify(state.oidMap),
                otype: state.otype,
                stime: searchDates[0].valueOf(),
                etime: searchDates[1].valueOf() + 1,
                hashes: [state.expandHash], // Application, SQL, ExternalCall 조회시 사용함
                type: state.expandHash, // ERROR 조회시 사용함
                gtype,
            })
        );

        async function run(session) {
            const { data } = await axios.post(
                `/analysis/service/${state.tableType.toLowerCase()}/data`,
                createFormData({
                    sessionKey: session,
                })
            );

            data.partialData.forEach(row => {
                rows.push(row);
            });
            commit('updateExpandChartProgress', {
                gtype,
                progress: data.progress,
            });

            if (data.hasNext) await run(session);
        }

        await run(data);

        commit('updateExpandChartRows', { gtype, rows });
        commit('updateExpandChartProgress', {
            gtype,
            progress: 0,
        });
    },
    async loadExpandTableDataForApplication({ commit, state }) {
        commit('updateExpandTableRows', []);

        const rows = [];
        const form = createFormData({
            oidsBySid: JSON.stringify(state.oidMap),
            otype: state.otype,
            stime: state.expandStartDateForTable.valueOf(),
            etime: state.expandEndDateForTable.valueOf() + 1,
            hash: state.expandHash,
        });

        const res1 = await axios.post(
            '/analysis/service/application/sql/detail/key',
            form
        );
        const res2 = await axios.post(
            '/analysis/service/application/externalcall/detail/key',
            form
        );

        async function run(session, ctype) {
            const { data } = await axios.post(
                `/analysis/service/application/${ctype}/detail/data`,
                createFormData({
                    sessionKey: session,
                })
            );

            data.partialData.forEach(row => {
                rows.push(row);
            });
            commit(
                'updateExpandTableProgress',
                data.progress / 2 + (ctype === 'sql' ? 0 : 0.5)
            );

            if (data.hasNext) await run(session, ctype);
        }

        await run(res1.data, 'sql');
        await run(res2.data, 'externalcall');

        commit('updateExpandTableRows', rows);
        commit('updateExpandTableProgress', 0);
    },
    async loadExpandTableData({ commit, state }) {
        commit('updateExpandTableRows', []);

        const rows = [];
        const { data } = await axios.post(
            `/analysis/service/${state.tableType.toLowerCase()}/detail/key`,
            createFormData({
                oidsBySid: JSON.stringify(state.oidMap),
                otype: state.otype,
                stime: state.expandStartDateForTable.valueOf(),
                etime: state.expandEndDateForTable.valueOf() + 1,
                hash: state.expandHash, // Application, SQL, ExternalCall 조회시 사용함
                type: state.expandHash, // ERROR 조회시 사용함
            })
        );

        async function run(session) {
            const { data } = await axios.post(
                `/analysis/service/${state.tableType.toLowerCase()}/detail/data`,
                createFormData({
                    sessionKey: session,
                })
            );

            data.partialData.forEach(row => {
                rows.push(row);
            });
            commit('updateExpandTableProgress', data.progress);

            if (data.hasNext) await run(session);
        }

        await run(data);

        commit('updateExpandTableRows', rows);
        commit('updateExpandTableProgress', 0);
    },
};
