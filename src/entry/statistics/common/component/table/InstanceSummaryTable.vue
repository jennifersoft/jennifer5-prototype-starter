<template>
    <div class="section">
        <table class="table simple headline">
            <caption>{{title }}</caption>
            <thead>
            <tr>
                <th v-for="column in columns">
                    {{column.name}}
                </th>
            </tr>

            </thead>
            <tbody>
            <tr v-for="(row, rowIndex) in dataList">
                <td v-for="(column, columnIndex) in columns" >
                    <div v-if="column.key === 'name'">
                        {{row[column.key]}}
                    </div>
                    <div v-else>
                        {{row[column.key].toLocaleForAries()}}
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "instanceSummaryTable",
        props: {
            title: {
                type: String,
                required: true
            },
            dataList: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                columns : [
                    {key: "name", name: i18n.get("ui.label.target")},
                    {key: "service_count", name: i18n.get("ui.mx.service_count")},
                    {key: "service_time", name: i18n.get("ui.mx.service_time")},
                    {key: "service_rate", name: i18n.get("ui.mx.service_rate")},
                    {key: "concurrent_user", name: i18n.get("ui.mx.concurrent_user")},
                    {key: "event_count", name: i18n.get("ui.mx.event_count")},
                    {key: "error_count", name: i18n.get("ui.mx.error_count")},
                ]
            }
        },

    };
</script>

<style lang="scss" scoped>
    div.section {
        margin-bottom: 20px;
    }
    table {
        min-width: 730px;

        caption {
            margin-bottom: 8px;
            margin-top: 15px;
            font-size: 12px;
            font-weight: bold;
            text-align: left;
        }
        tr > td:not(:first-child) {
            text-align: right;
        }
    }
</style>