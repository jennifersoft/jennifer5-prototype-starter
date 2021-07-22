import axios from '@library/axios';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { Business, Instance } from '@service/oidConfig';

export default {
    async loadCrudData({ commit, state }) {
        commit('resetCrudData');
        commit('updateSearchProgress', 0);

        async function run(result = [], searchKey = '') {
            const { data } = await axios.get('/analysis/crud', {
                params: {
                    format: 'json',
                    sid: state.domainId,
                    stime: state.startDate.valueOf(),
                    etime: state.endDate.valueOf(),
                    otype: state.otype,
                    agent: state.oidMap[state.domainId],
                    searchKey: searchKey,
                },
            });

            commit('updateSearchProgress', data.progress);
            result.push(data.applications);

            if (data.nextSearchKey !== '' && data.progress < 1) {
                await run(result, data.nextSearchKey);
            } else {
                commit('updateCrudData', result);
                commit('filterCrudData');
            }
        }

        await run([], '');
    },
    async loadTargetData({ commit, state }) {
        const sidToFetch = [state.domainId];
        const startTime = state.startDate.valueOf();
        const endTime = state.endDate.valueOf();

        return Promise.all([
            Instance.get(sidToFetch, startTime, endTime).then(res => {
                commit(
                    'updateInstanceData',
                    Array.from(normalizeOidConfigResponse(res, 'instance'))
                );
            }),
            Business.get(sidToFetch, startTime, endTime).then(res => {
                commit(
                    'updateBusinessData',
                    Array.from(normalizeOidConfigResponse(res, 'business'))
                );
            }),
        ]);
    },
};
