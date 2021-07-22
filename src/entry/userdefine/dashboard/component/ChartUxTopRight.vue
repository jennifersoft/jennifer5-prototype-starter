<template>
    <div class="chart-ux-top-right">
        <topology-chart-ux
            v-if="chartOption.charttype === 'topology'"
            :data-key="dataKey"
        >
        </topology-chart-ux>

        <tooltip
            v-if="cautionTooltipMessage !== undefined"
            :width="200"
            :message="cautionTooltipMessage"
            :position="'bottom-right'"
        >
            <btn :items="[{ iconType: caution3Icon }]" class="border-none" />
        </tooltip>

        <div v-if="isXViewDashboard" class="realtime-xview-loading">
            <i class="icon-loading spin"></i>
        </div>
        <tooltip
            v-if="isEventChart"
            :message="eventIconType.tooltip"
            :position="'top-center'"
        >
            <btn
                class="border-none"
                @click="toggleEventShowType"
                :items="[{ iconType: eventIconType.iconType }]"
            />
        </tooltip>

        <tooltip
            v-if="isRuntimeLineChartAndCanMerge"
            :message="lineMergeIconType.tooltip"
            :position="'top-center'"
        >
            <btn
                class="border-none"
                @click="toggleLineMerge"
                :items="[{ iconType: lineMergeIconType.iconType }]"
            />
        </tooltip>

        <tooltip
            v-if="isActiveServiceEqualizerAndCanMerge"
            :message="eqMergeIconType.tooltip"
            :position="'top-center'"
        >
            <btn
                class="border-none"
                @click="toggleEqualizerMerge"
                :items="[{ iconType: eqMergeIconType.iconType }]"
            />
        </tooltip>

        <template v-if="isXView">
            <tooltip
                v-if="asyncCount > 0"
                :message="i18n.async"
                :position="'top-center'"
            >
                <btn
                    :class="{
                        'primary-reverse': filterAsyncCall,
                    }"
                    :items="[{ text: asyncCount.toLocaleForAries() }]"
                    @click="toggleFilterAsyncCall"
                    class="border-none"
                />
            </tooltip>
            <tooltip :message="i18n.numberOfPoints" :position="'top-center'">
                <btn
                    :class="{
                        'primary-reverse': filterTransaction,
                    }"
                    :items="[{ text: numberOfPoints.toLocaleForAries() }]"
                    @click="toggleFilterTransaction"
                    class="border-none"
                />
            </tooltip>

            <tooltip :message="i18n.configViewPoint" :position="'top-center'">
                <dropdown-composed
                    ref="yAxisBtn"
                    :button-options="{
                        iconType: yAxisIcon,
                        position: 'left',
                    }"
                    small
                >
                    <popup-list
                        :items="yAxisTypes"
                        :active-index.sync="yAxisIndex"
                        @update:active-index="clickOnYAxisIndex"
                        type="icon"
                    />
                    <popup-list
                        class="auto-max-list"
                        :items="autoMaxOptions"
                        :active-index.sync="autoMaxOptionsSelect"
                        @update:active-index="clickOnAutoMax"
                        type="switch"
                    />
                </dropdown-composed>
            </tooltip>
        </template>

        <tooltip
            v-if="isHeapMemoryUsedAndRuntimeLine"
            :message="i18n.gc"
            :position="'top-center'"
        >
            <dropdown
                :display-row-count="4"
                small
                @unfold="gcUnfold"
                :button-options="{ iconType: gcIcon, position: 'bottom-left' }"
                :items="instanceList"
                @onchange="commitGC"
            />
        </tooltip>

        <tooltip :message="i18n.more" :position="'top-center'">
            <dropdown-composed
                ref="moreBtn"
                small
                :button-options="{
                    iconType: moreHorizonIcon,
                    position: 'left',
                }"
            >
                <popup-list
                    :items="items"
                    @update:active-index="clickOnCommon"
                />
                <popup-list
                    v-if="isXViewDashboard"
                    :items="checkOptions"
                    :active-index.sync="checkOptionsSelect"
                    @update:active-index="clickOnXView"
                    type="switch"
                />
            </dropdown-composed>
        </tooltip>
    </div>
