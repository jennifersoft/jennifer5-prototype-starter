<template>
    <div class="table-tool-bar" v-click-outside="onCloseColumnMenu">
        <div class="left">
            <span>
                {{ i18n.searchTerm }} :
                <strong>{{ searchTermFormat }}</strong>
            </span>
            <span>
                {{ i18n.serviceCount }} :
                <strong>{{ totalCountFormat }}</strong>
            </span>
        </div>
        <div class="right">
            <search
                small
                v-model="filterKeyword"
                :width="310"
                :placeholder="i18n.filtering"
                @search="onFilterRowsByName(false)"
                @clear="onFilterRowsByName(true)"
            ></search>

            <template v-if="useManageColumns">
                <btn
                    class="border-none"
                    :items="[{ iconType: iconTypes.column }]"
                    :pressed="showColumnMenu"
                    :tooltip-options="{
                        message: i18n.manageTableColumns,
                        position: 'bottom-right',
                    }"
                    @click="() => (showColumnMenu = !showColumnMenu)"
                ></btn>
                <layered-menu
                    :width="352"
                    :right="0"
                    :top="27"
                    v-if="showColumnMenu"
                >
                    <popup-list
                        type="checkbox"
                        style="max-height: 150px"
                        multi-select
                        :title="i18n.manageTableColumns"
                        :items="columnMenus"
                        :active-index.sync="activeColumns"
                        @update:active-index="
                            status => $emit('change-active-columns', status)
                        "
                    />
                </layered-menu>
            </template>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Search from '@vuejs/component/Input/Search';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import clickOutside from '@vuejs/directive/clickOutside';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { serverDateFormat } from '@common/base';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        Search,
        PopupList,
        LayeredMenu,
    },
    directives: {
        clickOutside,
    },
    props: {
        startDate: {
            type: Object,
            required: true,
        },
        endDate: {
            type: Object,
            required: true,
        },
        useManageColumns: {
            type: Boolean,
            required: false,
            default: false,
        },
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
    },
    computed: {
        searchTermFormat() {
            return `${this.startDate.format(
                serverDateFormat.long
            )} ~ ${this.endDate.format(serverDateFormat.long)}`;
        },
        totalCountFormat() {
            return this.rows.length.toLocaleForAries();
        },
        columnMenus() {
            return this.columns.map(col => {
                return {
                    text: col.name,
                    value: col.key,
                };
            });
        },
    },
    watch: {
        columns(newColumns) {
            this.showMoreMenu = false;
            this.activeColumns = newColumns.map(col => !col.isHide);

            // 컬럼이 변경되면 탭이 변경된것이므로 필터링 조건을 초기화 해야함
            this.filterKeyword = '';
            this.$emit('filter-rows', '');
        },
    },
    data() {
        return {
            iconTypes: {
                column: ICON_TYPE.tableColumn,
            },
            showColumnMenu: false,
            activeColumns: this.columns.map(col => !col.isHide),
            filterKeyword: '',
        };
    },
    methods: {
        onFilterRowsByName(isClear) {
            if (isClear) this.filterKeyword = '';
            this.$emit('filter-rows', this.filterKeyword);
        },
        onCloseColumnMenu() {
            if (this.showColumnMenu) this.showColumnMenu = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.table-tool-bar {
    position: relative;
    height: 26px;

    > div {
        &.left {
            position: absolute;
            padding-left: 6px;
            line-height: 26px;
            > span {
                margin-right: 24px;
            }
        }
        &.right {
            position: absolute;
            display: flex;
            align-items: center;
            right: 0px;
            > ::v-deep .search-input-wrapper {
                margin-right: 16px;
            }
            > ::v-deep .layered-menu {
                text-align: left;
            }
        }
    }
}
</style>
