<template>
    <div class="side-bar" v-click-outside="onClickOutside">
        <div class="btn-group upper">
            <logo
                class="top-logo"
                :logo-url="logoPath"
                clickable
                @click="onClickLogo"
            />
            <side-bar-item
                :menu-name="{ displayName: i18n.dashboard, key: 'dashboard' }"
                :active="showMenuLayer && activeMenu === 'dashboard'"
                :dotted="
                    isActiveMenu('/dashboard') || isActiveMenu('/realtime')
                "
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{
                    displayName: i18n.userdefineddashboard,
                    key: 'userDefinedDashboard',
                }"
                :active="activeMenu === 'userDefinedDashboard'"
                :dotted="isActiveMenu('/userdefine')"
                @click="onClickMenuItem"
                v-if="useUserdefine"
            />
            <side-bar-item
                :menu-name="{ displayName: i18n.analysis, key: 'analysis' }"
                :active="showMenuLayer && activeMenu === 'analysis'"
                :dotted="isActiveMenu('/analysis')"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ displayName: i18n.statistics, key: 'statistics' }"
                :active="showMenuLayer && activeMenu === 'statistics'"
                :dotted="isActiveMenu('/statistics')"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ displayName: i18n.report, key: 'report' }"
                :active="activeMenu === 'report'"
                :dotted="
                    isActiveMenu('/report/template') ||
                        isActiveMenu('/report/document')
                "
                @click="onClickMenuItem"
                v-if="(useTemplate || useDocument) && useNotification"
            />
        </div>
        <div class="btn-group lower">
            <side-bar-item
                v-if="showNoticeButton"
                :menu-name="{ displayName: i18n.notice, key: 'notice' }"
                :dotted="showNoticeLayer"
                :status="noticeStatus"
                @click="toggleNoticeBox"
            />
            <span class="item-with-badge" v-if="useNotification">
                <side-bar-item
                    :menu-name="{ displayName: i18n.alarm, key: 'alarm' }"
                    :dotted="showAlarmLayer"
                    @click="toggleAlarmBox"
                />
                <badge
                    v-if="newAlarmList.length > 0"
                    :value="newAlarmList.length"
                    type="danger"
                />
            </span>
            <side-bar-item
                :menu-name="{ displayName: i18n.talk, key: 'talk' }"
                :dotted="isActiveMenu('/report/board')"
                @click="onClickMenuItem"
                v-if="useBoard && useNotification"
            />
            <side-bar-item
                :menu-name="{ displayName: i18n.management, key: 'setting' }"
                :dotted="showManagement"
                @click="onClickManagementItem"
                v-if="useManagement && useNotification"
            />
            <span>
                <side-bar-item
                    :menu-name="{ displayName: i18n.userMenu, key: 'userMenu' }"
                    :dotted="showUserMenuLayer"
                    @click="toggleUserMenu"
                />
                <user-menu-layer
                    v-if="showUserMenuLayer"
                    :user-info="userInfo"
                    :offset-top="userMenuOffsetTop"
                    @click:user-menu="onClickUserMenu"
                />
            </span>
        </div>
        <notice-layer
            v-if="showNoticeLayer"
            :notices="notices"
            :system-events="systemEvents"
            @close="updateActiveLayer"
        />
        <alarm-layer
            v-if="showAlarmLayer"
            :new-list="newAlarmList"
            :last-list="lastAlarmList"
            :active-sound="activeAlarmSound"
            @select-item="onClickAlarmBox"
            @update:alarm-sound="toggleAlarmSound"
            @close="onCloseAlarmLayer"
        />
        <menu-layer
            v-show="showMenuLayerConditionally"
            :title="i18n[activeMenu]"
            :list="menuSet[activeMenu]"
            :hide-search="hideSearchInMenuLayer"
        />
        <alarm-detail-window
            v-if="!!selectedAlarm"
            :content="selectedAlarm"
            @close="updateSelectedAlarm"
            @link-xview="openXViewPopup"
        />
        <about-jennifer
            v-if="showAboutJennifer"
            :logo-path="logoPath"
            :server-version="serverVersion"
            @close="showAboutJennifer = false"
        />
        <my-background-job
            v-if="showBackgroundJob"
            @close="showBackgroundJob = false"
        />
        <alert-for-bg-job
            v-if="alertMessage !== ''"
            :message="alertMessage"
            @cancel="updateAlertMessageForBgJob"
        />
        <mng-window
            v-if="showManagement && mngData !== null"
            :url="mngData.url"
            :title="mngData.title"
            :width="mngData.width"
            :height="mngData.height"
            :scroll="mngData.scroll"
            :btn-title="mngData.btnTitle"
            :btn-func="mngData.btnFunc"
            :use-footer="mngData.useFooter"
            :use-loading="mngData.useLoading"
            @close="onClickManagementItem"
            @ready="onReadyManagementPage"
            @home="resetMngData"
        />
        <domain-setting v-if="!existDomain" @link-mng="openManagementLayer" />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SideBarItem from '@layout/component/item/SideBarItem';
