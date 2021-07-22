<template>
    <section id="total-perf-in-domain">
        <h3>1. {{ i18n.totalPerformance }}</h3>
        <div class="chart-grid">
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.callCount }}</span>
                    <span>{{ totalData.todayWithOperateTime.service_count | toLocaleString }}</span>
                </div>
                <graph-bar
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :colors="columnFillHandler"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart1Data"
                        :labels="labelsInHourOrDay"
                        :display="'max'"
                        :format="formatYAxis"
                        :axis-max="chart1Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-full-mode="true"
                        :axis-step="4"
                >
                    <tooltip :names="[]" :show-anchor="false" />
                </graph-bar>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.service_count, totalData.todayWithOperateTime.service_count)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.service_count | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.service_count, totalData.todayWithOperateTime.service_count)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.service_count | toLocaleString }}</span>
                </div>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.visitCount }}</span>
                    <span>{{ totalData.todayWithOperateTime.visit_day | toLocaleString }}</span>
                </div>
                <graph-bar
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :colors="columnFillHandler"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart2Data"
                        :labels="labelsInHourOrDay"
                        :display="'max'"
                        :format="formatYAxis"
                        :axis-max="chart2Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-full-mode="true"
                        :axis-step="4"
                >
                    <tooltip :names="[]" :show-anchor="false" />
                </graph-bar>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.visit_day, totalData.todayWithOperateTime.visit_day)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.visit_day | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.visit_day, totalData.todayWithOperateTime.visit_day)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.visit_day | toLocaleString }}</span>
                </div>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.errorCount }}</span>
                    <span>{{ totalData.todayWithOperateTime.error_count | toLocaleString }}</span>
                </div>
                <graph-bar
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :colors="columnFillHandler"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart3Data"
                        :labels="labelsInHourOrDay"
                        :axis-full-mode="true"
                        :display="'max'"
                        :format="formatYAxis"
                        :axis-max="chart3Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-step="4"
                >
                    <tooltip :names="[]" :show-anchor="false" />
                </graph-bar>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.error_count, totalData.todayWithOperateTime.error_count)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.error_count | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.error_count, totalData.todayWithOperateTime.error_count)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.error_count | toLocaleString }}</span>
                </div>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.serviceRate }}</span>
                    <span>{{ totalData.todayWithOperateTime.service_rate | toLocaleString }}</span>
                </div>
                <graph-line-dateblock
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart4Data"
                        :labels="lineChartHourIndex"
                        :display="'max'"
                        :focus-start="peakStartIndexIn5Min"
                        :focus-end="peakEndIndexIn5Min"
                        :format="formatYAxis"
                        :axis-reverse="false"
                        :axis-format="formatXAxis"
                        :axis-max="chart4Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-interval="1000 * 60 * 60 * 2"
                        :axis-step="2"
                >
                </graph-line-dateblock>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.service_rate, totalData.todayWithOperateTime.service_rate)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.service_rate | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.service_rate, totalData.todayWithOperateTime.service_rate)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.service_rate | toLocaleString }}</span>
                </div>
            </div>

            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.responseTime }} ({{ i18n.ms }})</span>
                    <span>{{ totalData.todayWithOperateTime.service_time | toLocaleString }}</span>
                </div>
                <graph-line-dateblock
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-right="chartPaddingRight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :values="chart5Data"
                        :labels="lineChartHourIndex"
                        :display="'max'"
                        :focus-start="peakStartIndexIn5Min"
                        :focus-end="peakEndIndexIn5Min"
                        :format="formatYAxis"
                        :axis-max="chart5Data | getMaxFromValues"
                        :axis-reverse="false"
                        :axis-format="formatXAxis"
                        :axis-x-style="'none'"
                        :axis-interval="1000 * 60 * 60 * 2"
                        :axis-step="4"
                >
                </graph-line-dateblock>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.service_time, totalData.todayWithOperateTime.service_time)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.service_time | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.service_time, totalData.todayWithOperateTime.service_time)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.service_time | toLocaleString }}</span>
                </div>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.concurrentUser }}</span>
                    <span>{{ totalData.todayWithOperateTime.concurrent_user | toLocaleString }}</span>
                </div>
                <graph-line-dateblock
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart6Data"
                        :labels="lineChartHourIndex"
                        :display="'max'"
                        :focus-start="peakStartIndexIn5Min"
                        :focus-end="peakEndIndexIn5Min"
                        :format="formatYAxis"
                        :axis-max="chart6Data | getMaxFromValues"
                        :axis-reverse="false"
                        :axis-format="formatXAxis"
                        :axis-x-style="'none'"
                        :axis-interval="1000 * 60 * 60 * 2"
                        :axis-step="4"
                >
                </graph-line-dateblock>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.previousDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.yesterdayWithOperateTime.concurrent_user, totalData.todayWithOperateTime.concurrent_user)" />
                    </div>
                    <span>{{ totalData.yesterdayWithOperateTime.concurrent_user | toLocaleString }}</span>
                </div>
                <div class="total compared">
                    <div class="values">
                        <span>{{ i18n.lastweekSameDay }}</span>
                        <delta-percentage :delta="comparedValue(totalData.lastweekdayWithOperateTime.concurrent_user, totalData.todayWithOperateTime.concurrent_user)" />
                    </div>
                    <span>{{ totalData.lastweekdayWithOperateTime.concurrent_user | toLocaleString }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import { i18n } from '@common/utility';
import VueTooltipWidget from 'vue-graph/src/widgets/tooltip';
import VueBarGraph from 'vue-graph/src/components/bar';
import VueLineGraph from 'vue-graph/src/components/line';
import VueLineDateBlockGraph from 'vue-graph/src/components/line-dateblock';
import DeltaPercentage from "@entry/statistics/common/component/extra/DeltaPercentage";
import ClassicTheme from '../../styles/chart-classic';
import DarkTheme from '../../styles/chart-dark';
import FormatMixin from "@entry/statistics/common/component/mixin/FormatMixin";

const { mapGetters, mapState } = createNamespacedHelpers('statistics');

export default {
    name: 'totalPerfChartInDomain',
    inject: {
        theme: {
            default: 'classic',
        },
    },
    mixins: [FormatMixin],
    components: {
        tooltip: VueTooltipWidget,
        'graph-bar': VueBarGraph,
        'graph-line': VueLineGraph,
        'graph-line-dateblock': VueLineDateBlockGraph,
        DeltaPercentage,
    },
    props: {
        chartWidth: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        const styles = this.theme === 'classic' ? ClassicTheme : DarkTheme;

        return {
            // TODO: injection하기
            i18n: {
                totalPerformance: i18n.get('ui.label.totalPerformance'),
                serviceRate: i18n.get('ui.label.serviceRate'),
                responseTime: i18n.get('ui.label.responseTime'),
                concurrentUser: i18n.get('ui.label.concurrentUser'),
                M0432: i18n.get('M0432'),
                M0433: i18n.get('M0433'),
                previousDay: i18n.get('ui.label.time.previousDay'),
                lastweekSameDay: i18n.get('ui.label.time.lastweekSameDay'),
                callCount: i18n.get('ui.label.callCount'),
                visitCount: i18n.get('ui.label.visitor.daily'),
                errorCount: i18n.get('ui.label.errorCount'),
                ms: i18n.get('ui.label.unit.ms'),
            },
            paddingTop: 20,
            chartPaddingRight: 20,
            chartHeight: 160,
            chartNoteFontSize: 12,
            styles: {
                ...styles.component(),
                backgroundColor: 'transparent',
            },
            chartTitleDy: 5,
        };
    },
    methods: {
        columnFillHandler(_, index) {
            const isPeakTime = index >= this.peakStartIndexInHour && index < this.peakEndIndexInHour;
            return isPeakTime ? "#ff4f55" : "#49d484";
        },
    },
    computed: {
        ...mapGetters({
            totalData: 'totalData',
            peakData: 'peakData',
            searchCondition: 'searchCondition',
            searchTimeInDaily: 'searchTimeInDaily',
        }),
        peakStartIndexInHour() {
            return this.peakData.time - this.searchCondition.operateStartHour;
        },
        peakEndIndexInHour() {
            return (
                this.peakData.time - this.searchCondition.operateStartHour + 1
            );
        },
        peakStartIndexIn5Min() {
            return this.peakStartIndexInHour * 12;
        },
        peakEndIndexIn5Min() {
            return this.peakEndIndexInHour * 12;
        },
        lineChartHourIndex() {
            return this.searchTimeInDaily.startDateAndEndDate;
        },
        dailyDataInHour() {
            return this.totalData.chartHour;
        },
        dailyDataIn5min() {
            return this.totalData.chart5Min;
        },
        chart1Data() {
            return this.dailyDataInHour.map(data => data.service_count);
        },
        chart2Data() {
            return this.dailyDataInHour.map(data => data.visit_hour);
        },
        chart3Data() {
            return this.dailyDataInHour.map(data => data.error_count);
        },
        chart4Data() {
            return this.dailyDataIn5min.map(data => data.service_rate);
        },
        chart5Data() {
            return this.dailyDataIn5min.map(data => data.service_time);
        },
        chart6Data() {
            return this.dailyDataIn5min.map(data => data.concurrent_user);
        },
        labelsInHourOrDay() {
            return Array.from(
                new Array(
                    this.searchCondition.operateEndHour -
                    this.searchCondition.operateStartHour +
                    1
                ).keys()
            ).map(index =>
                (index + this.searchCondition.operateStartHour) % 2 === 0
                    ? (index + this.searchCondition.operateStartHour)
                        .toString()
                        .padStart(2, '0')
                    : ''
            );
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~@entry/statistics/common/styles/chart-grid.scss";
.chart-grid {
    @include chart-grid;
}
</style>
