<template>
    <div class="tab-content-container">
        <div class="upper-bar">
            <checkbox
                :disabled="noAllCheck"
                :style="{ marginLeft: '5px' }"
                :active="allChecked"
                @change="checkAllHandler"
            />
            <transition name="flip" type="in-out" v-if="!noSearch">
                <svg-icon
                    v-if="!searchEnable"
                    class="search-icon-before"
                    :icon-type="iconType"
                    :width="16"
                    :height="16"
                    @click.native="enableSearch"
                    key="not-search"
                />
                <search
                    v-else
                    :value="searchText"
                    @change="updateSearchText"
                    @blur="disableSearch"
                    @clear="disableSearch"
                    @keydown.esc.native="disableSearch"
                    ref="search"
                    small
                    cancelable
                    key="search"
                />
            </transition>
        </div>
        <div class="contents">
            <tree
                ref="tree"
                :tree-check-decouple-children-check-propagation="true"
                :tree="treeToRender"
                :no-moving-row="searchEnable"
                :selectable="selectable"
                :checkable="checkable"
                @treeChange="treeChangeHandler"
                @rowSelected="e => $emit('rowSelected', e)"
                @rowUnselected="e => $emit('rowUnselected', e)"
            />
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';

import Tree from '@vuejs/component/resource/tree/DomainGroupTree.vue';
import Checkbox from '@vuejs/component/toggle/Checkbox';

import { isUnder } from '@vuejs/component/resource/tree/treeAction';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Search from '@vuejs/component/input/Search';

export default {
    inject: {
        selectAllText: { default: 'All' },
    },
    components: {
        Search,
        SvgIcon,
        Tree,
        Checkbox,
    },
    props: {
        selectable: {
            type: Boolean,
            default: false,
        },
        checkable: {
            type: Boolean,
            default: true,
        },
        tree: {
            type: Array,
            required: true,
        },
        noAllCheck: {
            type: Boolean,
            default: false,
        },
        noSearch: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            internalTree: Array.from(this.tree),
            searchEnable: false,
            searchText: '',
            iconType: ICON_TYPE.search,
        };
    },
    computed: {
        allChecked() {
            return (
                this.internalTree.length !== 0 &&
                this.internalTree.every(({ check }) => check === 'on')
            );
        },
        treeToRender() {
            if (this.searchEnable) {
                return this.filteredTree;
            }
            return this.internalTree;
        },
        filteredTree() {
            if (!this.searchText.length) {
                return Array.from(this.internalTree);
            }
            const showList = this.internalTree.filter(r =>
                r.label
                    .trim()
                    .toLowerCase()
                    .includes(this.searchText.trim().toLowerCase())
            );

            return this.internalTree.map(r => {
                const shouldNotHide = showList.some(s => {
                    if (isUnder(s.treeIndex, r.treeIndex)) {
                        return true;
                    } else if (r.rowId === s.rowId) {
                        return true;
                    }
                    return false;
                });

                if (shouldNotHide) {
                    return r;
                }
                return {
                    ...r,
                    hide: true,
                };
            });
        },
    },
    watch: {
        tree() {
            this.internalTree = Array.from(this.tree);
        },
    },
    methods: {
        enableSearch() {
            if (!this.searchEnable) this.searchEnable = true;
            this.$nextTick(() => {
                // focus after mount
                this.$refs.search.$el.getElementsByTagName('input')[0].focus();
            });
        },
        disableSearch() {
            if (this.searchText?.length > 0) return;
            this.searchEnable = false;
        },
        updateSearchText(t) {
            this.searchText = t;
        },
        searchInputHandler: _.debounce(function(e) {
            return this.updateSearchText(e.target.value);
        }, 300),
        checkAllHandler() {
            if (this.allChecked) {
                this.$refs.tree.uncheckAll();
            } else {
                this.$refs.tree.checkAll();
            }
        },
        treeChangeHandler(tree) {
            if (this.searchEnable) {
                const searchApplyedTree = this.internalTree.map(r => {
                    for (const searchRow of tree) {
                        if (searchRow.rowId === r.rowId) {
                            return {
                                ...r,
                                ...searchRow,
                                hide: false,
                            };
                        }
                    }
                    return {
                        ...r,
                        hide: false,
                    };
                });
                this.internalTree = searchApplyedTree;
                this.$emit('treeChange', searchApplyedTree);
            } else {
                this.internalTree = tree;
                this.$emit('treeChange', tree);
            }
        },
        unselect() {
            this.$refs.tree.unselect();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.tab-content-container {
    > .upper-bar {
        @include themify($themes) {
            border-bottom: 1px solid themed('border-color');
            box-sizing: border-box;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px;

            .search-icon-before {
                color: themed('typography-color-grey1');
                cursor: pointer;
                right: 9px;
                position: absolute;
            }
            .search-input-wrapper {
                max-width: 150px;
            }
        }
    }

    > .contents {
        overflow: auto;
        padding: 0;
        border: 0;
        position: absolute;
        top: 34px;
        left: 0;
        bottom: 0;
        right: 0;
    }
}
.flip-enter {
    opacity: 0;
}
.flip-leave-to {
    opacity: 0;
}
.flip-enter-active,
.flip-leave-active {
    transition-duration: 0.2s;
}
</style>
