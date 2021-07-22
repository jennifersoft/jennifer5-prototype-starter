<template>
    <div class="group-view">
        <div class="title">
            <div class="left">{{ i18n[groupType] }}</div>
            <div class="right">
                <dropdown
                    :is-simple-style="true"
                    :width="160"
                    :items="sortByColumns"
                    :selected-value="chartSort"
                    @onchange="onCreateChartData"
                ></dropdown>
            </div>
        </div>
        <group-chart
            :class="[activeLoading ? 'disabled' : '']"
            :data="chartData"
            :active-index="chartIndex"
            :active-sequence="chartSequence"
            @onchange="onChangeGroupData"
        ></group-chart>
    </div>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import GroupChart from '../component/GroupChart';
import { mapState, mapActions } from '../store/base';

const EXCEPT_COLUMNS = [
    'groupIndex',
    'groupName',
    'transactionIds',
    'startTime',
    'endTime',
];

function getCallCount(transactionIds) {
    return Object.values(transactionIds)
        .map(ids => ids.length)
        .reduce((acc, cur) => acc + cur, 0);
}
export default {
    components: {
        Dropdown,
        GroupChart,
    },
    inject: {
        i18n: {
            default: {
                application: 'Application',
                guid: 'GUID',
                clientId: 'Client ID',
                userId: 'User ID',
                averageResponseTime: 'Avg. Response Time',
                recentResponseTime: 'Rec. Response Time',
                maxResponseTime: 'Max. Response Time',
                errorCount: 'Error Count',
                callCount: 'Call Count',
                sqlTime: 'SQL Time',
                cpuTime: 'CPU Time',
                fetchTime: 'Fetch Time',
            },
        },
    },
    props: {
        activeLoading: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapState({
            groupType: state => state.groupType,
            groupRows: state => {
                return state.groupRows.map((row, index) => {
                    return {
                        ...row,
                        groupIndex: index,
                        callCount: getCallCount(row.transactionIds),
                    };
                });
            },
        }),
        sortByColumns() {
            return Object.keys(this.groupRows[0])
                .filter(key => !EXCEPT_COLUMNS.includes(key))
                .map(key => {
                    return {
                        text: this.i18n[key],
                        value: key,
                    };
                });
        },
    },
    data() {
        return {
            chartData: [],
            chartIndex: -1,
            chartSort: 'callCount',
            chartSequence: 0,
        };
    },
    methods: {
        ...mapActions(['selectGroupRow']),

        onCreateChartData({ value }) {
            const sortedGroupRows = this.groupRows.sort(
                (a, b) => b[value] - a[value]
            );
            const topRow = sortedGroupRows[0];

            this.chartData = sortedGroupRows.map((row, i) => {
                return {
                    index: row.groupIndex,
                    name: row.groupName,
                    value: row[value].toLocaleForAries(),
                    rate: row[value] / topRow[value],
                    seq: i,
                };
            });
            this.chartSort = value;

            this.onChangeGroupData(this.chartData[0]);
        },

        onChangeGroupData({ index }) {
            if (this.activeLoading) return;

            if (this.chartIndex !== index) {
                this.chartIndex = index;
                this.updateTransactionTable(index);
            }
        },

        updateTransactionTable(index) {
            // 첫번째 로우를 선택하고, 해당 로우의 트랜잭션 아이디로 서버에서 데이터를 가져온다.
            this.selectGroupRow(index);

            // 트랜잭션 및 프로파일 데이터 서버에서 다시 가져오기
            this.$emit('reload-transaction-and-profile-data');
        },

        keydownEventHandler(e) {
            if (this.activeLoading) return;

            if (e.code === 'Tab') {
                e.preventDefault();

                const activeNode = this.chartData.filter(
                    data => data.index === this.chartIndex
                )[0];
                let nextSeq = activeNode.seq + 1;
                if (nextSeq === this.chartData.length) nextSeq = 0;

                this.chartSequence = nextSeq;
                this.onChangeGroupData({
                    index: this.chartData[nextSeq].index,
                    seq: nextSeq,
                });
            }
        },
    },
    beforeMount() {
        // 최초 화면 로드시 차트 데이터 만들기 (선택된 컬럼 내림차순)
        this.onCreateChartData({ value: this.chartSort });

        // 탭 키를 눌렀을 경우, 다음 그룹으로 변경한다.
        window.addEventListener('keydown', this.keydownEventHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.keydownEventHandler);
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.group-view {
    height: 100%;
    display: flex;
    flex-direction: column;

    @include themify($themes) {
        > .title {
            display: flex;
            flex-direction: row;
            padding: 14px;
            align-items: center;
            border-bottom: 1px solid themed('layout-border-color');

            > .left,
            > .right {
                flex: 1;
            }

            > .left {
                color: themed('group-view-title-font-color');
                font-size: 14px;
                font-weight: 500;
            }
        }
        > .group-chart {
            flex-grow: 1;
        }
    }
}
</style>
