<template>
    <div class="stacktrace-tab">
        <div class="tabs">
            <div class="menu">
                <div
                    :class="['item', showDetail ? 'active' : '']"
                    @click="onClickTabMenu(true)"
                >
                    {{ i18n.showDetail }}
                </div>
                <div
                    :class="['item', showDetail ? '' : 'active']"
                    @click="onClickTabMenu(false)"
                >
                    {{ i18n.summary }}
                </div>
            </div>
            <div class="text">
                {{ i18n.setTimeOfAutoStacktrace }}
                <tooltip
                    class="information"
                    :position="'top-right'"
                    :width="300"
                    :cursor-none="true"
                    :message="collectTooltip"
                    >{{ collectThreshold }}</tooltip
                >
                {{ i18n.ms }}
            </div>
        </div>
        <div class="contents">
            <div class="detail" v-if="showDetail">
                <div class="left" :style="{ 'max-height': detailLeftHeight }">
                    <div
                        class="time-table"
                        v-for="(row, i) in stacktraceContentRows"
                    >
                        <div
                            :class="[
                                'time-row',
                                i === groupIndex && j === stacktraceIndex
                                    ? 'active'
                                    : '',
                            ]"
                            @click="onClickContentMenu(i, j)"
                            v-for="(data, j) in row.stackTraces"
                        >
                            <div
                                class="head"
                                :style="{
                                    'background-color': row.color,
                                }"
                            >
                                &nbsp;
                            </div>
                            <div class="body">{{ data.timeFormat }}</div>
                        </div>
                    </div>
                </div>
                <div
                    class="right"
                    :style="{
                        'max-height': detailRightHeight,
                        'max-width': detailRightWidth,
                    }"
                >
                    <pre v-html="stacktraceText"></pre>
                </div>
            </div>
            <div class="summary" v-else>
                <stacktrace-tree
                    :width="mainWidth"
                    :height="mainHeight"
                    :rows="stacktraceSummaryRows"
                    @update-parents="onUpdateStacktraceParents"
                ></stacktrace-tree>

                <detail-window
                    :top="windowTop"
                    @cancel="() => (showStacktraceParents = false)"
                    v-if="showStacktraceParents"
                >
                    <template #subject>
                        <span>{{ i18n.showStacktraceParents }}</span>
                    </template>
                    <template #contents>
                        <pre v-html="parentStacktraceText"></pre>
                    </template>
                </detail-window>
            </div>
        </div>
    </div>
</template>

<script>
import { getDayjs, serverDateFormat } from '@common/base';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import StacktraceTree from '../component/StacktraceTree';
import DetailWindow from '../component/DetailWindow';
import {
    mapState as baseMapState,
    mapGetters as baseMapGetters,
} from '../store/base';
import { mapState, mapActions } from '../store/stacktrace';

const DATETIME_FORMAT = `${serverDateFormat.longWithSec}.SSS`;

const GROUP_COLORS = [
    '#6FE09F',
    '#497EFF',
    '#FF8652',
    '#7932A5',
    '#9ED5FF',
    '#16A085',
    '#FFD327',
    '#9370DB',
    '#FF69B4',
    '#674172',
];

