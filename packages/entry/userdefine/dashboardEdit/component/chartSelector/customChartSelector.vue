<template>
    <div class="chart-box">
        <div>
            <div
                @click="onClickChart('equalizer')"
                :data-tooltip-text="i18nMessage.charttype.equalizer"
                v-click-outside="hideEqualizerDropdown"
                :class="{ choose: isChoose('equalizer') }"
                class="chart-thumbnail"
            >
                <i class="equalizer" />
                <div class="selected-text">{{ keywordEqualizer }}</div>
                <dropdown
                    ref="equalizerChartTypeList"
                    :items="equalizerTypes"
                    :hide-selected-text="true"
                    class="size-small chart-configure-dropdown"
                    style="position: absolute;left: 1px; bottom: 1px; z-index: 20;"
                    @onchange="onClickEqualizerChartType"
                >
                </dropdown>
            </div>
            <div
                @click="onClickChart('list.activeservice')"
                :data-tooltip-text="i18nMessage.charttype.listActiveService"
                v-click-outside="hideActiveServiceListDropdown"
                :class="{ choose: isChoose('list.activeservice') }"
                class="chart-thumbnail"
            >
                <i class="list-activeservice" />
                <div class="selected-text">{{ keywordList }}</div>
                <dropdown
                    ref="listChartTypeList"
                    :items="listActiveserviceTypes"
                    :hide-selected-text="true"
                    class="size-small chart-configure-dropdown"
                    style="position: absolute;left: -50px; bottom: 1px; z-index: 20;"
                    @onchange="onClickListChartType"
                >
                </dropdown>
            </div>
            <div
                @click="onClickChart('xview.dashboard')"
                :data-tooltip-text="i18nMessage.charttype.xview"
                v-click-outside="hideXViewDropdown"
                :class="{ choose: isChoose('xview.dashboard') }"
                class="chart-thumbnail"
            >
                <i class="xview" />
                <div class="selected-text">{{ keywordXView }}</div>
                <dropdown
                    ref="xviewChartTypeList"
                    :items="xviewTypes"
                    :hide-selected-text="true"
                    class="size-small chart-configure-dropdown"
                    style="position: absolute;right: 1px; bottom: 1px; z-index: 20;"
                    @onchange="onClickXViewChartType"
                >
                </dropdown>
            </div>
            <div
                @click="onClickChart('event')"
                :data-tooltip-text="i18nMessage.charttype.event"
                :class="{ choose: isChoose('event') }"
                class="chart-thumbnail"
            >
                <i class="event" />
            </div>
            <div
                @click="onClickChart('speedhorizon')"
                :data-tooltip-text="i18nMessage.charttype.speedBar"
                :class="{ choose: isChoose('speedhorizon') }"
                class="chart-thumbnail"
            >
                <i class="speedhorizon" />
            </div>
            <div
                @click="onClickChart('speedvertical')"
                :data-tooltip-text="i18nMessage.charttype.speedMeter"
                :class="{ choose: isChoose('speedvertical') }"
                class="chart-thumbnail"
            >
                <i class="speedvertical" />
            </div>
            <div
                @click="onClickChart('scoreboard')"
                :data-tooltip-text="i18nMessage.charttype.scoreboard"
                :class="{ choose: isChoose('scoreboard') }"
                class="chart-thumbnail"
            >
                <i class="scoreboard" />
            </div>
            <div
                @click="onClickChart('line.compare')"
                :data-tooltip-text="i18nMessage.charttype.lineBase"
                :class="{ choose: isChoose('line.compare') }"
                class="chart-thumbnail"
            >
                <i class="line-compare" />
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { PTypeDef } from '@common/definition';
import clickOutside from '@vuejs/directive/clickOutside';
const {
    mapGetters,
    mapState,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('userdefine');

import Dropdown from '@vuejs/component/Dropdown/Dropdown';

export default {
    name: 'customChartSelector',
    inject: {
        i18nMessage: {
            charttype: {
                area: {
                    default: 'area',
                },
                bar: {
                    default: 'bar',
                },
                equalizer: {
                    default: 'equalizer',
                },
                event: {
                    default: 'event',
                },
                lineBase: {
                    default: 'line.base',
                },
                lineRuntime: {
                    default: 'line.runtime',
                },
                line24Hour: {
                    default: 'line.24Hour',
                },
                line24HourPerHour: {
                    default: 'line.24Hour.per.hour',
                },
                listActiveService: {
                    default: 'list.activeService',
                },
                speedBar: {
                    default: 'speedBar',
                },
                speedMeter: {
                    default: 'speedMeter',
                },
                scoreboard: {
                    default: 'scoreboard',
                },
                xview: {
                    default: 'x-view',
                },
            },
        },
    },
    directives: {
        clickOutside,
    },
    components: {
        Dropdown,
    },
    data() {
        return {
            selectedEqualierIndex: 0,
            selectedEqualierValue: 'active_service',
            equalizerTypes: [
                {
                    text: 'ActiveService',
                    value: 'active_service',
                    pkey: 'active_service',
                    keyword: 'AS',
                },
                {
                    text: 'CPU',
                    value: 'sys_cpu_by_section',
                    pkey: 'sys_cpu_by_section',
                    keyword: 'CPU',
                },
                {
                    text: 'DB Connection',
                    value: 'db_connection',
                    pkey: 'db_connection',
                    keyword: 'DB',
                },
            ],
            selectedListIndex: 0,
            listActiveserviceTypes: [
                {
                    text: i18n.get('ui.label.activeService'),
                    value: 'active_service_list',
                    persepective: 'active_service_list',
                    keyword: 'AS',
                },
                {
                    text: i18n.get('ui.label.activeSql'),
                    value: 'active_sql_list',
                    persepective: 'active_sql_list',
                    keyword: 'SQL',
                },
                {
                    text: i18n.get('ui.label.activeTxcall'),
                    value: 'active_excall_list',
                    persepective: 'active_excall_list',
                    keyword: 'EXTERNAL',
                },
            ],
            selectedXViewIndex: 0,
            xviewTypes: [
                {
                    text: i18n.get('ui.label.responseTime'),
                    value: 'elapsedTime',
                    viewpoint: 'elapsedTime',
                    keyword: 'RES',
                },
                {
                    text: i18n.get('ui.label.sqlTime'),
                    value: 'sqlTime',
                    viewpoint: 'sqlTime',
                    keyword: 'SQL',
                },
                {
                    text: i18n.get('ui.label.fetchTime'),
                    value: 'fetchTime',
                    viewpoint: 'fetchTime',
                    keyword: 'FETCH',
                },
                {
                    text: i18n.get('ui.label.txcallTime'),
                    value: 'txcallTime',
                    viewpoint: 'txcallTime',
                    keyword: 'EXTERNAL',
                },
                {
                    text: i18n.get('ui.label.cpuTime'),
                    value: 'cpuTime',
                    viewpoint: 'cpuTime',
                    keyword: 'CPU',
                },
            ],
            fontSizeArray: Array.from(new Array(6).keys()).map(num => {
                const size = num + 10;
                const row = {};
                row.text = size;
                row.value = size;

                return row;
            }),

            isShowEqualizerTypes: false,
            isShowListTypes: false,
            isShowXViewTypes: false,
            isShowFontSize: false,

            i18n: {
                btnApply: i18n.get('ui.button.apply'),
            },
        };
    },
    computed: {
        ...mapState(['editingChartOptions']),

        keywordEqualizer() {
            return this.equalizerTypes[this.selectedEqualierIndex].keyword;
        },

        keywordList() {
            return this.listActiveserviceTypes[this.selectedListIndex].keyword;
        },

        keywordXView() {
            return this.xviewTypes[this.selectedXViewIndex].keyword;
        },
    },
    methods: {
        ...mapMutations([
            'setChartTypeOnEditingChart',
            'setPTypeOnEditingChart',
            'setPKeyOnEditingChart',
            'setPerspectiveOnEditingChart',
            'setFontSizeOnEditingChart',
            'setColumnsOnEditingChart',
            'setViewpointOnEditingChart',
            'setFixedmaxOnEditingChart',
            'setTopbarSyncOnEditingChart',
        ]),

        ...mapActions(['setChartTypeAndClearValueWhenClickThumnail']),

        onClickChart(type) {
            this.setChartTypeAndClearValueWhenClickThumnail(type);

            this.setPTypeOnEditingChart(PTypeDef.MISC);

            //선택 전에 specific 사용하는값들은 초기화할까? general까지 같이 초기화 하는게 좋겠다.
            if (type === 'equalizer') {
                this.$refs.equalizerChartTypeList.isUnfold = true;
                this.configureByEqualizerType(
                    this.equalizerTypes[this.selectedEqualierIndex].pkey
                );
            } else if (type === 'list.activeservice') {
                this.$refs.listChartTypeList.isUnfold = true;

                this.configureByActiveserviceListType(
                    this.listActiveserviceTypes[this.selectedListIndex]
                        .persepective
                );
            } else if (type === 'xview.dashboard') {
                this.$refs.xviewChartTypeList.isUnfold = true;

                this.setViewpointOnEditingChart(
                    this.xviewTypes[this.selectedXViewIndex].viewpoint
                );
            } else if (type === 'event') {
                this.setPKeyOnEditingChart('rt_event');
            } else if (type === 'scoreboard') {
                this.setPKeyOnEditingChart('score_board_v2');
            } else if (type === 'line.compare') {
                this.setTopbarSyncOnEditingChart(false);
                this.setPKeyOnEditingChart('base_line');
            }
        },

        configureByEqualizerType(pkey) {
            this.setPKeyOnEditingChart(pkey);
            if (pkey === 'active_service') {
                this.setChartTypeOnEditingChart('equalizer');
                this.setFixedmaxOnEditingChart(undefined);
            } else if (pkey === 'sys_cpu_by_section') {
                this.setChartTypeOnEditingChart('equalizer.cpu');
                this.setFixedmaxOnEditingChart(100);
            } else if (pkey === 'db_connection') {
                this.setChartTypeOnEditingChart('equalizer.dbcon');
                this.setFixedmaxOnEditingChart(undefined);
            }
        },

        configureByActiveserviceListType(persepective) {
            this.setPKeyOnEditingChart('active_service_list');
            this.setPerspectiveOnEditingChart(persepective);
            if (persepective === 'active_service_list') {
                this.setColumnsOnEditingChart(
                    'domainName,sysId,elapsedTime,serviceHashText'
                );
            } else if (persepective === 'active_sql_list') {
                this.setColumnsOnEditingChart(
                    'domainName,sysId,runningTime,jndiAndDb,runningFullText'
                );
            } else if (persepective === 'active_excall_list') {
                this.setColumnsOnEditingChart(
                    'domainName,sysId,runningTime,runningFullText'
                );
            }
        },

        onClickListChartType(item) {
            this.selectedListIndex = this.listActiveserviceTypes.findIndex(
                type => type.persepective === item.persepective
            );
        },

        onClickEqualizerChartType(item) {
            this.selectedEqualierIndex = this.equalizerTypes.findIndex(
                type => type.pkey === item.pkey
            );
        },

        onClickXViewChartType(item) {
            this.selectedXViewIndex = this.xviewTypes.findIndex(
                type => type.viewpoint === item.viewpoint
            );
        },

        isChoose(type) {
            return (
                this.editingChartOptions.charttype &&
                this.editingChartOptions.charttype.includes(type)
            );
        },

        hideEqualizerDropdown(event) {
            this.$refs.equalizerChartTypeList.isUnfold = false;
        },

        hideActiveServiceListDropdown(event) {
            this.$refs.listChartTypeList.isUnfold = false;
        },

        hideXViewDropdown(event) {
            this.$refs.xviewChartTypeList.isUnfold = false;
        },
    },
    watch: {
        editingChartOptions() {
            if (this.isChoose('equalizer')) {
                this.selectedEqualierIndex = this.editingChartOptions.pkey
                    ? this.equalizerTypes.findIndex(
                          type => type.pkey === this.editingChartOptions.pkey
                      )
                    : 0;
            } else if (this.isChoose('list.activeservice')) {
                this.selectedListIndex = this.editingChartOptions.perspective
                    ? this.listActiveserviceTypes.findIndex(
                          type =>
                              type.persepective ===
                              this.editingChartOptions.perspective
                      )
                    : 0;
            } else if (this.isChoose('xview.dashboard')) {
                this.selectedXViewIndex = this.editingChartOptions.viewpoint
                    ? this.xviewTypes.findIndex(
                          type =>
                              type.viewpoint ===
                              this.editingChartOptions.viewpoint
                      )
                    : 0;
            }
        },

        selectedListIndex() {
            const persepective = this.listActiveserviceTypes[
                this.selectedListIndex
            ].persepective;
            this.configureByActiveserviceListType(persepective);
        },

        selectedEqualierIndex() {
            const pkey = this.equalizerTypes[this.selectedEqualierIndex].pkey;
            this.configureByEqualizerType(pkey);
        },

        selectedXViewIndex() {
            this.setViewpointOnEditingChart(
                this.xviewTypes[this.selectedXViewIndex].viewpoint
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.chart-box {
    @include themify($themes) {
        .chart-thumbnail {
            display: inline-block;
            margin-right: 2px;
            margin-bottom: 6px;

            border-radius: 3px;
            border: solid 1px themed('edit-chart-tab-thumbnail-border-color');
            cursor: pointer;
            position: relative;

            .chart-configure-dropdown {
                width: 157px;
            }

            > i {
                margin: 11px;
                background-image: url('../../../../../style/aries.png');
                background-repeat: no-repeat;
                background-color: transparent;
                border: 0;
                width: 32px;
                height: 32px;
                display: block;

                &.equalizer {
                    background-position: -496px -338px;
                }

                &.list-activeservice {
                    background-position: -528px -402px;
                }

                &.xview {
                    background-position: -496px -370px;
                }

                &.event {
                    background-position: -528px -370px;
                }

                &.speedhorizon {
                    background-position: -592px -370px;
                }

                &.speedvertical {
                    background-position: -560px -370px;
                }

                &.scoreboard {
                    background-position: -592px -338px;
                }

                &.line-compare {
                    background-position: -496px -402px;
                }
            }

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }

            &.choose {
                border: 1px solid #8652ff;

                > .selected-text {
                    display: block;
                }
            }

            > .selected-text {
                display: none;
                position: absolute;
                left: 1px;
                bottom: 1px;
                border-radius: 3px;
                background-color: #8652ff;
                width: 52px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                font-size: 11px;
                color: #ffffff;
            }
        }

        [data-tooltip-text]:hover {
            position: relative;
        }

        [data-tooltip-text]:hover:after {
            background-color: rgba(0, 0, 0, 0.88);
            border-radius: 3px;

            color: #ffffff;
            font-size: 10px;
            margin-bottom: 10px;
            padding: 7px;
            position: absolute;
            width: max-content;
            min-width: 50px;
            max-width: 300px;
            word-wrap: break-word;

            z-index: 9999;
            bottom: 48px;
            left: 50%;
            transform: translate(-50%, 0);
            opacity: 1;

            content: attr(data-tooltip-text);
        }
    }
}
</style>
