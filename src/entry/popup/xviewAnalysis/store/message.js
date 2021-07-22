import axios from '@library/axios'
import { createNamespacedHelpers } from 'vuex'

export const NAMESPACE = 'xviewAnalysis/message'

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE)

export const state = {
    messageRows: [],
}

export const mutations = {
    updateMessageRows(state, rows) {
        state.messageRows = rows
    },
}

export const actions = {
    async loadMessageRows({ commit }, payload) {
        const { data } = await axios.get('/xview/message', {
            params: payload,
        })

        commit('updateMessageRows', data)
    },
}

export const getters = {}
