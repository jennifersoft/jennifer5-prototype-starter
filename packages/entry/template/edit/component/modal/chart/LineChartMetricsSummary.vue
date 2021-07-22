<template>
    <base-window
        class="line-chart-metrics-summary"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject
            >{{ i18n.lineChart }} - {{ i18n.multiDomain }}
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

            <search-condition
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :metrics-map="metricsData"
                :metrics-multi-select="false"
                @change-resource="onChangeResourceGroupData"
            ></search-condition>

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
import { BaseChart } from '../base/Base';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import MessageBar from '../base/ui/MessageBar';
import SearchCondition from '../base/SearchCondition';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        MessageBar,
        SearchCondition,
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
        sumMetricsMap: {
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

            request: state => state.request,
        }),
    },
    data() {
        return {
            i18n: {
                menu: i18n.get('ui.label.menu'),
                multiDomain: i18n.get('ui.title.multiDomain'),
                lineChart: i18n.get('ui.title.report.linechart'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0213: i18n.get('M0213'),
                M0021: i18n.get('M0021'),
                M0260: i18n.get('M0260'),
            },
            metricsData: this.metricsMap,
            width: 1066,
            height: 528,
            showBuildConfig: false,
        };
    },
    watch: {
        metricsMap(newVal) {
            this.metricsData = newVal;
        },
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (!this.request || this.request.length == 0) {
                this.alert(this.i18n.M0021);
                return false;
            }

            this.setDataImage({ type: 'line' });
            return true;
        },
        onResetRequest() {
            this.alert(this.i18n.M0260);
            this.setDataImage({ request: [] });
        },
        onChangeResourceGroupData(groupStr) {
            if (this.checkManualDomain) {
                const oidCount = (groupStr.match(/,/g) || []).length + 1;
                this.metricsData =
                    oidCount == 1 ? this.metricsMap : this.sumMetricsMap;
            }
        },
        onApplyBuildConfigWindow(config) {
            if (config.checkManualDomain !== this.checkManualDomain)
                this.onResetRequest();

            this.setDataImage(config);
            this.showBuildConfig = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.line-chart-metrics-summary {
    .config-toolbar,
    .message-bar,
    .search-condition {
        margin-top: 8px;
    }
}
</style>
