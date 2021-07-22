<template>
    <div class="canvas-wrapper">
        <loading-wrapper v-show="loadingData" />
        <div class="head">
            <div class="left">
                <btn
                    v-if="naviBtnItems"
                    @click="clickNavi"
                    :items="naviBtnItems"
                    :type-in-group-button="'noselect'"
                    class="size-small primary-reverse"
                    style="margin-right: 9px;"
                ></btn>
                <dropdown
                    v-show="currentTab === 'transaction'"
                    :is-simple-style="true"
                    :items="yAxisTypeItemsInTransactionTab"
                    :width="180"
                    @onchange="updateYAxisInTransactionTab"
                />
                <dropdown
                    v-show="currentTab !== 'transaction'"
                    :is-simple-style="true"
                    :items="yAxisTypeItemsInGroupTab"
                    :width="180"
                    @onchange="updateYAxisInGroupTab"
                />
            </div>
            <div class="right">
                <tooltip
                    :message="i18n.numberOfPoints"
                    :position="'top-center'"
                    :offset="-3"
                >
                    <div class="count">{{ pointCount.toLocaleForAries() }}</div>
                </tooltip>

                <tooltip
                    :message="btnTooltip"
                    :position="'top-right'"
                    :offset="-3"
                >
                    <btn
                        :items="btnItem"
                        class="size-medium border-none"
                        @click="toggleDragInteraction"
                    />
                </tooltip>
            </div>
        </div>
        <div class="body" ref="canvasWrapperDom">
            <canvas class="render" />
            <canvas class="interaction" tabindex="1000" />
            <configure-max />
            <share-url-window v-if="closeShareUrlWindow === false" />
        </div>
    </div>
</template>

<script>
import { XViewChartInAnalysisBuilder } from '@module/chart/builder/XViewChartBuilder';
import { ChartKeywordInObserver } from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';
import Btn from '@vuejs/component/button/Btn';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import {
    yAxisTypesInGroupTab,
    yAxisTypesInTransactionTab,
} from '@entry/analysis/xview/common';
import { timeSelectRangeToText } from '@module/chart/util/Time18n';
import LoadingWrapper from '@entry/analysis/xview/container/LoadingWrapper';
import ShareUrlWindow from '@entry/analysis/xview/container/window/ShareUrlWindow';
import ConfigureMax from '@entry/analysis/xview/container/ConfigureMax';

export default {
    components: {
        ConfigureMax,
        LoadingWrapper,
        Btn,
        Tooltip,
        Dropdown,
        ShareUrlWindow,
    },
    inject: ['i18n'],
    name: 'CanvasWrapper',
    data() {
        return {
            yAxisTypeItemsInTransactionTab: yAxisTypesInTransactionTab.map(
                type => {
                    return { text: this.i18n[type], value: type };
                }
            ),
            yAxisTypeItemsInGroupTab: yAxisTypesInGroupTab.map(
                ({ key, i18nKey }) => {
                    return { text: this.i18n[i18nKey], value: key };
                }
            ),

            periodList: Array.from(new Array(7).keys()).map(key => {
                const num = key + 1;

                return {
                    text: `${num}${this.i18n.unitDay}`,
                    value: num,
                };
            }),
            iconType: {
                drag: ICON_TYPE.dragArea,
                timeSelect: ICON_TYPE.expandHorizontal,
            },
            chart: undefined,
        };
    },
    methods: {
        ...mapMutations('xviewAnalysis', [
            'toggleDragInteraction',
            'updateYAxisInTransactionTab',
            'updateYAxisInGroupTab',
        ]),
        ...mapActions('xviewAnalysis', [
            'appendFocusTimeStack',
            'popFocusTimeStack',
            'clearFocusTimeStack',
        ]),
        paintAfterMakeChart() {
            //dom 과 store(transaction)  정보면 충분하지 않을까?
            XViewChartInAnalysisBuilder.build(
                this.$refs.canvasWrapperDom,
                this.$store
            );
        },
        clickNavi(item) {
            if (item.value === 'backHistory') this.emitBackHistory();
            else if (item.value === 'removeAllHistory')
                this.emitRemoveAllHistory();
        },
        emitBackHistory() {
            this.popFocusTimeStack();
        },
        emitRemoveAllHistory() {
            this.clearFocusTimeStack();
        },
    },
    computed: {
        ...mapState('xviewAnalysis', {
            isDragInteractionAboutPopup: state =>
                state.isDragInteractionAboutPopup,
            currentTab: state => state.currentTab,
            currentView: state => state.currentView,
            loadingData: state => state.loadingData,
            closeShareUrlWindow: state => state.closeShareUrlWindow,
        }),
        ...mapGetters('xviewAnalysis', ['focusTimeRange', 'pointCount']),

        btnItem() {
            return !this.isDragInteractionAboutPopup
                ? [{ iconType: this.iconType.drag }]
                : [{ iconType: this.iconType.timeSelect }];
        },
        btnTooltip() {
            return !this.isDragInteractionAboutPopup
                ? this.i18n.selectAreaByDragging
                : this.i18n.extendTimeByDragging;
        },
        naviBtnItems() {
            if (this.focusTimeRange) {
                const { stime, etime } = this.focusTimeRange;
                const range = etime - stime;
                const startTimeText = timeSelectRangeToText(
                    stime,
                    range,
                    this.periodDays > 1
                );

                const endTimeText = timeSelectRangeToText(
                    etime,
                    range,
                    this.periodDays > 1
                );

                return [
                    { iconType: ICON_TYPE.arrowLeft, value: 'backHistory' },
                    {
                        text: `${startTimeText} ~ ${endTimeText}`,
                        value: 'text',
                    },
                    { iconType: ICON_TYPE.close, value: 'removeAllHistory' },
                ];
            } else return undefined;
        },
    },
    mounted() {
        this.paintAfterMakeChart();
        const resizeObserver = new ResizeObserver(elArray => {
            Observer.emit(
                ChartKeywordInObserver.RENDER_IN_ANALYSIS_XVIEW_WHEN_FETCH_OR_RESIZE
            );
        });

        resizeObserver.observe(this.$refs.canvasWrapperDom);

        Observer.on(
            ChartKeywordInObserver.FOCUS_TIME_AREA_IN_PERFORMANCE_CHART,
            focusTimeArea => {
                this.appendFocusTimeStack(focusTimeArea);
            }
        );
    },
    created() {
        //아이콘 추가되면 변경해야함.
        this.dragIcon = ICON_TYPE.desktop;
        this.timeSelectIcon = ICON_TYPE.code;
    },
};
</script>
<style lang="scss">
@import '~@vuejs/component/themes.scss';
.canvas-wrapper {
    position: relative;
    border-radius: 4px;

    display: flex;
    flex-direction: column;
    > .head {
        display: flex;
        align-items: center;
        flex: 0 0 36px;

        margin: 8px 8px 0 8px;

        justify-content: space-between;
        .left {
            display: flex;
            align-items: center;

            .aries-ui-dropdown {
                > .row-list {
                    max-height: none;
                }
            }
        }
        .right {
            display: flex;
            flex-direction: row;
        }

        .count {
            font-size: 11px;
            @include themify($themes) {
                color: themed('typography-color-grey1');

                &:hover {
                    color: themed('typography-color-primary');
                }
            }
            margin-right: 8px;
        }
    }
    > .body {
        flex-grow: 1;
        position: relative;
        > canvas {
            position: absolute;
            width: 100%;
            height: 100%;
            &.render {
                z-index: 10;
            }
            &.interaction {
                z-index: 11;
            }
        }
    }
}
</style>
