<template>
    <base-window
        class="pie-chart-metrics"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.pieChart }} - {{ i18n.dbMetrics }}
        </template>
        <template #contents>
            <search-config-toolbar
                :title="title"
                :domain-group-title="domainGroupTitle"
                :build-day="buildDay"
                :build-time="buildTime"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                :check-manual-domain="checkManualDomain"
                :check-manual-day="checkManualDay"
                @show-config="() => (showBuildConfig = true)"
            ></search-config-toolbar>

            <config-toolbar @open-theme="onClickOpenTheme"></config-toolbar>

            <metrics-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :resource-tab="oidConfigMenu"
                :metrics-map="metricsMap"
                :metrics-multi-select="false"
                :active-group-data="groupData"
                :active-metrics="[metrics]"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
                @change-metrics="onChangeMetricsNodes"
            ></metrics-config>

            <message-bar :message="i18n.M0213"></message-bar>

            <build-config-window
                :parent-key="'title'"
                :parent-width="width"
                :parent-height="height"
                :title="title"
                :check-manual-domain="checkManualDomain"
                :check-manual-day="checkManualDay"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                @cancel="() => (showBuildConfig = false)"
                @apply="onApplyBuildConfigWindow"
                v-if="showBuildConfig"
            ></build-config-window>
        </template>
    </base-window>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import { OTypeDef } from '@common/definition';
import { BaseChart } from '../base/Base';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import MessageBar from '../base/ui/MessageBar';
import MetricsConfig from '../base/ui/MetricsConfig';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        MessageBar,
        MetricsConfig,
    },
    mixins: [BaseChart],
    props: {
        resourceList: {
            type: Array,
            required: true,
        },
        metricsMap: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState({
            id: state => state.id,
            title: state => state.title,
            checkManualDomain: state => state.checkManualDomain,
            checkManualDay: state => state.checkManualDay,
            buildTimeValue: state => state.buildTimeValue,
            runTimeValue: state => state.runTimeValue,

            groupData: state => state.groupData || '',
            oidConfigMenu: state => state.oidConfigMenu || 'domain',
            otype: state => state.otype || OTypeDef.SYSTEM,
            metrics: state => state.metrics || '',
        }),
    },
    data() {
        return {
            i18n: {
                menu: i18n.get('ui.label.menu'),
                dbMetrics: i18n.get('ui.title.dbmetrics'),
                pieChart: i18n.get('ui.title.report.piechart'),
                M0213: i18n.get('M0213'),
                M0268: i18n.get('M0268'),
                M0015: i18n.get('M0015'),
            },
            width: 866,
            height: 538,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.metrics === '') {
                this.alert(this.i18n.M0268);
                return false;
            }

            if (
                this.checkManualDomain &&
                (this.groupData === '' || this.groupData === '{}')
            ) {
                this.alert(this.i18n.M0015);
                return false;
            }

            this.setDataImage({
                type: 'pie',
                oidConfigMenu: this.oidConfigMenu,
                otype: this.otype,
            });

            return true;
        },
        onChangeResourceTab(tab) {
            this.setDataImage({
                oidConfigMenu: tab,
                otype: tab == 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM,
                metrics: '',
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeMetricsNodes(nodes) {
            this.setDataImage({
                metrics: nodes[0].value,
            });
        },
        onApplyBuildConfigWindow(config) {
            this.setDataImage(config);
            this.showBuildConfig = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.pie-chart-metrics {
    .config-toolbar,
    .message-bar,
    .metrics-config {
        margin-top: 8px;
    }
}
</style>
