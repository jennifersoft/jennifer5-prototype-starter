<template>
    <table class="table simple stripeless chart-mode">
        <thead>
            <tr>
                <th width="15%"></th>
                <th v-for="hour in columns">
                    {{ hour }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows">
                <td>{{ row.name }}</td>
                <td :colspan="columns.length">
                    <div
                        v-if="pageType === PAGE_TYPE.DAILY"
                        class="inner-chart"
                    >
                        <!-- 세로 점선과 max값이 안나온다. -->
                        <graph-area-dateblock
                            v-if="row.type === 'line'"
                            :theme="theme"
                            :height="60"
                            :padding-bottom="0"
                            :padding-top="0"
                            :padding-left="0"
                            :padding-right="0"
                            :format="formatYAxis"
                            :axis-reverse="false"
                            :axis-x-style="'hidden'"
                            :axis-y-style="'hidden'"
                            :axis-format="'HH:mm'"
                            :axis-interval="1000 * 60 * 60"
                            :axis-max="
                                Math.max(...fiveMinValues(row.key)) * 1.45
                            "
                            :colors="getColors('areaBorderColor')"
                            :display="'max'"
                            :labels="areaChartHourIndex"
                            :values="fiveMinValues(row.key)"
                        ></graph-area-dateblock>
                        <graph-bar
                            v-else-if="row.type === 'column'"
                            :theme="theme"
                            :styles="getBarStyles()"
                            :colors="getColors('columnBgColor')"
                            :height="60"
                            :padding-bottom="0"
                            :padding-top="0"
                            :padding-left="0"
                            :padding-right="0"
                            :format="formatYAxis"
                            :axis-reverse="false"
                            :axis-x-style="'hidden'"
                            :axis-y-style="'hidden'"
                            :axis-format="'HH:mm'"
                            :axis-interval="1000 * 60 * 60"
                            :axis-max="
                                Math.max(...oneHourValues(row.key)) * 1.45
                            "
                            :bar-margin="0"
                            :bar-padding="0"
                            :display="'max'"
                            :labels="columns"
                            :values="oneHourValues(row.key)"
                        ></graph-bar>
                    </div>
                    <div v-else class="inner-chart">
                        <!-- 세로 점선과 max값이 안나온다. -->
                        <graph-area
                            v-if="row.type === 'line'"
                            :theme="theme"
                            :height="60"
                            :padding-bottom="0"
                            :padding-top="0"
                            :padding-left="0"
                            :padding-right="0"
                            :format="formatYAxis"
                            :axis-full-mode="false"
                            :axis-reverse="false"
                            :axis-x-style="'hidden'"
                            :axis-y-style="'hidden'"
                            :axis-format="'HH:mm'"
                            :axis-interval="1000 * 60 * 60 * 24"
                            :shape="'step'"
                            :colors="getColors('areaBorderColor')"
                            :display="'max'"
                            :axis-max="
                                Math.max(...valueInMonthly(row.key)) * 1.45
                            "
                            :labels="columns"
                            :values="valueInMonthly(row.key)"
                        ></graph-area>
                        <graph-bar
                            v-else-if="row.type === 'column'"
                            :theme="theme"
                            :styles="getBarStyles()"
                            :colors="getColors('columnBgColor')"
                            :height="60"
                            :padding-bottom="0"
                            :padding-top="0"
                            :padding-left="0"
                            :padding-right="0"
                            :format="formatYAxis"
                            :axis-reverse="false"
                            :axis-x-style="'hidden'"
                            :axis-y-style="'hidden'"
                            :axis-format="'HH:mm'"
                            :axis-interval="1000 * 60 * 60"
                            :bar-margin="0"
                            :bar-padding="0"
                            :axis-max="
                                Math.max(...valueInMonthly(row.key)) * 1.45
                            "
                            :display="'max'"
                            :labels="columns"
                            :values="valueInMonthly(row.key)"
                        ></graph-bar>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { MxDef } from '@common/definition';
import { i18n } from '@common/utility';
import { getDayjs } from '@common/base';
import VueAreaBlockGraph from 'vue-graph/src/components/area';
import VueAreaDateBlockGraph from 'vue-graph/src/components/area-dateblock';
import VueBarGraph from 'vue-graph/src/components/bar';
import { PAGE_TYPE } from '@entry/statistics/common/common';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'statistics'
);

