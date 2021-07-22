<template>
    <div class="transaction-toolbar" v-click-outside="onCloseToolbarMenus">
        <div class="buttons">
            <template v-if="dataMode === 'guid'">
                <btn
                    class="border-none"
                    :items="[{ text: i18n.viewByTable }]"
                    @click="() => $emit('change-chart-mode', false)"
                    v-if="chartMode"
                />
                <btn
                    class="border-none"
                    :items="[{ text: i18n.viewByChart }]"
                    @click="() => $emit('change-chart-mode', true)"
                    v-else
                />
            </template>
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.column }]"
                :pressed="showColumnMenu"
                :tooltip-options="{ message: i18n.manageTableColumns }"
                @click.native="onClickToolbarButtons(true)"
            ></btn>
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.more }]"
                :pressed="showMoreMenu"
                :tooltip-options="{ message: i18n.settingETC }"
                @click.native="onClickToolbarButtons(false)"
            ></btn>
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.help }]"
                :tooltip-options="{ message: i18n.help }"
                @click.native="onClickHelpButton"
            ></btn>
        </div>

        <layered-menu :width="250" :right="25" :top="26" v-if="showColumnMenu">
            <popup-list
                type="checkbox"
                no-scroll
                multi-select
                :items="[{ text: i18n.multiColumnSort }]"
                :active-index.sync="tableMultiSort"
            />
            <popup-list
                type="checkbox"
                style="max-height: 150px"
                multi-select
                :title="i18n.manageTableColumns"
                :items="columnMenuList"
                :active-index.sync="tableActiveColumns"
            />
        </layered-menu>
        <layered-menu :width="200" :right="0" :top="26" v-if="showMoreMenu">
            <popup-list
                type="checkbox"
                no-scroll
                multi-select
                :items="[{ text: i18n.profileAutoSearch }]"
                :active-index="profileAutoSearch"
                @update:active-index="() => onClickMoreMenu(3)"
            />
            <popup-list
                no-scroll
                :items="moreMenuList"
                @update:active-index="onClickMoreMenu"
            />
        </layered-menu>

        <window
            class="xview-filtering-window"
            :open-w="380"
            :open-h="320"
            :open-x="'calc(100% - 393px)'"
            :open-y="43"
            :messages="{
                apply: i18n.apply,
                cancel: i18n.cancel,
            }"
            @cancel="() => (showXViewFilteringForm = false)"
            @apply="onApplyXViewChartFilteringForm"
            v-show="showXViewFilteringForm"
        >
            <template #subject>
                <span>{{ i18n.xviewChartFiltering }}</span>
            </template>
            <div>
                <div class="active">
                    <div class="input-box">
                        <checkbox v-model="activeXViewFiltering" normal />
                        <div>{{ i18n.M0623 }}</div>
                    </div>
                </div>
                <div class="list">
                    <div class="subject">
                        {{ i18n.filteringCondition }}
                    </div>
                    <div class="input-box">
                        <radio
                            v-model="xviewFilteringTypes[0]"
                            normal
                            @change="() => onChangeXViewFilteringType(0)"
                        />
                        <div>{{ i18n.serviceName }}</div>
                    </div>
                    <div class="input-box">
                        <radio
                            v-model="xviewFilteringTypes[1]"
                            normal
                            @change="() => onChangeXViewFilteringType(1)"
                        />
                        <div>{{ i18n.wmonId }}</div>
                    </div>
                    <div class="input-box">
                        <radio
                            v-model="xviewFilteringTypes[2]"
                            normal
                            @change="() => onChangeXViewFilteringType(2)"
                        />
                        <div>{{ i18n.ipaddr }}</div>
                    </div>
                    <div class="input-box">
                        <radio
                            v-model="xviewFilteringTypes[3]"
                            normal
                            @change="() => onChangeXViewFilteringType(3)"
                        />
                        <div>{{ i18n.userId }}</div>
                    </div>
                </div>
            </div>
        </window>

        <confirm-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            @apply="applyDownloadCsvForProfileAll"
            v-if="alertMessage !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import clickOutside from '@vuejs/directive/clickOutside';
import { STORAGE_KEYS } from '@entry/popup/xviewAnalysis/constant';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import Window from '@vuejs/component/window/Window';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Radio from '@vuejs/component/Toggle/Radio';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import LayeredMenu from '../component/LayeredMenu';
import {
    mapActions as baseMapAction,
    mapMutations as baseMapMutations,
    mapState as baseMapState,
} from '../store/base';
import { CHART_FILTERS } from '../constant';
import { getItem, setItem } from '../storage';
import { hashManual } from '@common/utility';

// 보이기/숨기기 메뉴에서 제외할 컬럼
const EXCEPT_COLUMNS = [0, 1, 25];

