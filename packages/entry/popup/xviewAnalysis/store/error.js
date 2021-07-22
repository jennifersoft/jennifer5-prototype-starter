import { createNamespacedHelpers } from 'vuex'
import axios from '@library/axios'

export const NAMESPACE = 'xviewAnalysis/error'

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE)

export const state = {
    errorRows: [],
}

export const mutations = {
    updateErrorRows(state, rows) {
        state.errorRows = rows
    },
}

export const actions = {
    async loadErrorRows({ commit }, payload) {
        const { data } = await axios.get('/xview/error', {
            params: payload,
        })

        commit('updateErrorRows', data)
    },
}

export const getters = {}
