<template>
    <div class="table-panel">
        <div class="toolbar">
            <div class="left">{{ i18n.dir }} : {{ dirPath }}</div>
            <div class="right">
                <btn
                    :items="[{ text: i18n.memoryDump }]"
                    :loading="memoryDumpLoading"
                    @click.native="() => $emit('memory-dump')"
                    v-if="permMemoryDump"
                />
                <btn
                    :items="[{ text: i18n.serviceDump }]"
                    :loading="dumpLoading"
                    @click.native="() => $emit('dump')"
                    v-if="permServiceDump"
                />
                <btn
                    :items="[{ text: i18n.delete }]"
                    :loading="deleteLoading"
                    :disabled="checkedKeys.length === 0"
                    @click.native="() => $emit('delete', checkedKeys)"
                />
            </div>
        </div>
        <table ref="grid" class="table normal nowrap">
            <thead>
                <tr>
                    <th width="50px">{{ i18n.num }}</th>
                    <th>{{ i18n.instance }}</th>
                    <th>{{ i18n.ip }}</th>
                    <th>{{ i18n.creationTime }}</th>
                    <th width="35%">{{ i18n.dumpName }}</th>
                    <th>{{ i18n.size }} ({{ i18n.bytes }})</th>
                    <th width="50px">
                        <input type="checkbox" v-model="allCheck" />
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import Table from 'juijs-grid/src/components/table';
import XTable from 'juijs-grid/src/components/xtable';
import { getDayjs, serverDateFormat } from '@common/base';
import { setSortEff, checkPermission } from '@common/utility';
import { PermissionDef } from '@common/definition';
import { UIManager } from '@common/legacy/UIManager';
import Btn from '@vuejs/component/button/Btn';

jui.use(Table, XTable);

export default {
    components: {
        Btn,
    },
    inject: ['i18n', 'platform'],
    props: {
        domainId: {
            type: Number,
            required: false,
            default: -1,
        },
        dirPath: {
            type: String,
            required: false,
            default: '',
        },
        dumpLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        memoryDumpLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        deleteLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        tableRows: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    watch: {
        tableRows(data) {
            this.tableObj.update(
                data.map(row => {
                    return {
                        checked: false,
                        timeFormat: getDayjs(row.time).format(
                            `${serverDateFormat.longWithSec}`
                        ),
                        sizeFormat: row.size.toLocaleForAries(),
                        ...row,
                    };
                })
            );

            this.allCheck = false;
            this.checkedKeys = [];
        },
        allCheck(checked) {
            const data = this.tableObj.listData();
            const elements = document.getElementsByClassName('row-checkbox');

            if (checked) this.checkedKeys = data.map(row => row.file_name);
            else this.checkedKeys = [];

            for (let i = 0; i < elements.length; i++) {
                elements[i].checked = checked;
            }
        },
    },
    data() {
        return {
            allCheck: false,
            checkedKeys: [],
            tableObj: null,
        };
    },
    computed: {
        permMemoryDump() {
            return (
                checkPermission(PermissionDef.ACTIVE_MEMORY_DUMP) &&
                this.platform === 'net'
            );
        },
        permServiceDump() {
            return checkPermission(PermissionDef.ACTIVE_SERVICE_DUMP);
        },
    },
    mounted() {
        this.tableObj = jui.create('grid.table', this.$refs.grid, {
            fields: [
                null,
                'short_name',
                'ip',
                'time',
                'file_name',
                'size',
                null,
            ],
            sort: [1, 2, 3, 4, 5],
            resize: true,
            event: {
                sort: setSortEff,
                click: (row, e) => {
                    const cls = e.target.className;

                    if (cls === 'row-link') {
                        UIManager.serviceDumpDetail(
                            '/popup/servicedump',
                            this.domainId,
                            parseInt(row.data.agent_id),
                            row.data.file_name
                        );
                    } else if (cls === 'row-checkbox') {
                        const key = row.data.file_name;
                        if (e.target.checked) {
                            if (!this.checkedKeys.includes(key))
                                this.checkedKeys.push(key);
                        } else {
                            this.checkedKeys = this.checkedKeys.filter(
                                k => k !== key
                            );
                        }
                    }
                },
            },
            tpl: {
                row: `<tr>
    <td align="right"><!= row.seq !></td>
    <td><!= short_name !></td>
    <td><!= ip !></td>
    <td><!= timeFormat !></td>
    <td title="<!= file_name !>"><span class="row-link"><!= file_name !></span></td>
    <td align="right"><!= sizeFormat !></td>
    <td><input type="checkbox" class="row-checkbox" /></td>
</tr>`,
            },
        });
    },
};
</script>

<style lang="scss" scoped>
.table-panel {
    margin-top: 10px;

    .toolbar {
        display: flex;
        > .left {
            flex: 2;
            line-height: 26px;
        }
        > .right {
            text-align: right;
            flex: 1;
        }
    }

    ::v-deep tr {
        span.row-link {
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
</style>
