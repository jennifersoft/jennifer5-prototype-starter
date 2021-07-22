<template>
    <div class="main" style="">
        <user-define-edit-header />
        <div class="content">
            <div class="dashboard-edit-area">
                <user-define-edit-area-menu
                    @showConfirmWindow="showConfirmWindow"
                />
                <div class="component-edit-area">
                    <top-bar
                        :type="'agent'"
                        :use-multi-instance.sync="
                            topbar === TOPBAR_TYPES.DOMAIN_INSTANCE_MULTI
                        "
                        :type-in-userdefine-edit.sync="topbar"
                        :top-on-content="false"
                        @onChangeTopbar="onChangeTopbar"
                    ></top-bar>
                    <div
                        ref="gridArea"
                        class="grid-area"
                        @mousemove.capture="onMousemove"
                        @mouseup.capture="onMouseup"
                    >
                        <canvas class="grid" ref="gridCanvas" />
                        <div
                            ref="componentsArea"
                            class="components-area"
                            @keydown.left.self="moveLeftActiveComponent"
                            @keydown.right.self="moveRightActiveComponent"
                            @keydown.up.self="moveUpActiveComponent"
                            @keydown.down.self="moveDownActiveComponent"
                            v-click-outside="nonSelectWhenClickInGridCanvas"
                            :tabindex="1000"
                        >
                            <chart-template
                                v-for="(item, index) in chartComponents"
                                v-bind:key="item.dataKey"
                                :chart-option="item"
                                @registeredChartKey="registeredChartKey"
                                @onMousedownComponent="onMousedownComponent"
                                @onMousedownResizePoint="onMousedownResizePoint"
                                :areaWidth="componentsAreaSize.width"
                                :areaHeight="componentsAreaSize.height"
                            />
                            <text-template
                                v-for="(item, index) in textComponents"
                                v-bind:key="item.dataKey"
                                :text-option="item"
                                @onMousedownComponent="onMousedownComponent"
                                @onMousedownResizePoint="onMousedownResizePoint"
                                :areaWidth="componentsAreaSize.width"
                                :areaHeight="componentsAreaSize.height"
                            />
                            <iframe-template
                                v-for="(item, index) in iframeComponents"
                                v-bind:key="item.dataKey"
                                :iframe-option="item"
                                @onMousedownComponent="onMousedownComponent"
                                @onMousedownResizePoint="onMousedownResizePoint"
                                :areaWidth="componentsAreaSize.width"
                                :areaHeight="componentsAreaSize.height"
                            />
                            <plugin-template
                                v-for="(item, index) in pluginComponents"
                                v-bind:key="item.dataKey"
                                :plugin-option="item"
                                @onMousedownComponent="onMousedownComponent"
                                @onMousedownResizePoint="onMousedownResizePoint"
                                :areaWidth="componentsAreaSize.width"
                                :areaHeight="componentsAreaSize.height"
                            />
                        </div>
                        <cancel-or-apply-window
                            :message="i18n.dashboardImportConfirmMessage"
                            v-show="isShowDashboardImportConfirmWindow"
                            @cancel="hideDashboardImportConfirmWindow"
                            @apply="loadSelectedDashboard"
                        />
                        <check-window
                            :message="messageWhenNeedSelect"
                            v-if="messageWhenNeedSelect !== undefined"
                            @cancel="hideCheckWindow"
                        />

                        <cell-configure-on-score-board
                            v-if="
                                this.editingCellOptionOnScoreBoard.cellIndex !==
                                    undefined
                            "
                            :style="stylingScoreBoardLayer"
                            @cancel="nonSelectEditingCellOptionOnScoreBoard"
                            @apply="nonSelectEditingCellOptionOnScoreBoard"
                        />
                        <baseline-configure-window
                            v-if="isShowWindowWhenBaselineChartEdit"
                            @cancel="emitShowWindowWhenBaselineChartEdit(false)"
                            @apply="emitShowWindowWhenBaselineChartEdit(false)"
                        />

                        <active-service-list-configure-window
                            v-if="isShowWindowWhenActiveServiceListChartEdit"
                            @cancel="
                                emitShowWindowWhenActiveServiceListChartEdit(
                                    false
                                )
                            "
                            @apply="
                                emitShowWindowWhenActiveServiceListChartEdit(
                                    false
                                )
                            "
                        />
                    </div>
                </div>
            </div>
            <div class="edit-component-box">
                <user-define-edit-insert-types />
                <edit-chart
                    v-if="
                        Object.values(CHART_TYPE_ON_UI).includes(
                            selectedInsertTypeOnUI
                        )
                    "
                />
                <edit-text
                    v-else-if="
                        INSERT_TYPE_ON_UI.TEXT === selectedInsertTypeOnUI
                    "
                />
                <edit-iframe
                    v-else-if="
                        INSERT_TYPE_ON_UI.IFRAME === selectedInsertTypeOnUI
                    "
                />
                <edit-plugin
                    v-else-if="
                        INSERT_TYPE_ON_UI.PLUGIN === selectedInsertTypeOnUI
                    "
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { i18n } from '@common/utility';
import { ServerConfigureValue } from '@module/global/ServerConfigureValue';

