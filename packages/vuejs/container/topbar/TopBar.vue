<template>
    <div
        class="topbar"
        ref="topbar"
        :class="{ 'top-on-content': topOnContent }"
    >
        <btn
            v-if="useMulti"
            v-tooltip="{
                content: i18n.reset,
                bgColor: tooltip.bgColor,
                color: tooltip.color,
                isScrolling: false,
            }"
            :items="[{ iconType: iconTypes.refresh }]"
            class="border-none"
            @click="clearSelected"
        ></btn>
        <div class="list-wrapper" :class="{ open: open }">
            <div class="list" ref="listInTopBar">
                <instance
                    v-if="viewInstance"
                    v-for="instanceId in filterdInstanceList"
                    v-bind:key="instanceId"
                    :id="instanceId"
                    :name="getName(instanceId)"
                    :selected="selectedInstanceList.includes(instanceId)"
                    @select="select(instanceId)"
                /><domain
                    v-if="viewDomain"
                    v-for="id in filterDomainListByBatchjob"
                    v-bind:key="id"
                    :id="id"
                    :selected="selectedDomainList.includes(id)"
                    @select="select(id)"
                />
            </div>
        </div>
        <div class="configure-topbar" v-if="typeInUserdefineEdit !== undefined">
            <dropdown
                class="configure-topbar"
                ref="topbarDropdown"
                :is-simple-style="true"
                :items="topbarTypes"
                :selected-value="typeInUserdefineEdit"
                @onchange="onChangeTopbar"
            />
        </div>
        <div class="count" v-else>
            <btn
                v-tooltip="{
                    content: totalCountMessage,
                    bgColor: tooltip.bgColor,
                    color: tooltip.color,
                    isScrolling: false,
                }"
                :items="[totalCountItem]"
                class="border-none"
                @click="toggleOpen"
            >
            </btn>
            <scoreboard
                v-if="viewInstance && useRealtime"
                v-show="configure.showScoreboard[0] === true"
                :live-count="instanceCountByStatus.live"
                :stopped-count="instanceCountByStatus.stop"
                :unlicenced-count="instanceCountByStatus.license"
            ></scoreboard>

            <dropdown-composed
                v-if="viewInstance && useRealtime"
                v-tooltip="{
                    content: i18n.settingView,
                    bgColor: tooltip.bgColor,
                    color: tooltip.color,
                    isScrolling: false,
                }"
                :button-options="{
                    iconType: iconMoreVertical,
                    position: 'left',
                }"
            >
                <popup-list
                    :items="itemsShowScoreboard"
                    :active-index.sync="configure.showScoreboard"
                    type="checkbox"
                />
                <popup-list
                    :items="itemsShowInstanceByStatus"
                    type="icon"
                    :active-index.sync="configure.showInstanceByStatus"
                />
            </dropdown-composed>
        </div>
    </div>
</template>

<script>
import { Observer } from '@common/legacy/Observer';
import {
    ChartKeywordInObserver,
    DataKeywordInObserver,
} from '@common/ObserverKeyword';
import VInstanceTooltip from './vInstanceTooltip';
import { ElementManager } from '@common/legacy/ElementManager';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';
import DropdownComposed from '@vuejs/component/dropdown/DropdownComposed';
import PopupList from '@vuejs/component/dropdown/PopupList';
import Instance from '@vuejs/container/topbar/Instance';
import Domain from '@vuejs/container/topbar/Domain';
import Scoreboard from '@vuejs/container/topbar/Scoreboard';
import { setSessionObj, getSessionObj, i18n } from '@common/utility';
import { ariesuser } from '@common/base';
import { DomainBarBatchjobModeDef, LicenseStatusDef } from '@common/definition';
import { setTopBarConfigure } from '@module/common/TopBarConfigure';
import { SelectAgentEventListenerInDashboard } from '@module/chart/eventlistener/SelectAgentEventListenerInDashboard';
import { TOPBAR_TYPES } from '@entry/userdefine/dashboardEdit/const';
import Dropdown from '@vuejs/component/dropdown/Dropdown';

const VIEW_INSTANCE_AND_VIEW_SCOREBOARD = 'view_instance_and_view_scoreboard';

const NOT_LIVE_LICENSE_STATUS = [
    LicenseStatusDef.STOPPED,
    LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS,
];

