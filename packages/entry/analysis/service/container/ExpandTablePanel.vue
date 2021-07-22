<template>
    <div class="table-panel">
        <div class="toolbar">
            <circle-loading-btn
                small
                :progress="tableProgress"
                :suspendible="false"
                v-if="tableProgress > 0"
            ></circle-loading-btn>
            <btn
                class="border-none"
                :items="[{ iconType: moreMenuIcon }]"
                :pressed="showMoreMenu"
                :tooltip-options="{ message: i18n.settingETC }"
                @click="() => (showMoreMenu = !showMoreMenu)"
                v-else
            ></btn>
            <layered-menu :width="150" :right="5" :top="33" v-if="showMoreMenu">
                <popup-list
                    no-scroll
                    :items="moreMenuItems"
                    @update:active-index="onClickMoreMenu"
                />
            </layered-menu>
        </div>

        <detail-table
            :height="290"
            :columns="tableColumns"
            :rows="tableRows"
            :row-template="tableRowTemplate"
            :size="'small'"
            @error-link="onClickErrorLink"
        ></detail-table>

        <form
            ref="form"
            method="post"
            action="/popup/errorDetailForMulti"
            target="errorDetail"
        >
            <input type="hidden" name="otype" :value="otype" />
            <input type="hidden" name="stime" :value="startTime" />
            <input type="hidden" name="etime" :value="endTime" />
            <input type="hidden" name="oidsBySid" :value="oidMapStr" />
            <input type="hidden" name="name" />
            <input type="hidden" name="hash" />
            <input type="hidden" name="errorType" />
        </form>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import CircleLoadingBtn from '@vuejs/component/button/CircleLoadingBtn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import DetailTable from '../component/DetailTable';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { OTypeDef } from '@common/definition';
import { downloadCsv, printCsvText } from '@common/utility';
import { mapState } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Btn,
        CircleLoadingBtn,
        PopupList,
        LayeredMenu,
        DetailTable,
    },
    computed: {
        ...mapState({
            oidMapStr: state => JSON.stringify(state.oidMap),
            name: state => state.expandName,
            hash: state => state.expandHash,
            startTime: state => state.expandStartDateForTable.valueOf(),
            endTime: state => state.expandEndDateForTable.valueOf() + 1,
            tableType: state => state.tableType,
            tableColumns: state => state.expandTableColumns,
            tableRows: state => state.expandTableRows,
            tableRowTemplate: state => state.expandTableRowTemplate,
            tableProgress: state => state.expandTableProgress,
        }),
        moreMenuItems() {
            const items = [{ text: this.i18n.export }];
            if (this.tableType === 'application')
                items.push({ text: this.i18n.showErrorList });
            return items;
        },
    },
    data() {
        return {
            showMoreMenu: false,
            moreMenuIcon: ICON_TYPE.moreHorizon,
            otype: OTypeDef.SYSTEM,
        };
    },
    methods: {
        onClickMoreMenu(index) {
            if (index === 1) {
                this.updateFormData(this.name, this.hash, -1);
                this.openErrorDetailPopup();
            } else {
                downloadCsv(`${this.tableType}_expand`, {
                    fields: this.tableColumns.map(col => col.key),
                    names: this.tableColumns.map(col => col.name),
                    rows: this.tableRows.map((row, i) => {
                        const newRow = {
                            ...row,
                            no: i + 1,
                        };
                        if (this.tableType === 'error')
                            newRow.applicationName = printCsvText(
                                row.applicationName
                            );
                        else newRow.name = printCsvText(row.name);
                        return newRow;
                    }),
                });
            }

            this.showMoreMenu = false;
        },
        onClickErrorLink(data) {
            // ERROR 탭일 때는 expandHash가 에러 타입
            this.updateFormData(
                data.applicationName,
                data.applicationHash,
                this.hash
            );
            this.openErrorDetailPopup();
        },
        updateFormData(name, hash, errorType) {
            const _frm = this.$refs['form'];
            _frm.name.value = name;
            _frm.hash.value = hash;
            _frm.errorType.value = errorType;
        },
        openErrorDetailPopup() {
            const popup = window.open(
                '',
                'errorDetail',
                "width=1024,height=768,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            );

            if (popup) {
                popup.focus();
                this.$refs['form'].submit();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.table-panel {
    margin-top: 16px;
    > .toolbar {
        position: relative;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        > ::v-deep .layered-menu {
            text-align: left;
        }
    }
}
</style>