const JUI_CHART_COLOR = {
    classic: {
        columnBgColor: '#D0CFF3',
        columnBorderColor: '#7977C2',
        gridBorderColor: '#ccc',
        areaBgColor: '#7BB9E7',
        areaBorderColor: '#7BBAE7',
    },
    dark: {
        columnBgColor: '#433769',
        columnBorderColor: '#8f7ade',
        gridBorderColor: '#3d3d3d',
        areaBgColor: '#7BB9E7',
        areaBorderColor: '#7BBAE7',
    },
};

export default {
    name: 'instanceDetailChart',
    inject: {
        theme: {
            default: 'classic',
        },
        pageType: {
            default: PAGE_TYPE.DAILY,
        },
    },
    props: {
        dataFiveMin: {
            type: Array,
            required: false,
        },
        dataOneHour: {
            type: Array,
            required: false,
        },
        dataInMonthly: {
            type: Array,
            required: false,
        },
    },
    components: {
        'graph-area': VueAreaBlockGraph,
        'graph-area-dateblock': VueAreaDateBlockGraph,
        'graph-bar': VueBarGraph,
    },
    data() {
        return {
            areaChartHourIndex: [
                new Date('2019-01-01 00:00:00'),
                new Date('2019-01-02 00:00:00'),
            ],
            PAGE_TYPE: PAGE_TYPE,
        };
    },
    methods: {
        formatYAxis(value) {
            return typeof value === 'number' ? value.toLocaleForAries() : value;
        },

        fiveMinValues(key) {
            return this.dataFiveMin.map(object => object[key] || 0);
        },

        oneHourValues(key) {
            return this.dataOneHour.map(object => object[key] || 0);
        },

        valueInMonthly(key) {
            return this.dataInMonthly.map(object => object[key] || 0);
        },

        getColors(type) {
            return [JUI_CHART_COLOR[this.theme][type]];
        },

        getBarStyles() {
            return {
                barBorderColor: JUI_CHART_COLOR[this.theme].columnBorderColor,
                barBorderWidth: 1,
                barBorderOpacity: 1,
            };
        },
    },
    computed: {
        ...mapState({
            detailConditionByTarget: 'detailConditionByTarget',
        }),

        ...mapGetters({
            searchCondition: 'searchCondition',
        }),

        columns() {
            let data;
            if (this.pageType === PAGE_TYPE.DAILY) {
                const startHour = this.searchCondition.operateStartHour,
                    endHour = this.searchCondition.operateEndHour;

                data = Array.from(Array(endHour - startHour).keys()).map(
                    num => num + 1 + startHour
                );
            } else if (this.pageType === PAGE_TYPE.MONTHLY) {
                data = Array.from(Array(this.dataInMonthly.length).keys()).map(
                    num => num + 1
                );
            } else if (this.pageType === PAGE_TYPE.PERIOD) {
                data = this.dataInMonthly.map(data =>
                    getDayjs(data.date).format('MM-DD')
                );
            }

            return data;
        },

        rows() {
            return this.detailConditionByTarget.viewMetricsArray.map(object => {
                const key = Object.keys(MxDef).find(
                    key => MxDef[key] === object.mxid
                );
                return {
                    key: key,
                    name: i18n.get('ui.mx.' + key),
                    type: object.type,
                };
            });
        },
    },
};
</script>
<style lang="scss" scoped>
table > thead > tr {
    > th {
        text-align: right !important;
    }
}

table > tbody > tr {
    > td:last-child {
        padding: 0px !important;
    }
}
</style>
