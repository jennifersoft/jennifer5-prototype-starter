import { createNamespacedHelpers } from 'vuex'
import axios from '@library/axios'

export const NAMESPACE = 'xviewAnalysis/file'

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE)

export const state = {
    fileRows: [],
}

export const mutations = {
    updateFileRows(state, rows) {
        state.fileRows = rows
    },
}

export const actions = {
    async loadFileRows({ commit }, payload) {
        const { data } = await axios.get('/xview/file', {
            params: payload,
        })

        commit('updateFileRows', data)
    },
}

export const getters = {}
