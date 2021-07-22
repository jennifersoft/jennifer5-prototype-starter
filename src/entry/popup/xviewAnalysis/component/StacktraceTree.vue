<template>
    <div ref="stacktraceTree" class="xtable scroll">
        <table class="table simple headline nowrap hover">
            <thead>
                <tr>
                    <th width="600px">{{ i18n.method }}</th>
                    <th>{{ i18n.selfTime }}</th>
                    <th>{{ i18n.elapsedTime }}</th>
                    <th>{{ i18n.measureCount }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import XTableComp from 'juijs-grid/src/components/xtable';
import { i18n } from '@common/utility';
import { createTreeIndexes } from '../utility';

jui.use(XTableComp);

const ROW_TEMPLATE = `
<!
    var hasChild = row.children.length > 0;
!>
<tr>
    <td title="<!= methodName !>" style="padding-left: <!= (row.depth * 7) + 5 !>px">
        <! if(hasChild) { !>
        <i style="margin-left: -2px;" class="icon-<! if(row.type == "fold") { !>left<! } else { !>right<! } !>"></i>
        <! } else { !>
        <i style="margin-right: 10px;" class="icon-blank"></i>
        <! } !>

        <! if (row.index === "0" && methodName !== "[ROOT]") { !>
        <span class="detail">${i18n.get(
            'ui.label.showStacktraceParents'
        )}</span>
        <! } !>
        <!= methodName !>
    </td>
    <td>
        <! if(selfTime != -1) { !>
        <div class="time-layout">
            <div class="time"><!= selfTimeFormat !></div>
            <div class="time-bar">
                <div class="time-bar-per" style="width: <!= selfRate.toFixed(1) !>%;"></div>
                <div class="time-bar-text"><!= selfRate.toFixed(1) !>%</div>
            </div>
        </div>
        <! } !>
    </td>
    <td align="right"><!= elapsedTimeFormat !></td>
    <td align="right"><!= callCountFormat !></td>
</tr>
`;

export default {
    inject: {
        i18n: {
            default: {
                method: 'Method',
                selfTime: 'Self Time',
                elapsedTime: 'Elapsed Time',
                measureCount: 'Measure Count',
            },
        },
    },
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        rows: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    data() {
        return {
            parentRows: [],
        };
    },
    computed: {
        tableHeight() {
            return this.height - 90;
        },
    },
    watch: {
        width(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.table.scrollWidth(newVal, true);
            this.table.resize();
        },
        height(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.table.height(newVal);
            this.table.resize();
        },
    },
    methods: {
        getRootNode(treeData) {
            for (let i = 0; i < treeData.length; i++) {
                if (treeData[i].children.length >= 2) {
                    return treeData[i];
                }
            }

            return null;
        },
        getParentRows(data, parent, parents = []) {
            const filteredData = data.filter(
                row => row.key === parent.parentKey
            );
            if (filteredData.length === 1) {
                parents.push(filteredData[0]);
                return this.getParentRows(data, filteredData[0], parents);
            }
            return parents;
        },
        covertToTreeData(
            data,
            rootRow = {
                children: [],
                data: {
                    methodName: '[ROOT]',
                    selfRate: -1,
                    selfTime: -1,
                    selfTimeFormat: '',
                    elapsedTime: -1,
                    elapsedTimeFormat: '',
                    callCount: -1,
                    callCountFormat: '',
                },
                index: '0',
                type: 'open',
            },
            rootKey = '0'
        ) {
            const newData = [rootRow];
            const rowMap = {};
            const rootRows = [];
            let rootIndex = 0;

            data.forEach(row => {
                const newRow = {
                    children: [],
                    data: row,
                    index: null,
                    type: 'open',
                };

                newData.push(newRow);
                rowMap[row.key] = newRow;

                if (row.parentKey == rootKey) {
                    newRow.index = '0.' + rootIndex;
                    newRow.type = 'fold';
                    rootRows.push(newRow);
                    rootIndex++;
                }
            });

            newData.forEach(row => {
                const parent = rowMap[row.data.parentKey];
                if (parent) parent.children.push(row);
            });

            if (rootRows.length == 0) {
                return [];
            } else {
                rootRows.forEach(rootRow => {
                    createTreeIndexes(rootRow, rootRow.index);
                });

                const result = newData
                    .filter(row => row.index != null)
                    .sort((a, b) => {
                        if (a.index < b.index) return -1;
                        else if (a.index > b.index) return 1;
                        return 0;
                    });

                return result;
            }
        },
    },
    mounted() {
        const self = this;

        this.table = jui.create('grid.xtable', this.$refs.stacktraceTree, {
            fields: ['methodName', 'selfTime', 'elapsedTime', 'callCount'],
            resize: true,
            buffer: 'vscroll',
            width: this.width,
            scrollWidth: this.width,
            scrollHeight: this.tableHeight,
            rowHeight: 27,
            event: {
                select: function(row, e) {
                    if (e.target.className === 'detail') {
                        self.$emit('update-parents', self.parentRows);
                    } else {
                        if (row.children.length > 0) {
                            if (row.type == 'fold') {
                                this.open(row.index);
                            } else {
                                this.fold(row.index);
                            }
                        }

                        this.select(row.index);
                    }
                },
            },
            tpl: {
                row: ROW_TEMPLATE,
            },
        });

        if (this.rows.length > 0) {
            const treeData = this.covertToTreeData(this.rows);
            const rootNode = this.getRootNode(treeData);

            if (rootNode === null) {
                this.parentRows = [];
                this.table.updateTree(treeData);
            } else {
                this.parentRows = this.getParentRows(this.rows, rootNode.data);

                const parentKeys = this.parentRows.map(row => row.key);
                const filteredRows = this.rows.filter(
                    row =>
                        !parentKeys.includes(row.key) &&
                        row.key !== rootNode.data.key
                );
                const filteredTreeData = this.covertToTreeData(
                    filteredRows,
                    {
                        children: [],
                        data: { ...rootNode.data, parentKey: null },
                        index: '0',
                        type: 'open',
                    },
                    rootNode.data.key
                );

                this.table.updateTree(filteredTreeData);
            }
        }
    },
};
</script>

<style lang="scss" scoped></style>