</template>

<script>
import { checkPermission, i18n } from '@common/utility';
import { MxDef, PermissionDef } from '@common/definition';
import { UIManager } from '@common/legacy/UIManager';
import { Observer } from '@common/legacy/Observer';
import {
    ChartKeywordInObserver,
    XViewChartKeywordInObserver,
} from '@common/ObserverKeyword';
import { METRICS_CAN_MERGED_IN_RUNTIME_LINE } from '@module/chart/config/ChartRenderConst';
import { mapActions, mapMutations, mapState } from 'vuex';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import TopologyChartUx from '@entry/userdefine/dashboard/component/TopologyChartUx';
import DropdownComposed from '@vuejs/component/Dropdown/DropdownComposed';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { server } from '@common/base';
import { AbstractModel } from '@module/chart/model/AbstractModel';
import { ID } from '@common/legacy/ID';
import { gcCommitAgent } from '@entry/userdefine/dashboard/http';

export default {
    components: {
        TopologyChartUx,
        Tooltip,
        Dropdown,
        DropdownComposed,
        PopupList,
        Btn,
    },

    inject: {
        i18n: {
            default: {
                exportCanvas: i18n.get('ui.label.export.canvas'),
                frontChartTooltip: i18n.get('ui.front.chart.tooltip'),
                M458: i18n.get('M458'),
                chartPopup: i18n.get('ui.label.chartPopup'),
                realtimeMonitoring: i18n.get('ui.label.realtimeMonitoring'),
                setting: i18n.get('ui.label.setting'),
                load: i18n.get('ui.button.load'),
                autoPlacement: i18n.get('ui.button.autoPlacement'),
                displayName: i18n.get('ui.label.displayName'),
                edit: i18n.get('ui.label.node.show.hidden'),
                more: i18n.get('ui.label.more'),
                configViewPoint: i18n.get('ui.label.viewpoint.config'),
                numberOfPoints: i18n.get('ui.label.numberOfPoints'),

                M0308: i18n.get('M0308'),
                M0399: i18n.get('M0399'),
                M0450: i18n.get('M0450'),
                M0449: i18n.get('M0449'),
                M0453: i18n.get('M0453'),
                M0452: i18n.get('M0452'),
                M0451: i18n.get('M0451'),
                M0473: i18n.get('M0473'),
            },
        },
    },
    props: {
        chartOption: {
            type: Object,
            required: true,
        },
        dataKey: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            EXCLUDE_CHARTTYPE_POPUP: [
                'topology',
                'line.perf',
                'xview.analysis',
            ],

            EXCLUDE_CHARTTYPE_SCREENSHOT: ['line.perf', 'xview.analysis'],
            isMergedLineMode: false,
            isListRenderMode: false,
            isDomainViewOnActiveServiceEQ: false,
            autoMaxOptions: [
                {
                    text: i18n.get('ui.label.autoMax'),
                    value: 'autoMax',
                },
            ],
            autoMaxOptionsSelect: [false],
            checkOptions: [
                {
                    text: i18n.get('ui.label.showOnlyException2'),
                    value: 'errCode',
                },
                {
                    text: i18n.get('ui.label.showBigX'),
                    value: 'bigX',
                },
            ],
            checkOptionsSelect: [false, false],

            yAxisIndex: 0,
            yAxisValue: 'elapsedTime',
            yAxisTypes: [
                {
                    text: i18n.get('ui.label.responseTime'),
                    value: 'elapsedTime',
                },
                {
                    text: i18n.get('ui.label.sqlTime'),
                    value: 'sqlTime',
                },
                {
                    text: i18n.get('ui.label.fetchTime'),
                    value: 'fetchTime',
                },
                {
                    text: i18n.get('ui.label.txcallTime'),
                    value: 'txcallTime',
                },
                {
                    text: i18n.get('ui.label.cpuTime'),
                    value: 'cpuTime',
                },
            ],
            numberOfPoints: 0,
            asyncCount: 0,
            instanceList: [],
            gcCommitMessage: undefined,
            filterAsyncCall: false,
            filterTransaction: false,
        };
    },
    methods: {
        ...mapActions('dashboard', [
            'showOnlyErrorInXView',
            'showOnlyAsyncInXView',
            'showOnlyTransactionInXView',
            'showDeployInXView',
            'updateYAxisInXView',
            'updateAutoMaxYAxisInXView',
        ]),
        ...mapMutations('dashboard', ['setGcContextMenu']),

        gcUnfold(unfold) {
            if (unfold) {
                const keys = this.$parent.getIds();

                this.instanceList = keys
                    ? keys.map(key => {
                          const agent = AbstractModel.getAgentById(key);
                          return {
                              text: agent.name(),
                              value: agent.agent,
                              key: key,
                          };
                      })
                    : [];
            }
        },
        commitGC({ text, value, key }) {
            const id = ID.parse(key);
            const params = {
                sid: id.sid,
                agent: id.oid,
            };

            gcCommitAgent(params).then(r =>
                console.log(
                    `gc commit => sid: ${params.sid}, oid : ${params.agent}`
                )
            );

            const gcCommitMessage = text + ' - ' + this.i18n.gc;
            this.$emit('chart:message', gcCommitMessage);
        },
        realtimePopup() {
            //xview.dashboard 이면서 배치잡이 아닐때
            if (this.isXViewDashboard)
                UIManager.realtimePopup('/realtime/xview', 1024, 768);
            else if (this.isConcurrentOrVisitHourInMetrics)
                UIManager.realtimePopup('/realtime/user', 1024, 768);
        },
        toggleLineMerge() {
            Observer.emit(
                ChartKeywordInObserver.TOGGLE_LINE_MERGE + this.dataKey
            );
        },
        toggleEqualizerMerge() {
            Observer.emit(
                ChartKeywordInObserver.TOGGLE_VIEW_DOMAIN_EQUALIZER +
                    this.dataKey
            );
        },
        toggleEventShowType() {
            Observer.emit(
                ChartKeywordInObserver.TOGGLE_EVENT_LIST + this.dataKey
            );
        },
        toggleFilterAsyncCall() {
            this.filterAsyncCall = !this.filterAsyncCall;
            this.showOnlyAsyncInXView({
                chartKey: this.dataKey,
                showOnly: this.filterAsyncCall,
            });
            this.filterTransaction = false;
            this.showOnlyTransactionInXView({
                chartKey: this.dataKey,
                showOnly: this.filterTransaction,
            });
        },
        toggleFilterTransaction() {
            //ARIES-10305 async가 있을때만 버튼 토글 되게함.
            if (this.asyncCount > 0) {
                this.filterTransaction = !this.filterTransaction;
                this.showOnlyTransactionInXView({
                    chartKey: this.dataKey,
                    showOnly: this.filterTransaction,
                });
                this.filterAsyncCall = false;
                this.showOnlyAsyncInXView({
                    chartKey: this.dataKey,
                    showOnly: this.filterAsyncCall,
                });
            }
        },
        clickOnYAxisIndex(index) {
            const item = this.yAxisTypes[index];
            const chartKey = this.dataKey;
            this.updateYAxisInXView({
                chartKey,
                yAxisType: item.value,
            });
            this.yAxisValue = item.value;
            this.$refs.yAxisBtn.close();
        },
        clickOnAutoMax(checkOptionsSelect) {
            const chartKey = this.dataKey;
            const useAutoMax = checkOptionsSelect[0];
            this.updateAutoMaxYAxisInXView({ chartKey, useAutoMax });
        },
        clickOnCommon(index) {
            const item = this.items[index];

            if (item.value === 'realtime-popup') {
                this.realtimePopup();
            } else if (item.value === 'chart-popup') {
                this.$emit('chart:popup');
            } else if (item.value === 'chart-export') {
                this.$emit('chart:export');
            }

            this.$refs.moreBtn.close();
        },
        clickOnXView(checkOptionsSelect) {
            const chartKey = this.dataKey;
            this.showOnlyErrorInXView({
                chartKey,
                showOnly: checkOptionsSelect[0],
            });
            localStorage.setItem(
                XViewChartKeywordInObserver.BIG_X_POINT_IN_DASHBOARD,
                checkOptionsSelect[1] + ''
            );
            this.showDeployInXView({
                chartKey,
                showDeploy: checkOptionsSelect[2],
            });
        },
    },
    computed: {
        ...mapState('dashboard', ['topbar', 'gcContextMenu']),

        isXViewDashboard() {
            return this.chartOption.charttype === 'xview.dashboard';
        },
        isXView() {
            return this.chartOption.charttype.includes('xview');
        },
        isHeapMemoryUsedAndRuntimeLine() {
            return (
                this.chartOption.charttype === 'line.runtime' &&
                this.chartOption.metrics === MxDef.heap_used
            );
        },
        isConcurrentOrVisitHourInMetrics() {
            return (
                this.chartOption.metrics === MxDef.concurrent_user ||
                this.chartOption.metrics === MxDef.visit_hour
            );
        },
        isEventChart() {
            return this.chartOption.charttype === 'event';
        },

        isRuntimeLineChartAndCanMerge() {
            //ARIES-5360, JQA-343
            return (
                this.chartOption.charttype === 'line.runtime' &&
                METRICS_CAN_MERGED_IN_RUNTIME_LINE.includes(
                    this.chartOption.metrics
                ) &&
                this.isMultiTarget
            );
        },

        isActiveServiceEqualizerAndCanMerge() {
            return (
                this.chartOption.charttype === 'equalizer' &&
                this.chartOption.pkey === 'active_service' &&
                this.chartOption.domainBarSync &&
                this.topbar?.multiinstance
            );
        },

        isMultiTarget() {
            if (this.chartOption.domainBarSync) {
                return this.topbar?.multidomain || this.topbar?.multiinstance;
            }
            return true;
        },

        isRecentGcTimeDetail() {
            return this.chartOption.pkey === 'recent_gc_time_detail';
        },

        isRecentHeapDetailUsage() {
            return this.chartOption.pkey === 'recent_heap_detail_usage';
        },

        isAreaChartOrBarDailyChart() {
            return (
                this.chartOption.charttype === 'area' ||
                this.chartOption.charttype === 'column.daily'
            );
        },

        cautionTooltipMessage() {
            if (this.isAreaChartOrBarDailyChart) return this.i18n.M0399;
            else if (this.isRecentGcTimeDetail) return this.i18n.M0473;
            else if (this.isRecentHeapDetailUsage) return this.i18n.M0451;
            else return undefined;
        },

        items() {
            const items = [];

            // 토폴로지 대시보드(토폴로지, X-View), 리얼타임이벤트, 리얼타임메니져 는 제외
            if (this.isXViewDashboard || this.isConcurrentOrVisitHourInMetrics)
                items.push({
                    text: this.i18n.realtimeMonitoring,
                    value: 'realtime-popup',
                });

            if (
                !this.EXCLUDE_CHARTTYPE_POPUP.includes(
                    this.chartOption.charttype
                )
            ) {
                items.push({
                    text: this.i18n.chartPopup,
                    value: 'chart-popup',
                });
            }

            if (
                !this.EXCLUDE_CHARTTYPE_SCREENSHOT.includes(
                    this.chartOption.charttype
                )
            ) {
                items.push({
                    text: this.i18n.exportCanvas,
                    value: 'chart-export',
                });
            }
            return items;
        },
        lineMergeIconType() {
            if (this.isMergedLineMode) {
                return {
                    iconType: this.lineSeparateIcon,
                    tooltip: this.i18n.M0453,
                };
            } else {
                return {
                    iconType: this.lineMergeIcon,
                    tooltip: this.i18n.M0452,
                };
            }
        },
        eqMergeIconType() {
            if (this.isDomainViewOnActiveServiceEQ) {
                return {
                    iconType: this.lineSeparateIcon,
                    tooltip: this.i18n.M0676,
                };
            } else {
                return {
                    iconType: this.lineMergeIcon,
                    tooltip: this.i18n.M0675,
                };
            }
        },
        eventIconType() {
            if (this.isListRenderMode) {
                return {
                    iconType: this.menu2Icon,
                    tooltip: this.i18n.M0450,
                };
            } else {
                return {
                    iconType: this.listIcon,
                    tooltip: this.i18n.M0449,
                };
            }
        },
    },

    created() {
        this.MxDef = MxDef;
        this.UIManager = UIManager;
        this.moreHorizonIcon = ICON_TYPE.moreHorizon;
        this.caution3Icon = ICON_TYPE.caution3;
        this.lineMergeIcon = ICON_TYPE.lineMerge;
        this.lineSeparateIcon = ICON_TYPE.lineSeparate;
        this.listIcon = ICON_TYPE.list;
        this.menu2Icon = ICON_TYPE.grid;
        this.yAxisIcon = ICON_TYPE.yAxis;
        this.gcIcon = ICON_TYPE.gc;

        if (
            server.platform !== 'php' &&
            checkPermission(PermissionDef.SHOW_DEPLOY_IN_XVIEW)
        ) {
            this.checkOptions.push({
                text: i18n.get('ui.label.showDeployData'),
                value: 'deployData',
            });
            this.checkOptionsSelect.push(true);
        }

        this.checkOptionsSelect[1] =
            localStorage.getItem(
                XViewChartKeywordInObserver.BIG_X_POINT_IN_DASHBOARD
            ) === 'true';
    },

    mounted() {
        if (this.isRuntimeLineChartAndCanMerge) {
            Observer.on(
                ChartKeywordInObserver.TOGGLE_LINE_MERGE + this.dataKey,
                () => {
                    this.isMergedLineMode = !this.isMergedLineMode;
                }
            );
        }
        if (this.isActiveServiceEqualizerAndCanMerge) {
            Observer.on(
                ChartKeywordInObserver.TOGGLE_VIEW_DOMAIN_EQUALIZER +
                    this.dataKey,
                () => {
                    this.isDomainViewOnActiveServiceEQ = !this
                        .isDomainViewOnActiveServiceEQ;
                }
            );
        }
        if (this.isEventChart) {
            Observer.on(
                ChartKeywordInObserver.TOGGLE_EVENT_LIST + this.dataKey,
                () => {
                    this.isListRenderMode = !this.isListRenderMode;
                }
            );
        }

        if (this.isXView) {
            Observer.on(
                XViewChartKeywordInObserver.NUMBER_OF_POINT_WITH_CHARTKEY(
                    this.dataKey
                ),
                (totalCount, asyncCount) => {
                    this.numberOfPoints = totalCount - asyncCount;
                    this.asyncCount = asyncCount;
                }
            );

            if (this.chartOption.viewpoint) {
                const index = this.yAxisTypes.findIndex(
                    item => item.value === this.chartOption.viewpoint
                );

                if (index > -1) this.yAxisIndex = index;
            }
        }
    },
};
</script>
<style lang="scss" scoped>
.chart-ux-top-right {
    display: flex;
    flex-direction: row;

    @import 'themes.scss';
    .icon {
        &:not(.icon-caution) {
            cursor: pointer;
        }

        @include themify($themes) {
            color: themed('chart-interaction-icon-color');
            &:hover {
                color: themed('chart-interaction-icon-hover-color');
            }
        }
    }

    @import '~@vuejs/component/themes.scss';
    .count {
        padding: 0 8px;
        z-index: 20;
        font-size: 11px;
        @include themify($themes) {
            color: themed('typography-color-grey1');

            &:hover {
                color: themed('typography-color-primary');
            }
        }
    }

    ::v-deep .aries-ui-btn {
        z-index: 20;
    }

    ::v-deep .popup-list-group {
        z-index: 100;
    }

    ::v-deep .auto-max-list {
        > li {
            > span {
                margin-left: 24px;
            }
        }
    }
}
</style>
