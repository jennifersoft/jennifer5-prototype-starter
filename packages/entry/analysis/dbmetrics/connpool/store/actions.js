import { Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { i18n } from '@common/utility';
import axios from '@library/axios';
import { convertTimeText } from '@entry/analysis/dbmetrics/dbsearch';

export default {
    async fetchResource({ state, commit, rootGetters }) {
        const sidList = rootGetters['domain/sidList'];
        const { start, end } = state.time;

        const ret = await Instance.get(sidList, start.valueOf(), end.valueOf());
        if (ret && ret.length) {
            const n = normalizeOidConfigResponse(ret, 'instance').map(n => ({
                ...n,
                check: 'no-check',
            }));
            const domainNotClickable = n.map(l => {
                if (l.resourceType === 'domain') {
                    return {
                        ...l,
                        noInteraction: true,
                    };
                }
                return l;
            });
            commit('updateResourcesData', [
                {
                    resourceType: 'instance',
                    tree: Array.from(domainNotClickable),
                },
            ]);
            commit('updatePoolNames');
        }
    },
    async fetchAlivePoolNames({ state, commit, rootGetters }) {
        const sidList = rootGetters['domain/sidList'];
        const { start, end } = state.time;
        const { oid } = state.resource;

        commit('updateLoadingPoolNames');
        const { data } = await axios.get('/jmx/pool', {
            params: {
                sid: sidList[0],
                oid,
                stime: start.valueOf(),
                etime: end.valueOf(),
            },
        });
        if (data && data.length) {
            const items = [];

            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                items.push({
                    label:
                        row.name +
                        (row.isJmx ? ' (' + i18n.get('ui.en.jmx') + ')' : ''),
                    value: row.name,
                });
            }
            commit('updatePoolNamesData', items);
        } else commit('updatePoolNamesData');
        commit('updatePoolNames');
        commit('updateLoadingPoolNames', false);
    },
    async fetchDbConnPoolData({ state, commit, rootGetters }) {
        const { start, end } = state.time;

        const sid = rootGetters['domain/sidList'][0];
        const intervalMs =
            state.interval === 0 ? -1 : state.interval * 60 * 1000;

        const pOids = [],
            pFunctions = [],
            pMetrics = [];
        state.conditionQueue.forEach(l => {
            const { resource, pool, metrics } = l;
            const { oid } = resource;
            pOids.push(oid);
            pFunctions.push(pool.map(p => p.value).join(';'));
            pMetrics.push(metrics.map(m => m.key).join(';'));
        });

        commit('updateProgress', 0);
        setTimeout(async () => {
            const { data, status } = await axios.get('/jmx/metrics', {
                params: {
                    sid,
                    stime: start.valueOf(),
                    etime: end.valueOf(),
                    interval: intervalMs,
                    oids: pOids,
                    functions: pFunctions,
                    metrics: pMetrics,
                },
            });
            if (status === 200) {
                commit(
                    'updateTableData',
                    data.map(i => ({
                        timeConverted: convertTimeText(
                            i[0],
                            end.valueOf(),
                            state.interval,
                            state.showStartTime
                        ),
                        list: i.map(j => j.toShortForAries()),
                    }))
                );
                commit('updateFilterCache', {
                    endTime: end.valueOf(),
                    interval: state.interval,
                    showStartTime: state.showStartTime,
                });
            }
            commit('updateProgress', 1);
        }, 500);
    },
};
