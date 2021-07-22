<template>
    <no-data-page v-if="activeNoData"></no-data-page>
    <loading-page v-else-if="useGlobalLoading"></loading-page>
    <div :class="[groupType !== '' ? 'side-mode' : 'full-mode']" v-else>
        <div class="side" v-if="groupType !== ''">
            <group-view
                :active-loading="useMainLoading"
                @reload-transaction-and-profile-data="
                    reloadTransactionAndProfileData
                "
            ></group-view>
        </div>

        <div class="main">
            <loading-page v-if="useMainLoading"></loading-page>
            <template v-else>
                <div class="top">
                    <transaction-table
                        @load-profile-data="loadProfileData"
                        @resize="resizeHandler"
                    ></transaction-table>
                </div>
                <div class="bottom">
                    <template v-if="transactionRow != null">
                        <detail-tabs
                            @load-profile-data="loadProfileData"
                        ></detail-tabs>
                    </template>
                </div>

                <template v-if="dataMode === 'link'">
                    <topology-window
                        @active-topology="toggleActiveTopology"
                        @load-profile-data="loadProfileData"
                        v-show="activeTopology"
                    ></topology-window>
                    <topology-minimap
                        @active-topology="toggleActiveTopology"
                        v-show="!activeTopology"
                    ></topology-minimap>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import NoDataPage from './component/NoDataPage';
import LoadingPage from './container/LoadingPage.vue';
import TransactionTable from './container/TransactionTable';
import DetailTabs from './container/DetailTabs';
import GroupView from './container/GroupView';
import TopologyMinimap from './container/TopologyMinimap';
import TopologyWindow from './container/TopologyWindow';
import { UIManager } from '@common/legacy/UIManager';
import { TAB_KEYS, CHART_FILTERS, GROUP_TYPES, TOP_HEIGHT } from './constant';
import { convertTableData } from './utility';
import { mapState, mapMutations, mapActions, mapGetters } from './store/base';
import { mapActions as timelineMapActions } from './store/timeline';
import {
    mapMutations as textMapMutations,
    mapActions as textMapActions,
} from './store/text';
import { mapActions as sectionMapActions } from './store/section';
import { mapActions as socketMapActions } from './store/socket';
import { mapActions as fileMapActions } from './store/file';
import { mapActions as messageMapActions } from './store/message';
import { mapActions as errorMapActions } from './store/error';
import { mapActions as stacktraceMapActions } from './store/stacktrace';
import { mapActions as cicsMapActions } from './store/cics';
import { mapActions as asyncMapActions } from './store/async';

