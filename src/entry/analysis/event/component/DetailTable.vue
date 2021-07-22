<template>
    <div class="detail-table">
        <div class="tool-bar">
            <div class="left">{{ searchDateFormat }}</div>
            <div class="right">
                <span class="search-count">{{ searchCountFormat }}</span>

                <btn
                    normal
                    class="border-none"
                    :items="[{ iconType: foldIconType }]"
                    :tooltip-options="{ message: foldIconMessage }"
                    @click="onToggleTableFolder"
                ></btn>

                <btn
                    normal
                    class="border-none"
                    :items="[{ iconType: iconTypes.more }]"
                    :pressed="showMoreMenu"
                    :tooltip-options="{ message: i18n.settingETC }"
                    @click="() => (showMoreMenu = !showMoreMenu)"
                ></btn>
                <layered-menu
                    :width="150"
                    :right="0"
                    :top="42"
                    v-if="showMoreMenu"
                >
                    <popup-list
                        no-scroll
                        normal
                        :items="[{ text: i18n.export }]"
                        @update:active-index="onClickExportBtn"
                    />
                </layered-menu>
            </div>
        </div>
        <x-table
            :table-type="'large vborderless stripeless'"
            :data="tableData"
            :columns="columns"
            :resize="true"
            :sort-cache="true"
            :sort-key="'time'"
            :scroll-height="tableHeight"
            :row-height="35"
            :template-row="rowTemplate"
            @click="onTableClickEvent"
        ></x-table>
        <window
            v-if="showDetailPopup"
            :open-w="610"
            :open-h="440"
            :open-x="92"
            :open-y="detailPopupTop"
            hide-footer
            @cancel="() => (showDetailPopup = false)"
        >
            <template #subject>
                <span>{{ detailData.subject }}</span>
            </template>
            <div
                style="overflow: auto; height: 364px;"
                v-html="detailData.contents"
            ></div>
        </window>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import Window from '@vuejs/component/window/Window';
import Btn from '@vuejs/component/button/Btn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { getDayjs, serverDateFormat } from '@common/base';
import {
    i18n,
    printEscape,
    downloadCsv,
    printCsvText,
    openXViewPopupForEvent,
    getEventData,
} from '@common/utility';

