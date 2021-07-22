import axios from '@library/axios';
import { createFormData } from '@common/utility';
import { getDomainAndInstanceInfo } from '../utility';

export default {
    async loadActiveServiceList({ state, commit }) {
        let result = [];

        if (state.isIncoming) {
            const { data } = await axios.get('/activeService/list/incoming', {
                params: {
                    format: 'json',
                    sourceSid: state.sourceDomainId,
                    sourceOid: state.sourceInstanceOid,
                    targetSid: state.targetDomainId,
                    targetOid: state.targetInstanceOid,
                    existReverse: state.existReverse,
                },
            });
            result = data;
        } else if (state.isOutgoing) {
            const { data } = await axios.get('/activeService/list/outgoing', {
                params: {
                    format: 'json',
                    sourceSid: state.sourceDomainId,
                    sourceOid: state.sourceInstanceOid,
                    targetRemoteCallType: state.targetRemoteCallType,
                    targetCustomMethodDescHashOrZero:
                        state.targetCustomMethodDescHash,
                    targetIpAddressOrEmpty: state.targetIpAddress,
                    targetPortOrZero: state.targetPort,
                },
            });
            result = data;
        } else if (state.isGroupNode) {
            const { data } = await axios.post(
                '/activeService/list/groupNode',
                createFormData({
                    sourceInfoList: state.sourceInfoList,
                    targetInfoList: state.targetInfoList,
                })
            );
            result = data;
        } else {
            const params = { sids: [], oids: [] };

            if (state.isFromBatchJobDomain) params.sids = state.domainIds;
            else {
                const info = getDomainAndInstanceInfo();
                params.sids = info.domainIds;
                params.oids = info.instanceOids;
            }

            const { data } = await axios.get('/activeService/list', {
                params: {
                    format: 'json',
                    ...params,
                },
            });
            result = data;
        }

        commit('updateActiveServiceList', result);
        commit('updateScoreValues');
    },
    async loadActiveServiceDetail({}, payload) {
        const { data } = await axios.get('/activeService/detail/ajax', {
            params: {
                format: 'json',
                sid: payload.domainId,
                txid: payload.txid,
                session: payload.session,
                threadHash: payload.threadHashText,
            },
        });

        return data;
    },
    async loadExternalCallDetail({}, payload) {
        const { data } = await axios.get('/activeService/detail/excall', {
            params: {
                format: 'json',
                sid: payload.domainId,
                key: payload.runningHashText,
                captureTime: payload.captureTime,
            },
        });

        return data;
    },
    async loadScoreRanges({ commit }) {
        const { data } = await axios.get('/activeService/range/get', {
            params: {
                format: 'json',
            },
        });

        commit('updateScoreRanges', data);
    },
    async createServiceDump({}, payload) {
        const { data } = await axios.post(
            '/analysis/servicedump/set',
            createFormData(payload)
        );

        return data;
    },
};
