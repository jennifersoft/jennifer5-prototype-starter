<template>
    <div class="detail-table">
        <div class="tool-bar" v-click-outside="onHideMoreMenu">
            <div class="left">{{ i18n.searchResult }}</div>
            <div class="right">
                <btn
                    :items="[moreButton]"
                    :pressed="showMoreMenu"
                    :tooltip-options="{
                        message: i18n.settingETC,
                    }"
                    class="border-none"
                    normal
                    @click="() => (showMoreMenu = !showMoreMenu)"
                ></btn>
                <layered-menu
                    :width="150"
                    :right="20"
                    :top="188"
                    v-if="showMoreMenu"
                >
                    <popup-list
                        no-scroll
                        normal
                        :items="[{ text: i18n.export }]"
                        @update:active-index="onDownloadTableCsv"
                    />
                </layered-menu>
            </div>
        </div>
        <table-panel
            :table-rows="filteredCrudData"
            :table-height="mainHeight"
            @change-filter="onChangeTableFilter"
        ></table-panel>
    </div>
</template>

<script>
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import Btn from '@vuejs/component/button/Btn';
import TablePanel from '../component/TablePanel';
import clickOutside from '@vuejs/directive/clickOutside';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { downloadCsv } from '@common/utility';
import { mapState, mapMutations } from '../vuex';
import { printTableStr } from '../utility';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        TablePanel,
        PopupList,
        LayeredMenu,
    },
    directives: {
        clickOutside,
    },
    computed: {
        ...mapState({
            filteredCrudData: state => state.filteredCrudData,
            mainHeight: state => state.mainHeight,
        }),
    },
    data() {
        return {
            moreButton: { iconType: ICON_TYPE.moreHorizon },
            showMoreMenu: false,
        };
    },
    methods: {
        ...mapMutations(['updateTableFilter', 'filterCrudData']),
        onChangeTableFilter(filter) {
            this.updateTableFilter(filter);
            this.filterCrudData();
        },
        onDownloadTableCsv() {
            downloadCsv('crudData', {
                fields: ['no', 'service', 'tableFormat', 'funcFormat'],
                names: [
                    this.i18n.num,
                    this.i18n.application,
                    this.i18n.tableCrud,
                    this.i18n.databaseFunction,
                ],
                rows: this.filteredCrudData.map((row, i) => {
                    return {
                        no: i + 1,
                        tableFormat: printTableStr(row.table, true),
                        funcFormat: row.func.join(' '),
                        ...row,
                    };
                }),
            });

            this.onHideMoreMenu();
        },
        onHideMoreMenu() {
            this.showMoreMenu = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.detail-table {
    @include themify($themes) {
        > .tool-bar {
            display: flex;

            > .left {
                flex: 2;
                line-height: 36px;
                font-size: 14px;
                color: themed('detail-table-subject-font-color');
            }

            > .right {
                text-align: right;
                flex: 1;

                ::v-deep .layered-menu {
                    text-align: left;
                }
            }
        }
    }
}
</style>