export default {
    inject: ['i18n'],
    components: {
        XTable,
        Window,
        Btn,
        PopupList,
        LayeredMenu,
    },
    props: {
        tableData: {
            type: Array,
            required: false,
            default: () => [],
        },
        tableHeight: {
            type: Number,
            required: false,
            default: 300,
        },
        searchDateFormat: {
            type: String,
            required: false,
            default: '',
        },
        headerFold: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        foldIconType() {
            return this.headerFold ? ICON_TYPE.arrowDown : ICON_TYPE.arrowUp;
        },
        foldIconMessage() {
            return this.headerFold
                ? this.i18n.viewSmaller
                : this.i18n.viewLarger;
        },
        searchCountFormat() {
            return `${this.tableData.length.toLocaleForAries()}`;
        },
        detailPopupTop() {
            return window.innerHeight - 465;
        },
    },
    watch: {
        tableData(newVal) {
            return newVal.map(function(item) {
                item.timeStr = getDayjs(item.time).format(
                    serverDateFormat.longWithSec
                );
                item.messageStr = printEscape(
                    item.message || item.detailMessage
                );
                item.valueStr =
                    item.value == -1 ? '' : item.value.toLocaleForAries();
                return item;
            });
        },
    },
    data: function() {
        return {
            showDetailPopup: false,
            detailSubject: '',
            detailData: {
                subject: '',
                time: '',
                contents: '',
            },

            showMoreMenu: false,
            iconTypes: {
                more: ICON_TYPE.moreHorizon,
            },
            columns: [
                {
                    key: 'eventLevelName',
                    name: this.i18n.eventLevel,
                    sort: true,
                    width: '100px',
                },
                {
                    key: 'time',
                    name: this.i18n.time,
                    sort: true,
                    width: '180px',
                },
                {
                    key: 'domainName',
                    name: this.i18n.domain,
                    sort: true,
                    width: '100px',
                },
                {
                    key: 'name',
                    name: this.i18n.target,
                    sort: true,
                    width: '100px',
                },
                {
                    key: 'errorTypeName',
                    name: this.i18n.eventType,
                    sort: true,
                    width: '250px',
                },
                {
                    key: 'detailMessage',
                    name: this.i18n.message,
                    sort: true,
                },
                {
                    key: 'value',
                    name: this.i18n.value,
                    sort: true,
                    width: '100px',
                },
                {
                    key: 'serviceName',
                    name: this.i18n.serviceName,
                    sort: true,
                },
                {
                    key: null,
                    name: this.i18n.transaction,
                    sort: false,
                    width: '100px',
                },
            ],
            rowTemplate: `
<tr class="<!= eventLevelName.toLowerCase() !>">
    <td><i class="score <!= eventLevelName.toLowerCase() !>"></i> <!= eventLevelName !></td>
    <td><!=	timeStr !></td>
    <td><!=	domainName !></td>
    <td><!=	name !></td>
    <td><!=	errorTypeName !><! if(mxidName != "") { !> (<!= i18n.get("ui.mx." + mxidName) !>)<! } !></td>
    <td>
        <! if(detailMessage) { !>
        <span class="detail-link">${this.i18n.moreMessage}</span>
        <! } !>
        <! if(typeof(customMessage) == "string") { !>
        <!= customMessage !>
        <! } !>
        <!= messageStr !>
    </td>
    <td align="right">
        <!= valueStr !>
    </td>
    <td title="<!= serviceName !>"><!= serviceName !></td>
    <td align="center">
        <! if(relevantTxId != "0") { !>
        <a class="xview-link">${this.i18n.show}</a>
        <! } !>
    </td>
</tr>`,
        };
    },
    methods: {
        onClickExportBtn() {
            this.showMoreMenu = false;

            if (this.tableData.length === 0) {
                this.$emit('alert', this.i18n.M0004);
                return;
            }

            const rows = [];
            for (let i = 0; i < this.tableData.length; i++) {
                const row = this.tableData[i];
                row.time = getDayjs(row.time).format(
                    serverDateFormat.longWithSec
                );
                row.value = row.value == -1 ? '' : row.value;
                row.serviceName = printCsvText(row.serviceName);

                // JJC-4343: 내보내기시 메시지 키 이름을 detailMessage로 해야 한다.
                row.detailMessage =
                    typeof row.customMessage == 'string' &&
                    row.customMessage != ''
                        ? printCsvText(row.customMessage) + ' '
                        : '';
                row.detailMessage += printCsvText(
                    row.message || row.detailMessage
                );

                if (row.mxidName != '')
                    row.errorTypeName +=
                        ' (' + i18n.get('ui.mx.' + row.mxidName) + ')';

                rows.push(row);
            }

            downloadCsv('event', {
                fields: this.columns
                    .filter(item => item.key != null)
                    .map(item => item.key),
                names: this.columns
                    .filter(item => item.key != null)
                    .map(item => item.name),
                rows: rows,
            });
        },
        onTableClickEvent(row, e) {
            const cls = e.target.className;

            if (cls === 'detail-link') {
                const eventData = getEventData(row.data);
                this.detailData = {
                    subject: eventData.subject,
                    contents: `${eventData.time}<br/><br/>${eventData.detailMessage}`,
                };
                this.showDetailPopup = true;
            } else if (cls === 'xview-link') {
                openXViewPopupForEvent(
                    row.data.sid,
                    row.data.time,
                    `${row.data.relevantTxId}`
                );
            }
        },
        onToggleTableFolder() {
            this.$emit('resize', this.headerFold);
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
            margin-bottom: 10px;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
            > div {
                flex: 1;
                &.left {
                    color: themed('common-font-color');
                }
                &.right {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    right: 16px;
                    > .search-count {
                        font-size: 12px;
                        margin-right: 16px;
                        color: themed('common-font-color');
                    }
                    ::v-deep .layered-menu {
                        text-align: left;
                    }
                }
            }
        }
        ::v-deep tr {
            &.fatal {
                font-weight: bold;
            }
            &:hover {
                .xview-link {
                    border-radius: 2px;
                    padding: 4px 6px;
                    color: themed('detail-table-xview-link-font-color');
                    background-color: themed(
                        'detail-table-xview-link-background-color'
                    );
                }
            }

            .xview-link {
                cursor: pointer;
                font-weight: normal;
                color: themed('common-font-color');
            }
            .detail-link {
                font-weight: normal;
            }

            .score.warning {
                background-color: themed(
                    'detail-table-score-warning-background-color'
                ) !important;
            }
        }
    }

    @import '~@entry/popup/activeService/style/active-score-cell.scss';
    @include active-score-cell;
}
</style>
