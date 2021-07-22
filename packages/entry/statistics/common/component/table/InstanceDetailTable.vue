<template>
    <table class="table simple headline table-mode">
        <thead>
        <tr>
            <th>{{i18nTimeOrDate}}</th>
            <th v-for="column in columns">
                {{column.name}}
            </th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="data in dataList">
                <td>{{hourOrDate(data)}}</td>
                <td v-for="column in columns">
                    <div v-if="data[column.key] !== undefined">
                    {{data[column.key].toLocaleForAries()}}
                    </div>
                </td>
            </tr>
            <tr v-if="dataList.length === 0">
                <td class='none' :colspan="Object.keys(columns).length + 1">
                    <div class='msg'>
                        {{i18n.M0004}}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import { createNamespacedHelpers } from "vuex";
    import { MxDef } from "@common/definition";
    import { PAGE_TYPE } from "@entry/statistics/common/common";
    import { getDayjs, serverDateFormat } from "@common/base";

    const {mapGetters, mapState, mapMutations} = createNamespacedHelpers("statistics");

    export default {
        name: "instanceDetailTable",
        props: {
            dataList: {
                type: Array,
                required: true
            },
        },
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
                i18n: {
                    table: i18n.get('ui.label.table'),
                    chart: i18n.get('ui.label.chart'),
                    buttonCancel: i18n.get('ui.button.cancel'),
                    M0004: i18n.get('M0004'),

                },

                i18nTimeOrDate: (this.pageType === PAGE_TYPE.DAILY)? i18n.get('ui.label.time') : i18n.get('ui.label.date')
            }
        },
        methods: {
            hourOrDate(row) {
                let data;
                if (this.pageType === PAGE_TYPE.DAILY) data = row.time + ":00";
                else  data = getDayjs(row.date).format(serverDateFormat.short);

                return data;
            }
        },
        computed: {
            ...mapState({
                detailConditionByTarget : 'detailConditionByTarget',
            }),

            columns() {
                return this.detailConditionByTarget.viewMetricsArray.map(object => {
                    const key = Object.keys(MxDef).find(key => MxDef[key] === object.mxid);
                    return { key: key, name: i18n.get("ui.mx." + key) };
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    table {
        margin-top: 10px !important;

        tr > td:not(:first-child) {
            text-align: right;
        }
    }

</style>