<template>
    <div class="topology-chart-ux">
        <btn
            :items="[{ iconType: icons.chartXview, text: i18n.showXviewChart }]"
            icon-first
            @click="toggleXView"
        />
        <div v-click-outside="closeConfig">
            <btn
                ref="config-btn"
                :items="[{ text: i18n.setting }]"
                @click="onClickMapConfig"
            />
            <window
                v-show="showMapConfig"
                class="map-config-window"
                :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
                :open-x="configPosition.x"
                :open-y="configPosition.y"
                :draggable="false"
                animation-name="fade-down"
                @apply="onApplyMapConfigTime"
                @cancel="closeConfig"
            >
                <template #subject>
                    <span>{{ i18n.mapConfigTime }}</span>
                </template>
                <div class="map-config-content">
                    <span>{{ i18n.recent }}</span>
                    <format-number-input
                        v-model="mapConfigTimeMin"
                        :width="80"
                        :max="60"
                        use-stepper
                        small
                    />
                    <span>{{ i18n.minute }}</span>
                </div>
            </window>
        </div>
        <btn
            v-click-outside="closeUtilList"
            :items="utilBtnItems"
            type-in-group-button="noselect"
            @click="onClickUtilBtn"
        />
        <tooltip :message="nodeScaleFormat" position="bottom-center">
            <btn
                :items="scaleBtnItems"
                type-in-group-button="noselect"
                @click="onClickScaleBtn"
            />
        </tooltip>
        <div class="switch-group">
            <toggle-switch
                v-model="showDisplayName"
                normal
                :label="i18n.displayName"
            />
            <toggle-switch
                v-model="showHiddenNode"
                normal
                :label="i18n.showHiddenNode"
            />
        </div>
        <window
            v-if="showNewTitle"
            class="new-dashboard-title-window"
            animation-name="fade-down"
            :open-x="popupPosition.x"
            :open-y="popupPosition.y"
            :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
            @apply="onApplyNewDashboardTitle"
            @cancel="showNewTitle = false"
        >
            <template #subject>
                <span>{{ i18n.M0180 }}</span>
            </template>
            <div class="new-dashboard-title-content">
                <span>{{ i18n.M0181 }}</span>
                <input-field
                    v-model="newTitle"
                    @blur="onApplyNewDashboardTitle"
                    small
                />
            </div>
        </window>
        <window
            v-if="showDeletionConfirm"
            class="delete-dashboard-confirm"
            animation-name="fade-down"
            :open-x="popupPosition.x"
            :open-y="popupPosition.y"
            :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
            @cancel="showDeletionConfirm = false"
            @apply="onApplyDeleteDashboard"
        >
            <div style="width: 320px;">{{ deleteConfirmMessage }}</div>
        </window>
        <window v-if="showXviewChart" hide-footer> </window>

        <!--        TODO: popup list 의 위치 동적으로 지정해야 함. 메세지에 따라 버튼 사이즈가 다르다.-->

        <popup-list-composed
            v-if="showSaveList"
            class="dashboard-save-list"
            :offset-y="32"
            :offset-x="174"
            small
        >
            <popup-list
                :items="[{ text: i18n.M0180, value: 'new' }]"
                @update:active-index="openNewTitle"
            />
            <popup-list
                :items="saveList"
                @update:active-index="saveDashboard"
            />
        </popup-list-composed>
        <popup-list
            v-if="showLoadList"
            class="dashboard-load-list"
            :items="saveList"
            :width="180"
            small
            removable
            style="top: 32px; left: 216px;"
            @update:active-index="onClickDashboardToLoad"
            @remove="openDeleteConfirm"
        />
        <alert
            v-if="showNotification"
            type="success"
            class="topology-alert"
            :message="notificationMessage"
            fade-down
            toast
        />
    </div>
</template>

