import { createNamespacedHelpers } from 'vuex'
import axios from '@library/axios'

export const NAMESPACE = 'xviewAnalysis/socket'

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE)

export const state = {
    socketRows: [],
}

export const mutations = {
    updateSocketRows(state, rows) {
        state.socketRows = rows
    },
}

export const actions = {
    async loadSocketRows({ commit }, payload) {
        const { data } = await axios.get('/xview/socket', {
            params: payload,
        })

        commit('updateSocketRows', data)
    },
}

export const getters = {}
