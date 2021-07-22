<template>
    <section id="perf-summary-in-instance">
        <h3>2. {{title}} </h3>
        <div v-if="pageType === PAGE_TYPE.DAILY">
            <instance-summary-table :title="i18n.chapter1InDaily"
                                    :dataList="summaryData.operateTime" />
            <instance-summary-table :title="i18n.chapter2InDaily"
                                    :dataList="summaryData.peakTime" />
        </div>
        <div v-else>
            <instance-summary-table :title="i18n.chapter1InMonthly"
                                    :dataList="summaryDataInMonthly.peakday" />
        </div>
    </section>
</template>
<script>
    import VueInstanceSummaryTable from "@entry/statistics/common/component/table/InstanceSummaryTable";
    import { createNamespacedHelpers } from "vuex";
    import { OTypeDef } from "@common/definition";
    import { PAGE_TYPE } from "@entry/statistics/common/common";

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('statistics');

    export default {
        name: "performanceSummaryInInstance",
        inject: {
            theme: {
                default: 'classic',
            },
            pageType: {
                default: PAGE_TYPE.DAILY
            },
            otype: {
                default: OTypeDef.SYSTEM
            }
        },
        components: {
            "instance-summary-table": VueInstanceSummaryTable,
        },
        data() {
            return {
                i18n: {
                    instancePerformanceSummary: i18n.get('ui.label.instancePerformanceSummary'),
                    businessPerformanceSummary: i18n.get('ui.label.businessPerformanceSummary'),
                    chapter1InDaily: "2-1. " + i18n.get("ui.label.operatingTime"),
                    chapter2InDaily: "2-2. " + i18n.get("ui.label.peakTime"),
                    chapter1InMonthly: i18n.get("ui.label.peakDay"),

                },
                dataList: [],
                paddingTop: 20,
                //X축 24시간 표현을 위해 픽스
                //hourIndex: [ new Date("2019-01-01 00:00:00"), new Date("2019-01-02 00:00:00") ]
                barChartHourIndex: Array.from(new Array(25).keys()).map(index => (index % 2 === 0 )? index+"" : ""),
                lineChartHourIndex: [new Date("2019-01-01 00:00:00"), new Date("2019-01-02 00:00:00")],
                PAGE_TYPE: PAGE_TYPE,
            }
        },
        computed: {
            ...mapGetters({
                searchCondition: 'searchCondition',
                summaryData: 'summaryData',
                summaryDataInMonthly: 'summaryDataInMonthly',
            }),

            title() {
                return (this.otype === OTypeDef.BUSINESS)? this.i18n.businessPerformanceSummary : this.i18n.instancePerformanceSummary;
            }
        },
        methods: {

        }
    };
</script>

<style scoped>

</style>