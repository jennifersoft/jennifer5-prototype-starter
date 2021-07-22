import Vue from 'vue';
import Vuex from 'vuex';
import server from './server';
import domain from './domain';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        server,
        domain,
    },
});

export const createLocalStore = function(modName, modObj) {
    const modules = { server, domain };
    modules[modName] = modObj;

    return new Vuex.Store({ modules });
};
