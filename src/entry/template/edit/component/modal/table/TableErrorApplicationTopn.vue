<template>
    <base-window
        class="table-error-application-topn"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.table }} - {{ i18n.dberrorService }} ({{ i18n.topn }})
        </template>
        <template #contents>
            <search-config-toolbar
                :max-row="maxRow"
                :domain-group-title="domainGroupTitle"
                :build-day="buildDay"
                :build-time="buildTime"
                :build-time-value="buildTimeValue"
                :run-time-value="runTimeValue"
                :check-manual-domain="checkManualDomain"
                :check-manual-day="checkManualDay"
                @show-config="() => (showBuildConfig = true)"
            ></search-config-toolbar>

            <config-toolbar :is-chart="false">
                <format-number-input
                    small
                    :label="`${i18n.error} ${i18n.topn}`"
                    :value="errorTopN"
                    :width="130"
                    :min="5"
                    :max="100"
                    :step="5"
                    @input="onChangeErrorTopN"
                ></format-number-input>

                <format-number-input
                    small
                    class="last"
                    :label="`${i18n.application} ${i18n.topn}`"
                    :value="applicationTopN"
                    :width="185"
                    :min="5"
                    :max="100"
                    :step="5"
                    @input="onChangeApplicationTopN"
                ></format-number-input>
            </config-toolbar>

            <oid-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="true"
                :resource-tab="oidConfigMenu"
                :active-group-data="groupData"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
            ></oid-config>

            <build-config-window
                :parent-key="'maxRow'"
                :parent-width="width"
                :parent-height="height"
                :maxRow="maxRow"
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
import { BaseTable } from '../base/Base';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import OidConfig from '../base/ui/OidConfig';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        OidConfig,
        FormatNumberInput,
    },
    mixins: [BaseTable],
    props: {
        resourceList: {
            type: Array,
            required: true,
        },
    },
    computed: {
        ...mapState({
            id: state => state.id,
            maxRow: state => state.maxRow,
            checkManualDomain: state => state.checkManualDomain,
            checkManualDay: state => state.checkManualDay,
            buildTimeValue: state => state.buildTimeValue,
            runTimeValue: state => state.runTimeValue,

            groupData: state => state.groupData || '',
            oidConfigMenu: state => state.oidConfigMenu || 'domain',
            otype: state => state.otype || OTypeDef.SYSTEM,
            errorTopN: state => state.errorTopN || 5,
            applicationTopN: state => state.applicationTopN || 5,
        }),
    },
    data() {
        return {
            i18n: {
                dberrorService: i18n.get('ui.title.dberror.application'),
                error: i18n.get('ui.label.error'),
                application: i18n.get('ui.label.application'),
                table: i18n.get('ui.label.table'),
                topn: i18n.get('ui.label.topn'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                M0213: i18n.get('M0213'),
                M0015: i18n.get('M0015'),
            },
            width: 966,
            height: 482,
            showBuildConfig: false,
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (
                this.checkManualDomain &&
                (this.groupData === '' || this.groupData === '{}')
            ) {
                this.alert(this.i18n.M0015);
                return false;
            }

            this.setDataImage({
                type: 'table',
                oidConfigMenu: this.oidConfigMenu,
                otype: this.otype,
                errorTopN: this.errorTopN,
                applicationTopN: this.applicationTopN,
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
        onChangeErrorTopN(value) {
            this.setDataImage({
                errorTopN: value,
            });
        },
        onChangeApplicationTopN(value) {
            this.setDataImage({
                applicationTopN: value,
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
.table-error-application-topn {
    .config-toolbar,
    .oid-config {
        margin-top: 8px;
    }

    ::v-deep .aries-ui-format-number-input.last {
        margin-left: 4px;
    }
}
</style>
