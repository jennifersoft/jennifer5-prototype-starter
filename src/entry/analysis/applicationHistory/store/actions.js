import axios from '@library/axios';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { Instance } from '@service/oidConfig';
import { createFormData } from '@common/utility';
import { checkEscapingContents } from '../utility';

export default {
    async loadTargetData({ commit, state }) {
        return Promise.all([
            Instance.get([state.domainId], state.startTime, state.endTime).then(
                res => {
                    commit(
                        'updateInstanceData',
                        Array.from(normalizeOidConfigResponse(res, 'instance'))
                    );
                }
            ),
        ]);
    },
    async loadDeployCount({ commit, state }) {
        const { data } = await axios.get('/deploydata/monthly/count', {
            params: {
                format: 'json',
                sid: state.domainId,
                oids: state.checkedOids,
                year: state.year,
                month: state.month,
            },
        });

        commit('updateDeployCount', data);
        commit('findDeployIndex');
        commit('updateDeploySearchTimes');
    },
    async loadDeployData({ commit, state }) {
        const { data } = await axios.get('/deploydata/list/all', {
            params: {
                format: 'json',
                sid: state.domainId,
                oids: state.checkedOids,
                stime: state.startTime,
                etime: state.endTime,
            },
        });

        commit('updateDeployData', data);
        commit('updateResourceSearchParams', 0);
    },
    async loadResourceData({ commit, state }) {
        if (state.deployKey !== '' && state.collectTime !== -1) {
            const { data } = await axios.get('/deploydata/list/resource', {
                params: {
                    format: 'json',
                    sid: state.domainId,
                    key: state.deployKey,
                    collectTime: state.collectTime,
                },
            });

            commit('updateResourceData', data);
        }
    },
    async loadResourceContents({ commit, state }, payload) {
        const { data } = await axios.get('/deploydata/before/contents', {
            params: {
                format: 'json',
                sid: state.domainId,
                key: state.deployKey,
                collectTime: state.collectTime,
                lastModified: payload.lastModified,
                resourceName: payload.resourceName,
            },
        });

        const result = {
            contents: payload.contents,
            prettyContents: payload.contents,
            beforeContents: data,
            useEscaping: checkEscapingContents(payload.resourceType),
        };

        if (!result.useEscaping) {
            const res = await axios.post(
                '/deploydata/list/contents',
                createFormData({
                    contents: payload.contents,
                })
            );

            result.prettyContents = res.data;
        }

        commit('updateResourceContents', result);
    },
};