export default {
    components: {
        Btn,
        SvgIcon,
        PopupList,
        LayeredMenu,
        Window,
        Checkbox,
        Radio,
        ConfirmWindow,
    },
    directives: { clickOutside },
    inject: {
        i18n: {
            default: {
                settingETC: 'Setting ETC',
                transactionData: 'Transaction Data',
                multiColumnSort: 'Multi Column Sorting',
                manageTableColumns: 'Manage Table Columns',
                profileAutoSearch: 'Profile Auto Search',
                xviewChartFiltering: 'X-View Chart Filtering',
                exportTransactionRows: 'Export Transactions',
                exportProfileAll: 'Export Profile All',
                filteringCondition: 'Filtering Condition',
                viewByTable: 'View by table',
                viewByChart: 'View by chart',
                apply: 'Apply',
                cancel: 'Cancel',
                M0305: 'M0305',
                M0623: 'M0623',
            },
        },
    },
    props: {
        columns: {
            type: Array,
            required: true,
        },
        chartMode: {
            type: Boolean,
            required: false,
        },
    },
    computed: {
        ...baseMapState({
            dataMode: state => state.dataMode,
            chartKey: state => state.chartKey,
            profileAutoSearch: state => [state.profileAutoSearch],
            transactionRow: state => state.transactionRow,
            transactionRows: state => state.transactionRows,
        }),
    },
    data() {
        const optColumns = this.columns.filter(
            (col, i) => !EXCEPT_COLUMNS.includes(i)
        );

        return {
            iconTypes: {
                column: ICON_TYPE.tableColumn,
                more: ICON_TYPE.moreHorizon,
                help: ICON_TYPE.help,
            },

            showColumnMenu: false,
            columnMenuList: optColumns.map(col => ({
                text: col.name,
            })),

            showMoreMenu: false,
            moreMenuList: [
                { text: this.i18n.exportTransactionRows },
                { text: this.i18n.exportProfileAll },
            ],

            showXViewFilteringForm: false,
            activeXViewFiltering: false,
            xviewFilteringTypes: [true, false, false, false],

            // 테이블 설정 정보
            tableMultiSort: [
                getItem(
                    STORAGE_KEYS.TRANSACTION_MULTISORT_STATUS,
                    true,
                    Boolean
                ),
            ],
            tableActiveColumns: optColumns.map(column => column.active),

            alertMessage: '',
        };
    },
    watch: {
        tableActiveColumns(newVal) {
            const activeList = [true, true, ...newVal, true];

            this.$emit('change-active-columns', this.getColumns(activeList));
            setItem(STORAGE_KEYS.TRANSACTION_COLUMN_STATUS, activeList);
        },
        tableMultiSort(newVal) {
            this.tableMultiSort = newVal;

            this.$emit('change-sort-type', newVal[0] ? 'multi' : 'single');
            setItem(STORAGE_KEYS.TRANSACTION_MULTISORT_STATUS, newVal[0]);
        },
    },
    methods: {
        ...baseMapMutations(['toggleProfileAutoSearch']),

        getColumns(activeColumns) {
            return this.columns.map((col, i) => {
                return {
                    ...col,
                    active: activeColumns[i],
                };
            });
        },

        onClickToolbarButtons(isFirst) {
            if (isFirst) {
                this.showColumnMenu = !this.showColumnMenu;
                this.showMoreMenu = false;
            } else {
                this.showColumnMenu = false;
                this.showMoreMenu = !this.showMoreMenu;
            }
        },
        onCloseToolbarMenus() {
            if (this.showColumnMenu) this.showColumnMenu = false;
            if (this.showMoreMenu) this.showMoreMenu = false;
        },
        onClickMoreMenu(index) {
            if (index === 3) {
                this.toggleProfileAutoSearch();
            } else {
                if (index === 0) {
                    this.downloadCsvForTransactions();
                } else if (index === 1) {
                    this.showDownloadCsvForProfileAll();
                } else if (index === 2) {
                    this.showXViewFilteringForm = true;
                }

                this.showMoreMenu = false;
            }
        },
        onClickHelpButton() {
            hashManual('popup_xviewAnalysis');
        },

        onApplyXViewChartFilteringForm() {
            const filterTypes = Object.values(CHART_FILTERS);

            const filterType =
                filterTypes[this.xviewFilteringTypes.indexOf(true)];
            const filterValue = this.transactionRow[filterType];

            const chartsObject = opener.aries.get('bigdata.charts');
            const chart = chartsObject
                ? chartsObject[this.chartKey]
                : opener.aries.get('XViewChartInAnalysis');

            if (chart) {
                chart.xviewFilter.setPopupFilterCondition(
                    this.activeXViewFiltering
                        ? { [filterType]: filterValue }
                        : {}
                );
                if (chart.getChartTypeName() === 'XViewChartInAnalysis')
                    chart.repaint();
            }

            this.showXViewFilteringForm = false;
        },
        onChangeXViewFilteringType(type) {
            const values = [false, false, false, false];
            values[type] = true;
            this.xviewFilteringTypes = values;
        },

        downloadCsvForTransactions() {
            const columns = this.getColumns([
                true,
                true,
                ...this.tableActiveColumns,
                true,
            ]);

            const fields = columns
                .filter(col => col.active)
                .map(col => col.key);
            const names = columns
                .filter(col => col.active)
                .map(col => col.name);

            this.$emit('download-csv-file', {
                fields,
                names,
            });
        },
        showDownloadCsvForProfileAll() {
            this.alertMessage = this.i18n.M0305;
        },
        applyDownloadCsvForProfileAll() {
            this.alertMessage = '';
            this.$emit('export-profile-all');
        },
    },
    mounted() {
        if (opener.document.location.pathname !== '/analysis/xview')
            this.moreMenuList.push({ text: this.i18n.xviewChartFiltering });
    },
};
</script>

<style lang="scss" scoped>
.transaction-toolbar {
    flex: 1;
    position: relative;

    > .buttons {
        position: absolute;
        right: 0px;
        bottom: -4px;
        .aries-ui-btn + .aries-ui-btn {
            margin-left: -2px;
        }
    }

    .xview-filtering-window {
        .subject {
            margin: 23px 0px 16px 0px;
            opacity: 0.6;
            font-size: 12px;
        }

        .input-box {
            display: flex;
            margin-bottom: 10px;

            > *:first-child {
                flex: 0 0 30px;
            }

            > *:last-child {
                flex: 1;
                margin-top: -3px;
            }
        }
    }
}
</style>
