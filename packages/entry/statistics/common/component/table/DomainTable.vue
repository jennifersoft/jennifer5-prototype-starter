<template>
    <div id="inst_summary_total">
        <table class="table simple headline stripeless">
            <thead>
            <tr>
                <th v-for="column in columnsByPageType">
                    {{column.name}}
                </th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in dataListByPageType">
                    <td v-for="(column, columnIndex) in columnsByPageType" >
                        <div v-if="rowIndex === 0 && column.key !== 'compareDate'" >
                            {{row[column.key].toLocaleForAries()}}
                        </div>
                        <div v-else-if="column.key !== 'compareDate'">
                            <div v-if="comparedValue(row[column.key], currentValue(column.key)) > 0" class='plus'>
                                <i class='icon-arrow3'></i>
                                {{ Math.abs(Math.floor(comparedValue(row[column.key], currentValue(column.key))))}}% ({{row[column.key].toLocaleForAries()}})
                            </div>
                            <div v-else-if="comparedValue(row[column.key], currentValue(column.key)) < 0" class='minus'>
                                <i class='icon-arrow1'></i>
                                {{ Math.abs(Math.floor(comparedValue(row[column.key], currentValue(column.key))))}}% ({{row[column.key].toLocaleForAries()}})
                            </div>
                            <div v-else>
                                {{ Math.abs(Math.floor(comparedValue(row[column.key], currentValue(column.key))))}}% ({{row[column.key].toLocaleForAries()}})
                            </div>
                        </div>
                        <div v-else>
                            {{row[column.key]}}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from "vuex";
    import { i18n } from "@common/utility";
    import { PAGE_TYPE } from "@entry/statistics/common/common";

    const {mapGetters, mapState} = createNamespacedHelpers("statistics");

    export default {
        name: "domainTable",
        inject: {
            theme: {
                default: 'classic',
            },
            pageType: {
                default: PAGE_TYPE.DAILY
            },
        },
        data() {
            return {
                columns : [
                    {key: "compareDate", name: i18n.get("ui.label.compareDate")},
                    {key: "service_count", name: i18n.get("ui.mx.service_count")},
                    {key: "service_time", name: i18n.get("ui.mx.service_time")},
                    {key: "service_rate", name: i18n.get("ui.mx.service_rate")},
                    {key: "max_tps", name: i18n.get("ui.mx.max_tps")},
                    {key: "concurrent_user", name: i18n.get("ui.mx.concurrent_user")},
                    {key: "error_count", name: i18n.get("ui.mx.error_count")},
                    {key: "visit_day", name: i18n.get("ui.mx.visit_day")}
                ],
                columnsInMonthly : [
                    {key: "compareDate", name: i18n.get("ui.label.compareDate")},
                    {key: "total_service_count", name: i18n.get("ui.label.cumulativeCalls")},
                    {key: "service_count", name: i18n.get("ui.mx.service_count")},
                    {key: "service_time", name: i18n.get("ui.mx.service_time")},
                    {key: "service_rate", name: i18n.get("ui.mx.service_rate")},
                    {key: "max_tps", name: i18n.get("ui.mx.max_tps")},
                    {key: "concurrent_user", name: i18n.get("ui.mx.concurrent_user")},
                    {key: "error_count", name: i18n.get("ui.mx.error_count")},
                    {key: "visit_day", name: i18n.get("ui.mx.visit_day")},
                    {key: "total_visit_day", name: i18n.get("ui.label.visitor.total")},
                ]
            }
        },
        methods: {
            comparedValue : (prev, next) => {
                const per = ((next - prev) / prev) * 100;

                return (isNaN(per))? 0 : per;
            },
            todayValue(key) {
                return this.totalData.todayWithOperateTime[key]
            },

            selectMonthValue(key) {
                return this.totalDataListInMonth[0][key];
            },

            currentValue(key) {
                if (this.pageType === PAGE_TYPE.DAILY) return this.todayValue(key);
                else return this.selectMonthValue(key);
            },

        },
        computed: {
            ...mapGetters({
                totalData: 'totalData',
                totalDataListInMonth: 'totalDataListInMonth'
            }),

            columnsByPageType() {
                if (this.pageType === PAGE_TYPE.DAILY) return this.columns;
                else return this.columnsInMonthly;
            },

            dataListByPageType() {
                if (this.pageType === PAGE_TYPE.DAILY) return this.dataList;
                else return this.dataListInMonthly;
            },

            dataList() {
                return this.totalData.total.map((row, rowIndex) => {
                    //비교 날짜 컬럼 텍스트
                    if (rowIndex === 0) row.compareDate = i18n.get("ui.label.time.selectedDay");
                    else if (rowIndex === 1) row.compareDate = i18n.get("M0433") + '(' + i18n.get("ui.label.value") + ')';
                    else if (rowIndex === 2) row.compareDate = i18n.get("M0432") + '(' + i18n.get("ui.label.value") + ')';

                    return row;
                });
            },

            dataListInMonthly() {
                return this.totalDataListInMonth.map((row, rowIndex) => {
                    //비교 날짜 컬럼 텍스트
                    if (rowIndex === 0) row.compareDate = i18n.get("ui.label.time.selectedMonth");
                    else if (rowIndex === 1) row.compareDate = i18n.get("M0431") + '(' + i18n.get("ui.label.value") + ')';

                    return row;
                });
            },
        }
    }

</script>
<style lang="scss" scoped>
    table tr > td:not(:first-child) {
        text-align: right;

        .plus {
            color: #fe3b4d;
        }

        .minus {
            color: #0081ff;
        }
    }
</style>