export default {
    components: {
        StacktraceTree,
        Tooltip,
        DetailWindow,
    },
    inject: {
        i18n: {
            default: {
                apply: 'Apply',
                cancel: 'Cancel',
                ms: 'ms',
                summary: 'Summary',
                showDetail: 'Show details',
                setTimeOfAutoStacktrace: 'Set time of AutoStacktrace',
                showStacktraceParents: 'Show Stacktrace Parents',
                M0400: '%d %d %d',
            },
        },
    },
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth,
            mainHeight: state => state.mainHeight,
            windowTop: state => state.mainHeight - state.distHeight - 95,
        }),
        ...mapState({
            groupIndex: state => state.groupIndex,
            stacktraceIndex: state => state.stacktraceIndex,
            stacktraceText: state => state.stacktraceText,
            collectCount: state => state.collectCount.toLocaleForAries(),
            collectInterval: state => state.collectInterval.toLocaleForAries(),
            collectThreshold: state =>
                state.collectThreshold.toLocaleForAries(),
            stacktraceSummaryRows: state => {
                return state.stacktraceSummaryRows.map(row => {
                    return {
                        ...row,
                        selfTimeFormat: row.selfTime.toLocaleForAries(),
                        elapsedTimeFormat: row.elapsedTime.toLocaleForAries(),
                        callCountFormat: row.callCount.toLocaleForAries(),
                    };
                });
            },
            stacktraceContentRows: state => {
                const colorMap = {};

                let index = 0;
                return state.stacktraceContentRows.map(row => {
                    if (!colorMap[row.key]) {
                        colorMap[row.key] = GROUP_COLORS[index];

                        // 설정된 그룹 컬러보다 인덱스가 클 경우에 다시 원점으로 돌림
                        if (index === GROUP_COLORS.length - 1) index = 0;
                        else index++;
                    }

                    row.stackTraces = row.stackTraces.map(data => {
                        return {
                            ...data,
                            timeFormat: getDayjs(data.time).format(
                                DATETIME_FORMAT
                            ),
                        };
                    });

                    return {
                        ...row,
                        color: colorMap[row.key],
                    };
                });
            },
        }),
        ...baseMapGetters({
            params: 'transactionToProfileSearchParams',
        }),
        collectTooltip() {
            let title = this.i18n.M0400;
            title = title.replace('%d', this.collectThreshold);
            title = title.replace('%d', this.collectInterval);
            title = title.replace('%d', this.collectCount);
            return title;
        },
        detailLeftHeight() {
            return `${this.mainHeight - 55}px`;
        },
        detailRightHeight() {
            return `${this.mainHeight - 85}px`;
        },
        detailRightWidth() {
            return `${this.mainWidth - 200}px`;
        },
        stacktraceTextForParents() {
            return '';
        },
    },
    data() {
        return {
            showDetail: true,
            showStacktraceParents: false,
            parentStacktraceText: '',
        };
    },
    methods: {
        ...mapActions(['loadStacktraceText']),
        onClickTabMenu(showDetail) {
            this.showDetail = showDetail;
        },
        onClickContentMenu(groupIndex, stacktraceIndex) {
            this.loadStacktraceText({
                domainId: this.params.sid,
                groupIndex,
                stacktraceIndex,
            });
        },
        onUpdateStacktraceParents(parents) {
            this.showStacktraceParents = true;
            this.parentStacktraceText = parents
                .reverse()
                .map(row => row.methodName)
                .join('<br/>');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.stacktrace-tab {
    @include themify($themes) {
        > .tabs {
            position: relative;
            height: 28px;

            > .menu,
            > .text {
                position: absolute;
                top: 0px;
                height: 26px;
            }
            > .menu {
                > .item {
                    display: inline-block;
                    padding: 3px 8px;
                    text-align: center;
                    cursor: pointer;
                    color: themed('stacktrace-tab-font-color');

                    &.active {
                        cursor: default;
                        height: 20px;
                        border-radius: 20px;
                        font-weight: 500;
                        color: themed('stacktrace-tab-menu-active-font-color');
                        background-color: themed(
                            'stacktrace-tab-menu-active-background-color'
                        );
                    }
                }
            }
            > .text {
                right: 0px;
                color: themed('stacktrace-tab-font-color');
                line-height: 26px;

                > .information {
                    display: inline-block;
                    text-align: center;
                    width: 48px;
                    height: 26px;
                    border-radius: 2px;
                    background-color: themed(
                        'stacktrace-tab-text-information-background-color'
                    );
                    color: themed('stacktrace-tab-text-information-font-color');
                }
            }
        }

        > .contents {
            margin-top: 28px;

            > .detail {
                display: flex;

                > .left {
                    flex: 0 0 200px;
                    padding-right: 8px;
                    margin-right: 8px;
                    overflow-y: auto;

                    > .time-table {
                        margin-bottom: 8px;
                        border-radius: 3px;
                        border: solid 1px
                            themed('stacktrace-tab-time-border-color');

                        > .time-row {
                            color: themed('stacktrace-tab-font-color');
                            cursor: pointer;

                            > .head,
                            > .body {
                                display: inline-block;
                                height: 32px;
                                line-height: 32px;
                            }
                            > .head {
                                width: 6px;
                            }
                            > .body {
                                padding-left: 23px;
                            }

                            &:first-child > .head {
                                border-top-left-radius: 3px;
                            }
                            &:last-child > .head {
                                border-bottom-left-radius: 3px;
                            }

                            &:hover {
                                background-color: themed(
                                    'stacktrace-tab-time-row-hover-background-color'
                                );
                            }
                            &.active {
                                background-color: themed(
                                    'stacktrace-tab-time-row-active-background-color'
                                );
                                color: themed(
                                    'stacktrace-tab-time-row-active-font-color'
                                );
                                font-weight: bold;
                                cursor: default;
                            }
                        }
                    }
                }
                > .right {
                    flex: 1;
                    overflow: auto;
                    padding: 16px;
                    border-radius: 4px;
                    background-color: themed(
                        'stacktrace-tab-editor-background-color'
                    );
                    border: solid 1px
                        themed('stacktrace-tab-editor-border-color');
                    > pre {
                        margin: 0px !important;
                    }
                }
            }
        }
    }
}
</style>
