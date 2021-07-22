import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import { getDayjs, serverDateFormat } from '@common/base';
import { ErrorTypeDef } from '@common/definition';
import axios from '@library/axios';

export const NAMESPACE = 'errorDetailForMulti';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        params: {
            oidsBySid: '',
            otype: '',
            errorType: '',
            etime: '',
            stime: '',
            hash: '',
        },
        list: [],
        progress: 0,
    },
    mutations: {
        updateParams(state, params) {
            state.params = params;
        },
        updateList(state, list = []) {
            state.list = list;
        },
        updateProgress(state, progress) {
            state.progress = progress;
        },
    },
    actions: {
        async requestList(
            { state, commit, dispatch },
            { session = null, list = [] }
        ) {
            if (!session) {
                const {
                    oidsBySid,
                    otype,
                    errorType,
                    etime,
                    stime,
                    hash,
                } = state.params;
                const params = {
                    applicationNameKey: hash,
                    otype: otype,
                    stime: parseInt(stime),
                    etime: parseInt(etime),
                    group: JSON.stringify(oidsBySid),
                    errorTypes: [],
                };

                if (parseInt(errorType) === -1) {
                    for (let key in ErrorTypeDef) {
                        params.errorTypes.push(ErrorTypeDef[key]);
                    }
                } else {
                    params.errorTypes.push(errorType);
                }

                commit('updateProgress', 0);
                const { data: sessionKey, status } = await axios.post(
                    '/domaingroup/db/error/list/key',
                    null,
                    {
                        params,
                    }
                );
                if (status === 200) {
                    dispatch('requestList', { session: sessionKey, list: [] });
                }
            } else {
                const { data, status } = await axios.post(
                    '/domaingroup/db/error/list/data',
                    null,
                    {
                        params: {
                            session,
                        },
                    }
                );
                if (status === 200) {
                    const { partialData, progress, hasNext } = data;
                    if (hasNext) {
                        commit('updateProgress', progress);
                        dispatch('requestList', {
                            session,
                            list: list.concat(partialData),
                        });
                    } else {
                        commit('updateProgress', 1);
                        commit(
                            'updateList',
                            list.concat(partialData).map(e => ({
                                ...e,
                                timestamp: getDayjs(e.time).format(
                                    serverDateFormat.long
                                ),
                            }))
                        );
                    }
                }
            }
        },
    },
});

export default store;