export default {
    directives: {
        tooltip: VInstanceTooltip,
    },
    components: {
        Scoreboard,
        Btn,
        Domain,
        Instance,
        DropdownComposed,
        Dropdown,
        PopupList,
    },
    props: {
        type: {
            type: String,
            required: false,
            default: 'agent',
            validator: type => {
                return ['agent', 'domain'].includes(type);
            },
        },
        useMultiDomain: {
            type: Boolean,
            required: false,
            default: true,
        },
        useMultiInstance: {
            type: Boolean,
            required: false,
            default: false,
        },
        batchjobMode: {
            type: Number,
            required: false,
            default: 0,
            validator: value => {
                return [0, 1, 2].includes(value);
            },
        },
        userHeight: {
            type: Number,
            required: false,
            default: null,
        },
        isHidden: {
            type: Boolean,
            required: false,
            default: false,
        },
        domainIds: {
            type: Array,
            required: false,
            default: undefined,
        },
        instanceOids: {
            type: Array,
            required: false,
            default: undefined,
        },
        //[분석 > X-View] 에서는 useRealtime: false, searchedOids 조회된 값이다.
        useRealtime: {
            type: Boolean,
            required: false,
            default: true,
        },

        searchedIdNameList: {
            type: Array,
            required: false,
            default: undefined,
        },
        selectedIdList: {
            type: Array,
            required: false,
            default: undefined,
        },
        typeInUserdefineEdit: {
            type: String,
            required: false,
            default: undefined,
        },
        topOnContent: {
            type: Boolean,
            required: false,
            default: true,
        },
    },

    data() {
        return {
            instanceList: [],
            selectedInstanceList: [],
            liveInstanceList: [],
            domainList: [],
            selectedDomainList: [],
            instanceCountByStatus: { license: 0, live: 0, stop: 0 },
            open: false,
            hasExtend: false,
            iconMoreVertical: ICON_TYPE.moreVertical,
            itemsShowScoreboard: [
                {
                    text: i18n.get('ui.label.topbar.configure.showScoreboard'),
                    value: 'showScoreboard',
                },
            ],
            itemsShowInstanceByStatus: [
                {
                    text: i18n.get('ui.label.topbar.configure.showAllInstance'),
                    value: 'all',
                },
                {
                    text: i18n.get(
                        'ui.label.topbar.configure.doNotSeeFrozenInstance'
                    ),
                    value: 'onlyLiveInstance',
                },
            ],
            topbarTypes: [
                { text: i18n.get('ui.label.none'), value: TOPBAR_TYPES.NONE },
                {
                    text: i18n.get('ui.label.topbar.instance.single'),
                    value: TOPBAR_TYPES.DOMAIN_INSTANCE_SINGLE,
                },
                {
                    text: i18n.get('ui.label.topbar.instance.multi'),
                    value: TOPBAR_TYPES.DOMAIN_INSTANCE_MULTI,
                },
            ],
            configure: {
                showScoreboard: [true],
                showInstanceByStatus: 0,
            },
            i18n: {
                totalCountRawMessageWhenViewInstance: i18n.get('M0632'),
                totalCountRawMessageWhenViewDomain: i18n.get('M0634'),

                total: i18n.get('ui.label.totalSum'),
                settingView: i18n.get('ui.label.settingView'),
                reset: i18n.get('ui.button.reset'),
            },
            tooltip: {
                bgColor: 'rgba(0, 0, 0, 0.75)',
                color: '#FFF',
            },
            DomainBarBatchjobModeDef: DomainBarBatchjobModeDef,
        };
    },
    methods: {
        onChangeTopbar(item) {
            this.$emit('onChangeTopbar', item);
        },
        selectedInfo() {
            const cache = ElementManager.getCache();

            if (!cache) return null;

            if (this.viewInstance) {
                if (this.useMultiInstance) {
                    return {
                        instanceIds: cache.selectedInstanceList,
                    };
                } else {
                    const obj = ElementManager.getValue(
                        cache.selectedInstanceList[0] || cache.instanceList[0]
                    );

                    if (!obj) return null;

                    return {
                        domainId: obj.sid,
                        instanceOid: obj.agent,
                    };
                }
            }
        },
        clearSelected() {
            this.$emit('clear');
            this.viewInstance
                ? ElementManager.refreshInstanceSelect()
                : ElementManager.refreshDomainSelect();
            Observer.emit(DataKeywordInObserver.DOMAIN_BAR_CHANGE);
        },
        select(id) {
            this.$emit('select', id);
            this.viewInstance
                ? this.selectWhenViewInstance(id)
                : this.selectWhenViewDomain(id);

            const selectedIdInDashboard = SelectAgentEventListenerInDashboard.selectedAgent()
                ?.id;

            if (this.viewInstance) {
                if (
                    this.selectedInstanceList.length > 0 &&
                    this.selectedInstanceList.includes(
                        selectedIdInDashboard
                    ) === false
                )
                    SelectAgentEventListenerInDashboard.unSelect();
            } else {
                if (
                    this.selectedDomainList.length > 0 &&
                    this.selectedDomainList.includes(selectedIdInDashboard) ===
                        false
                )
                    SelectAgentEventListenerInDashboard.unSelect();
            }

            Observer.emit(DataKeywordInObserver.DOMAIN_BAR_CHANGE);
        },
        selectWhenViewInstance(id) {
            this.useMultiInstance
                ? ElementManager.select(id)
                : ElementManager.selectInstanceOne(id);
            this.selectedInstanceList = ElementManager.getCache().selectedInstanceList;
        },
        selectWhenViewDomain(id) {
            const domain = ElementManager.getValue(id);
            if (
                (this.batchjobMode === DomainBarBatchjobModeDef.BATCHJOB_ONLY &&
                    domain.batchjob === false) ||
                (this.batchjobMode ===
                    DomainBarBatchjobModeDef.BATCHJOB_EXCLUDE &&
                    domain.batchjob)
            ) {
                return;
            }

            this.useMultiDomain
                ? ElementManager.select(id)
                : ElementManager.selectDomainOne(id);

            this.selectedDomainList = ElementManager.getCache().selectedDomainList;
        },

        toggleOpen() {
            if (this.hasExtend) this.open = !this.open;
        },
        render() {
            // 최초 화면 로드시 이벤트 발생
            this.viewInstance
                ? this.renderWhenViewInstance()
                : this.renderWhenViewDomain();

            this.checkHasExtend();
            this.saveSessionSelected();
        },
        renderWhenViewInstance() {
            this.instanceList = ElementManager.getCache().instanceList;
            this.liveInstanceList = ElementManager.getCache().liveInstanceList;
            this.selectedInstanceList = ElementManager.getCache().selectedInstanceList;
            this.instanceCountByStatus = Object.assign(
                {},
                ElementManager.getInfo()
            );

            // 선택되어진게 없다면 무조건 처음걸 선택한다.
            if (this.useMultiInstance === false) {
                if (
                    ElementManager.getCache().hasSelectedInstance === false &&
                    this.liveInstanceList[0]
                ) {
                    ElementManager.selectInstanceOne(this.liveInstanceList[0]);
                    this.selectedInstanceList = [this.liveInstanceList[0]];
                } else if (this.selectedInstanceList.length > 1) {
                    // domain 별로는 single 일 수 있는데  domain group 에서 개별 도메인별로 선택된 instance 가 모두 선택될 수 있음.
                    // 그래서 selected instance list 를 1 로 맞춤.
                    ElementManager.selectInstanceOne(
                        this.selectedInstanceList[0]
                    );
                    this.selectedInstanceList = [this.selectedInstanceList[0]];
                }
            }
        },
        renderWhenViewDomain() {
            this.domainList = ElementManager.getDomainAllList();
            this.selectedDomainList = ElementManager.getCache().selectedDomainList;

            this.$nextTick(() => {
                if (this.useMultiDomain === false) {
                    if (
                        ElementManager.getCache().hasSelectedDomain === false &&
                        this.filterDomainListByBatchjob[0]
                    ) {
                        ElementManager.selectDomainOne(
                            this.filterDomainListByBatchjob[0]
                        );
                        this.selectedDomainList = [
                            this.filterDomainListByBatchjob[0],
                        ];
                    } else if (this.selectedDomainList.length > 1) {
                        // domain 별로는 single 일 수 있는데  domain group 에서 개별 도메인별로 선택된 instance 가 모두 선택될 수 있음.
                        // 그래서 selected instance list 를 1 로 맞춤.
                        ElementManager.selectDomainOne(
                            this.selectedDomainList[0]
                        );
                        this.selectedDomainList = [this.selectedDomainList[0]];
                    }
                }
            });
        },
        checkHasExtend() {
            this.$nextTick(() => {
                const offsetTopData = new Set(
                    Array.from(this.$refs.listInTopBar.childNodes).map(
                        el => el.offsetTop
                    )
                );

                this.hasExtend = offsetTopData.size > 1;

                if (this.hasExtend === false) this.open = false;
            });
        },

        //domainbar.js checkRedirectAndMove() 구현..
        checkRedirectAndMove() {
            const count = this.viewInstance
                ? this.viewInstanceList().length
                : this.viewDomainList().length;

            const uri = location.pathname,
                expandedDashboardTargetCount =
                    ariesuser.expandedDashboardTargetCount;

            //대시보드 레이아웃 변경
            if (
                uri.indexOf('realtimeAdmin') > -1 ||
                uri.indexOf('multiDomain') > -1
            ) {
                if (count >= expandedDashboardTargetCount) {
                    Observer.emit(
                        ChartKeywordInObserver.CHANGE_DASHBOARD_LAYOUT_EXTEND
                    );
                } else {
                    Observer.emit(
                        ChartKeywordInObserver.CHANGE_DASHBOARD_LAYOUT_ORIGIN
                    );
                }
            }
        },

        viewInstanceList() {
            const cache = ElementManager.getCache();
            return cache.selectedInstanceList.length > 0
                ? cache.selectedInstanceList
                : cache.instanceList;
        },

        viewDomainList() {
            const cache = ElementManager.getCache();
            return cache.selectedDomainList.length > 0
                ? cache.selectedDomainList
                : this.filterDomainListByBatchjob;
        },

        //domainbar.js의 saveSession 동일하게 구성함.
        saveSessionSelected() {
            // 캐쉬에 저장해보자.
            setSessionObj(this.getSessionKeySelected, {
                selectedDomainList: ElementManager.getCache()
                    .selectedDomainList,
                selectedInstanceList: ElementManager.getCache()
                    .selectedInstanceList,
            });
        },

        restoreSessionSelected() {
            return getSessionObj(this.getSessionKeySelected);
        },

        saveSessionScoreboardNViewInstance() {
            setSessionObj(VIEW_INSTANCE_AND_VIEW_SCOREBOARD, this.configure);
        },

        restoreSessionScoreboardNViewInstance() {
            return getSessionObj(VIEW_INSTANCE_AND_VIEW_SCOREBOARD);
        },

        listenFetchDataInDashboard() {
            Observer.on(DataKeywordInObserver.INSTANCE_INFO_IN_DOMAIN, () => {
                this.checkRedirectAndMove();
                this.render();
            });
        },

        getName(id) {
            return this.searchedIdNameList?.find(item => item.id === id)?.name;
        },
    },
    computed: {
        filterDomainListByBatchjob() {
            const domainArray = this.domainList.map(domainId =>
                ElementManager.getValue(domainId)
            );
            const filteredDomainArray =
                this.batchjobMode === DomainBarBatchjobModeDef.BATCHJOB_EXCLUDE
                    ? domainArray.filter(domain => domain.batchjob === false)
                    : this.batchjobMode ===
                      DomainBarBatchjobModeDef.BATCHJOB_ONLY
                    ? domainArray.filter(domain => domain.batchjob === true)
                    : domainArray;
            return filteredDomainArray.map(domain => domain.id);
        },
        filterdInstanceList() {
            //사용자 정의 대시보드 편집화면에서 '없음'으로 설정되었을때..
            if (this.typeInUserdefineEdit === TOPBAR_TYPES.NONE) return [];

            return this.configure.showInstanceByStatus === 1
                ? this.liveInstanceList
                : this.instanceList;
        },

        totalCountMessage() {
            const totalCountRawMessage = this.viewInstance
                ? this.i18n.totalCountRawMessageWhenViewInstance
                : this.i18n.totalCountRawMessageWhenViewDomain;

            return this.hasExtend
                ? totalCountRawMessage.replace('%d', this.totalCount)
                : this.i18n.total;
        },
        totalCountItem() {
            const item = {
                text: this.totalCount,
            };

            if (this.hasExtend) item.iconType = this.iconTypes.arrowDown;
            return item;
        },

        totalCount() {
            return this.searchedIdNameList
                ? this.searchedIdNameList.length
                : this.viewInstance
                ? this.configure.showInstanceByStatus
                    ? this.instanceCountByStatus.live
                    : this.instanceCountByStatus.totalCount
                : this.filterDomainListByBatchjob.length;
        },

        //domainbar.js의 getSessionKey와 동일하게 키를 구성함.
        getSessionKeySelected() {
            return [
                !!Observer.get('isDomainGroupUsage'),
                this.type,
                this.useMultiDomain,
                this.useMultiInstance,
            ].join(':');
        },
        useMulti() {
            return (
                (this.useMultiDomain && this.viewDomain) ||
                (this.useMultiInstance && this.viewInstance)
            );
        },
        viewInstance() {
            return this.type === 'agent';
        },
        viewDomain() {
            return this.type === 'domain';
        },
    },
    watch: {
        configure: {
            deep: true,

            handler(newConfigure) {
                const liveOnly = newConfigure.showInstanceByStatus === 1;
                Observer.emit(ChartKeywordInObserver.SHOW_LIVE_INSTANCE, [
                    liveOnly,
                ]);
                if (liveOnly)
                    ElementManager.refreshUnliveInstanceSelectWhenSelectOnlyLive();
                this.saveSessionScoreboardNViewInstance();
            },
        },
        //[분석 > X-View에서 조회후 생성되는 상단바에서 사용함.
        searchedIdNameList() {
            this.instanceList = this.searchedIdNameList.map(item => item.id);
        },
        selectedIdList() {
            this.selectedInstanceList = this.selectedIdList;
        },
        typeInUserdefineEdit(newValue) {
            //사용자 정의 대시보드 편집화면에서 'Instance 싱글' 으로 변경 되었을때...
            if (
                newValue === TOPBAR_TYPES.DOMAIN_INSTANCE_SINGLE &&
                this.filterdInstanceList.length > 0
            ) {
                this.selectWhenViewInstance(this.filterdInstanceList[0]);
            }
        },
    },
    mounted() {
        //https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
        const resizeObserver = new ResizeObserver(el => {
            this.checkHasExtend();
        });
        resizeObserver.observe(this.$refs.topbar);

        if (this.useRealtime) {
            ElementManager.init(
                Observer.get('elements'),
                this.batchjobMode,
                this.domainIds,
                this.instanceOids
            );

            if (this.domainIds === undefined && this.instanceOids === undefined)
                ElementManager.setSelectedData(this.restoreSessionSelected());

            this.checkRedirectAndMove();
            // 도메인바 선택시 이벤트 발생
            Observer.on(DataKeywordInObserver.DOMAIN_BAR_CHANGE, () => {
                this.checkRedirectAndMove();
                this.render();
                this.$emit('change', this.selectedInfo());
            });

            // 도메인바 리사이징시 이벤트 발생
            Observer.on(DataKeywordInObserver.DOMAIN_BAR_RESIZE, height => {
                this.$emit('resize', height);
            });

            Observer.emit(DataKeywordInObserver.DOMAIN_BAR_CHANGE);

            //인스턴스 정보 데이터 갱신. [/dashboard/common.js] 를 호출해서 TopBar를 생성하는 대시보드에서만 동작.
            this.listenFetchDataInDashboard();

            //차트에서 상단바 정보를 꺼내 쓰기 위해 set 함.
            setTopBarConfigure(
                this.type,
                this.multidomain,
                this.multiinstance,
                this.batchjobMode
            );

            //저장된 값이 있을때만 로드.
            if (this.restoreSessionScoreboardNViewInstance() !== null)
                this.configure = this.restoreSessionScoreboardNViewInstance();
        }
    },
    created() {
        Observer.on(
            DataKeywordInObserver.CHANGE_SELECT_DOMAIN_OR_INSTANCE_ON_ELEMENT,
            selectedInstanceOidsBySid => {
                console.log('load', selectedInstanceOidsBySid);
            }
        );

        this.iconTypes = {
            refresh: ICON_TYPE.refresh,
            arrowDown: ICON_TYPE.arrowDown,
        };
    },
};
</script>

