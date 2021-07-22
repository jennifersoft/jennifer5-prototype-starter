import axios from 'axios';
import { DBMetrics as db } from '@service/dbMetrics';
import { createHeatmapChartData } from '@entry/analysis/regression/utility';

export default {
    async loadHeatmapData({ state, commit }, payload) {
        const responses = [];
        commit('updateFetching');

        state.metricValues.forEach(metrics => {
            responses.push(
                db.get(
                    state.domainId,
                    state.instanceOid,
                    payload.startTime,
                    payload.endTime,
                    payload.interval,
                    metrics,
                    state.startHour,
                    state.endHour
                )
            );
        });

        const data = await axios.all(responses);

        commit(
            'updateHeatmapValues',
            createHeatmapChartData(
                state.metricNames,
                data.map(item => item.data).map(item => item[0].v2)
            )
        );
        commit('updateFetching', false);
    },
};
