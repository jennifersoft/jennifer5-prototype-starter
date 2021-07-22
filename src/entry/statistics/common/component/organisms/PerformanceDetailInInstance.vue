<template>
    <section id="perf-detail-in-instance">
        <h3>3. {{i18n.title}} ({{i18n.time}})</h3>
        <div v-for="(tableData, index) in tableDataArray">
            <h4>{{names[index]}}</h4>
            <instance-detail-chart v-if="viewChart"
                                   :data-five-min="chartData5Min[index]"
                                   :data-one-hour="chartData1Hour[index]"
                                   :data-in-monthly="chartDataInMonthly[index]" />
            <instance-detail-table v-if="viewTable"
                                   :data-list="tableData" />
        </div>
    </section>
</template>

<script>
    import VueInstanceDetailTable from "@entry/statistics/common/component/table/InstanceDetailTable";
    import InstanceDetailChart from "@entry/statistics/common/component/chart/InstanceDetailChart";
    import { createNamespacedHelpers } from "vuex";
    import { OTypeDef } from "@common/definition";
    import { PAGE_TYPE } from "@entry/statistics/common/common";

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('statistics');

    export default {
        name: "performanceDetailInInstance",
        inject: {
            theme: {
                default: 'classic',
            },
            pageType: {
                default: PAGE_TYPE.DAILY
            },
            otype: {
                default: OTypeDef.SYSTEM,
            },
        },
        components: {
            InstanceDetailChart,
            "instanceDetailTable": VueInstanceDetailTable,
        },
        computed: {
            ...mapState({
                detailConditionByTarget: 'detailConditionByTarget',
            }),

            ...mapGetters({
                searchCondition: 'searchCondition',
                peakData: 'peakData',
                detailData: 'detailData',
            }),

            names() {
                return this.searchCondition.names;
            },

            viewTable() {
                return this.detailConditionByTarget.viewTable
            },

            viewChart() {
                return this.detailConditionByTarget.viewChart
            },

            tableDataArray() {
                let data;
                if (this.pageType === PAGE_TYPE.DAILY) data = this.detailData.table.one_hour;
                else  data = this.detailData.one_day;

                return data;
            },

            chartData5Min() {
                return (this.detailData.chart)? this.detailData.chart.five_min : [];
            },

            chartData1Hour() {
                return (this.detailData.chart)? this.detailData.chart.one_hour : [];
            },

            chartDataInMonthly() {
                return (this.detailData.one_day)? this.detailData.one_day: [];
            },

        },
        data() {
            return {
                i18n: {
                    time: (this.pageType === PAGE_TYPE.DAILY)? i18n.get('ui.label.perHourly'): i18n.get('ui.label.perDaily'),
                    title: (this.otype === OTypeDef.BUSINESS)? i18n.get('ui.label.businessPerformanceDetail') : i18n.get('ui.label.instancePerformanceDetail'),
                },

                themes: {
                    classic: {
                        columnBgColor: "#D0CFF3",
                        columnBorderColor: "#7977C2",
                        gridBorderColor: "#ccc",
                        areaBgColor: "#7BB9E7",
                        areaBorderColor: "#7BBAE7"
                    },
                    dark: {
                        columnBgColor: "#433769",
                        columnBorderColor: "#8f7ade",
                        gridBorderColor: "#3d3d3d",
                        areaBgColor: "#7BB9E7",
                        areaBorderColor: "#7BBAE7"
                    }
                },
                PAGE_TYPE: PAGE_TYPE
            }
        },
    };
</script>

<style lang="scss" scoped>
    h4 {
        margin-top: 36px !important;
        margin-bottom: 10px !important;
    }

    .classic {
        h4 {
            color: #333 !important;
        }
    }

    .dark {
        h4 {
            color: #d5d5d5 !important;
        }
    }

</style>