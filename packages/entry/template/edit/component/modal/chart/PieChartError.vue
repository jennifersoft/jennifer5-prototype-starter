<template>
    <base-window
        class="pie-chart-error"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject
            >{{ i18n.pieChart }} - {{ i18n.error }} ({{
                i18n.summary
            }})</template
        >
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

            <config-toolbar @open-theme="onClickOpenTheme">
                <label-with-dropdown
                    :label="i18n.label"
                    :items="groupList"
                    :selected-value="groupCondition"
                    :width="120"
                    @change="onChangeGroupCondition"
                ></label-with-dropdown>
            </config-toolbar>

            <error-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :resource-tab="oidConfigMenu"
                :active-group-data="groupData"
                :active-error="errorTypes"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
                @change-error="onChangeError"
            ></error-config>

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
import ErrorConfig from '../base/ui/ErrorConfig';
import LabelWithDropdown from '../base/ui/LabelWithDropdown';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        MessageBar,
        ErrorConfig,
        LabelWithDropdown,
    },
    mixins: [BaseChart],
    props: {
        resourceList: {
            type: Array,
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
            errorTypes: state => state.errorTypes || [],
            groupCondition: state => state.groupCondition || 'target',
        }),
    },
    data() {
        return {
            i18n: {
                label: i18n.get('ui.label.label.choice'),
                summary: i18n.get('ui.label.summary'),
                menu: i18n.get('ui.label.menu'),
                error: i18n.get('ui.label.error'),
                pieChart: i18n.get('ui.title.report.piechart'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0213: i18n.get('M0213'),
                M0021: i18n.get('M0021'),
                M0015: i18n.get('M0015'),
            },
            width: 966,
            height: 528,
            showBuildConfig: false,
            groupList: [
                { text: i18n.get('ui.label.target'), value: 'target' },
                { text: i18n.get('ui.label.error'), value: 'error' },
            ],
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.errorTypes.length == 0) {
                this.alert(this.i18n.M0021);
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
                groupCondition: this.groupCondition,
            });

            return true;
        },
        onChangeResourceTab(tab) {
            this.setDataImage({
                oidConfigMenu: tab,
                otype: tab == 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM,
            });
        },
        onChangeResourceGroupData(groupData) {
            this.setDataImage({
                groupData: groupData,
            });
        },
        onChangeError(nodes) {
            this.setDataImage({
                errorTypes: nodes.map(node => node.value),
            });
        },
        onChangeGroupCondition({ value }) {
            this.setDataImage({
                groupCondition: value,
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
.pie-chart-error {
    .config-toolbar,
    .error-config {
        margin-top: 8px;
    }
}
</style>
