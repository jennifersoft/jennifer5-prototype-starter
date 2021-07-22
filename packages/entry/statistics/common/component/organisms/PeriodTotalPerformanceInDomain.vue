<template>
    <section id="total-perf-in-domain">
        <h3>1. {{ i18n.totalPerformance }}</h3>
        <div class="chart-grid">
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.callCount }}</span>
                    <span>{{ totalDataInMonth.searchMonth.service_count | toLocaleString }}</span>
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
                        :axis-step="4"
                >
                    <tooltip :names="[]"
                             :show-anchor="false" />
                </graph-bar>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.visitCount }}</span>
                    <span>{{ totalDataInMonth.searchMonth.visit_day | toLocaleString }}</span>
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
                        :axis-step="4"
                >
                    <tooltip :names="[]"
                             :show-anchor="false" />
                </graph-bar>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.errorCount }}</span>
                    <span>{{ totalDataInMonth.searchMonth.error_count | toLocaleString }}</span>
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
                        :display="'max'"
                        :format="formatYAxis"
                        :axis-max="chart3Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-step="4"
                >
                    <tooltip :names="[]"
                             :show-anchor="false" />
                </graph-bar>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.serviceRate }}</span>
                    <span>{{ totalDataInMonth.searchMonth.service_rate | toLocaleString }}</span>
                </div>
                <graph-line
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart4Data"
                        :labels="labelsInHourOrDay"
                        :display="'max'"
                        :shape="'step'"
                        :focus-start="peakStartIndexInDay"
                        :focus-end="peakEndIndexInDay"
                        :format="formatYAxis"
                        :axis-max="chart4Data | getMaxFromValues"
                        :axis-reverse="false"
                        :axis-x-style="'none'"
                        :axis-step="4"
                >
                </graph-line>
            </div>

            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.responseTime }} ({{ i18n.ms }})</span>
                    <span>{{ totalDataInMonth.searchMonth.service_time | toLocaleString }}</span>
                </div>
                <graph-line
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart5Data"
                        :labels="labelsInHourOrDay"
                        :display="'max'"
                        :shape="'step'"
                        :focus-start="peakStartIndexInDay"
                        :focus-end="peakEndIndexInDay"
                        :format="formatYAxis"
                        :axis-max="chart5Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-step="4"
                >
                </graph-line>
            </div>
            <div class="chart-box">
                <div class="total selected">
                    <span>{{ i18n.concurrentUser }}</span>
                    <span>{{ totalDataInMonth.searchMonth.concurrent_user | toLocaleString }}</span>
                </div>
                <graph-line
                        class="chart"
                        :theme="theme"
                        :styles="styles"
                        :width="chartWidth"
                        :height="chartHeight"
                        :padding-left="40"
                        :padding-top="paddingTop"
                        :padding-right="chartPaddingRight"
                        :values="chart6Data"
                        :labels="labelsInHourOrDay"
                        :display="'max'"
                        :shape="'step'"
                        :focus-start="peakStartIndexInDay"
                        :focus-end="peakEndIndexInDay"
                        :format="formatYAxis"
                        :axis-max="chart6Data | getMaxFromValues"
                        :axis-x-style="'none'"
                        :axis-step="4"
                >
                </graph-line>
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
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { getDayjs } from '@common/base';
import ClassicTheme from '../../styles/chart-classic';
import DarkTheme from '../../styles/chart-dark';
import FilterMixin from "@entry/statistics/common/component/mixin/FormatMixin";

const { mapGetters, mapState } = createNamespacedHelpers('statistics');

export default {
    name: 'totalPerfChartInDomain',
    inject: {
        theme: {
            default: 'classic',
        },
    },
    mixins: [FilterMixin],
    components: {
        tooltip: VueTooltipWidget,
        'graph-bar': VueBarGraph,
        'graph-line': VueLineGraph,
        'graph-line-dateblock': VueLineDateBlockGraph,
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
            },
            chartTitleDy: 5,
        };
    },
    methods: {
        columnFillHandler(_, index) {
            const isPeakTime = index >= this.peakStartIndexInDay && index <= this.peakEndIndexInDay;
            return isPeakTime ? "#ff4f55" : "#49d484";
        },
    },
    computed: {
        ...mapGetters({
            totalData: 'totalData',
            peakData: 'peakData',
            searchCondition: 'searchCondition',
            searchTimeInPeriod: 'searchTimeInPeriod',
            peakDayTimestamp: 'peakDayTimestamp',
            summaryDataInMonthly: 'summaryDataInMonthly',
            totalDataInMonth: 'totalDataObjectInMonth'
        }),
        monthlyData() {
            return this.summaryDataInMonthly.chart;
        },
        peakStartIndexInHour() {
            return this.peakData.time - this.searchCondition.operateStartHour;
        },
        peakEndIndexInHour() {
            return (
                this.peakData.time - this.searchCondition.operateStartHour + 1
            );
        },
        peakStartIndexInDay() {
            const searchTime = this.searchTimeInPeriod;
            return this.peakDayTimestamp - searchTime.startTime === 0
                ? 0
                : Math.floor(
                      (this.peakDayTimestamp - searchTime.startTime) /
                          ClientUtilities.ONE_DAY
                  );
        },

        //@alvin한테 date-block과 다른 방식이라고 전달받은 값이 같아야함.
        peakEndIndexInDay() {
            return this.peakStartIndexInDay;
        },
        chart1Data() {
            return this.monthlyData.map(data => data.service_count);
        },
        chart2Data() {
            return this.monthlyData.map(data => data.visit_day);
        },
        chart3Data() {
            return this.monthlyData.map(data => data.error_count);
        },
        chart4Data() {
            return this.monthlyData.map(data => data.service_rate);
        },
        chart5Data() {
            return this.monthlyData.map(data => data.service_time);
        },
        chart6Data() {
            return this.monthlyData.map(data => data.concurrent_user);
        },
        labelsInHourOrDay() {
            const dayCount = Math.floor(
                    (this.searchTimeInPeriod.endTime.valueOf() -
                        this.searchTimeInPeriod.startTime.valueOf()) /
                        ClientUtilities.ONE_DAY
                );
            return Array.from(new Array(dayCount).keys()).map(day => {
                const timestamp =
                    this.searchTimeInPeriod.startTime +
                    day * ClientUtilities.ONE_DAY;
                return getDayjs(timestamp).format('MM-DD');
            });
        },
        countMonthlyData() {
            return this.monthlyData.length;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "~@entry/statistics/common/styles/chart-grid.scss";
.chart-grid {
    @include chart-grid(false);
}
</style>
