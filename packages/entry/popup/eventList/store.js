import { createNamespacedHelpers } from 'vuex';
import store from '@vuejs/vuex/store';
import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import axios from '@library/axios';
import { OTypeDef } from '@common/definition';
import { printEscape } from '@common/utility';
import { serverDateFormat } from '@common/base';

export const NAMESPACE = 'eventList';

export const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

store.registerModule(NAMESPACE, {
    namespaced: true,
    state: {
        params: {
            domainJson: '',
            sid: '',
            oid: '',
            otype: '',
            isBiz: false,
        },
        onlyUnrecovered: true,
        tableData: [],
    },
    mutations: {
        updateParams(state, params) {
            state.params = params;
        },
        toggleOnlyUnrecovered(state, _) {
            state.onlyUnrecovered = !state.onlyUnrecovered;
        },
        updateTableData(state, list = []) {
            state.tableData = list;
        },
    },
    actions: {
        requestList({ state, commit, dispatch }, { sids, keys, events }) {
            if (!state.params.domainJson) {
                const { sid, oid } = state.params;
                commit('updateParams', {
                    ...state.params,
                    domainJson: JSON.stringify({
                        [sid]: [oid],
                    }),
                });
            }

            if (!sids && !keys && !events) {
                const { domainJson, isBiz } = state.params;
                const includeOnlyAlive = state.onlyUnrecovered;

                let sdate = getDayjs(),
                    edate = getDayjs();

                if (!includeOnlyAlive) {
                    sdate = startOfDayjs(sdate, 'date');
                } else {
                    sdate = sdate.add(-1, 'hour');
                }

                axios
                    .get('/db/event/all/keys', {
                        params: {
                            format: 'json',
                            stime: sdate.valueOf(),
                            etime: edate.valueOf(),
                            otype: isBiz ? OTypeDef.BUSINESS : OTypeDef.SYSTEM,
                            includeOnlyAlive,
                            domainJson,
                        },
                    })
                    .then(res => {
                        const domains = res.data;
                        const sids = [],
                            keys = [];

                        for (let sid in domains) {
                            sids.push(sid);
                            keys.push(domains[sid]);
                        }
                        dispatch('requestList', { sids, keys, events: [] });
                    });
            } else {
                axios
                    .get('/db/event/all/datas', {
                        params: {
                            format: 'json',
                            sids,
                            keys,
                        },
                    })
                    .then(({ data }) => {
                        events = events.concat(data.events);

                        if (data.domains == null) {
                            commit(
                                'updateTableData',
                                events.map(e => ({
                                    ...e,
                                    timestamp: getDayjs(e.time).format(
                                        serverDateFormat.long
                                    ),
                                    mxidNameMsg:
                                        e.mxidName !== ''
                                            ? i18n.get(`ui.mx.${e.mxidName}`)
                                            : '',
                                    messageFormatted: printEscape(
                                        e.message || e.detailMessage
                                    ),
                                }))
                            );
                        } else {
                            const sids = [],
                                keys = [];

                            for (let sid in data.domains) {
                                sids.push(sid);
                                keys.push(data.domains[sid]);
                            }
                            dispatch('requestList', { sids, keys, events });
                        }
                    });
            }
        },
        recoveryEvents({ state, dispatch }, { index }) {
            const { domainJson, isBiz } = state.params;
            if (!index) {
                axios
                    .post('/event/recovery/all', null, {
                        params: {
                            domainJson,
                            isBiz,
                        },
                    })
                    .then(() => dispatch('requestList', {}));
            } else {
                // TODO: ARIES-6916 비공개 기능 (개별 복구)
                // const { data } = popTable.get(index);
                // const { sid, oid, key, otype } = data;
                //
                // if (row != null) {
                //     axios
                //         .post('/event/recovery/keys', null, {
                //             params: { sid, oid, key, otype },
                //         })
                //         .then(() => this.requestList());
                // }
            }
        },
    },
});

export default store;
