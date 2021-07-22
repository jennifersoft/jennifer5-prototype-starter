import vuestore from "@vuejs/vuex/store";
import { state } from "./store/state";
import { getters } from "./store/getters";
import { mutations } from "./store/mutations";
import { actions } from "./store/actions";


vuestore.registerModule('statistics', {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
});

export const store = vuestore;