import UserDefineEditHeader from '@entry/userdefine/dashboardEdit/component/userDefineEditHeader';
import UserDefineEditAreaMenu from '@entry/userdefine/dashboardEdit/component/userDefineEditAreaMenu';
import UserDefineEditInsertTypes from '@entry/userdefine/dashboardEdit/component/userDefineEditInsertTypes';
import TopBar from '@vuejs/container/topbar/TopBar';
import EditChart from '@entry/userdefine/dashboardEdit/component/edit/editChart';
import EditText from '@entry/userdefine/dashboardEdit/component/edit/editText';
import EditIframe from '@entry/userdefine/dashboardEdit/component/edit/editIframe';
import EditPlugin from '@entry/userdefine/dashboardEdit/component/edit/editPlugin';
import {
    CHART_TYPE_ON_UI,
    COMPONENT_MOVE,
    COMPONENT_RESIZE,
    GRID_COUNT,
    INSERT_TYPE_ON_UI,
    TOPBAR_TYPES,
} from '@entry/userdefine/dashboardEdit/const';
import { ThemeHandler } from '@module/chart/config/ThemeHandler';
import ChartTemplate from '@entry/userdefine/dashboardEdit/component/template/chartTemplate';
import TextTemplate from '@entry/userdefine/dashboardEdit/component/template/textTemplate';
import IframeTemplate from '@entry/userdefine/dashboardEdit/component/template/iframeTemplate';
import PluginTemplate from '@entry/userdefine/dashboardEdit/component/template/pluginTemplate';

import { Observer } from '@common/legacy/Observer';
import { ElementManager } from '@common/legacy/ElementManager';
import { BusinessManager } from '@common/legacy/BusinessManager';
import { readDashboard } from '@entry/userdefine/dashboardEdit/http';
import CellConfigureOnScoreBoard from '@entry/userdefine/dashboardEdit/component/window/cellConfigureOnScoreBoard';
import clickOutside from '@vuejs/directive/clickOutside';
import CancelOrApplyWindow from '@entry/userdefine/dashboardEdit/component/window/cancelOrApplyWindow';
import CheckWindow from '@entry/userdefine/dashboardEdit/component/window/checkWindow';
import BaselineConfigureWindow from '@entry/userdefine/dashboardEdit/component/window/baselineConfigureWindow';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import ActiveServiceListConfigureWindow from '@entry/userdefine/dashboardEdit/component/window/activeServiceListConfigureWindow';
import { fixDataForLegacy } from '@entry/dashboard/common';

