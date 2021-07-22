<template>
    <div class="section-tab">
        <div class="chart">
            <div class="client">
                <div class="open" v-if="!activeServerChart">
                    <div class="subject" @click="onToggleActiveChart">
                        <svg-icon
                            :icon-type="iconTypes.open"
                            :width="iconTypes.size"
                            :height="iconTypes.size"
                        ></svg-icon>
                        <span>{{ i18n.client }}</span>
                    </div>
                    <div class="content">
                        <div class="item dom">
                            <div class="title">{{ i18n.dom }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: domTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{ domTimeFormat }}</span>
                                <span class="line"></span>
                                <span class="text">{{ domTimePercent }}</span>
                            </div>
                        </div>
                        <div class="item network">
                            <div class="title">{{ i18n.network }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: networkTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    networkTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{
                                    networkTimePercent
                                }}</span>
                            </div>
                        </div>
                        <div class="item render">
                            <div class="title">{{ i18n.render }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: renderTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    renderTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{
                                    renderTimePercent
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fold" v-else>
                    <div
                        :class="interactionChartClasses"
                        @click="onToggleActiveChart"
                    >
                        <svg-icon
                            :icon-type="iconTypes.fold"
                            :width="iconTypes.size"
                            :height="iconTypes.size"
                        ></svg-icon>
                        <span>{{ i18n.client }}</span>
                    </div>
                    <div class="content">
                        <div class="item">
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: clientTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    clientTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{ totalTimeFormat }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="server">
                <div class="open" v-if="activeServerChart">
                    <div
                        :class="interactionChartClasses"
                        @click="onToggleActiveChart"
                    >
                        <svg-icon
                            :icon-type="iconTypes.open"
                            :width="iconTypes.size"
                            :height="iconTypes.size"
                        ></svg-icon>
                        <span>{{ i18n.server }}</span>
                    </div>
                    <div class="content">
                        <div
                            :class="[
                                'item',
                                'method',
                                profileType === serverTypes.METHOD
                                    ? 'active'
                                    : '',
                            ]"
                            @click="onClickServerDetail(serverTypes.METHOD)"
                        >
                            <div class="title">{{ i18n.method }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: methodTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    methodTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{
                                    methodTimePercent
                                }}</span>
                                <span class="circle">{{ methodCount }}</span>
                            </div>
                        </div>
                        <div
                            :class="[
                                'item',
                                'sql',
                                profileType === serverTypes.SQL ? 'active' : '',
                            ]"
                            @click="onClickServerDetail(serverTypes.SQL)"
                        >
                            <div class="title">{{ i18n.sql }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: sqlTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{ sqlTimeFormat }}</span>
                                <span class="line"></span>
                                <span class="text">{{ sqlTimePercent }}</span>
                                <span class="circle">{{ sqlCount }}</span>
                            </div>
                        </div>
                        <div
                            :class="[
                                'item',
                                'external-call',
                                profileType === serverTypes.EXTERNALCALL
                                    ? 'active'
                                    : '',
                            ]"
                            @click="
                                onClickServerDetail(serverTypes.EXTERNALCALL)
                            "
                        >
                            <div class="title">{{ i18n.externalCall }}</div>
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: externalCallTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    externalCallTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{
                                    externalCallTimePercent
                                }}</span>
                                <span class="circle">{{
                                    externalCallCount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fold" v-else>
                    <div class="subject" @click="onToggleActiveChart">
                        <svg-icon
                            :icon-type="iconTypes.fold"
                            :width="iconTypes.size"
                            :height="iconTypes.size"
                        ></svg-icon>
                        <span>{{ i18n.server }}</span>
                    </div>
                    <div class="content">
                        <div class="item">
                            <div class="graph">
                                <div
                                    class="bar"
                                    :style="{ width: serverTimePercent }"
                                ></div>
                            </div>
                            <div class="description">
                                <span class="focus">{{
                                    serverTimeFormat
                                }}</span>
                                <span class="line"></span>
                                <span class="text">{{ totalTimeFormat }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table" v-if="activeServerChart" :key="detailTableKey">
            <template v-if="showIndividualInSection">
                <simple-table
                    :size="'small'"
                    :columns="individualProfileTableColumns"
                    :rows="individualRows"
                    :row-template="individualProfileTableRowTemplate"
                    :margin-top="260"
                    @click="onClickIndividualTableRow"
                ></simple-table>
                <sql-window
                    :sql="sql"
                    :sql-key="sqlKey"
                    :inline-parameters="inlineParameters"
                    :bound-parameters="boundParameters"
                    :sherpa-oracle-server-config="sherpaOracleServerConfig"
                    :sherpa-oracle-instance-name="sherpaOracleInstanceName"
                    :sherpa-oracle-sequence="sherpaOracleSequence"
                    :sherpa-oracle-guid="sherpaOracleGuid"
                    v-if="showSqlWindow"
                    @cancel="() => (showSqlWindow = false)"
                ></sql-window>
            </template>
            <template v-else>
                <simple-table
                    :size="'small'"
                    :columns="profileTableColumns"
                    :rows="profileRows"
                    :row-template="profileTableRowTemplate"
                    :margin-top="260"
                ></simple-table>
            </template>
        </div>
    </div>
</template>

<script>
import SqlWindow from './SqlWindow';
import SimpleTable from './SimpleTable';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { printEscape, i18n } from '@common/utility';
import {
    mapState as baseMapState,
    mapGetters as baseMapGetters,
} from '../store/base';
import { mapState as toolbarMapState } from '../store/toolbar';
import { mapState, mapMutations, mapActions } from '../store/section';
import { getPercent, printSqlParams } from '../utility';
import { BACKEND_TYPES } from '../constant';

export const createTableMetadata = i18n => {
    return {
        methodTableColumns: [
            {
                key: 'text',
                name: i18n.detail,
                sort: true,
                width: '40%',
            },
            {
                key: 'api',
                name: i18n.api,
                sort: true,
            },
            {
                key: 'count',
                name: i18n.repeatCount,
                sort: true,
            },
            {
                key: 'methodTime',
                name: i18n.selfTimeSum,
                sort: true,
            },
            {
                key: 'averageMethod',
                name: i18n.selfTimeAverage,
                sort: true,
            },
            {
                key: 'totalTime',
                name: i18n.responseTimeSum,
                sort: true,
            },
            {
                key: 'average',
                name: i18n.responseTimeAverage,
                sort: true,
            },
        ],
        methodTableRowTemplate: `<tr>
    <td title="<!= text !>"><!= text  !></td>
    <td><!= api !></td>
    <td align="right"><!= countFormat !></td>
    <td align="right"><!= methodFormat !></td>
    <td align="right"><!= averageMethodFormat !></td>
    <td align="right"><!= totalTimeFormat !></td>
    <td align="right"><!= averageFormat !></td>
</tr>`,
        sqlTableColumns: [
            {
                key: 'text',
                name: i18n.detail,
                sort: true,
                width: '40%',
            },
            {
                key: 'dbConnectionNameOrNull',
                name: i18n.dbConnection,
                sort: true,
            },
            {
                key: 'count',
                name: i18n.repeatCount,
                sort: true,
            },
            {
                key: 'totalTime',
                name: i18n.responseTimeSum,
                sort: true,
            },
            {
                key: 'average',
                name: i18n.responseTimeAverage,
                sort: true,
            },
        ],
        sqlTableRowTemplate: `<tr>
    <td title="<!= text !>"><!= text  !></td>
    <td><!= dbConnectionNameOrNull !></td>
    <td align="right"><!= countFormat !></td>
    <td align="right"><!= totalTimeFormat !></td>
    <td align="right"><!= averageFormat !></td>
</tr>`,
        externalCallTableColumns: [
            {
                key: 'text',
                name: i18n.detail,
                sort: true,
                width: '40%',
            },
            {
                key: 'count',
                name: i18n.repeatCount,
                sort: true,
            },
            {
                key: 'totalTime',
                name: i18n.responseTimeSum,
                sort: true,
            },
            {
                key: 'average',
                name: i18n.responseTimeAverage,
                sort: true,
            },
        ],
        externalCallTableRowTemplate: `<tr>
    <td title="<!= text !>"><!= text  !></td>
    <td align="right"><!= countFormat !></td>
    <td align="right"><!= totalTimeFormat !></td>
    <td align="right"><!= averageFormat !></td>
</tr>`,

        individualMethodTableColumns: [
            {
                key: 'no',
                name: i18n.no,
                sort: true,
                width: '40px',
            },
            {
                key: 'detail',
                name: i18n.detail,
                sort: true,
                width: '60%',
            },
            {
                key: 'time',
                name: i18n.responseTime,
                sort: true,
            },
            {
                key: 'etc1',
                name: i18n.parameters,
                sort: true,
            },
            {
                key: 'etc2',
                name: i18n.return,
                sort: true,
            },
        ],
        individualMethodTableRowTemplate: `<tr>
    <td class="profile"><!= no !></td>
    <td><!= detailHtml  !></td>
    <td align="right"><!= timeFormat !></td>
    <td align="right"><!= etc1Format !></td>
    <td align="right"><!= etc2Format !></td>
</tr>`,
        individualSqlTableColumns: [
            {
                key: 'no',
                name: i18n.no,
                sort: true,
                width: '40px',
            },
            {
                key: 'detail',
                name: i18n.detail,
                sort: true,
                width: '60%',
            },
            {
                key: 'time',
                name: i18n.responseTime,
                sort: true,
            },
            {
                key: 'etc1',
                name: i18n.dbConnection,
                sort: true,
            },
            {
                key: 'etc2',
                name: i18n.inlineParam,
                sort: true,
            },
            {
                key: 'etc3',
                name: i18n.boundParam,
                sort: true,
            },
        ],
        individualSqlTableRowTemplate: `<tr>
    <td class="profile"><!= no !></td>
    <td><!= detailHtml  !></td>
    <td align="right"><!= timeFormat !></td>
    <td align="right"><!= etc1Format !></td>
    <td align="right"><!= etc2Format !></td>
    <td align="right"><!= etc3Format !></td>
</tr>`,
        individualExternalCallTableColumns: [
            {
                key: 'no',
                name: i18n.no,
                sort: true,
                width: '40px',
            },
            {
                key: 'detail',
                name: i18n.detail,
                sort: true,
                width: '60%',
            },
            {
                key: 'time',
                name: i18n.responseTime,
                sort: true,
            },
            {
                key: 'etc1',
                name: i18n.serviceExternalCall,
                sort: true,
            },
        ],
        individualExternalCallTableRowTemplate: `<tr>
    <td class="profile"><!= no !></td>
    <td><!= detailHtml  !></td>
    <td align="right"><!= timeFormat !></td>
    <td align="right"><!= etc1Format !></td>
</tr>`,
    };
};

export default {
    components: {
        SqlWindow,
        SimpleTable,
        SvgIcon,
    },
    inject: {
        i18n: {
            default: {
                no: 'No.',
                ms: 'ms',
                server: 'Server',
                client: 'Client',
                dom: 'DOM',
                network: 'Network',
                render: 'Render',
                method: 'Method',
                sql: 'SQL',
                externalCall: 'External Call',
                detail: 'Detail',
                api: 'API',
                repeatCount: 'Repeat Count',
                selfTimeSum: 'Sum of self time',
                selfTimeAverage: 'Average of self time',
                responseTimeSum: 'Sum of response time',
                responseTimeAverage: 'Average of response time',
                dbConnection: 'DB Connection',
                inlineParam: 'Inline Parameter',
                boundParam: 'Bound Parameter',
                showSql: 'Show SQL',
                serviceExternalCall: 'External Call',
            },
        },
    },
    computed: {
        ...baseMapState({
            clientTime: state =>
                state.transactionRow.frontEndElapsedTime +
                state.transactionRow.networkTime,
            serverTime: state => state.transactionRow.elapsedTime,
        }),
        ...baseMapGetters({
            params: 'transactionToProfileSearchParams',
        }),
        ...toolbarMapState({
            showIndividualInSection: state => state.showIndividualInSection,
        }),
        ...mapState({
            profileType: state => state.profileType,
            domTime: state => state.domTime,
            networkTime: state => state.networkTime,
            renderTime: state => state.renderTime,
            methodTime: state => state.methodTime,
            sqlTime: state => state.sqlTime,
            externalCallTime: state => state.externalCallTime,
            methodCount: state => state.methodRows.length,
            sqlCount: state => state.sqlRows.length,
            externalCallCount: state => state.externalCallRows.length,
            methodRows: state => {
                return state.methodRows.map(row => {
                    return {
                        ...row,
                        countFormat: row.count.toLocaleForAries(),
                        methodFormat: row.methodTime.toLocaleForAries(),
                        averageMethodFormat: row.averageMethod.toLocaleForAries(),
                        totalTimeFormat: row.totalTime.toLocaleForAries(),
                        averageFormat: row.average.toLocaleForAries(),
                    };
                });
            },
            sqlRows: state => {
                return state.sqlRows.map(row => {
                    return {
                        ...row,
                        countFormat: row.count.toLocaleForAries(),
                        totalTimeFormat: row.totalTime.toLocaleForAries(),
                        averageFormat: row.average.toLocaleForAries(),
                    };
                });
            },
            externalCallRows: state => {
                return state.externalCallRows.map(row => {
                    return {
                        ...row,
                        countFormat: row.count.toLocaleForAries(),
                        totalTimeFormat: row.totalTime.toLocaleForAries(),
                        averageFormat: row.average.toLocaleForAries(),
                    };
                });
            },
            individualRows: state => {
                return state.individualRows.map(row => {
                    const data = {
                        detailHtml: printEscape(row.detail),
                        timeFormat: row.time.toLocaleForAries(),
                    };

                    if (state.profileType === BACKEND_TYPES.METHOD) {
                        data.etc1Format = row.etc1;
                        data.etc2Format = row.etc2;
                    } else if (state.profileType === BACKEND_TYPES.SQL) {
                        data.detailHtml = `<span class="detail">${i18n.get(
                            'ui.label.showSql'
                        )}</span> ${data.detailHtml}`;
                        data.etc1Format =
                            typeof row.etc1 === 'string' ? row.etc1 : '';
                        data.etc2Format = printSqlParams(row.etc2);
                        data.etc3Format = printSqlParams(row.etc3);
                    } else if (
                        state.profileType === BACKEND_TYPES.EXTERNALCALL
                    ) {
                        data.etc1Format = row.etc1;
                    }

                    return {
                        ...row,
                        ...data,
                    };
                });
            },
        }),
        totalTime() {
            return this.clientTime + this.serverTime;
        },
        totalTimeFormat() {
            return `${this.totalTime.toLocaleForAries()}${this.i18n.ms}`;
        },

        clientTimeFormat() {
            return `${this.clientTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        clientTimePercent() {
            return getPercent(this.clientTime, this.totalTime);
        },
        domTimeFormat() {
            return `${this.domTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        domTimePercent() {
            return getPercent(this.domTime, this.clientTime);
        },
        networkTimeFormat() {
            return `${this.networkTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        networkTimePercent() {
            return getPercent(this.networkTime, this.clientTime);
        },
        renderTimeFormat() {
            return `${this.renderTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        renderTimePercent() {
            return getPercent(this.renderTime, this.clientTime);
        },

        serverTimeFormat() {
            return `${this.serverTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        serverTimePercent() {
            return getPercent(this.serverTime, this.totalTime);
        },
        methodTimeFormat() {
            return `${this.methodTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        methodTimePercent() {
            return getPercent(this.methodTime, this.serverTime);
        },
        sqlTimeFormat() {
            return `${this.sqlTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        sqlTimePercent() {
            return getPercent(this.sqlTime, this.serverTime);
        },
        externalCallTimeFormat() {
            return `${this.externalCallTime.toLocaleForAries()}${this.i18n.ms}`;
        },
        externalCallTimePercent() {
            return getPercent(this.externalCallTime, this.serverTime);
        },

        // 하단 상세 테이블 관련 데이터
        profileTableColumns() {
            if (this.profileType === this.serverTypes.SQL)
                return this.sqlTableColumns;
            else if (this.profileType === this.serverTypes.EXTERNALCALL)
                return this.externalCallTableColumns;
            return this.methodTableColumns;
        },
        profileRows() {
            if (this.profileType === this.serverTypes.SQL) return this.sqlRows;
            else if (this.profileType === this.serverTypes.EXTERNALCALL)
                return this.externalCallRows;
            return this.methodRows;
        },
        profileTableRowTemplate() {
            if (this.profileType === this.serverTypes.SQL)
                return this.sqlTableRowTemplate;
            else if (this.profileType === this.serverTypes.EXTERNALCALL)
                return this.externalCallTableRowTemplate;
            return this.methodTableRowTemplate;
        },

        // 하단 상세 테이블 관련 데이터 (개별)
        individualProfileTableColumns() {
            if (this.profileType === this.serverTypes.SQL)
                return this.individualSqlTableColumns;
            else if (this.profileType === this.serverTypes.EXTERNALCALL)
                return this.individualExternalCallTableColumns;
            return this.individualMethodTableColumns;
        },
        individualProfileTableRowTemplate() {
            if (this.profileType === this.serverTypes.SQL)
                return this.individualSqlTableRowTemplate;
            else if (this.profileType === this.serverTypes.EXTERNALCALL)
                return this.individualExternalCallTableRowTemplate;
            return this.individualMethodTableRowTemplate;
        },

        // "서버 차트 열림, 클라이언트 차트 닫힘" 상태에서 클라이언트 값이 0이 때, 열림/닫힘 효과를 막기 위한 클래스
        interactionChartClasses() {
            return ['subject', this.clientTime === 0 ? 'no-click' : ''];
        },
    },
    data() {
        const tableMetadata = createTableMetadata(this.i18n);

        return {
            iconTypes: {
                open: ICON_TYPE.hierarchyOpen,
                fold: ICON_TYPE.hierarchyClose,
                size: 10,
            },
            activeServerChart: true,
            serverTypes: BACKEND_TYPES,
            detailTableKey: 1,

            showSqlWindow: false,
            sql: '',
            sqlKey: -1,
            inlineParameters: [],
            boundParameters: [],
            sherpaOracleServerConfig: '',
            sherpaOracleInstanceName: '',
            sherpaOracleSequence: -1,
            sherpaOracleGuid: '',

            ...tableMetadata,
        };
    },
    watch: {
        profileType(newVal, oldVal) {
            // 트랜잭션 테이블 로우 선택시 상세 테이블은 무조건 리셋한다.
            if (newVal !== oldVal) this.detailTableKey += 1;

            // 개별 보기가 활성화 되있을 경우
            if (this.showIndividualInSection)
                this.loadIndividualRows(this.params);
        },
        showIndividualInSection(newVal, oldVal) {
            // 상세 테이블 개별로 변경시 리셋한다.
            if (newVal !== oldVal) this.detailTableKey += 1;

            // 개별 보기가 활성화 되있을 경우
            if (newVal) this.loadIndividualRows(this.params);
        },
    },
    methods: {
        ...mapMutations(['changeProfileType']),
        ...mapActions(['loadIndividualRows']),
        onToggleActiveChart() {
            // 서버 시간은 무조건 존재하기 때문에 클라이언트 시간만 확인하면 된다.
            if (this.clientTime !== 0)
                this.activeServerChart = !this.activeServerChart;
        },
        onClickServerDetail(type) {
            this.detailTableKey += 1;
            this.changeProfileType(type);
        },
        onClickIndividualTableRow(row, e) {
            if (e.target.className === 'profile') {
                this.$emit('search-profile', row.data.no);
            } else if (e.target.className === 'detail') {
                this.sql = row.data.detail;
                this.sqlKey = row.data.sqlKey;
                this.inlineParameters =
                    row.data.etc2 === null ? [] : row.data.etc2;
                this.boundParameters =
                    row.data.etc3 === null ? [] : row.data.etc3;
                this.sherpaOracleServerConfig =
                    row.data.sherpaOracleServerConfig;
                this.sherpaOracleInstanceName =
                    row.data.sherpaOracleInstanceName;
                this.sherpaOracleSequence = row.data.sherpaOracleSequence;
                this.sherpaOracleGuid = row.data.sherpaOracleGuid;
                this.showSqlWindow = true;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.section-tab {
    @include themify($themes) {
        > .chart {
            > .client,
            > .server {
                border-radius: 4px;
                margin-bottom: 4px;
                border: solid 1px themed('section-tab-chart-border-color');

                > .open,
                > .fold {
                    padding: 28px 24px;
                    display: flex;

                    > .subject {
                        flex: 0 0 130px;
                        font-size: 14px;
                        font-weight: bold;

                        &:not(.no-click) {
                            cursor: pointer;
                        }

                        > span {
                            margin-left: 8px;
                        }
                    }
                    > .content {
                        flex: 1px;
                        > .item {
                            display: flex;
                            > .graph {
                                background-color: themed(
                                    'section-tab-chart-item-graph-background-color'
                                );
                                border-radius: 2px;
                            }
                            > .description {
                                text-align: right;
                                > .focus {
                                    font-size: 12px;
                                    font-weight: bold;
                                }
                                > .line {
                                    height: 18px;
                                    width: 1px;
                                    margin: 0 16px;
                                    border-left: 1px solid
                                        themed(
                                            'section-tab-chart-item-line-border-color'
                                        );
                                }
                                > .text {
                                    font-size: 11px;
                                    color: themed(
                                        'section-tab-chart-item-text-font-color'
                                    );
                                }
                            }
                        }
                    }
                }

                > .open {
                    box-shadow: themed('section-tab-chart-item-box-shadow');
                    > .content {
                        > .item {
                            height: 40px;
                            border-radius: 3px;

                            &:hover {
                                background-color: themed(
                                    'section-tab-chart-item-hover-background-color'
                                );
                            }
                            &.active {
                                background-color: themed(
                                    'section-tab-chart-item-active-background-color'
                                );
                            }
                            &.dom {
                                .bar {
                                    background: #7931a5;
                                }
                            }
                            &.network {
                                .bar {
                                    background: #ff8d00;
                                }
                            }
                            &.render {
                                .bar {
                                    background: #fda7ec;
                                }
                            }
                            &.method {
                                .bar {
                                    background: #4a7dff;
                                }
                                .circle {
                                    border-color: #4a7dff;
                                }
                            }
                            &.sql {
                                .bar {
                                    background: #9ed5ff;
                                }
                                .circle {
                                    border-color: #9ed5ff;
                                }
                            }
                            &.external-call {
                                .bar {
                                    background: #ffdc04;
                                }
                                .circle {
                                    border-color: #ffdc04;
                                }
                            }

                            > .title {
                                flex: 0 0 100px;
                                margin-top: 12px;
                                padding-left: 22px;
                                color: themed(
                                    'section-tab-chart-item-font-color'
                                );
                            }
                            > .graph {
                                flex: 1;
                                margin-top: 18px;
                                height: 8px;
                                > .bar {
                                    height: 8px;
                                    border-radius: 2px;
                                    max-width: 100%;
                                }
                            }
                            > .description {
                                flex: 0 0 230px;
                                margin-top: 10px;
                                padding-right: 16px;
                                > .circle {
                                    display: inline-block;
                                    text-align: center;
                                    width: 24px;
                                    height: 24px;
                                    line-height: 24px;
                                    font-weight: bold;
                                    margin-left: 17px;
                                    margin-top: -2px;
                                    border-radius: 50%;
                                    border-width: 1px;
                                    border-style: solid;
                                    color: themed(
                                        'section-tab-chart-item-circle-font-color'
                                    );
                                }
                            }
                        }
                    }
                }

                > .fold {
                    > .content {
                        > .item {
                            > .graph {
                                flex: 1;
                                margin-top: 2px;
                                height: 16px;

                                > .bar {
                                    height: 16px;
                                    border-radius: 2px;
                                    background-color: themed(
                                        'section-tab-chart-fold-item-graph-background-color'
                                    );
                                }
                            }
                            > .description {
                                flex: 0 0 200px;
                                height: 20px;
                                > .focus {
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }

            > .server {
                > .open {
                    > .content {
                        > .item {
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
}
</style>
