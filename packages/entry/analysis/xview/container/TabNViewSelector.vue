<template>
    <div class="tab-n-view-selector">
        <tab
            :tabs="tabData"
            :active-tab="currentTab"
            @change="updateCurrentTab"
        >
        </tab>
        <div class="view-selector-n-etc">
            <dropdown
                v-if="viewDataByCurrentTab.length > 1"
                :is-simple-style="true"
                :items="viewDataByCurrentTab"
                :selected-value="currentView"
                style="width: 274px; "
                normal
                @onchange="updateCurrentView"
            />

            <btn
                v-if="currentView === 'table'"
                :items="[{ iconType: arrowDownwardIcon }]"
                class="size-medium border-none"
                :tooltipOptions="{
                    position: 'top-center',
                    message: i18n.exportCsv,
                }"
                @click="$emit('export-table')"
            />
            <btn
                v-if="currentView === 'table' && selectedIndexArray.length > 0"
                :items="[{ iconType: newWindowIcon }]"
                class="size-medium border-none"
                :tooltipOptions="{
                    position: 'top-center',
                    message: i18n.viewPopup,
                }"
                @click="popupFromTable"
            />
            <btn
                v-if="
                    (currentView === 'chart' ||
                        currentView === 'application-n-chart') &&
                        currentTab === 'transaction'
                "
                :items="[{ iconType: shareIcon }]"
                class="size-medium border-none"
                :tooltipOptions="{
                    position: 'top-center',
                    message: i18n.share,
                }"
                @click="openShareUrlWindow"
            />
            <btn
                :items="[{ iconType: sliderIcon }]"
                class="size-medium border-none"
                :pressed="closeFilter === false"
                :tooltipOptions="{
                    position: 'top-center',
                    message: i18n.filtering,
                }"
                @click="toggleFilterUI"
            />

            <btn
                v-if="currentView === 'table' && currentTab === 'transaction'"
                class="size-medium border-none"
                :items="[{ iconType: tableIcon }]"
                :pressed="showColumnMenu"
                :tooltip-options="{
                    message: i18n.manageTableColumns,
                    position: 'top-right',
                }"
                @click="showColumnMenu = !showColumnMenu"
            ></btn>
            <layered-menu
                :width="250"
                :right="0"
                :top="50"
                v-if="showColumnMenu"
            >
                <popup-list
                    type="checkbox"
                    style="max-height: 150px"
                    multi-select
                    :title="i18n.manageTableColumns"
                    :items="columnMenuList"
                    :active-index.sync="tableActiveColumns"
                />
            </layered-menu>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Tab from '@vuejs/component/tab/Tab';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '@entry/popup/xviewAnalysis/component/LayeredMenu';
import {
    DEFAULT_COLUMNS,
    STORAGE_KEYS,
} from '@entry/popup/xviewAnalysis/constant';
import { getItem, setItem } from '@entry/popup/xviewAnalysis/storage';

export default {
    name: 'TabNViewSelector',
    inject: ['i18n'],
    components: {
        Btn,
        Checkbox,
        Dropdown,
        FormatDateInput,
        FormatNumberInput,
        NavigationBar,
        NavigationItem,
        PopupList,
        LayeredMenu,

        Tab,
    },
    data() {
        return {
            showColumnMenu: false,
            tableActiveColumns: getItem(
                STORAGE_KEYS.TRANSACTION_COLUMN_STATUS,
                DEFAULT_COLUMNS.map(col => `${col.active}`),
                Array
            ).map(col => col === 'true'),

            columnMenuList: DEFAULT_COLUMNS.map(col => ({
                text: this.i18n[col.key],
            })),
        };
    },
    methods: {
        ...mapMutations('xviewAnalysis', [
            'toggleFilterUI',
            'increaseTableKey',
            'openShareUrlWindow',
        ]),
        ...mapActions('xviewAnalysis', [
            'updateCurrentView',
            'updateCurrentTab',
            'popupFromTable',
        ]),
    },
    computed: {
        ...mapState('xviewAnalysis', {
            currentView: state => state.currentView,
            currentTab: state => state.currentTab,
            loading: state => state.loading,
            progress: state => state.progress,
            closeFilter: state => state.closeFilter,
            selectedIndexArray: state => state.selectedIndexArray,
        }),
        ...mapGetters('xviewAnalysis', ['viewDataByCurrentTab', 'tabData']),
    },
    watch: {
        tableActiveColumns(checkedValues) {
            setItem(STORAGE_KEYS.TRANSACTION_COLUMN_STATUS, checkedValues);
            this.increaseTableKey();
        },
    },
    created() {
        this.arrowDownwardIcon = ICON_TYPE.arrowDownward;
        this.shareIcon = ICON_TYPE.share;
        this.sliderIcon = ICON_TYPE.slider;
        this.newWindowIcon = ICON_TYPE.newWindow;
        this.tableIcon = ICON_TYPE.tableColumn;
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
    ),
    dark: (
        border-color: #4e4e4e,
    ),
);
.tab-n-view-selector {
    display: flex;
    justify-content: space-between;
    position: relative;
    > .tab-wrapper {
        border-bottom: none !important;
    }

    @include themify($themes) {
        border-bottom: 1px solid themed('border-color');
    }

    .view-selector-n-etc {
        align-items: center;
        display: flex;

        ::v-deep .aries-ui-dropdown {
            > .row-list {
                max-height: none;
            }
        }

        .aries-ui-btn {
            + .aries-ui-btn {
                margin-left: 0;
            }
        }
    }
}
</style>
