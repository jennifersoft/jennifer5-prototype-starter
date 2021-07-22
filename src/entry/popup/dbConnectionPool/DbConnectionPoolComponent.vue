<template>
    <div class="db-connection-pool-component">
        <div class="header">{{ instanceName }}{{ stringWhetherIsJMX }}</div>
        <chart-component
            :chart-option="item"
            :show-interaction-component="false"
        ></chart-component>
    </div>
</template>

<script>
import ChartComponent from '@entry/userdefine/dashboard/component/ChartComponent';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { OTypeDef, PTypeDef } from '@common/definition';

export default {
    name: 'DbConnectionPoolComponent',
    components: {
        ChartComponent,
    },
    props: {
        instanceName: {
            type: String,
            required: true,
            default: '',
        },
        isJmx: {
            type: Boolean,
            required: true,
        },
        sid: {
            type: Number,
            required: true,
        },
        oid: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            item: {
                charttype: 'equalizer.dbcon',
                datatype: 'dbconnectionPool',
                domainBarSync: false,
                i18nTitle: 'ui.label.dbconnection',
                title: i18n.get('ui.label.dbconnection'),
                metrics: 0,
                otype: OTypeDef.SYSTEM,
                ptype: PTypeDef.MISC,
                pkey: 'db_connection_detail',
            },
        };
    },
    computed: {
        stringWhetherIsJMX() {
            return this.isJmx ? '(JMX)' : '';
        },
    },
    created() {
        this.item.sid = [this.sid];
        this.item.oid = [this.oid];
    },
    async mounted() {
        DashboardChartHandler.socketUseCheckInit();
    },
};
</script>
<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        font-color: #232323,
    ),
    dark: (
        border-color: #4e4e4e,
        font-color: #d3d3d3,
    ),
);

.db-connection-pool-component {
    height: 100%;

    .header {
        margin: 20px;
        @include themify($themes) {
            color: themed('font-color');
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid themed('border-color');
        }
    }

    ::v-deep .chart-component {
        position: relative;
        box-shadow: none;
        margin: 20px;
        height: calc(100% - 90px);
    }
}
</style>
