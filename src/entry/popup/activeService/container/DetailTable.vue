<template>
    <div class="detail-table">
        <x-table
            :table-type="'nowrap'"
            :table-effect="'stripeless'"
            :table-size="'normal'"
            :scroll-height="tableHeight"
            :scroll-event="false"
            :select-row-effect="false"
            :sort-cache="true"
            :row-height="27"
            :resize="true"
            :columns="columns"
            :data="rows"
            :template-row="rowTemplate"
            @click="(row, e) => $emit('click', row, e)"
        >
        </x-table>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import { getDayjs } from '@common/base';
import { getItem } from '@entry/popup/xviewAnalysis/storage';
import { mapState } from '../vuex';

export const createTableColumns = (platform, type, i18n) => {
    let columns = [];

    const status = getItem(`vue/activeServiceColumnsV4#${type}`, [], Array);

    const DEFAULT_COLUMNS_1 = [
        {
            key: 'scoreType',
            name: i18n.status,
            sort: false,
            width: '35px',
            active: true,
        },
        {
            key: 'domainName',
            name: i18n.domain,
            sort: true,
            active: true,
        },
        {
            key: 'sysId',
            name: i18n.instance,
            sort: true,
            active: true,
        },
    ];

    const DEFAULT_COLUMNS_2 = [
        {
            key: 'txid',
            name: i18n.txid,
            sort: true,
            active: false,
        },
        {
            key: 'asyncCallerId',
            name: i18n.asyncCallerId,
            sort: true,
            active: false,
        },
        {
            key: 'serviceHashText',
            name: i18n.application,
            sort: true,
            width: '20%',
            active: true,
        },
        {
            key: 'alias',
            name: i18n.applicationAlias,
            sort: true,
            width: '15%',
            active: false,
        },
        {
            key: 'elapsedTime',
            name: `${i18n.performTime} (${i18n.ms})`,
            sort: true,
            active: true,
        },
    ];

    if (type === 'APPLICATION') {
        columns = [
            ...DEFAULT_COLUMNS_1,
            ...[
                {
                    key: 'bizId',
                    name: i18n.business,
                    sort: true,
                    active: true,
                },
                {
                    key: 'ipaddr',
                    name: i18n.clientIp,
                    sort: true,
                    active: true,
                },
                {
                    key: 'startTime',
                    name: i18n.startTime,
                    sort: true,
                    active: true,
                },
                {
                    key: 'statusFormat',
                    name: i18n.statusPerformTime,
                    sort: false,
                    width: '100px',
                    active: true,
                },
                {
                    key: 'cpuTime',
                    name: `${i18n.cpu} (${i18n.ms})`,
                    sort: true,
                    active: true,
                },
                {
                    key: 'sqlCount',
                    name: i18n.sqlCount,
                    sort: true,
                    active: true,
                },
                {
                    key: 'fetchCount',
                    name: i18n.fetchCount,
                    sort: true,
                    active: true,
                },
                {
                    key: 'batchCount',
                    name: i18n.batchCount,
                    sort: true,
                    active: false,
                },
                {
                    key: 'batchTime',
                    name: i18n.batchTime,
                    sort: true,
                    active: false,
                },
            ],
            ...DEFAULT_COLUMNS_2,
        ];
    } else if (type === 'SQL') {
        columns = [
            ...DEFAULT_COLUMNS_1,
            ...[
                {
                    key: 'runningFullText',
                    name: i18n.sql,
                    sort: false,
                    width: '25%',
                    active: true,
                },
                {
                    key: 'jndiAndDb',
                    name:
                        platform === 'net'
                            ? i18n.connectionString
                            : i18n.jndiAndDBName,
                    sort: false,
                    active: true,
                },
                {
                    key: 'runningTime',
                    name: `${i18n.sql} ${i18n.performTime} (${i18n.ms})`,
                    sort: false,
                    active: true,
                },
            ],
            ...DEFAULT_COLUMNS_2,
        ];
    } else if (type === 'EXTERNALCALL') {
        columns = [
            ...DEFAULT_COLUMNS_1,
            ...[
                {
                    key: 'runningFullText',
                    name: i18n.txCall,
                    sort: false,
                    width: '25%',
                    active: true,
                },
                {
                    key: 'runningTime',
                    name: `${i18n.txCall} ${i18n.performTime} (${i18n.ms})`,
                    sort: false,
                    active: true,
                },
            ],
            ...DEFAULT_COLUMNS_2,
        ];
    }

    return columns.map((col, i) => {
        return {
            ...col,
            active: !status[i] ? col.active : status[i] === 'true',
        };
    });
};

