<template>
    <base-window
        class="line-chart-metrics-comparison"
        :width="width"
        :height="height"
        :back-menu="backMenu"
        @home="onClickHomeBtn"
        @cancel="onClickCancelBtn"
        @apply="onClickSubmitBtn"
    >
        <template #subject>
            {{ i18n.lineChart }} - {{ i18n.compareMetrics }}
        </template>
        <template #contents>
            <search-config-toolbar
                :title="title"
                :domain-group-title="domainGroupTitle"
                :build-day="buildDay"
                :build-time="buildTime"
                :build-time-value="'1'"
                :run-time-value="runTimeValue"
                :check-manual-domain="true"
                :check-manual-day="true"
                @show-config="() => (showBuildConfig = true)"
            ></search-config-toolbar>

            <config-toolbar @open-theme="onClickOpenTheme"> </config-toolbar>

            <div class="search-condition">
                <div class="left">
                    <metrics-config
                        :check-manual-domain="true"
                        :resource-list="resourceList"
                        :resource-multi-select="false"
                        :resource-tab="oidConfigMenu"
                        :metrics-map="metricsMap"
                        :metrics-multi-select="false"
                        :active-group-data="groupData"
                        :active-metrics="[metrics]"
                        @change-tab="onChangeResourceTab"
                        @change-resource="onChangeResourceGroupData"
                        @change-metrics="onChangeMetricsNodes"
                    ></metrics-config>
                </div>

                <div class="d-day">
                    <div class="config-toolbar-text">{{ i18n.searchDate }}</div>
                    <format-number-input
                        small
                        :label="'D-'"
                        :width="70"
                        :min="1"
                        :max="30"
                        :step="1"
                        v-model="prevDay"
                    ></format-number-input>
                </div>

                <div class="center">
                    <btn
                        :items="[{ iconType: addIcon.type }]"
                        :tooltip-options="{ message: addIcon.message }"
                        @click.native="onClickAddCondition"
                    ></btn>
                </div>

                <div class="right">
                    <condition-list
                        :items="conditions"
                        @delete="onClickDeleteCondition"
                    ></condition-list>
                </div>
            </div>

            <message-bar :message="i18n.M0584"></message-bar>

            <build-config-window
                :parent-key="'title'"
                :parent-width="width"
                :parent-height="height"
                :title="title"
                :check-manual-domain="true"
                :check-manual-domain-disabled="true"
                :check-manual-day="true"
                :check-manual-day-hidden="true"
                :build-time-value="'1'"
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
import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import { i18n } from '@common/utility';
import { OTypeDef } from '@common/definition';
import { BaseChart } from '../base/Base';
import BaseWindow from '../../modal/BaseWindow';
import BuildConfigWindow from '../base/BuildConfigWindow';
import SearchConfigToolbar from '../base/ui/SearchConfigToolbar';
import ConfigToolbar from '../base/ui/ConfigToolbar';
import MessageBar from '../base/ui/MessageBar';
import ConditionList from '../base/ui/ConditionList';
import MetricsConfig from '../base/ui/MetricsConfig';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

const { mapState, mapMutations } = createNamespacedHelpers('template/modal');

export default {
    components: {
        BaseWindow,
        BuildConfigWindow,
        SearchConfigToolbar,
        ConfigToolbar,
        MessageBar,
        ConditionList,
        MetricsConfig,
        FormatNumberInput,
        Btn,
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
            // checkManualDomain: state => state.checkManualDomain,
            // checkManualDay: state => state.checkManualDay,
            // buildTimeValue: state => state.buildTimeValue,
            runTimeValue: state => state.runTimeValue,

            groupData: state => state.groupData || '',
            oidConfigMenu: state => state.oidConfigMenu || 'domain',
            metrics: state => state.metrics || '',
            previousDays: state => state.previousDays || [],
        }),
        conditions() {
            const format = 'YYYY-MM-DD';
            let now = startOfDayjs(getDayjs(), 'date');
            now = now.add(-1, 'day');

            return this.previousDays.map(delta => {
                const prev = now.clone().add(-delta, 'day');
                return {
                    title: `${prev.format(format)} (D-${delta})`,
                    key: delta,
                };
            });
        },
    },
    data() {
        return {
            i18n: {
                target: i18n.get('ui.label.target'),
                manual: i18n.get('ui.label.template.manual'),
                menu: i18n.get('ui.label.menu'),
                compareMetrics: i18n.get(
                    'ui.title.report.linechart.metrics.compare'
                ),
                lineChart: i18n.get('ui.title.report.linechart'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.apply'),
                addCondition: i18n.get('ui.label.addCondition'),
                searchDate: i18n.get('ui.label.search.date'),
                M0584: i18n.get('M0584'),
                M0014: i18n.get('M0014'),
                M0015: i18n.get('M0015'),
                M0586: i18n.get('M0586'),
                M0585: i18n.get('M0585'),
            },
            width: 966,
            height: 528,
            showBuildConfig: false,
            prevDay: 1,
            addIcon: {
                type: ICON_TYPE.arrowRight,
                message: i18n.get('ui.button.add'),
            },
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        beforeSubmit() {
            if (this.groupData == '' || this.groupData == '{}') {
                this.alert(this.i18n.M0015);
                return false;
            }

            if (this.metrics === '') {
                this.alert(this.i18n.M0014);
                return false;
            }

            if (this.previousDays.length == 0) {
                this.alert(this.i18n.M0586);
                return false;
            }

            this.setDataImage({
                type: 'line',
                oidConfigMenu: 'domain',
                otype: OTypeDef.SYSTEM,
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
        onClickAddCondition() {
            const previousDays = this.previousDays;

            if (previousDays.includes(this.prevDay)) {
                this.alert(this.i18n.M0585);
                return;
            }

            this.setDataImage({
                previousDays: [...previousDays, this.prevDay],
            });
        },
        onClickDeleteCondition(key) {
            const previousDays = this.previousDays.filter(day => day !== key);

            this.setDataImage({
                previousDays,
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
.line-chart-metrics-comparison {
    @import '../../../themes';
    @include themify($themes) {
        .config-toolbar,
        .message-bar,
        .search-condition {
            margin-top: 8px;
        }

        .config-toolbar-text {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 4px;
            color: themed('search-config-toolbar-font-color');
        }
    }

    @import '../../../style/search-condition';
    .search-condition {
        @include search-condition;

        > .d-day {
            left: 525px;
            top: 78px;
        }
        > .center {
            left: 605px !important;
        }
        > .right {
            width: calc(100% - 690px) !important;
        }
    }
}
</style>
