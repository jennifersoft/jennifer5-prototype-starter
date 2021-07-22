import axios from '@library/axios';
import { Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';

export default {
    async loadTargetData({ commit, state }) {
        return Promise.all([
            Instance.get(
                [state.domainId],
                state.startDate.valueOf(),
                state.endDate.valueOf()
            ).then(res => {
                commit(
                    'updateInstanceData',
                    Array.from(normalizeOidConfigResponse(res, 'instance'))
                );
            }),
        ]);
    },
    async loadTopStackElements({ state, commit }) {
        commit('updateTableRows', []);
        commit('updateSearchProgress', 0.01);

        const result = [];
        const { data } = await axios.get(
            '/api-v2/stack-trace-statistic/top-elements/session',
            {
                params: {
                    domainId: state.domainId,
                    oids: state.instanceOids.join('_'),
                    startTime: state.startDate.valueOf(),
                    endTime: state.endDate.valueOf(),
                },
            }
        );

        async function run(session) {
            const { data } = await axios.get(
                '/api-v2/stack-trace-statistic/top-elements/data',
                {
                    params: {
                        domainId: state.domainId,
                        sessionId: session,
                    },
                }
            );

            data.data.forEach(row => {
                result.push(row);
            });
            commit('updateSearchProgress', data.progress);

            if (data.hasNext) await run(session);
        }

        await run(data.sessionId);

        commit('updateTableRows', result);
        commit('updateSearchProgress', 1);
    },
};