const ROW_TEMPLATES = {
    APPLICATION: `
<tr>
    <td align="center"><i class="score <!= scoreType !>"></i></td>
    <td><!= domainName !></td>
    <td><!= sysId !></td>
    <td><!= bizId !></td>
    <td><!= ipaddr !></td>
    <td><!= startTimeFormat !></td>
    <td>
        <! if(runningMode === 'SQL' || runningMode === 'EXTERNALCALL') { !>
        <span class="status-link detail"><!= statusFormat !></span>
        <! } else { !>
        <!= statusFormat !>
        <! } !>
    </td>
    <td align="right"><!= cpuTimeFormat !></td>
    <td align="right"><!= sqlCountFormat !></td>
    <td align="right"><!= fetchCountFormat !></td>
    <td align="right"><!= batchCountFormat !></td>
    <td align="right"><!= batchTimeFormat !></td>
    <td><!= txid !></td>
    <td><! if(asyncCallerId != '') { !><span class="async-link"><!= asyncCallerId !></span><! } !></td>
    <td title="<!= serviceHashText !>"><span class="status-link service"><!= serviceHashText !></span></td>
    <td title="<!= alias !>"><!= alias !></td>
    <td align="right"><!= elapsedTimeFormat !></td>
</tr>
`,
    SQL: `
<tr>
    <td align="center"><i class="score <!= scoreType !>"></i></td>
    <td><!= domainName !></td>
    <td><!= sysId !></td>
    <td>
        <span class="detail-link"><!= i18n.show !></span>
        <span class="full-text"><!= runningFullText !></span>
    </td>
    <td><!= jndiAndDb !></td>
    <td align="right"><!= runningTimeFormat!></td>
    <td><!= txid !></td>
    <td><! if(asyncCallerId != '') { !><span class="async-link"><!= asyncCallerId !></span><! } !></td>
    <td title="<!= serviceHashText !>"><span class="status-link service"><!= serviceHashText !></span></td>
    <td title="<!= alias !>"><!= alias !></td>
    <td align="right"><!= elapsedTimeFormat !></td>
</tr>
`,
    EXTERNALCALL: `
<tr>
    <td align="center"><i class="score <!= scoreType !>"></i></td>
    <td><!= domainName !></td>
    <td><!= sysId !></td>
    <td>
        <span class="detail-link"><!= i18n.show !></span>
        <span class="full-text"><!= runningFullText !></span>
    </td>
    <td align="right"><!= runningTimeFormat!></td>
    <td><!= txid !></td>
    <td><! if(asyncCallerId != '') { !><span class="async-link"><!= asyncCallerId !></span><! } !></td>
    <td title="<!= serviceHashText !>"><span class="status-link service"><!= serviceHashText !></span></td>
    <td title="<!= alias !>"><!= alias !></td>
    <td align="right"><!= elapsedTimeFormat !></td>
</tr>
`,
};

export default {
    inject: ['i18n', 'platform'],
    components: {
        XTable,
    },
    computed: {
        ...mapState({
            activeTab: state => state.activeTab,
            filteredData: state => state.filteredData,
            tableHeight: state => state.tableHeight,
        }),
        rowTemplate() {
            return ROW_TEMPLATES[this.activeTab];
        },
        rows() {
            if (this.activeTab === 'APPLICATION') {
                return this.filteredData.map(row => {
                    let statusFormat = '';

                    if (
                        row.statusName !== null &&
                        row.statusName !== 'NONE' &&
                        row.statusName !== 'RUN'
                    )
                        statusFormat = `${
                            this.i18n.activeServiceStatus[row.statusName]
                        } (${row.runningTime.toLocaleForAries()})`;

                    return {
                        statusFormat: statusFormat,
                        startTimeFormat: getDayjs(row.startTime).format(
                            'HH:mm:ss'
                        ),
                        cpuTimeFormat: row.cpuTime.toLocaleForAries(),
                        sqlCountFormat: row.sqlCount.toLocaleForAries(),
                        fetchCountFormat: row.fetchCount.toLocaleForAries(),
                        elapsedTimeFormat: row.elapsedTime.toLocaleForAries(),
                        batchCountFormat: row.batchCount.toLocaleForAries(),
                        batchTimeFormat: row.batchTime.toLocaleForAries(),
                        ...row,
                    };
                });
            } else {
                return this.filteredData.map(row => {
                    return {
                        i18n: this.i18n,
                        runningFullText: row.runningFullText,
                        runningTimeFormat: row.runningTime.toLocaleForAries(),
                        elapsedTimeFormat: row.elapsedTime.toLocaleForAries(),
                        ...row,
                    };
                });
            }
        },
        columns() {
            return createTableColumns(this.platform, this.activeTab, this.i18n);
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-table {
    @import '../style/active-score-cell.scss';
    @include active-score-cell;

    ::v-deep tr {
        .async-link {
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
</style>