<script>
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { i18n } from '@common/utility';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Window from '@vuejs/component/window/Window';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import PopupListComposed from '@vuejs/component/Dropdown/PopupListComposed';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import InputField from '@vuejs/component/Input/InputField';
import Alert from '@vuejs/component/Alert/Alert';
import clickOutside from '@vuejs/directive/clickOutside';
import { createNamespacedHelpers } from 'vuex';
import { NAMESPACE } from '@entry/dashboard/topology/store';

const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
    NAMESPACE
);

export default {
    components: {
        Window,
        ToggleSwitch,
        Btn,
        FormatNumberInput,
        PopupList,
        PopupListComposed,
        Tooltip,
        InputField,
        Alert,
    },
    directives: {
        clickOutside,
    },
    inject: {
        i18n: {
            default: {
                frontChartTooltip: i18n.get('ui.front.chart.tooltip'),
                M458: i18n.get('M458'),
                chartPopup: i18n.get('ui.label.chartPopup'),
                realtimeMonitoring: i18n.get('ui.label.realtimeMonitoring'),
                setting: i18n.get('ui.label.setting'),
                load: i18n.get('ui.button.load'),
                autoPlacement: i18n.get('ui.button.autoPlacement'),
                displayName: i18n.get('ui.label.displayName'),
                showHiddenNode: i18n.get('ui.label.node.show.hidden'),
                M0308: i18n.get('M0308'),
                M0399: i18n.get('M0399'),
                M0450: i18n.get('M0450'),
                M0449: i18n.get('M0449'),
                M0453: i18n.get('M0453'),
                M0452: i18n.get('M0452'),
                M0451: i18n.get('M0451'),
                M0473: i18n.get('M0473'),
                apply: i18n.get('ui.label.apply'),
                cancel: i18n.get('ui.label.cancel'),
                mapConfigTime: i18n.get('ui.label.mapConfigTime'),
                recent: i18n.get('ui.label.recent'),
                minute: i18n.get('ui.label.unit.minute'),
                M0180: i18n.get('M0180'),
                M0181: i18n.get('M0181'),
                M0185: i18n.get('M0185'),
                showXviewChart: i18n.get('ui.label.showXview'),
                save: i18n.get('ui.button.save'),
            },
        },
    },
    props: {
        dataKey: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showMapConfig: false,
            showNewTitle: false,
            showDeletionConfirm: false,
            showSaveList: false,
            showLoadList: false,
            showXviewChart: false,
            mapConfigTimeMin: 0,
            showDisplayName: true,
            showHiddenNode: false,
            configPosition: {
                x: 0,
                y: 0,
            },
            popupPosition: {
                x: window.innerWidth / 2 - 180,
                y: window.innerHeight / 2 - 93,
            },
            scaleBtnItems: [
                { iconType: ICON_TYPE.add },
                { iconType: ICON_TYPE.remove },
            ],
            utilBtnItems: [
                { text: this.i18n.save },
                { text: this.i18n.load },
                { text: this.i18n.autoPlacement },
            ],
            newTitle: '',
            indexToDelete: null,
        };
    },
    computed: {
        ...mapState({
            mapConfigTime: state => state.mapConfigTime,
            saveList: state => state.saveList,
            nodeScale: state => state.nodeScale,
            notificationMessage: state => state.notificationMessage,
            showNotification: state => state.showNotification,
            showXView: state => state.showXView,
        }),
        nodeScaleFormat() {
            return Math.floor(this.nodeScale * 10) * 10 + '%';
        },
        deleteConfirmMessage() {
            return `${this.saveList[this.indexToDelete].text} ${
                this.i18n.M0185
            }`;
        },
    },
    methods: {
        ...mapMutations(['toggleXView']),
        ...mapActions([
            'loadMapConfigTime',
            'saveMapConfigTime',
            'plusScale',
            'minusScale',
            'autoReplacement',
            'loadSaveList',
            'loadDashboard',
            'saveDashboard',
            'saveNewDashboard',
            'deleteDashboard',
        ]),
        closeConfig() {
            if (this.showMapConfig) {
                this.showMapConfig = false;
            }
        },
        async onClickMapConfig() {
            if (!this.showMapConfig) {
                await this.loadMapConfigTime();
                this.mapConfigTimeMin = this.mapConfigTime;
                this.showMapConfig = true;
                return;
            }
            this.closeConfig();
        },
        async onApplyMapConfigTime() {
            await this.saveMapConfigTime(this.mapConfigTimeMin);
            this.closeConfig();
        },
        onClickScaleBtn(item) {
            if (Object.is(item, this.scaleBtnItems[0])) this.plusScale();
            else this.minusScale();
        },
        async onClickUtilBtn(item) {
            if (Object.is(item, this.utilBtnItems[0])) {
                await this.onClickSaveBtn();
            } else if (Object.is(item, this.utilBtnItems[1])) {
                await this.onClickLoadBtn();
            } else if (Object.is(item, this.utilBtnItems[2])) {
                this.showSaveList = this.showLoadList = false;
                this.autoReplacement();
            }
        },
        closeUtilList() {
            if (this.showSaveList) this.showSaveList = false;
            if (this.showLoadList) this.showLoadList = false;
        },
        async onClickSaveBtn() {
            this.showLoadList = false;
            if (this.showSaveList) {
                this.showSaveList = false;
                return;
            }
            await this.loadSaveList();
            this.showSaveList = true;
        },
        openDeleteConfirm(i) {
            this.indexToDelete = i;
            this.showLoadList = false;
            this.showDeletionConfirm = true;
        },
        async onClickLoadBtn() {
            this.showSaveList = false;
            if (this.showLoadList) {
                this.showLoadList = false;
                return;
            }
            await this.loadSaveList();
            this.showLoadList = true;
        },
        onClickDashboardToLoad(index) {
            this.loadDashboard(this.saveList[index].value);
        },
        openNewTitle() {
            this.showNewTitle = true;
            this.showSaveList = false;
        },
        async onApplyNewDashboardTitle() {
            if (this.newTitle.length > 0) {
                await this.saveNewDashboard(this.newTitle);
                this.showNewTitle = false;
            }
        },
        async onApplyDeleteDashboard() {
            await this.deleteDashboard(this.indexToDelete);
            this.showDeletionConfirm = false;
        },
    },
    watch: {
        showDisplayName() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.isDefaultDisplayName = this.showDisplayName;
        },
        showHiddenNode() {
            const topologyChart = DashboardChartHandler.topologyCharts()[0];
            topologyChart.isShowHiddenNode = this.showHiddenNode;
        },
    },
    created() {
        this.icons = {
            settings: ICON_TYPE.settings,
            save: ICON_TYPE.save,
            add: ICON_TYPE.add,
            remove: ICON_TYPE.remove,
            chartXview: ICON_TYPE.chartXview,
        };
    },
    mounted() {
        if (this.$refs['config-btn']) {
            const { left, top, height } = this.$refs[
                'config-btn'
            ].$el.getBoundingClientRect();
            this.configPosition = { x: left - 4, y: top + height + 8 };
        }
    },
};
</script>
<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.topology-chart-ux {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    align-items: center;
    z-index: 13;
    > :not(:first-child) {
        margin-left: 8px;
    }
    .switch-group {
        margin-left: 16px;
        > :not(:first-child) {
            margin-left: 8px;
        }
    }
    .map-config-content {
        width: 180px;
        .config-footer {
            margin: 12px -12px -12px 0;
            display: flex;
            justify-content: flex-end;
            > .aries-ui-btn {
                margin-left: 0 !important;
            }
        }
    }
    .new-dashboard-title-window {
        .new-dashboard-title-content {
            width: 320px;
            > :last-child {
                margin-top: 16px;
            }
        }
    }
}
</style>