export default {
    components: {
        NoDataPage,
        LoadingPage,
        GroupView,
        TransactionTable,
        DetailTabs,
        TopologyMinimap,
        TopologyWindow,
    },
    props: {
        startTime: {
            type: Number,
            required: true,
        },
        endTime: {
            type: Number,
            required: true,
        },
        dataMode: {
            type: String,
            required: false,
            default: '',
            validator: value => {
                return ['guid', 'link', ''].indexOf(value) !== -1;
            },
        },
        transactionRows: {
            type: Array,
            required: false,
            default: () => [],
        },
        transactionIds: {
            type: Object,
            required: false,
            default: () => {},
        },
        chartKey: {
            type: String,
            required: false,
            default: '',
        },
        chartFilter: {
            type: String,
            required: false,
            default: '',
            validator: value => {
                return (
                    ['', ...Object.values(CHART_FILTERS)].indexOf(value) !== -1
                );
            },
        },
        groupType: {
            type: String,
            required: false,
            default: '',
            validator: value => {
                return (
                    ['', ...Object.values(GROUP_TYPES)].indexOf(value) !== -1
                );
            },
        },
        groupRows: {
            type: Array,
            required: false,
            default: () => [],
        },
        instanceOids: {
            type: Object,
            required: false,
            default: () => {},
        },
        transactionCount: {
            type: Number | String,
            required: false,
            default: 0,
        },
        searchType: {
            type: String,
            required: false,
            default: '',
            validator: value => {
                return (
                    ['application', 'sql', 'externalCall', ''].indexOf(
                        value
                    ) !== -1
                );
            },
        },
        searchName: {
            type: String,
            required: false,
            default: '',
        },
        isFailed: {
            type: Boolean | String,
            required: false,
            default: false,
        },
        guid: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        ...mapState({
            activeTab: state => state.activeTab,
            transactionRow: state => state.transactionRow,
            loadingPercent: state => state.loadingPercent,
        }),
        ...mapGetters({
            tabParams: 'transactionToProfileSearchParams',
        }),
        useGlobalLoading() {
            // 일반적인 X-View 팝업 or guid 링크 팝업
            return (
                (this.dataMode === '' &&
                    this.groupType === '' &&
                    this.loadingPercent > -1) ||
                (this.guid !== '' && this.loadingPercent > -1)
            );
        },
        useMainLoading() {
            // 좌측 통계 데이터가 보이는 X-View 팝업 뜨는 로딩
            return this.groupType !== '' && this.loadingPercent > -1;
        },
    },
    data() {
        return {
            activeNoData: false,
            activeTopology: true,
            resizeHandler: null,
        };
    },
    methods: {
        ...mapMutations([
            'loadParameters',
            'updateTransactionRows',
            'calculateMainSize',
            'updateDistHeight',
            'updateTabLoading',
            'changeActiveTab',
        ]),
        ...mapActions([
            'selectTransactionRow',
            'loadTransactionRows',
            'searchGuidTransactionRows',
        ]),
        ...timelineMapActions(['loadTimelineData']),
        ...textMapMutations(['updateProfileNo']),
        ...textMapActions(['loadProfileText']),
        ...sectionMapActions(['loadSectionData']),
        ...fileMapActions(['loadFileRows']),
        ...socketMapActions(['loadSocketRows']),
        ...messageMapActions(['loadMessageRows']),
        ...errorMapActions(['loadErrorRows']),
        ...stacktraceMapActions(['loadStacktraceData']),
        ...cicsMapActions(['loadCicsData']),
        ...asyncMapActions(['loadAsyncRows']),

        async loadProfileData() {
            const tab = this.activeTab;

            this.updateTabLoading(true);

            if (tab == TAB_KEYS.TIMELINE)
                await this.loadTimelineData(this.tabParams);
            else if (tab == TAB_KEYS.TEXT) {
                await this.loadProfileText(this.tabParams);
                this.updateProfileNo(arguments[0]);
            } else if (tab == TAB_KEYS.SECTION)
                await this.loadSectionData(this.tabParams);
            else if (tab == TAB_KEYS.SOCKET)
                await this.loadSocketRows(this.tabParams);
            else if (tab == TAB_KEYS.FILE)
                await this.loadFileRows(this.tabParams);
            else if (tab == TAB_KEYS.MESSAGE)
                await this.loadMessageRows(this.tabParams);
            else if (tab == TAB_KEYS.ERROR)
                await this.loadErrorRows(this.tabParams);
            else if (tab == TAB_KEYS.STACKTRACE)
                await this.loadStacktraceData(this.tabParams);
            else {
                try {
                    if (tab == TAB_KEYS.CICS)
                        await this.loadCicsData(this.tabParams);
                    else if (tab == TAB_KEYS.ASYNC)
                        await this.loadAsyncRows(this.tabParams);
                } catch (e) {
                    // CICS와 ASYNC는 에이전트 버전에 따라 에러가 발생할 수 있음
                    this.changeActiveTab(TAB_KEYS.TIMELINE);
                    await this.loadTimelineData(this.tabParams);
                }
            }

            this.updateTabLoading(false);
        },

        toggleActiveTopology(active) {
            this.activeTopology = active;
        },

        reloadTransactionAndProfileData() {
            this.loadTransactionRows().then(rows => {
                if (rows.length === 0) this.activeNoData = true;
                else {
                    this.selectTransactionRow({
                        index: 0,
                        data: rows[0],
                    });
                    this.loadProfileData();
                }
            });
        },
    },
    created() {
        this.loadParameters({
            startTime: this.startTime,
            endTime: this.endTime,
            dataMode: this.dataMode,
            transactionIds: this.transactionIds,
            chartKey: this.chartKey,
            chartFilter: this.chartFilter,
            groupType: this.groupType,
            groupRows: this.groupRows,
            instanceOids: this.instanceOids,
            transactionCount: this.transactionCount,
            searchType: this.searchType,
            searchName: this.searchName,
            isFailed: this.isFailed,
            guid: this.guid, // 외부에서 URL로 호출시 사용함
        });

        this.resizeHandler = _.throttle((e, h) => {
            if (h && h < TOP_HEIGHT) this.updateDistHeight(TOP_HEIGHT - h);
            this.calculateMainSize();
        }, 100);

        this.resizeHandler();
    },
    beforeMount() {
        if (this.dataMode !== '') {
            if (this.transactionRows.length > 0) {
                this.updateTransactionRows(
                    this.transactionRows.map(row => convertTableData(row))
                );

                // TODO: juijs-grid 라이브러리 문제로 인해 부득이하게 setTimeout을 사용했음
                setTimeout(() => {
                    this.selectTransactionRow({
                        index: 0,
                        data: this.transactionRows[0],
                    });
                    this.loadProfileData();
                }, 100);
            }
        } else {
            if (this.guid !== '') {
                this.searchGuidTransactionRows()
                    .then(rows => {
                        if (rows.length > 0) {
                            UIManager.getXViewPointListForTopologyOrGuid(
                                'guid',
                                this.startTime,
                                this.endTime,
                                rows,
                                'xviewAnalysis'
                            );
                        } else {
                            this.activeNoData = true;
                        }
                    })
                    .catch(() => {
                        this.activeNoData = true;
                    });
            } else {
                // groupType은 좌측 통계 영역을 활성화 시킨다.
                if (this.groupType === '')
                    this.reloadTransactionAndProfileData();
            }
        }

        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss">
@import 'themes.scss';

.xviewAnalysis {
    .side-mode,
    .full-mode {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    .side-mode {
        > .side {
            flex: 0 0 300px;
        }

        > .main {
            flex: 1;
        }
    }

    @include themify($themes) {
        .side {
            border-right: 1px solid themed('layout-border-color');
        }
    }
}

/* JUI 테이블 스타일 커스터마이징 */
.xtable {
    tr {
        &.not-focus {
            * {
                opacity: 0.7 !important;
            }
        }
    }

    td {
        &.profile {
            text-decoration: underline;
            cursor: pointer;
        }

        span.detail {
            cursor: pointer;
            border-radius: 3px;
            height: 18px;
            padding: 0px 4px;
        }

        .time-layout {
            position: relative;
            display: inline-block;
            width: 100%;

            > * {
                position: absolute;
                display: inline-block;
            }

            > .time {
                top: -14px;
                left: 0px;
                text-align: right;
            }

            > .time-bar {
                height: 12px;
                top: -11px;
                left: 55px;
                right: 0;
                border-radius: 2px;

                > .time-bar-per {
                    height: 12px;
                    border-radius: 2px;
                }

                > .time-bar-text {
                    height: 12px;
                    width: 100%;
                    text-align: right;
                    font-size: 11px;
                    margin-top: -15px;
                }
            }
        }

        &.package,
        &.class,
        > span.method {
            cursor: pointer;
            text-decoration: underline;
        }

        &.profile {
            > i {
                display: none;
                margin-left: 7px;
            }
            > span {
                display: inline-block;
                text-decoration: underline;
            }
        }

        @include themify($themes) {
            i.icon-left,
            i.icon-right {
                cursor: pointer;
                display: inline-block;
                width: 14px;
                height: 14px;
                background-size: cover;
                margin-bottom: -3px;

                &.icon-left {
                    background-image: themed('calltree-icon-close-asset-url');
                }

                &.icon-right {
                    background-image: themed('calltree-icon-open-asset-url');
                }
            }
        }

        i.ico-calltree {
            display: inline-block !important;
            background-image: url('./asset/icon-calltree.png') !important;
            background-repeat: no-repeat !important;
            width: 16px !important;
            height: 16px !important;
            line-height: 16px !important;
            margin-bottom: -5px;
            &.thread {
                background-position: -0px -0px !important;
            }
            &.method {
                background-position: -16px -0px !important;
            }
            &.db {
                background-position: -32px -0px !important;
            }
            &.tx_call {
                background-position: -0px -16px !important;
            }
            &.loop {
                background-position: -16px -16px !important;
            }
            &.exception {
                background-position: -32px -16px !important;
            }
            &.file {
                background-position: -0px -32px !important;
            }
            &.socket {
                background-position: -16px -32px !important;
            }
            &.dbconnection {
                background-position: -32px -32px !important;
            }
            &.not_profiled,
            &.lost {
                background-position: -0px -48px !important;
            }
            &.sql {
                background-position: -16px -48px !important;
            }
            &.fetch {
                background-position: -32px -48px !important;
            }
            &.message {
                background-position: -0px -64px !important;
            }
            &.error {
                background-position: -16px -64px !important;
            }
            &.async_call {
                background-position: -48px -0px !important;
            }
            &.batch {
                background-position: -48px -16px !important;
            }
        }
    }
}

body.classic .xtable {
    tr {
        &.selected-bold {
            background-color: #b8eecd !important;
        }
        &.selected-light {
            background-color: #dbf6e6 !important;
        }
    }

    td {
        span.detail {
            background-color: #cce4f9;
            color: #212121;
        }

        .time-layout {
            > .time {
                color: #212121;
            }

            > .time-bar {
                background-color: rgba(0, 0, 0, 0.06);

                > .time-bar-per {
                    background-color: #49d484;
                }

                > .time-bar-text {
                    color: #212121;
                }
            }
        }
    }
}

body.dark .xtable {
    tr {
        &.selected-bold {
            background-color: #355642 !important;
        }
        &.selected-light {
            background-color: #355642 !important;
        }
    }

    td {
        span.detail {
            background-color: #4986e7;
            color: #fff;
        }

        .time-layout {
            > .time {
                color: #e8e8e8;
            }

            > .time-bar {
                background-color: rgba(255, 255, 255, 0.06);

                > .time-bar-per {
                    background-color: #1fa558;
                }

                > .time-bar-text {
                    color: #ffffff;
                }
            }
        }
    }
}
</style>
