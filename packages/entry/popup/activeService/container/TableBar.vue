<template>
    <div class="table-bar">
        <div class="top">
            <div class="left">
                <div class="tabs" v-if="activeTab === 'APPLICATION'">
                    <div
                        :class="['tab', !showSummary ? 'active' : '']"
                        @click="onChangeSummaryTab(false)"
                    >
                        {{ i18n.total }}
                    </div>
                    <div
                        :class="['tab', showSummary ? 'active' : '']"
                        @click="onChangeSummaryTab(true)"
                    >
                        {{ i18n.summary }}
                    </div>
                </div>
            </div>
            <div class="right">
                <dropdown
                    v-if="showSummary && activeTab === 'APPLICATION'"
                    :items="summaryTypes"
                    :selected-value="selectedSummaryType"
                    :width="180"
                    @onchange="onChangeSummaryType"
                ></dropdown>
                <active-score
                    v-else
                    :fatal="scoreValues.fatal"
                    :warn="scoreValues.warn"
                    :info="scoreValues.info"
                    :normal="scoreValues.normal"
                ></active-score>
            </div>
        </div>

        <div class="line"></div>

        <summary-table
            :key="tableKey"
            :type="selectedSummaryType"
            v-if="showSummary && activeTab === 'APPLICATION'"
        ></summary-table>
        <detail-table
            :key="tableKey"
            @click="onClickTableRow"
            v-else
        ></detail-table>

        <sql-window
            v-if="showSqlWindow"
            :sql="sql"
            :sql-key="sqlKey"
            :inline-parameters="inlineParameters"
            :bound-parameters="boundParameters"
            :sherpa-oracle-server-config="sherpaOracleServerConfig"
            :sherpa-oracle-instance-name="sherpaOracleInstanceName"
            :sherpa-oracle-sequence="sherpaOracleSequence"
            :sherpa-oracle-guid="sherpaOracleGuid"
            @cancel="() => (showSqlWindow = false)"
        ></sql-window>

        <detail-window
            v-if="showExternalCallWindow"
            :top="windowTop"
            @cancel="() => (showExternalCallWindow = false)"
        >
            <template #subject>
                <span>{{ i18n.showTxcall }}</span>
            </template>
            <template #contents>
                <pre>{{ externalCall }}</pre>
            </template>
        </detail-window>

        <form ref="detailPopupForm">
            <input type="hidden" name="txid" />
            <input type="hidden" name="session" />
            <input type="hidden" name="threadHash" />
            <input type="hidden" name="sid" />
        </form>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import DetailWindow from '@entry/popup/xviewAnalysis/component/DetailWindow';
