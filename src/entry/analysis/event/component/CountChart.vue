<template>
    <div class="count-chart">
        <div class="left">
            <stack-chart
                :key="dailyChartSequence"
                :stack-names="dailyChartNames"
                :stack-labels="dailyChartLabels"
                :stack-values="dailyChartValues"
                :stack-max-value="dailyChartMaxValue"
                :stack-active-index="dailyChartActiveIndex"
                :is-hourly="false"
                @update#table="onClickForDetailTable"
                @reset#ratechart="onResetForRateChart"
            ></stack-chart>
        </div>
        <div class="right" v-if="isActiveHourlyChart">
            <stack-chart
                :stack-names="hourlyChartNames"
                :stack-labels="hourlyChartLabels"
                :stack-values="hourlyChartValues"
                :stack-max-value="hourlyChartMaxValue"
                :stack-active-index="hourlyChartActiveIndex"
                :is-hourly="true"
                @update#table="onClickForDetailTable"
                @reset#ratechart="onResetForRateChart"
            ></stack-chart>
        </div>
    </div>
</template>

<script>
import StackChart from './StackChart';
import { i18n } from '@common/utility';
import { ClientUtilities } from '@common/legacy/ClientUtilities';

export default {
    components: {
        StackChart,
    },
    props: {
        dailyChartNames: {
            type: Array,
            required: false,
            default: null,
        },
        dailyChartLabels: {
            type: Array,
            required: false,
            default: null,
        },
        dailyChartValues: {
            type: Array,
            required: false,
            default: null,
        },
        dailyChartMaxValue: {
            type: Number,
            required: false,
            default: 100,
        },
        dailyChartActiveIndex: {
            type: Number,
            required: false,
        },
        hourlyChartNames: {
            type: Array,
            required: false,
            default: null,
        },
        hourlyChartLabels: {
            type: Array,
            required: false,
            default: null,
        },
        hourlyChartValues: {
            type: Array,
            required: false,
            default: null,
        },
        hourlyChartMaxValue: {
            type: Number,
            required: false,
            default: 100,
        },
        hourlyChartActiveIndex: {
            type: Number,
            required: false,
        },
        isActiveHourlyChart: {
            type: Boolean,
            required: false,
        },
    },
    computed: {
        colors: function() {
            if (this.themeName == 'dark') {
                return [
                    '#8f7ade',
                    '#4692ca',
                    '#f2ab14',
                    '#ff7800',
                    '#87bb66',
                    '#1da8a0',
                    '#929292',
                    '#839cb5',
                    '#0298d5',
                    '#fa5559',
                    '#f5a397',
                    '#06d9b6',
                    '#c6a9d9',
                    '#6e6afc',
                    '#e3e768',
                    '#c57bc3',
                ];
            }

            return null;
        },
    },
    data() {
        return {
            dailyChartSequence: 1,
        };
    },
    watch: {
        isActiveHourlyChart() {
            this.dailyChartSequence += 1;
        },
    },
    methods: {
        getExpectedDailyChartLabel: function(index) {
            let label = this.dailyChartLabels[index];

            if (label == '' && index % 2 != 0) {
                const prevLabel = this.dailyChartLabels[index - 1];
                const tokens = prevLabel.split('-');
                const date = parseInt(tokens[1]) + 1;

                return `${tokens[0]}-${date < 10 ? `0${date}` : `${date}`}`;
            }

            return label || '';
        },
        onClickForDetailTable: function(obj, isHourly) {
            this.$emit('update#table', obj, isHourly);
        },
        onResetForRateChart: function() {
            this.$emit('reset#ratechart'); // 비율 차트 필터링 조건 초기화
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.count-chart {
    @include themify($themes) {
        display: flex;
        > div {
            flex: 1;
            &.right {
                border-left: 1px solid themed('common-border-color');
            }
        }
    }
}
</style>
