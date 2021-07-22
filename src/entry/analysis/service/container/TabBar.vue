<template>
    <div class="tab-bar">
        <tab
            :tabs="tabs"
            :active-tab="activeTab"
            @change="onChangeTableType"
        ></tab>
        <div class="buttons">
            <btn
                normal
                class="border-none"
                :items="[{ iconType: foldIconType }]"
                :tooltip-options="{ message: foldIconMessage }"
                @click="toggleHeaderFold"
            ></btn>

            <circle-loading-btn
                normal
                :progress="tableProgress"
                :suspendible="false"
                v-if="tableProgress > 0"
            ></circle-loading-btn>
            <btn
                normal
                class="border-none"
                :items="[{ iconType: iconTypes.more }]"
                :pressed="showMoreMenu"
                :tooltip-options="{ message: i18n.settingETC }"
                @click="() => (showMoreMenu = !showMoreMenu)"
                v-else
            ></btn>
            <layered-menu :width="150" :right="0" :top="40" v-if="showMoreMenu">
                <popup-list
                    no-scroll
                    normal
                    :items="[{ text: i18n.export }]"
                    @update:active-index="onClickExportButton"
                />
            </layered-menu>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Tab from '@vuejs/component/tab/Tab';
import CircleLoadingBtn from '@vuejs/component/button/CircleLoadingBtn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapMutations, mapActions } from '../vuex';
import { printCsvText, downloadCsv } from '@common/utility';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        Tab,
        CircleLoadingBtn,
        PopupList,
        LayeredMenu,
    },
    computed: {
        ...mapState({
            activeTab: state => state.tableType,
            tableType: state => state.tableType,
            tableColumns: state => state.tableColumns,
            tableRows: state => state.tableRows,
            tableProgress: state => state.tableProgress,
            headerFold: state => state.headerFold,
        }),
        foldIconType() {
            return this.headerFold ? ICON_TYPE.arrowDown : ICON_TYPE.arrowUp;
        },
        foldIconMessage() {
            return this.headerFold
                ? this.i18n.viewSmaller
                : this.i18n.viewLarger;
        },
    },
    data() {
        return {
            tabs: [
                {
                    key: 'application',
                    value: this.i18n.application,
                    disabled: false,
                },
                { key: 'sql', value: this.i18n.sql, disabled: true },
                {
                    key: 'externalCall',
                    value: this.i18n.externalCall,
                    disabled: true,
                },
                { key: 'error', value: this.i18n.error, disabled: true },
                { key: 'cics', value: this.i18n.cics, disabled: true },
            ],
            showMoreMenu: false,
            iconTypes: {
                more: ICON_TYPE.moreHorizon,
            },
            isLoading: false,
        };
    },
    methods: {
        ...mapMutations(['changeTableType', 'toggleHeaderFold']),
        ...mapActions(['loadTableData']),
        disableTabs(disabled, exceptTab = null) {
            this.tabs = this.tabs.map(tab => {
                return {
                    ...tab,
                    disabled: exceptTab === tab.key ? false : disabled,
                };
            });
        },
        onClickExportButton() {
            const filteredColumns = this.tableColumns.filter(
                col => !col.isHide
            );

            downloadCsv(this.tableType, {
                fields: filteredColumns.map(col => col.key),
                names: filteredColumns.map(col => col.name),
                rows: this.tableRows.map((row, i) => {
                    return {
                        ...row,
                        no: i + 1,
                        name: printCsvText(row.name),
                    };
                }),
            });

            this.showMoreMenu = false;
        },
        async onChangeTableType(tableType) {
            if (this.isLoading) return;

            this.changeTableType(tableType);
            this.disableTabs(true, tableType);

            this.isLoading = true;
            await this.loadTableData();

            this.disableTabs(false);
            this.isLoading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.tab-bar {
    position: relative;
    margin-bottom: 10px;

    > .buttons {
        display: flex;
        align-items: center;
        position: absolute;
        top: 8px;
        right: 0px;
    }
}
</style>
