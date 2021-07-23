<template>
    <TransitionGroup name="flip" tag="div" class="tree-container">
        <Row
            v-for="r in treeRendered"
            :key="r.rowId"
            :no-moving-row="noMovingRow"
            :indent="r.indent"
            :hide="r.hide"
            :label="r.label"
            :resource-type="r.resourceType"
            :check="r.check"
            :fold="r.fold"
            :selected="r.selected"
            :disabled="r.disabled || false"
            :show-warning-icon="(r.disabled && r.showWarningIcon) || false"
            :tail-style="r.tailStyle"
            :no-interaction="r.noInteraction"
            :no-fold-padding="r.noFoldPadding"
            :large="large"
            :status="r.status"
            @rowClicked="rowClickHandler(r.rowId)"
            @foldClicked="foldClickHandler(r.rowId)"
            @checkClicked="checkClickHandler(r.rowId)"
        />
    </TransitionGroup>
</template>

<script>
/**
 * @TODO Row :key 값 바꾸기
 * @TODO foldState 초기값 반영 및 클릭 이벤트 연동하기
 */
import Row from '../row/Row.vue';
import {
    getRow,
    cleanCheck,
    checkAll,
    uncheckAll,
    _parentCheck,
} from './treeAction';

import { selectedTailStyle } from '@vuejs/component/listSelector/listAction.js';

export default {
    components: {
        Row,
    },
    props: {
        tree: {
            type: Array,
            required: true,
        },
        selectable: {
            type: Boolean,
            default: false,
        },
        checkable: {
            type: Boolean,
            default: true,
        },
        // 모든 자식을 체크하면 부모가 체크되는 것을 막는 옵션
        treeCheckDecoupleChildrenCheckPropagation: {
            type: Boolean,
            default: false,
        },
        // row 움직이는거 막는 옵션 -> 검색에서 쓰임
        noMovingRow: {
            type: Boolean,
            default: false,
        },
        noUnselect: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            internalTree: this.tree.concat([]),
        };
    },
    computed: {
        treeRendered() {
            const foldRows = this.internalTree.filter(r => r.fold === 'close');
            const tree1 = this.internalTree.filter(r => {
                return !foldRows.find(
                    foldRow =>
                        r.treeIndex.indexOf(foldRow.treeIndex + '.') === 0
                );
            });
            return selectedTailStyle(tree1);
        },
    },
    watch: {
        tree() {
            this.internalTree = this.tree.concat([]);
        },
    },
    methods: {
        rowClickHandler(rowId) {
            if (this.selectable) {
                const selectedRowIndex = this.internalTree.findIndex(
                    t => t.rowId === rowId
                );
                const selectedRow = this.internalTree[selectedRowIndex];
                if (!selectedRow.noInteraction) {
                    if (this.noUnselect) {
                        this.$emit('rowSelected', selectedRow.data);
                    } else {
                        if (!selectedRow.selected) {
                            this.$emit('rowSelected', selectedRow.data);
                        } else {
                            this.$emit('rowUnselected', selectedRow.data);
                        }
                    }

                    if (selectedRow.selected && !this.noUnselect) {
                        this.$set(this.internalTree, selectedRowIndex, {
                            ...selectedRow,
                            selected: false,
                        });
                    } else {
                        this.internalTree = this.internalTree.map((t, i) => {
                            return {
                                ...t,
                                selected: i === selectedRowIndex,
                            };
                        });
                    }
                }
            }
        },
        foldClickHandler(rowId) {
            const { rowIndex, row } = getRow(rowId, this.internalTree);
            this.$set(this.internalTree, rowIndex, {
                ...row,
                fold:
                    row.fold === 'no-fold'
                        ? 'no-fold'
                        : row.fold === 'open'
                        ? 'close'
                        : 'open',
            });
            this.emitTreeChange();
        },
        checkClickHandler(rowId) {
            if (this.checkable) {
                const {
                    row: { treeIndex, check },
                } = getRow(rowId, this.internalTree);

                if (this.treeCheckDecoupleChildrenCheckPropagation) {
                    this.internalTree = _parentCheck(this.internalTree, {
                        treeIndex,
                        check: check === 'off' ? 'on' : 'off',
                    });
                } else {
                    this.internalTree = cleanCheck(this.internalTree, {
                        treeIndex,
                        check: check === 'off' ? 'on' : 'off',
                    });
                }

                this.emitTreeChange();
            }
        },
        checkAll() {
            if (this.checkable) {
                this.internalTree = checkAll(this.internalTree);
                this.emitTreeChange();
            }
        },
        uncheckAll() {
            this.internalTree = uncheckAll(this.internalTree);
            this.emitTreeChange();
        },
        emitTreeChange() {
            this.$emit('treeChange', Array.from(this.internalTree));
        },
        unselect() {
            this.internalTree = this.internalTree.map(t => ({
                ...t,
                selected: false,
            }));
        },
    },
};
</script>

<style lang="scss" scoped>
.tree-container {
    position: relative;
    font-size: 0;
    display: inline-block;
    min-width: 100%;
    max-height: calc(100vh - 192px);
    height: 100%;
    overflow-y: auto;
}
.flip-enter {
    transform: translateY(-2px);
    opacity: 0;
}
.flip-leave-to {
    opacity: 0;
}
.flip-leave-active {
    position: absolute;
    left: 0;
    right: 0;
}
</style>
