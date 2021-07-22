import { createNamespacedHelpers } from 'vuex';
import {
    checkReadResourceContents,
    getResourceType,
    getResourceStatus,
} from '@entry/analysis/applicationHistory/utility';
import { getDayjs } from '@common/base';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';
import { DeployResourceStatusDef } from '@common/definition';

export const NAMESPACE = 'applicationHistory';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        params: {
            list: '',
            stime: '',
            etime: '',
        },
        deployList: [],
        targetRow: -1,
        resourceList: [],
    },
    mutations: {
        updateParams(state, params) {
            state.params = params;
        },
        updateDeployList(state, deployList) {
            state.deployList = deployList;
        },
        updateTargetRow(state, row) {
            state.targetRow = row;
        },
        updateResourceList(state, resourceList) {
            state.resourceList = resourceList;
        },
    },
    actions: {
        async loadDeployList({ commit }, { list, stime, etime }) {
            const { data } = await axios.post(
                '/deploydata/list/keysForMultiDomain',
                null,
                {
                    params: {
                        format: 'json',
                        stime,
                        etime,
                        list,
                    },
                }
            );

            commit(
                'updateDeployList',
                data.map(e => ({
                    ...e,
                    timestamp: getDayjs(e.collectTime).format(
                        serverDateFormat.long
                    ),
                }))
            );
            if (data.length > 0) {
                commit('updateTargetRow', 0);
            }
        },
        async loadResourceList({ commit }, { sid, collectTime, key }) {
            const { data } = await axios.get('/deploydata/list/resource', {
                params: {
                    format: 'json',
                    sid,
                    collectTime,
                    key,
                },
            });

            commit(
                'updateResourceList',
                data.map(e => ({
                    ...e,
                    timestamp: getDayjs(e.lastModified).format(
                        serverDateFormat.long
                    ),
                    deployStatus: getResourceStatus(e.resourceStatus),
                    deployType: getResourceType(e.resourceType),
                    showCodeDiffBtn:
                        e.resourceStatus !== DeployResourceStatusDef.NEW &&
                        e.resourceStatus !== DeployResourceStatusDef.REMOVED &&
                        checkReadResourceContents(e.resourceType),
                    checkReadResourceContents: checkReadResourceContents(
                        e.resourceType
                    ),
                }))
            );
        },
    },
});

export default store;
