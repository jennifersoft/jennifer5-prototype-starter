<template>
    <div class="guid-chart table-panel">
        <div class="toolbar">
            <div class="right">
                <span class="domain">{{ chartDomain[0] | numberFormat }}</span>
                <span class="slider">
                    <slider small
                        :type="'ranged'"
                        :show-tooltip="true"
                        :max="maxRange"
                        :initial-value="chartDomain"
                        :step="2"
                        @update:value="onUpdateSlider"
                    ></slider>
                </span>
                <span class="domain">{{ chartDomain[1] | numberFormat }}</span>
            </div>
        </div>
        <async-chart
            :target="['blank', 'elapsedTime']"
            :colors="colors"
            :width="width"
            :height="166"
            :size="'small'"
            :use-select-effect="true"
            :domain="chartDomain"
            :rows="chartData"
            @click-row="onClickRow"
            @show-graph="onShowGraph"
            @hide-graph="onHideGraph"
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
import AsyncChart from './AsyncChart';
import AsyncDetailView from './AsyncDetailView';

export default {
    components: {
        Slider,
        AsyncChart,
        AsyncDetailView,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: {
                elapsedTime: 'Elapsed Time',
            },
        },
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        data: {
            type: Array,
            required: false,
            default: () => [],
        },
        rowIndex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        const maxRange = this.getMaxRange();

        return {
            colors: ['transparent', '#4a7dff'],
            maxRange: maxRange,
            chartDomain: [0, maxRange],
            showDetailView: false,
            detailViewLeft: 0,
            detailViewTop: 0,
            detailViewWidth: 240,
            detailViewItems: [],
        };
    },
    computed: {
        chartData() {
            if (this.data.length == 0) return [];

            const first = this.data[0];
            const maxIndex = this.maxIndex;

            return this.data.map((d, i) => {
                const start = d.startTime - first.startTime;
                return {
                    key: d.txid,
                    parentKey: -1,
                    active: maxIndex === i,
                    application: d.serviceName,
                    blank: start,
                    elapsedTime: d.elapsedTime,
                };
            });
        },
        maxIndex() {
            if (this.data.length == 0) return 0;

            let maxIndex = 0;
            this.data.forEach((d, i) => {
                if (this.data[maxIndex].elapsedTime < d.elapsedTime)
                    maxIndex = i;
            });
            return maxIndex;
        },
    },
    filters: {
        numberFormat: value => {
            return value.toLocaleForAries();
        },
    },
    methods: {
        onClickRow({ index }) {
            this.$emit('click', parseInt(index));
        },
        onShowGraph({ index, data }, e) {
            const items = [
                {
                    text: this.i18n.elapsedTime,
                    value: data.elapsedTime,
                    color: this.colors[1],
                },
            ];

            this.detailViewItems = items.filter(row => row.value > 0);
            this.detailViewLeft = e.x - this.detailViewWidth - 20;
            this.detailViewTop = e.y - this.detailViewItems.length * 20 - 24;
            this.showDetailView = true;
        },
        onHideGraph() {
            this.showDetailView = false;
        },
        onUpdateSlider(values) {
            this.chartDomain = [...values];
        },
        getMaxRange() {
            if (this.data.length === 0) return 100;

            const start = this.data[0].startTime;
            return Math.max.apply(
                null,
                this.data.map(row => {
                    return row.elapsedTime + row.startTime - start;
                })
            );
        },
    },
    mounted() {
        // 현재 활성화 된 트랜잭션 인덱스와 차트 데이터 인덱스랑 다를 경우
        if (this.rowIndex !== this.maxIndex) {
            this.$emit('click', this.maxIndex);
        }
    },
};
</script>

<style lang="scss" scoped>
@import '../style/AsyncToolbar.scss';

.guid-chart {
    ::v-deep tr {
        cursor: default !important;
    }

    @include async-toolbar;
}
</style>
