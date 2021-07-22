import axios from '@library/axios';
import {
    AgentFeatureCodeDef,
    AgentFeatureMessageDef,
} from '@common/definition';
import { getDayjs, serverDateFormat } from '@common/base';

export default {
    async loadSocketData({ state, commit }, updateChild = true) {
        const { sid, oid } = state.domain;

        if (!!sid && !!oid) {
            commit('updateLoading', true);

            const { localPort, remoteIpAddress, remotePort } = state.filters;
            const { data } = await axios.get('/analysis/socket', {
                params: {
                    format: 'json',
                    sid,
                    agent: oid,
                    localPort,
                    remoteIpAddress,
                    remotePort,
                },
            });
            commit('updateLoading', false);

            if (!!data?.list) {
                commit(
                    'updateTableData',
                    data.list.map(e => ({
                        ...e,
                        timestamp: getDayjs(e.time).format(
                            serverDateFormat.long
                        ),
                    }))
                );

                const { key } = state.innerTableData;
                const targetRow = state.tableData.find(e => e.key === key);
                if (key === -1 || !targetRow) {
                    commit('updateInnerTableData', {
                        key: -1,
                        data: [],
                        updateChild,
                    });
                    return;
                }
                commit('updateInnerTableData', {
                    key,
                    data: targetRow.children,
                    updateChild,
                });
                return;
            }

            commit('updateTableData', []);
            commit('updateInnerTableData', {
                key: -1,
                data: [],
                updateChild,
            });
        }
    },
    async checkAgentSupport({ state, commit }) {
        const { sid, oid } = state.domain;

        if (!!sid && !!oid) {
            const { data: status } = await axios.get('/agent/feature', {
                params: {
                    format: 'json',
                    sid,
                    oid,
                    code: AgentFeatureCodeDef.SOCKET_NEW_ALL_STACK,
                },
            });
            commit('updateAgentStatus', status);
        }
    },
    async receiveStacktrace({ state, commit, dispatch }, { key }) {
        const { sid, oid } = state.domain;

        if (!!sid && !!oid) {
            const { status } = await axios.get('/analysis/socket/stacktrace', {
                params: {
                    format: 'json',
                    sid,
                    agent: oid,
                    keys: key,
                },
            });
            if (status === 200) {
                const updated = state.innerTableData.data.slice();
                commit('updateInnerTableData', {
                    ...state.innerTableData,
                    data: updated.map((e, i) => {
                        if (e.key === key) {
                            e.newstack = true;
                        }
                        return e;
                    }),
                });
            }
        }
    },
    async removeStacktrace({ state, dispatch }) {
        const { oid, sid } = state.domain;
        if (!!sid && !!oid) {
            await axios.post('/analysis/socket/stackclear', null, {
                params: {
                    sid,
                    agent: oid,
                },
            });
            dispatch('loadSocketData');
        }
    },
    async receiveStacktraceAll({ state, dispatch }) {
        const { agentStatus } = state;
        if (agentStatus !== AgentFeatureMessageDef.SUPPORTED) return;

        const { sid, oid } = state.domain;
        if (!!sid && !!oid) {
            const { data } = await axios.get(
                '/analysis/socket/stacktrace/all',
                {
                    params: {
                        format: 'json',
                        sid,
                        agent: oid,
                    },
                }
            );
            if (data) dispatch('loadSocketData');
        }
    },
    async gc({ state }) {
        const { sid, oid } = state.domain;
        if (!!sid && !!oid) {
            await axios.post('/agent/gc', null, {
                params: {
                    sid,
                    agent: oid,
                },
            });
        }
    },
};