import Badge from '@vuejs/component/Label/Badge';
import MenuLayer from '@layout/component/layer/MenuLayer';
import AlarmLayer from '@layout/component/layer/AlarmLayer';
import NoticeLayer from '@layout/component/layer/NoticeLayer';
import AlarmDetailWindow from '@layout/component/window/AlarmDetailWindow';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import AboutJennifer from '@layout/component/window/AboutJennifer';
import DomainSetting from '@layout/component/window/DomainSetting';
import MyBackgroundJob from '@layout/container/MyBackgroundJob';
import clickOutside from '@vuejs/directive/clickOutside';
import { mapState, mapMutations, mapActions, mapGetters } from '@layout/vuex';
import { getDayjs } from '@common/base';
import {
    openXViewPopupForEvent,
    linkManual,
    hashManual,
} from '@common/utility';
import MngWindow from '@layout/component/window/MngWindow';
import UserMenuLayer from '@layout/component/layer/UserMenuLayer';
import Logo from '@layout/component/Logo';
import _ from '@library/lodash';
import { SIDEBAR_ITEM_TYPE } from '@layout/constant';

const domainStore = createNamespacedHelpers('domain');

export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        logoPath: {
            type: String,
            required: true,
        },
        useUserdefine: {
            type: Boolean,
            required: true,
        },
        useTemplate: {
            type: Boolean,
            required: true,
        },
        useDocument: {
            type: Boolean,
            required: true,
        },
        useBoard: {
            type: Boolean,
            required: true,
        },
        useManagement: {
            type: Boolean,
            required: true,
        },
        useNotification: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        SideBarItem,
        MenuLayer,
        AlarmLayer,
        Badge,
        AlarmDetailWindow,
        NoticeLayer,
        MngWindow,
        UserMenuLayer,
        AboutJennifer,
        DomainSetting,
        MyBackgroundJob,
        Logo,
        // TODO: MyBackgroundJob.vue로 옮기고 테스트도 추가하기.
        AlertForBgJob: AlertWindow,
    },
    directives: {
        clickOutside,
    },
    data() {
        const userMenuHeight = 348;
        const margin = 16;
        return {
            activeMenu: null,
            userMenuOffsetTop: window.innerHeight - userMenuHeight - margin,
            showAboutJennifer: false,
            showBackgroundJob: false,
        };
    },
    computed: {
        ...domainStore.mapState({
            existDomain: state => state.domainList.length > 0,
        }),
        ...mapState({
            activeLayer: state => state.activeLayer,
            menuSet: state => state.menuSet,
            notices: state => state.notices,
            systemEvents: state => state.systemEvents,
            mngData: state => state.mngData,
            userInfo: state => state.user,
            serverVersion: state => state.serverVersion,
            alertMessage: state => state.alertMessageForBgJob,
            selectedAlarm: state => state.alarm.selected,
            activeAlarmSound: state => state.alarm.settings.sound,
        }),
        ...mapGetters([
            'newAlarmList',
            'lastAlarmList',
            'noticeStatus',
            'hasMenuListFetched',
            'hasServerVersionFetched',
        ]),
        showMenuLayer() {
            return this.activeLayer === SIDEBAR_ITEM_TYPE.MENU;
        },
        showAlarmLayer() {
            return this.activeLayer === SIDEBAR_ITEM_TYPE.ALARM;
        },
        showNoticeLayer() {
            return this.activeLayer === SIDEBAR_ITEM_TYPE.NOTICE;
        },
        showManagement() {
            return this.activeLayer === SIDEBAR_ITEM_TYPE.MANAGEMENT;
        },
        showUserMenuLayer() {
            return this.activeLayer === SIDEBAR_ITEM_TYPE.USER_MENU;
        },
        showMenuLayerConditionally() {
            return (
                this.showMenuLayer &&
                this.activeMenu !== 'userDefinedDashboard' &&
                this.activeMenu !== 'report'
            );
        },
        showNoticeButton() {
            return this.noticeStatus !== 'default';
        },
        hideSearchInMenuLayer() {
            return this.activeMenu === 'statistics';
        },
    },
    methods: {
        ...mapMutations([
            'updateActiveLayer',
            'updateMenuType',
            'updateAlarmListAsRead',
            'updateSelectedAlarm',
            'updateMngData',
            'resetMngData',
            'updateAlertMessageForBgJob',
        ]),
        ...mapActions([
            'fetchMenuListCategorized',
            'fetchAlarmSettings',
            'fetchUserInformation',
            'fetchServerVersion',
            'checkLoginStatus',
        ]),
        async onClickMenuItem(type = null) {
            if (!type) return;

            if (!this.hasMenuListFetched) await this.fetchMenuListCategorized();

            if (this.hasSubmenu(type)) {
                if (this.activeMenu === type) {
                    this.activeMenu = null;
                    this.updateActiveLayer();
                    return;
                }
                this.activeMenu = type;
                this.updateActiveLayer(SIDEBAR_ITEM_TYPE.MENU);
                return;
            }

            const url =
                type === 'report'
                    ? `/report/${
                          this.useTemplate ? 'template' : 'document'
                      }/list`
                    : type === 'userDefinedDashboard'
                    ? '/userdefine'
                    : type === 'talk'
                    ? '/report/board'
                    : '/';
            location.href = url;
        },
        openManagementLayer() {
            this.updateActiveLayer(SIDEBAR_ITEM_TYPE.MANAGEMENT);
            this.resetMngData();
        },
        async onClickManagementItem() {
            // 관리화면은 Iframe으로 뜨기 때문에 뷰서버가 재시작되었을 경우, 로그인페이지가 나와버리는 문제가 있음
            // 그래서 관리화면을 띄우기 전에 로그인 체크를 먼저해야 함
            if (await this.checkLoginStatus()) {
                if (this.showManagement) {
                    this.updateActiveLayer();
                    this.updateMngData(null);
                    return;
                }
                this.openManagementLayer();
            } else {
                location.href = '/login';
            }
        },
        onReadyManagementPage() {
            this.updateMngData({
                ...this.mngData,
                useLoading: false,
            });
        },
        onClickOutside() {
            // 관리창은 click outside에 포함하지 않음
            if (this.showManagement) return;
            this.updateActiveLayer();
            this.activeMenu = null;
        },
        onCloseAlarmLayer() {
            this.updateActiveLayer();
            this.updateAlarmListAsRead();
        },
        isActiveMenu(prefix) {
            return location.pathname.startsWith(prefix);
        },
        hasSubmenu(menuName) {
            return (
                menuName !== 'userDefinedDashboard' &&
                menuName !== 'report' &&
                menuName !== 'talk'
            );
        },
        toggleAlarmBox() {
            this.updateActiveLayer(
                this.showAlarmLayer ? null : SIDEBAR_ITEM_TYPE.ALARM
            );
            if (!this.showAlarmLayer) {
                this.updateAlarmListAsRead();
            }
        },
        toggleNoticeBox() {
            this.updateActiveLayer(
                this.showNoticeLayer ? null : SIDEBAR_ITEM_TYPE.NOTICE
            );
        },
        toggleUserMenu() {
            this.updateActiveLayer(
                this.showUserMenuLayer ? null : SIDEBAR_ITEM_TYPE.USER_MENU
            );
        },
        toggleAlarmSound(active) {
            if (this.activeAlarmSound !== active) {
                this.fetchAlarmSettings(active);
            }
        },
        onClickAlarmBox(item) {
            this.updateSelectedAlarm(item);
        },
        async onClickUserMenu(key = null) {
            switch (key) {
                case 'accountManagement':
                    location.href = '/settings#/account';
                    break;
                case 'setting':
                    location.href = '/settings#/basic';
                    break;
                case 'myBackgroundJob':
                    this.showBackgroundJob = true;
                    break;
                case 'queryBuilder':
                    window.open(
                        '/popup/queryBuilder',
                        'queryBuilder',
                        "width=1024,height=768,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
                    );
                    break;
                case 'help':
                    const isSettingPage = location.pathname.startsWith(
                        '/settings'
                    );
                    if (isSettingPage) {
                        const manualHash = `settings_${location.hash.replace(
                            '#/',
                            ''
                        )}`;
                        hashManual(manualHash);
                    } else linkManual();
                    break;
                case 'about':
                    if (!this.hasServerVersionFetched)
                        await this.fetchServerVersion();
                    this.showAboutJennifer = true;
                    break;
                case 'logout':
                    this.logout();
                    break;
                default:
                    break;
            }
            this.updateActiveLayer();
        },
        logout() {
            localStorage.setItem('autoLogin', 'false');
            sessionStorage.clear();
            location.href = '/logout';
        },
        openXViewPopup() {
            const { sid, time, txid } = this.selectedAlarm;
            openXViewPopupForEvent(sid, getDayjs(time).valueOf(), txid);
        },
        onClickLogo() {
            location.href = '/';
        },
        onResize: _.debounce(function({ target }) {
            const userMenuHeight = 348;
            const margin = 16;
            this.userMenuOffsetTop =
                target.innerHeight - userMenuHeight - margin;
        }),
    },
    created() {
        // 다른 ajax 요청에 필요한 파라미터라서 예외적으로 created에서 처리
        this.fetchUserInformation();
    },
    beforeMount() {
        window.addEventListener('resize', this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
};
</script>

<style lang="scss" scoped>
.side-bar {
    position: sticky;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 10000;
    padding: 20px 20px 24px;
    box-sizing: border-box;
    background-color: #000;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    > .btn-group {
        display: flex;
        flex-direction: column;
        align-items: center;

        > .top-logo {
            margin-bottom: 40px;
            cursor: pointer;
        }

        > *:not(:last-child) {
            margin-bottom: 24px;
        }

        .item-with-badge {
            position: relative;
            > .badge {
                position: absolute;
                right: -8px;
                top: -8px;
            }
        }
    }
}
</style>
