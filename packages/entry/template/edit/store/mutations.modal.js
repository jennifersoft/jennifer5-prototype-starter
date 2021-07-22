import Vue from "vue";

export const mutations = {
    setDataImage: (state, payload) => {
        for(const key in payload) {
            if(state[key] === payload[key]) continue;
            Vue.set(state, key, payload[key]);
        }
    }
}