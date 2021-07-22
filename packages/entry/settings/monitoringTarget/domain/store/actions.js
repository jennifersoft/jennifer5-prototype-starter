import axios from '@library/axios';
import { createFormData } from '@common/utility';

export default {
    async loadUseDomainGroup({ commit }) {
        const { data } = await axios.get(`/domain/groups/status/usage`);
        commit('setUseDomainGroup', data);
    },
    async changeUseDomainGroup({ commit }, active) {
        await axios.get('/domain/groups/status/set', {
            params: {
                isActive: active,
            },
        });
        commit('setUseDomainGroup', active);
    },
    async loadDomainGroupTree({ commit }) {
        const { data } = await axios.get('/domain/groups');
        commit('updateDomainGroupTree', data.list);
    },
    async saveDomainGroupTree({ dispatch }, nodes) {
        const { data } = await axios.post(
            '/domain/groups/nodes/set',
            createFormData({
                titles: nodes.map(item => item.label),
                indexes: nodes.map(item => item.index),
                sids: nodes.map(item => item.sid),
            })
        );

        if (data) await dispatch('loadDomainGroupTree');
    },
    async loadDomainList({ commit }) {
        const { data } = await axios.get('/domain/list', {
            params: {
                format: 'json',
            },
        });
        const status = await axios.get('/domain/status');
        commit('updateDomainList', { data, status: status.data });
    },
    async getAgentList({ commit }, domainId) {
        return await axios.get('/agent/names', {
            params: {
                format: 'json',
                sid: domainId,
            },
        });
    },
    async removeCheckedDomainList({ state, commit, dispatch }) {
        const promisses = [];

        state.checkedDomainIds.forEach(domainId => {
            promisses.push(
                axios.get('/domain/remove', {
                    params: {
                        sid: domainId,
                    },
                })
            );
        });

        axios.all(promisses).then(() => {
            dispatch('loadDomainList').then(() => {
                commit('backToScreenMode');
            });
        });
    },
    async loadDetailDomain({ state, commit, dispatch }, row) {
        try {
            const { data } = await axios.get(
                '/domain/instanceManagePolicy/get',
                {
                    params: {
                        sid: row.sid,
                    },
                }
            );

            commit('selectDetailDomain', {
                ...data,
                ...row,
                isConnected: true,
            });
        } catch (e) {
            commit('selectDetailDomain', { ...row, isConnected: false });
        }

        commit('addCheckedDomainIds', [{ checked: true, sid: row.sid }]);
    },
    async saveDetailDomain({ state, dispatch }, row) {
        const { data } = await axios.get('/domain/save', {
            params: {
                sid: row.sid,
                shortName: row.shortName,
                longName: row.longName,
                ip: row.ip,
                port: row.port,
                order: state.domainList.length,
            },
        });

        if (data) {
            // TODO: 좋은 방법은 아닌데, 뷰서버에서 데이터서버 연결 완료 시점을 가져올 수 없음
            setTimeout(() => {
                try {
                    dispatch('updateDetailDomain', { row, isNew: true });
                    dispatch('updateAgentNamingRule', {
                        sid: row.sid,
                        ruleType: row.namingRule,
                        isOverwrite: false,
                    });
                } catch (e) {}
            }, 1000);
        }
    },
    async updateDetailDomain({ state }, { row, isNew }) {
        await axios.get('/domain/update-v2', {
            params: {
                ...row,
                isAnother: isNew,
                reuseInstanceId: false,
            },
        });
    },
    async updateAgentNamingRule({ state }, payload) {
        await axios.get('/domain/update/instance/namingrule', {
            params: payload,
        });
    },
};