export default {
    name: 'userDefineEditTemplate',
    directives: {
        clickOutside,
    },
    components: {
        ActiveServiceListConfigureWindow,
        BaselineConfigureWindow,
        CancelOrApplyWindow,
        CheckWindow,
        IframeTemplate,
        PluginTemplate,
        TextTemplate,
        UserDefineEditHeader,
        UserDefineEditAreaMenu,
        TopBar,
        UserDefineEditInsertTypes,
        CellConfigureOnScoreBoard,
        ChartTemplate,
        EditChart,
        EditText,
        EditIframe,
        EditPlugin,
    },
    inject: {
        theme: {
            type: String,
            default: 'classic',
        },

        groupId: {
            type: String,
        },
    },
    props: {
        paramKey: {
            type: String,
            required: false,
            default: '',
        },

        paramGroupId: {
            type: String,
            required: false,
            default: '',
        },

        configLimitChartCount: {
            type: Number,
            required: true,
        },

        useJenniferFrontOnDashboard: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            activeDrag: false,
            activeResize: false,
            activeComponentOriginPosition: {
                startx: undefined,
                starty: undefined,
                endx: undefined,
                endy: undefined,
            },
            dragOrResizeStartPosition: {
                x: undefined,
                y: undefined,
            },
            resizeDirections: [],
            usedTopbarType: 'none',
            i18n: {
                topbarConfigure: i18n.get('ui.label.topbar.configure'),
                dashboardImportConfirmMessage: i18n
                    .get('M0396')
                    .replace(/\\n/g, '<br>'),
            },
            GRID_COUNT: GRID_COUNT,
            COMPONENT_MOVE: COMPONENT_MOVE,
            CHART_TYPE_ON_UI: CHART_TYPE_ON_UI,
            INSERT_TYPE_ON_UI: INSERT_TYPE_ON_UI,
            TOPBAR_TYPES: TOPBAR_TYPES,
            xPercentArrayOnGrid: Array.from(
                new Array(GRID_COUNT.COLUMN + 1).keys()
            ).map(index => (100 * index) / GRID_COUNT.COLUMN),
            yPercentArrayOnGrid: Array.from(
                new Array(GRID_COUNT.ROW + 1).keys()
            ).map(index => (100 * index) / GRID_COUNT.ROW),
            ignoreErrorPercent: 0.5,
            componentsAreaWidth: 0,
            componentsAreaHeight: 0,
            isShowDashboardImportConfirmWindow: false,
            selectedDashboardData: undefined,
            registeredChartKeySet: new Set(),
            isSocketInitWhenDashboardLoad: true,
        };
    },
    methods: {
        ...mapMutations('userdefine', [
            'setDashboardKey',
            'setGroupId',
            'configureServerValues',
            'initComponents',
            'setComponent',
            'setTitle',
            'emitShowWindowWhenUseToolType',
            'emitShowWindowWhenBaselineChartEdit',
            'emitShowWindowWhenActiveServiceListChartEdit',
            'nonSelectEditingCellOptionOnScoreBoard',
            'configureTopbar',
            'setComponentsAreaSize',
            'showCheckWindowWithMessage',
            'setTopbarSyncOnEditingChart',
            'showCheckWindowWithMessage',
        ]),

        ...mapActions('userdefine', [
            'emitShowEditUI',
            'emitNonSelectComponent',
            'saveEditingAfterTypeCheck',
        ]),

        onChangeTopbar(item) {
            if (item.value === TOPBAR_TYPES.NONE) {
                if (this.hasDomainBarSyncChart) {
                    this.showCheckWindowWithMessage(i18n.get('M0363'));
                    return;
                }

                this.setTopbarSyncOnEditingChart(false);
            }

            this.configureTopbar(item.value);
        },
        moveLeftActiveComponent() {
            const activeComponent = this.activeComponent;

            if (
                activeComponent.startx - GRID_COUNT.COLUMN_PERCENT >
                GRID_COUNT.COLUMN_PERCENT * -0.1
            ) {
                activeComponent.startx -= GRID_COUNT.COLUMN_PERCENT;
                activeComponent.endx -= GRID_COUNT.COLUMN_PERCENT;
                this.saveEditingAfterTypeCheck();
            }
        },

        moveRightActiveComponent() {
            const activeComponent = this.activeComponent;

            if (
                activeComponent.endx + GRID_COUNT.COLUMN_PERCENT - 100 <
                GRID_COUNT.COLUMN_PERCENT * 0.1
            ) {
                activeComponent.startx += GRID_COUNT.COLUMN_PERCENT;
                activeComponent.endx += GRID_COUNT.COLUMN_PERCENT;
                this.saveEditingAfterTypeCheck();
            }
        },

        moveUpActiveComponent() {
            const activeComponent = this.activeComponent;

            if (
                activeComponent.starty - GRID_COUNT.ROW_PERCENT >
                GRID_COUNT.ROW_PERCENT * -0.1
            ) {
                activeComponent.starty -= GRID_COUNT.ROW_PERCENT;
                activeComponent.endy -= GRID_COUNT.ROW_PERCENT;
                this.saveEditingAfterTypeCheck();
            }
        },

        moveDownActiveComponent() {
            const activeComponent = this.activeComponent;

            if (
                activeComponent.endy + GRID_COUNT.ROW_PERCENT - 100 <
                GRID_COUNT.COLUMN_PERCENT * 0.1
            ) {
                activeComponent.starty += GRID_COUNT.ROW_PERCENT;
                activeComponent.endy += GRID_COUNT.ROW_PERCENT;
                this.saveEditingAfterTypeCheck();
            }
        },

        registeredChartKey(dataKey) {
            this.registeredChartKeySet.add(dataKey);

            //모든 차트 컴포넌트가 로드 되었을때 소켓 연결을 하고 싶어서 만든 코드.
            if (
                this.isSocketInitWhenDashboardLoad === false &&
                this.chartComponents.length === this.registeredChartKeySet.size
            ) {
                console.log('load dashboard - socket init');
                DashboardChartHandler.socketUseCheckInit();
                this.isSocketInitWhenDashboardLoad = true;
            }
        },

        onMousedownComponent(event) {
            this.activeDrag = true;
            this.setActiveComponentOriginPosition();
            this.emitShowWindowWhenUseToolType(false);
            this.configureHighestZIndex();

            this.dragOrResizeStartPosition.x = event.clientX;
            this.dragOrResizeStartPosition.y = event.clientY;
        },

        onMousedownResizePoint(emitData) {
            this.activeResize = true;
            this.setActiveComponentOriginPosition();

            const { event, directions } = emitData;

            this.dragOrResizeStartPosition.x = event.clientX;
            this.dragOrResizeStartPosition.y = event.clientY;

            this.resizeDirections = directions;
        },

        onMouseup(event) {
            if (this.activeResize) {
                const activeComponent = this.activeComponent;

                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.START_X_UPDATE
                    )
                )
                    activeComponent.startx = this.nearestPercentWithGrid(
                        activeComponent.startx,
                        this.xPercentArrayOnGrid
                    );
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.START_Y_UPDATE
                    )
                )
                    activeComponent.starty = this.nearestPercentWithGrid(
                        activeComponent.starty,
                        this.yPercentArrayOnGrid
                    );
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.END_X_UPDATE
                    )
                )
                    activeComponent.endx = this.nearestPercentWithGrid(
                        activeComponent.endx,
                        this.xPercentArrayOnGrid
                    );
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.END_Y_UPDATE
                    )
                )
                    activeComponent.endy = this.nearestPercentWithGrid(
                        activeComponent.endy,
                        this.yPercentArrayOnGrid
                    );

                this.setComponent(activeComponent);
                this.saveEditingAfterTypeCheck();
            }

            if (this.activeDrag) {
                const activeComponent = this.activeComponent;

                activeComponent.startx = this.nearestPercentWithGrid(
                    activeComponent.startx,
                    this.xPercentArrayOnGrid
                );
                activeComponent.starty = this.nearestPercentWithGrid(
                    activeComponent.starty,
                    this.yPercentArrayOnGrid
                );
                activeComponent.endx = this.nearestPercentWithGrid(
                    activeComponent.endx,
                    this.xPercentArrayOnGrid
                );
                activeComponent.endy = this.nearestPercentWithGrid(
                    activeComponent.endy,
                    this.yPercentArrayOnGrid
                );

                this.setComponent(activeComponent);
                this.saveEditingAfterTypeCheck();
            }

            this.activeDrag = false;
            this.activeResize = false;
        },

        onMouseleave(event) {
            this.activeDrag = false;
            this.activeResize = false;
        },

        onMousemove(event) {
            if (this.activeDrag) {
                const deltaX = event.clientX - this.dragOrResizeStartPosition.x;
                const deltaY = event.clientY - this.dragOrResizeStartPosition.y;
                const deltaXPercent = (deltaX / this.componentsAreaWidth) * 100;
                const deltaYPercent =
                    (deltaY / this.componentsAreaHeight) * 100;

                const activeComponent = this.activeComponent;
                activeComponent.startx =
                    this.activeComponentOriginPosition.startx + deltaXPercent;
                activeComponent.starty =
                    this.activeComponentOriginPosition.starty + deltaYPercent;
                activeComponent.endx =
                    this.activeComponentOriginPosition.endx + deltaXPercent;
                activeComponent.endy =
                    this.activeComponentOriginPosition.endy + deltaYPercent;
            }

            if (this.activeResize) {
                const deltaX = event.clientX - this.dragOrResizeStartPosition.x;
                const deltaY = event.clientY - this.dragOrResizeStartPosition.y;
                const deltaXPercent = (deltaX / this.componentsAreaWidth) * 100;
                const deltaYPercent =
                    (deltaY / this.componentsAreaHeight) * 100;

                const activeComponent = this.activeComponent;
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.START_X_UPDATE
                    )
                )
                    activeComponent.startx =
                        this.activeComponentOriginPosition.startx +
                        deltaXPercent;
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.START_Y_UPDATE
                    )
                )
                    activeComponent.starty =
                        this.activeComponentOriginPosition.starty +
                        deltaYPercent;
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.END_X_UPDATE
                    )
                )
                    activeComponent.endx =
                        this.activeComponentOriginPosition.endx + deltaXPercent;
                if (
                    this.resizeDirections.includes(
                        COMPONENT_RESIZE.END_Y_UPDATE
                    )
                )
                    activeComponent.endy =
                        this.activeComponentOriginPosition.endy + deltaYPercent;
            }
        },

        isActiveComponent(dataKey) {
            return this.editingChartOptions.dataKey === dataKey;
        },

        setActiveComponentOriginPosition() {
            const activeComponent = this.activeComponent;

            this.activeComponentOriginPosition.startx = activeComponent.startx;
            this.activeComponentOriginPosition.starty = activeComponent.starty;
            this.activeComponentOriginPosition.endx = activeComponent.endx;
            this.activeComponentOriginPosition.endy = activeComponent.endy;
        },

        configureHighestZIndex() {
            const activeComponent = this.activeComponent;
            activeComponent.zIndex = this.nextZIndex;

            this.setComponent(activeComponent);
            this.saveEditingAfterTypeCheck();
        },

        actionWhenDomResize() {
            //TODO state 값으로 변경해야한다.
            this.componentsAreaWidth = this.$refs.gridCanvas.clientWidth;
            this.componentsAreaHeight = this.$refs.gridCanvas.clientHeight;

            this.setComponentsAreaSize({
                width: this.$refs.gridCanvas.clientWidth,
                height: this.$refs.gridCanvas.clientHeight,
            });

            this.renderGridOnDashboardEditSpace();

            //사이즈 변경시에 하위 차트 컴포넌트 제렌더링.
            this.$emit('paintChart');
        },

        nearestPercentWithGrid(xPercent, percentArrayOnGrid) {
            return percentArrayOnGrid.reduce(
                (previousPercent, currentPercent) =>
                    Math.abs(currentPercent - xPercent) <
                    Math.abs(previousPercent - xPercent)
                        ? currentPercent
                        : previousPercent
            );
        },

        renderGridOnDashboardEditSpace() {
            const context = this.$refs.gridCanvas.getContext('2d');
            const positionOnGrid = this.gridPosition;

            const width = positionOnGrid.width;
            const height = positionOnGrid.height;
            const xArrayOnGrid = positionOnGrid.x;
            const yArrayOnGrid = positionOnGrid.y;

            const gridPath2D = new Path2D();
            const boldGridPath2D = new Path2D();
            const borderPath2D = new Path2D();

            xArrayOnGrid.forEach((x, index) => {
                gridPath2D.moveTo(x, 0);
                gridPath2D.lineTo(x, height);

                if (index % 10 === 0) {
                    boldGridPath2D.moveTo(x, 0);
                    boldGridPath2D.lineTo(x, height);
                }
            });

            yArrayOnGrid.forEach((y, index) => {
                gridPath2D.moveTo(0, y);
                gridPath2D.lineTo(width, y);

                if (index % 10 === 0) {
                    boldGridPath2D.moveTo(0, y);
                    boldGridPath2D.lineTo(width, y);
                }
            });

            context.clearRect(0, 0, width, height);

            borderPath2D.moveTo(0.5, 0);
            borderPath2D.lineTo(0.5, height);

            borderPath2D.moveTo(width - 0.5, 0);
            borderPath2D.lineTo(width - 0.5, height);

            borderPath2D.moveTo(0, 0.5);
            borderPath2D.lineTo(width, 0.5);

            borderPath2D.moveTo(0, height - 0.5);
            borderPath2D.lineTo(width, height - 0.5);

            context.strokeStyle = ThemeHandler.getCanvasStyle().userdefine_edit_dashboard_area_stroke_color;
            context.stroke(gridPath2D);

            context.strokeStyle = ThemeHandler.getCanvasStyle().userdefine_edit_dashboard_area_bold_stroke_color;
            context.stroke(boldGridPath2D);

            context.strokeStyle = ThemeHandler.getCanvasStyle().userdefine_edit_dashboard_area_border_color;
            context.stroke(borderPath2D);
        },

        loadTitle(title) {
            this.setTitle(title);
        },

        loadComponents(components) {
            components.forEach(component => this.setComponent(component));
        },

        initWhenDashboardLoad() {
            this.initComponents();
            this.registeredChartKeySet.clear();
            this.isSocketInitWhenDashboardLoad = false;
        },

        loadSelectedDashboard() {
            this.hideDashboardImportConfirmWindow();

            this.initWhenDashboardLoad();
            const domainBarProp = this.selectedDashboardData.domainBar;
            const chartsProp = this.selectedDashboardData.charts;

            this.loadTopbar(domainBarProp);
            this.loadComponents(chartsProp);
        },

        showConfirmWindow(dashboardData) {
            this.selectedDashboardData = dashboardData;

            this.isShowDashboardImportConfirmWindow = true;
        },

        hideDashboardImportConfirmWindow() {
            this.isShowDashboardImportConfirmWindow = false;
        },

        hideCheckWindow() {
            this.showCheckWindowWithMessage(undefined);
        },

        windowResize() {
            this.actionWhenDomResize();
        },

        loadTopbar(domainBarProp) {
            //원래 사용하던 코드.. JS는 그대로 사용하고 스타일만 변화를 주는 방법을 고민해보자.
            if (domainBarProp) {
                let domainBarType = domainBarProp.type;

                // 기존에 사용하던 type 을 현재 상태에 맞게 바꾼다.
                if (domainBarType === 'domain_agent') {
                    domainBarType = 'agent'; // multidomain, multiinstance 상태에 따라 그려지는 domainbar 가 다르다.
                }

                const isMultiInstance =
                    (domainBarProp.multi &&
                        (domainBarProp.multi === 'true' ||
                            domainBarProp.multi === true)) ||
                    domainBarProp.multiinstance;

                isMultiInstance
                    ? this.configureTopbar(TOPBAR_TYPES.DOMAIN_INSTANCE_MULTI)
                    : this.configureTopbar(TOPBAR_TYPES.DOMAIN_INSTANCE_SINGLE);
            } else {
                this.configureTopbar(TOPBAR_TYPES.NONE);
            }
        },

        nonSelectWhenClickInGridCanvas(e) {
            if (e.target.className === 'grid') this.emitNonSelectComponent();
        },
    },
    computed: {
        ...mapState('userdefine', [
            'components',
            'editingComponentDataKey',
            'editingChartOptions',
            'editingCellOptionOnScoreBoard',
            'isShowWindowWhenUseToolType',
            'isShowWindowWhenBaselineChartEdit',
            'isShowWindowWhenActiveServiceListChartEdit',
            'topbar',
            'messageWhenNeedSelect',
        ]),

        ...mapGetters('userdefine', [
            'selectedInsertTypeOnUI',
            'chartComponents',
            'textComponents',
            'iframeComponents',
            'pluginComponents',
            'maxZIndex',
            'nextZIndex',
        ]),

        ...mapGetters('domain', ['allSidList']),

        activeComponent() {
            return this.components[this.editingComponentDataKey];
        },

        componentsAreaSize() {
            return {
                width: this.componentsAreaWidth,
                height: this.componentsAreaHeight,
            };
            // return {width: this.$refs.componentsArea.clientWidth, height: this.$refs.componentsArea.clientHeight};
        },

        //this.$refs.gridCanvas 의 값을 Vue에서 감지하지 못해서 computed에 넣을수 없었다.
        gridPosition() {
            const { width, height } = this.componentsAreaSize;

            this.$refs.gridCanvas.width = width;
            this.$refs.gridCanvas.height = height;

            const xArrayOnGrid = Array.from(
                new Array(GRID_COUNT.COLUMN + 1).keys()
            ).map(
                index => Math.round((width * index) / GRID_COUNT.COLUMN) + 0.5
            );
            const yArrayOnGrid = Array.from(
                new Array(GRID_COUNT.ROW + 1).keys()
            ).map(index => Math.round((height * index) / GRID_COUNT.ROW) + 0.5);

            //가장 마지막 라인을 안쪽에서 그리기 위해 넣은 코드.
            xArrayOnGrid[xArrayOnGrid.length - 1]--;
            yArrayOnGrid[yArrayOnGrid.length - 1]--;

            return {
                x: xArrayOnGrid,
                y: yArrayOnGrid,
                width: width,
                height: height,
            };
        },
    },
    watch: {
        editingComponentDataKey() {
            if (this.editingComponentDataKey) this.emitShowEditUI();
        },
    },
    async mounted() {
        //렌더링 주기를 가장 낮은수준으로 세팅한다.
        ServerConfigureValue.renderingLevel = 'verylow';
        document
            .getElementsByName('renderingLevelDashboard')[0]
            .setAttribute('value', 'verylow');

        window.addEventListener('resize', this.windowResize);

        //instance 참조(이름)을 사용하기 위해 세팅..
        ElementManager.init(Observer.get('elements'));
        //비즈니스 참조(이름)을 사용하기 위해 세팅..
        BusinessManager.load(this.allSidList);

        //key값이 있다면 대시보드 로드.
        if (this.paramKey !== '') {
            const dashboardAxiosData = await readDashboard(this.paramKey);
            //axios에서 string을 리턴하고 있다. 버젼이 바뀐이후로 생긴 이슈.
            const dashboardProp =
                typeof dashboardAxiosData.data === 'string'
                    ? JSON.parse(dashboardAxiosData.data)
                    : dashboardAxiosData.data;

            this.initWhenDashboardLoad();

            this.setGroupId(dashboardProp.groupId);
            this.setDashboardKey(this.paramKey);
            this.loadTitle(dashboardProp.title);

            this.selectedDashboardData = dashboardProp;

            const charts = fixDataForLegacy(dashboardProp.charts);
            this.loadComponents(charts);
            this.loadTopbar(dashboardProp.domainBar);

            this.actionWhenDomResize();
        } else {
            this.paramGroupId !== ''
                ? this.setGroupId(this.paramGroupId)
                : this.setGroupId(this.groupId);

            //FIXME 기존 대시보드를 로드하는 상황에서는 actionWhenDomResize 가 반영이 잘 되는데 (*아마도 await 때문이겠지), 아닌 상황에서는 $nextTick을 써도 되지 않아서 setTimeout를 넣었다.
            setTimeout(() => {
                this.actionWhenDomResize();
            }, 2000);
        }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.windowResize);
    },
    created() {
        this.configureServerValues({
            configLimitChartCount: this.configLimitChartCount,
            useJenniferFrontOnDashboard: this.useJenniferFrontOnDashboard,
        });
    },
};
</script>
<style lang="scss" scoped>
@import 'themes.scss';

.main {
    display: flex;
    flex-direction: column;
    @include themify($themes) {
        height: 100%;
        border: 0;

        .content {
            flex-grow: 1;
            border-top: solid 1px themed('area-menu-border-color');

            display: flex;

            .dashboard-edit-area {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                //height: 100%;

                .component-edit-area {
                    padding: 20px;
                    background: themed('component-edit-area-background-color');
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    //height: calc(100% - 80px);

                    .grid-area {
                        margin-top: 4px;
                        flex-grow: 1;
                        position: relative;

                        canvas.grid {
                            background: themed(
                                'area-grid-canvas-background-color'
                            );
                            position: absolute;
                            width: 100%;
                            height: 100%;
                        }

                        .components-area {
                            /*width: 100%;*/
                            /*height: 100%;*/
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 2;

                            &:focus {
                                outline: none;
                            }
                        }
                    }
                }
            }

            .edit-component-box {
                display: flex;
                flex-direction: column;
                //  flex-grow: 0;
                //height: 100%;
                vertical-align: top;

                width: 280px;
                border-left: solid 1px themed('area-menu-border-color');
            }
        }
    }
}
</style>
