<template>
    <div class="tab-bar" v-click-outside="onCloseLayeredMenu">
        <tab
            :tabs="tabs"
            :active-tab="activeTab"
            @change="onChangeActiveServiceType"
        />
        <div class="right" v-if="!useSummaryMode">
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.column }]"
                :pressed="showColumnMenu"
                :tooltip-options="{
                    message: i18n.manageTableColumns,
                    position: 'bottom-right',
                }"
                @click.native="onClickColumnMenuBtn(true)"
            ></btn>
            <layered-menu
                :width="250"
                :right="0"
                :top="26"
                v-if="showColumnMenu"
            >
                <popup-list
                    type="checkbox"
                    style="max-height: 150px"
                    multi-select
                    :title="i18n.manageTableColumns"
                    :items="columnMenus"
                    :active-index.sync="columnIndexes"
                    @update:active-index="onClickColumnMenuStatus"
                />
            </layered-menu>

            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.more }]"
                :pressed="showMoreMenu"
                :tooltip-options="{
                    message: i18n.more,
                    position: 'bottom-right',
                }"
                @click.native="onClickMoreMenuBtn(true)"
            ></btn>
            <layered-menu :width="150" :right="0" :top="27" v-if="showMoreMenu">
                <popup-list
                    no-scroll
                    :items="[{ text: i18n.export }]"
                    @update:active-index="onClickExportCsv"
                />
            </layered-menu>
        </div>
    </div>
</template>

<script>
import Tab from '@vuejs/component/tab/Tab';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import Btn from '@vuejs/component/button/Btn';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import clickOutside from '@vuejs/directive/clickOutside';
import { getDayjs, serverDateFormat } from '@common/base';
import { setItem } from '@entry/popup/xviewAnalysis/storage';
import { downloadCsv } from '@common/utility';
import { createTableColumns } from './DetailTable';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['i18n', 'platform'],
    directives: { clickOutside },
    components: {
        Tab,
        PopupList,
        Btn,
        LayeredMenu,
    },
    data() {
        return {
            tabs: [
                {
                    key: 'APPLICATION',
                    value: this.i18n.activeService,
                },
                {
                    key: 'SQL',
                    value: this.i18n.activeSql,
                },
                {
                    key: 'EXTERNALCALL',
                    value: this.i18n.activeTxcall,
                },
            ],
            iconTypes: {
                column: ICON_TYPE.tableColumn,
                more: ICON_TYPE.moreHorizon,
            },
            showColumnMenu: false,
            showMoreMenu: false,
            columnIndexes: [],
        };
    },
    computed: {
        ...mapState({
            activeTab: state => state.activeTab,
            columnMenus: state => state.columnMenus,
            useSummaryMode: state => state.useSummaryMode,
            filteredData: state => state.filteredData,
        }),
    },
    methods: {
        ...mapMutations([
            'changeActiveTab',
            'updateActiveServiceList',
            'updateColumnMenus',
            'updateActiveColumnIndexes',
        ]),
        ...mapActions(['loadActiveServiceList']),
        onClickColumnMenuBtn(active) {
            if (this.showColumnMenu) this.showColumnMenu = false;
            else this.showColumnMenu = active;
            this.showMoreMenu = false;
        },
        onClickColumnMenuStatus(indexes) {
            setItem(`vue/activeServiceColumnsV4#${this.activeTab}`, [
                true,
                ...indexes,
                true,
            ]);
            this.$emit('reload-table');
        },
        onCloseLayeredMenu() {
            if (this.showColumnMenu) this.showColumnMenu = false;
            if (this.showMoreMenu) this.showMoreMenu = false;
        },
        onChangeActiveServiceType(tab) {
            const columns = createTableColumns(this.platform, tab, this.i18n);
            const filteredColumns = columns.filter(
                (col, i) => i > 0 && i < columns.length - 1
            );

            this.columnIndexes = filteredColumns.map(col => col.active);
            this.updateColumnMenus(
                filteredColumns.map(col => ({
                    text: col.name,
                }))
            );

            this.updateActiveServiceList([]);
            this.changeActiveTab(tab);
            this.loadActiveServiceList().then(() => {
                this.$emit('reload-table');
            });
        },
        onClickMoreMenuBtn(active) {
            if (this.showMoreMenu) this.showMoreMenu = false;
            else this.showMoreMenu = active;
            this.showColumnMenu = false;
        },
        onClickExportCsv() {
            const columns = createTableColumns(
                this.platform,
                this.activeTab,
                this.i18n
            ).filter(col => col.active);

            const fields = columns.map(col => col.key);
            const names = columns.map(col => col.name);
            console.log(this.activeTab);
            const rows = this.filteredData.map(row => {
                if (this.activeTab === 'APPLICATION') {
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
                        ...row,
                        statusFormat,
                        scoreType: row.scoreType.toUpperCase(),
                        startTime: getDayjs(row.startTime).format(
                            serverDateFormat.longWithSec
                        ),
                    };
                }

                return { ...row, scoreType: row.scoreType.toUpperCase() };
            });

            downloadCsv(`ActiveServiceData_${this.activeTab}`, {
                fields,
                names,
                rows,
            });

            this.showMoreMenu = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.tab-bar {
    position: relative;
    width: 100%;
    height: 46px;

    ::v-deep .tab-wrapper {
        position: absolute;
        width: 100%;
    }
    > .right {
        position: absolute;
        right: 0px;
        top: 10px;
    }
}
</style>