import SqlWindow from '@entry/popup/xviewAnalysis/container/SqlWindow';
import SummaryTable from './SummaryTable';
import DetailTable from './DetailTable';
import ActiveScore from '../component/ActiveScore';
import { UIManager } from '@common/legacy/UIManager';
import { mapState, mapMutations, mapActions, xviewStoreHelper } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Dropdown,
        SummaryTable,
        DetailTable,
        ActiveScore,
        DetailWindow,
        SqlWindow,
    },
    computed: {
        ...mapState({
            activeTab: state => state.activeTab,
            scoreValues: state => state.scoreValues,
            tableKey: state => state.tableKey,
        }),
        ...xviewStoreHelper.mapState({
            windowTop: state => state.mainHeight - 95,
        }),
    },
    data() {
        return {
            showSummary: false,
            summaryTypes: [
                { text: this.i18n.application, value: 'serviceHashText' },
                { text: this.i18n.applicationAlias, value: 'alias' },
            ],
            selectedSummaryType: 'serviceHashText',

            showSqlWindow: false,
            sql: '',
            sqlKey: -1,
            inlineParameters: [],
            boundParameters: [],
            sherpaOracleServerConfig: '',
            sherpaOracleInstanceName: '',
            sherpaOracleSequence: -1,
            sherpaOracleGuid: '',

            showExternalCallWindow: false,
            externalCall: '',
        };
    },
    methods: {
        ...mapMutations(['increaseTableKey']),
        ...mapActions(['loadActiveServiceDetail', 'loadExternalCallDetail']),
        ...xviewStoreHelper.mapMutations(['selectTransactionRow']),
        showDetailWindow(data) {
            if (data.runningMode === 'SQL') {
                this.sql = data.runningFullText;
                this.sqlKey = -1;
                this.inlineParameters = [];
                this.boundParameters = [];

                this.selectTransactionRow({
                    data: {
                        sid: data.domainId,
                        sysOid: data.oid,
                        elapsedTime: data.runningTime,
                        collectionTime: data.captureTime,
                        txid: data.txid,
                    },
                    index: 0,
                });

                // 셀파오라클 연동 버튼 노출하기
                if (data.sherpaOracleServerConfig) {
                    this.sherpaOracleServerConfig = 'sherpaOracle';
                    this.sherpaOracleInstanceName =
                        data.runningSherpaOracleInstanceName;
                    this.sherpaOracleSequence =
                        data.runningSherpaOracleSequence;
                }

                this.loadActiveServiceDetail(data)
                    .then(detail => {
                        if (detail.sqlText !== null) {
                            this.sql = detail.sqlText;
                            this.sqlKey = parseInt(detail.sqlHash);
                            this.inlineParameters = detail.sqlInlineParams;
                            this.boundParameters = detail.sqlBoundParams;
                        }
                    })
                    .finally(() => {
                        this.showSqlWindow = true;
                    });
            } else if (data.runningMode === 'EXTERNALCALL') {
                this.loadExternalCallDetail(data).then(detail => {
                    if (detail !== null) {
                        this.externalCall = detail;
                        this.showExternalCallWindow = true;
                    }
                });
            }
        },
        openDetailPopup({ domainId, txid, session, threadHashText }) {
            window
                .open(
                    '',
                    'activeServiceDetail',
                    'width=1280,height=800,history=no,resizable=no,status=no,scrollbars=yes,menubar=no'
                )
                .focus();

            const form = this.$refs.detailPopupForm;
            form.txid.value = txid;
            form.sid.value = domainId;
            form.session.value = session;
            form.threadHash.value = threadHashText;
            form.method = 'post';
            form.action = '/popup/activeServiceDetail';
            form.target = 'activeServiceDetail';
            form.submit();
        },
        onChangeSummaryTab(active) {
            if (this.showSummary === active) return;
            this.showSummary = active;
            this.increaseTableKey(active);
        },
        onClickTableRow({ data }, e) {
            const cls = e.target.className;

            if (cls === 'status-link detail' || cls === 'detail-link')
                this.showDetailWindow(data);
            else if (cls === 'status-link service') this.openDetailPopup(data);
            else if (cls === 'async-link') {
                const searchRange = 1000 * 60 * 60;
                UIManager.getXViewPointList(
                    data.domainId,
                    [data.asyncCallerId],
                    data.startTime - searchRange,
                    data.startTime + data.elapsedTime,
                    data.asyncCallerId,
                    undefined,
                    undefined,
                    'xviewAnalysisForAsync'
                );
            }
        },
        onChangeSummaryType({ value }) {
            this.selectedSummaryType = value;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.table-bar {
    @include themify($themes) {
        margin-top: 11px;

        > .top {
            display: flex;

            > * {
                flex: 1;
            }

            > .left {
                > .tabs {
                    > .tab {
                        display: inline-block;
                        padding: 6px 8px;
                        color: themed('table-bar-tab-font-color');
                        line-height: 1;
                        letter-spacing: normal;
                        cursor: pointer;

                        &.active {
                            cursor: default;
                            border-radius: 12px;
                            color: themed('table-bar-active-tab-font-color');
                            background-color: themed(
                                'table-bar-active-tab-background-color'
                            );
                        }
                    }
                }
            }

            > .right {
                text-align: right;
                ::v-deep .aries-ui-dropdown {
                    text-align: left;
                }
            }
        }
        > .line {
            height: 1px;
            margin: 11px 0px 13px 0px;
            background-color: themed('table-bar-bottom-line-color');
        }
    }
}
</style>
