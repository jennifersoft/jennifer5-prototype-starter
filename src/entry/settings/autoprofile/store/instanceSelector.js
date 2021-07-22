import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';

export const NAMESPACE = 'instanceSelector';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export const state = {
    domainId: -1,
    instanceList: [],
    instanceId: -1,
};

export const mutations = {
    updateInstances(state, data) {
        state.instanceList = data;
    },
    changeInstanceId(state, id) {
        state.instanceId = id;
    },
    changeDomainId(state, id) {
        state.domainId = id;
        state.instanceId = -1;
    },
};

export const actions = {
    async loadInstances({ state, commit }) {
        const { data } = await axios.get(
            `/api-v2/auto-profile/instance/${state.domainId}/list`
        );

        commit('updateInstances', data);

        // 선택된 인스턴스가 없을 경우에 대한 처리
        if (state.instanceId === -1 && data.length > 0) {
            commit('changeInstanceId', data[0].instanceId);
        }
    },
};
