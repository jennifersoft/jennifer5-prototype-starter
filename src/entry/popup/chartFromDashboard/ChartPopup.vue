<template>
    <div class="chart-popup">
        <chart-component
            :chart-option="item"
            :show-interaction-component="false"
            :filter-in-xview="filterMap"
        ></chart-component>
    </div>
</template>

<script>
import ChartComponent from '@entry/userdefine/dashboard/component/ChartComponent';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import { BusinessManager } from '@common/legacy/BusinessManager';
import { ElementManager } from '@common/legacy/ElementManager';
import { Observer } from '@common/legacy/Observer';

export default {
    name: 'ChartPopup',
    components: {
        ChartComponent,
    },
    props: {},
    data() {
        return {
            item: {
                domainBarSync: false,
            },
            filterMap: undefined,
        };
    },
    mounted() {
        DashboardChartHandler.socketUseCheckInit();

        const params = new URLSearchParams(location.search);
        const charttype = params.get('charttype');
        const openerChartKey = params.get('dataKey');
        if (charttype === 'xview.dashboard' || charttype === 'xview.realtime') {
            const openerXViewCharts = opener.aries.get(
                ChartKeywordInObserver.BIGDATA_CHARTS_OBJECT
            );

            const openerChart = openerXViewCharts?.[openerChartKey];
            if (openerChart) {
                // 필터 조건과 viewPoint(관점) 전달
                this.filterMap = openerChart.xviewFilter.registeredFilterMap;

                this.item.viewpoint = openerChart.renderer.viewPoint;
            }
        }
    },
    created() {
        const NUMERIC_FIELDS = ['metrics', 'otype', 'ptype'];
        const ARRAY_FIELDS = ['sid', 'oid'];
        const BOOLEAN_FIELDS = ['ismergedlinemode'];
        const JSON_FIELDS = ['cellConfigureArray'];

        const params = new URLSearchParams(location.search);
        params.forEach((value, key) => {
            this.item[key] = NUMERIC_FIELDS.includes(key)
                ? Number(value)
                : ARRAY_FIELDS.includes(key)
                ? value.split(',')
                : BOOLEAN_FIELDS.includes(key)
                ? Boolean(value)
                : JSON_FIELDS.includes(key)
                ? JSON.parse(value)
                : value;
        });

        if (params.get('datatype') === 'business') {
            BusinessManager.load(this.item.sid);
        } else {
            ElementManager.init(Observer.get('elements'));
        }
    },
};
</script>
<style lang="scss" scoped>
.chart-popup {
    height: 100%;
    width: 100%;
    ::v-deep .chart-component {
        position: relative;
        box-shadow: none;
        height: 100%;
    }
}
</style>