<style lang="scss" scoped>
.topbar {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        height: 32px;

        //box-shadow: 0 1px 2px 0 themed('topbar-shadow-color');

        border-radius: 3px;
        border: solid 1px themed('topbar-border-color');

        &.top-on-content {
            border-top: none;
            border-left: none;
            border-right: none;
            padding: 0 24px;
            border-radius: 0;
        }

        background-color: themed('topbar-background-color');

        display: flex;
        flex-direction: row;
        position: relative;
        > div:not(.list-wrapper) {
            margin: 3px;
        }

        > .list-wrapper {
            display: inline-flex;
            flex-grow: 1;
            position: relative;
            .list {
                padding: 1px 3px;
                border-radius: 3px 0 0 3px;
                display: flex;
                flex-direction: row;
                background: themed('topbar-background-color');

                border-right: solid 1px themed('topbar-border-color');
                flex-wrap: wrap;

                overflow: hidden;

                box-sizing: border-box;
                width: 100%;
            }

            &.open {
                display: block;
                > .list {
                    position: absolute;
                    z-index: 1000;
                    border-bottom: solid 1px themed('topbar-border-color');
                    border-radius: 0 0 3px 3px;

                    overflow: auto;
                    box-shadow: 0 2px 3px 0 themed('dropdown-shadow-color');
                }
            }
        }
        .configure-topbar {
            width: 200px;
        }
        .count {
            display: flex;
            ::v-deep .popup-list-group {
                z-index: 100;
            }
        }

        .refresh + .list-wrapper {
            > .list {
                border-left: solid 1px themed('topbar-border-color');
            }
        }
    }
}
</style>
