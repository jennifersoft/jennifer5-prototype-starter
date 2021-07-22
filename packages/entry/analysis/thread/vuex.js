import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import axios from '@library/axios';
import { UIManager } from '@common/legacy/UIManager';

export const NAMESPACE = 'analysis/thread';

export const {
    mapState,
    mapMutations,
    mapActions,
    mapGetters,
} = createNamespacedHelpers(NAMESPACE);

function getColList(list, tmpColList) {
    var newList = [],
        statCount = {};

    for (var i = 0; i < list.length; i++) {
        if (!tmpColList[list[i].id]) {
            tmpColList[list[i].id] = list[i].cpu;
            list[i].dcpu = 0;
        } else {
            list[i].dcpu = list[i].cpu - tmpColList[list[i].id];
        }
        newList.push(list[i]);
    }

    return { newList, tmpColList, statCount };
}

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        domain: {
            sid: -1,
            oid: -1,
        },
        tableData: [],
        tmpColList: {},
        count: {
            started: 0,
            deadlock: 0,
            current: 0,
        },
        stacktraceDetail: {},
    },
    mutations: {
        updateDomain(state, config) {
            const { sid, oid } = config;
            state.domain.sid = sid;
            state.domain.oid = oid;
        },
        updateTableData(state, list) {
            state.tableData = list;
        },
        updateTmpColList(state, list = {}) {
            state.tmpColList = list;
        },
        updateCount(state, { started, deadlock, current }) {
            state.count = {
                started,
                deadlock,
                current,
            };
        },
        updateStacktraceDetail(state, payload = {}) {
            state.stacktraceDetail = payload;
        },
    },
    getters: {
        isDomainValid(state) {
            const { sid, oid } = state.domain;
            return sid !== -1 && oid !== -1;
        },
        statusMap(state) {
            let ret = {};
            const list = state.tableData;

            for (var i = 0; i < list.length; i++) {
                if (!ret[list[i].stat]) {
                    ret[list[i].stat] = 0;
                }
                ret[list[i].stat] += 1;
            }
            return ret;
        },
    },
    actions: {
        initializeData({ commit }) {
            commit('updateTableData', []);
            commit('updateCount', {
                started: 0,
                deadlock: 0,
                current: 0,
            });
        },
        async loadThreadData({ state, commit, getters, dispatch }) {
            const { sid, oid: agent } = state.domain;
            if (getters.isDomainValid) {
                const { data } = await axios.get('/thread/list', {
                    params: {
                        format: 'json',
                        sid,
                        agent,
                    },
                });

                if (!!data?.list) {
                    const {
                        list,
                        started = 0,
                        deadlock = 0,
                        current = 0,
                    } = data;
                    const { newList, tmpColList } = getColList(
                        list,
                        state.tmpColList
                    );
                    commit('updateTableData', newList);
                    commit('updateTmpColList', tmpColList);
                    commit('updateCount', {
                        started,
                        deadlock,
                        current,
                    });
                } else {
                    dispatch('initializeData');
                }
            } else dispatch('initializeData');
        },
        async loadThreadStacktrace({ state, getters, commit }, { key }) {
            const { sid, oid: agent } = state.domain;
            if (getters.isDomainValid) {
                const { data: json } = await axios.get(
                    '/analysis/thread/detail',
                    {
                        params: {
                            format: 'json',
                            sid,
                            agent,
                            id: key,
                        },
                    }
                );
                if (!!json) {
                    commit('updateStacktraceDetail', json);
                }
            }
        },
        openDetailPopup({ state }, { key }) {
            const { sid, oid } = state.domain;
            UIManager.popup(
                '/popup/thread?sid=' + sid + '&agent=' + oid + '&key=' + key,
                1040,
                600
            );
        },
    },
});

export default store;
