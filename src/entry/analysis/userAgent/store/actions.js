import { Business, Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { OTypeDef } from '@common/definition';
import axios from '@library/axios';

export const actions = {
    async fetchResource({ commit, state }) {
        const { domains, filters } = state;
        const { sidList } = domains;
        const { start, end } = filters.time;

        const res = await Instance.get(sidList, start.valueOf(), end.valueOf());
        const n = normalizeOidConfigResponse(res, 'instance');
        const res2 = await Business.get(
            sidList,
            start.valueOf(),
            end.valueOf()
        );
        const n2 = normalizeOidConfigResponse(res2, 'business');

        commit('updateResourceData', [
            {
                resourceType: 'instance',
                tree: Array.from(n),
            },
            {
                resourceType: 'business',
                tree: Array.from(n2),
            },
        ]);
    },
    fetchUserAgentData({ commit, state, dispatch }, payload) {
        const { domains, loading, filters } = state;
        const { sid } = domains;
        const { time, oidList, otypeString, details } = filters;
        const { start, end } = time;
        const otype =
            otypeString === 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM;

        if (loading === false) {
            commit('updateProgress', 1);
            if (payload?.result) commit('updateData', payload.result);
            return;
        }

        if (!payload?.session) {
            commit('updateProgress', 0);
            axios
                .get('/analysis/userAgent/session', {
                    params: {
                        format: 'json',
                        stime: start.valueOf(),
                        etime: end.valueOf(),
                        sid,
                        otype,
                        oidList: oidList[sid]?.join(','),
                    },
                })
                .then(({ data: { session } }) => {
                    dispatch('fetchUserAgentData', {
                        session,
                        result: [],
                    });
                })
                .catch(() => {
                    commit('updateLoading', false);
                });
        } else {
            const { session, result } = payload;
            axios
                .get('/analysis/userAgent/list', {
                    params: {
                        format: 'json',
                        sid,
                        session,
                    },
                })
                .then(({ data: { progress, list, hasNext } }) => {
                    for (let i = 0, len = list.length; i < len; i++) {
                        result.push(list[i]);
                    }

                    if (hasNext) {
                        commit('updateProgress', progress);
                        dispatch('fetchUserAgentData', { session, result });
                    } else {
                        commit('updateData', result);
                        commit('updateLoading', false);
                        commit('updateProgress', 1);
                    }
                })
                .catch(() => {
                    commit('updateLoading', false);
                    commit('updateProgress', 1);
                });
        }
    },
};
