<template>
    <div class="async-tab table-panel">
        <div class="toolbar">
            <div class="right">
                <span class="domain"
                    >{{ chartDomain[0] | numberFormat }}{{ i18n.ms }}</span
                >
                <span class="slider">
                    <slider small
                        :type="'ranged'"
                        :show-tooltip="true"
                        :max="maxRange"
                        :initial-value="chartDomain"
                        :step="2"
                        :key="sliderSequence"
                        @update:value="updateChartDomain"
                    ></slider>
                </span>
                <span class="domain"
                    >{{ chartDomain[1] | numberFormat }}{{ i18n.ms }}</span
                >
            </div>
        </div>
        <async-chart
            :width="mainWidth"
            :height="mainHeight"
            :domain="chartDomain"
            :rows="asyncRows"
            :rowTemplate="rowTemplate"
            :target="['blank', 'method', 'sql', 'externalCall']"
            @show-graph="onShowGraphData"
            @hide-graph="onHideGraphData"
            @click-row="onClickRowData"
        ></async-chart>
        <async-detail-view
            :width="detailViewWidth"
            :left="detailViewLeft"
            :top="detailViewTop"
            :items="detailViewItems"
            v-if="showDetailView"
        ></async-detail-view>
    </div>
</template>

<script>
import Slider from '@vuejs/component/Slider/Slider';
import AsyncChart from '../component/AsyncChart';
import AsyncDetailView from '../component/AsyncDetailView';
import { UIManager } from '@common/legacy/UIManager';
import {
    mapState as baseMapState,
    mapGetters as baseMapGetters,
} from '@entry/popup/xviewAnalysis/store/base';
import { mapState, mapMutations } from '../store/async';

export default {
    components: {
        Slider,
        AsyncChart,
        AsyncDetailView,
    },
    inject: ['i18n'],
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth,
            mainHeight: state => state.mainHeight - 63,
        }),
        ...baseMapGetters({
            params: 'transactionToProfileSearchParams',
        }),
        ...mapState({
            asyncRows: state => state.asyncRows,
            maxRange: state => state.maxRange,
            chartDomain: state => state.chartDomain,
        }),
    },
    watch: {
        maxRange(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.sliderSequence += 1;
        },
    },
    data() {
        return {
            rowTemplate: `
<!
    var hasChild = row.children.length > 0;
!>
<tr class="<!= active ? 'selected-bold' : '' !>">
    <td>
        <span style="display: inline-block; width: <!= row.depth * 20 !>px"></span>
        <! if(hasChild) { !>
        <i style="margin-left: -2px;" class="icon-<! if(row.type == "fold") { !>left<! } else { !>right<! } !>"></i>
        <! } else { !>
        <i style="margin-right: 10px;" class="icon-blank"></i>
        <! } !>
        <span class="application" title="<!= application !>"><!= application !></span>
    </td>
    <td class="large"><span class="chart"></span></td>
</tr>
`,
            sliderSequence: 1,
            showDetailView: false,
            detailViewLeft: 0,
            detailViewTop: 0,
            detailViewWidth: 240,
            detailViewItems: [],
        };
    },
    filters: {
        numberFormat: value => {
            return value.toLocaleForAries();
        },
    },
    methods: {
        ...mapMutations(['updateChartDomain']),
        onShowGraphData(obj, e) {
            const items = [
                {
                    text: this.i18n.method,
                    value: obj.data.method,
                    color: '#4a7dff',
                },
                { text: this.i18n.sql, value: obj.data.sql, color: '#9ed5ff' },
                {
                    text: this.i18n.externalCall,
                    value: obj.data.externalCall,
                    color: '#ffdc04',
                },
                {
                    text: this.i18n.batchJob,
                    value: obj.data.batchJob,
                    color: '#49d484',
                },
            ];

            this.detailViewItems = items.filter(row => row.value > 0);
            this.detailViewLeft = e.x - this.detailViewWidth - 20;
            this.detailViewTop = e.y - this.detailViewItems.length * 20 - 24;
            this.showDetailView = true;
        },
        onHideGraphData() {
            this.showDetailView = false;
        },
        onClickRowData({ data }) {
            if (!data.active) {
                const searchRange = 1000 * 60 * 60;
                UIManager.getXViewPointList(
                    this.params.sid,
                    [data.key],
                    this.params.stime - searchRange,
                    this.params.etime + searchRange,
                    data.key,
                    undefined,
                    undefined,
                    'xviewAnalysisForAsync'
                );
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../style/AsyncToolbar.scss';

.async-tab {
    @include async-toolbar;
}
</style>
