<template>
    <div class="stack-chart">
        <div
            :class="['chart-message', isHourly ? 'hourly' : '']"
            @click="onClickTotalCount"
        >
            {{ totalEventCount }}
        </div>

        <graph-stackbar
            :width="chartWidth"
            :height="chartHeight"
            :padding-top="40"
            :padding-bottom="30"
            :padding-left="60"
            :padding-right="30"
            :theme="theme"
            :names="stackNames"
            :labels="stackLabels"
            :values="stackValues"
            :axis-max="stackMaxValue"
            :axis-full-mode="true"
            :axis-x-style="'none'"
            :axis-y-style="'solid'"
            :axis-step="3"
            :text-rotate-x="textRotate"
            :show-text="true"
            :display="'max'"
            :bar-margin="3"
            :min-value="5"
            :active-event="'click'"
            :active-index="stackActiveIndex"
            :format="stackDataFormat"
            :styles="chartStyles"
            @click="onClickBar"
        >
            <tooltip :names="stackNames"></tooltip>
        </graph-stackbar>
    </div>
</template>

<script>
import GraphStackbar from 'vue-graph/src/components/stackbar';
import Tooltip from 'vue-graph/src/widgets/tooltip';

const CHART_STYLES = {
    classic: {
        colors: ['#497eff', '#fddd2f', '#ff4f55'],
        backgroundColor: 'transparent',
        gridXFontColor: '#212121',
        gridYFontColor: '#212121',
        gridXAxisBorderColor: '#e8e8e8',
        gridYAxisBorderColor: '#e8e8e8',
        gridBorderColor: '#f6f6f6',
        gridTickBorderSize: 0,
    },
    dark: {
        colors: ['#497eff', '#fddd2f', '#ff4f55'],
        backgroundColor: 'transparent',
        gridXFontColor: '#e8e8e8',
        gridYFontColor: '#e8e8e8',
        gridXAxisBorderColor: '#424242',
        gridYAxisBorderColor: '#424242',
        gridBorderColor: '#292929',
        gridTickBorderSize: 0,
    },
};
export default {
    inject: {
        theme: {
            default: 'classic',
        },
    },
    components: {
        GraphStackbar,
        Tooltip,
    },
    props: {
        stackNames: {
            type: Array,
            required: true,
        },
        stackLabels: {
            type: Array,
            required: true,
        },
        stackValues: {
            type: Array,
            required: true,
        },
        stackMaxValue: {
            type: Number,
            required: false,
            default: 100,
        },
        stackActiveIndex: {
            type: Number,
            required: false,
        },
        stackWidth: {
            type: Number,
            required: false,
        },
        isHourly: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        textRotate: function() {
            return !this.isHourly ? 20 : 0;
        },
    },
    watch: {
        stackValues: function() {
            // 전체 EVENT 개수 갱신하기
            this.totalEventCount = this.calcTotalEventCount();
        },
    },
    data: function() {
        return {
            totalEventCount: this.calcTotalEventCount(),
            chartWidth: 0,
            chartHeight: 230,
            chartStyles: CHART_STYLES[this.theme],
        };
    },
    methods: {
        onClickTotalCount: function() {
            if (!this.isHourly) {
                this.$emit('update#table', null, this.isHourly);
                this.$emit('reset#ratechart'); // 비율 차트 필터링 조건 초기화
            }
        },
        onClickBar: function(obj) {
            this.$emit('update#table', obj, this.isHourly);
            this.$emit('reset#ratechart'); // 비율 차트 필터링 조건 초기화
        },
        stackDataFormat: function(d) {
            if (typeof d === 'number') return d.toLocaleForAries();
            return d;
        },
        calcTotalEventCount: function(targets) {
            let sum = 0;

            if (this.stackValues && this.stackValues.length > 0) {
                if (!targets || targets.length == 0) {
                    targets = ['0', '1', '2'];
                }

                for (let i = 0; i < targets.length; i++) {
                    sum += this.stackValues[targets[i]].reduce(
                        (a, b) => a + b,
                        0
                    );
                }
            }

            return sum.toLocaleForAries();
        },
        getExpectedDailyChartLabel: function(index) {
            let label = this.stackLabels[index];

            if (label == '' && index % 2 != 0) {
                const prevLabel = this.stackLabels[index - 1];
                const tokens = prevLabel.split('-');
                const date = parseInt(tokens[1]) + 1;

                return `${tokens[0]}-${date < 10 ? `0${date}` : `${date}`}`;
            }

            return label || '';
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.stack-chart {
    @include themify($themes) {
        position: relative;
        .chart-message {
            position: absolute;
            cursor: pointer;
            top: 16px;
            right: 16px;
            z-index: 99;
            display: block;
            font-size: 11px;
            color: themed('chart-section-font-color');
            &.hourly {
                cursor: default;
            }
        }
    }
}
</style>
