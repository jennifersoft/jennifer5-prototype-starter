<template>
    <side-bar-wrapper v-click-outside="closeLayer">
        <template #upper>
            <logo logo-url="/images/logo.svg" />
            <side-bar-item
                :menu-name="{ key: 'dashboard', displayName: '대시보드' }"
                :active="showMenu && activeMenu === 'dashboard'"
                :dotted="false"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ key: 'analysis', displayName: '분석' }"
                :active="showMenu && activeMenu === 'analysis'"
                :dotted="false"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ key: 'statistics', displayName: '통계' }"
                :active="showMenu && activeMenu === 'statistics'"
                :dotted="false"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ key: 'report', displayName: '보고서' }"
                :active="showMenu && activeMenu === 'report'"
                :dotted="false"
                @click="onClickMenuItem"
            />
        </template>
        <template #lower>
            <span class="item-with-badge">
                <side-bar-item
                    :menu-name="{ key: 'alarm', displayName: '알람' }"
                    @click="onClickMenuItem"
                />
                <badge
                    v-if="alarms.length > 0"
                    :value="alarms.length"
                    type="danger"
                />
            </span>
            <side-bar-item
                :menu-name="{ key: 'setting', displayName: '설정' }"
                @click="onClickMenuItem"
            />
            <side-bar-item
                :menu-name="{ key: 'userMenu', displayName: '사용자 메뉴' }"
                @click="onClickMenuItem"
            />
        </template>
        <alarm-layer v-if="showAlarm" :new-list="alarms" @close="closeLayer" />
        <menu-layer
            v-if="showMenu"
            :list="menuSet[activeMenu]"
            :title="activeMenu | toUpperCase"
        />
        <user-menu-layer
            v-if="showUserMenu"
            :user-info="userInfo"
            :offset-top="userMenuOffsetTop"
            @click:user-menu="onClickUserMenu"
        />
    </side-bar-wrapper>
</template>

<script>
import MenuLayer from '@layout/component/layer/MenuLayer';
import AlarmLayer from '@layout/component/layer/AlarmLayer';
import UserMenuLayer from '@layout/component/layer/UserMenuLayer';
import SideBarItem from '@layout/component/item/SideBarItem';
import SideBarWrapper from '@layout/component/SideBarWrapper';
import Logo from '@layout/component/Logo';
import Badge from '@vuejs/component/label/Badge';
import clickOutside from '@vuejs/directive/clickOutside';

import { menuSet, alarms, userInfo } from '../sample-data';

import _ from '@library/lodash';

const USER_MENU_HEIGHT = 348;
const MARGIN = 16;

export default {
    name: 'SideBar',
    components: {
        MenuLayer,
        AlarmLayer,
        UserMenuLayer,
        SideBarItem,
        SideBarWrapper,
        Logo,
        Badge,
    },
    directives: {
        clickOutside
    },
    data() {
        return {
            activeLayer: null,
            activeMenu: null,
            userMenuOffsetTop: window.innerHeight - USER_MENU_HEIGHT - MARGIN,
        };
    },
    filters: {
        toUpperCase(title) {
            if (!title) return '';
            return title.toUpperCase();
        },
    },
    computed: {
        showMenu() {
            return (
                this.activeLayer === 'dashboard' ||
                this.activeLayer === 'analysis' ||
                this.activeLayer === 'statistics'
            );
        },
        showAlarm() {
            return this.activeLayer === 'alarm';
        },
        showUserMenu() {
            return this.activeLayer === 'userMenu';
        },
    },
    methods: {
        onClickMenuItem(key) {
            if (this.activeLayer === key) {
                this.closeLayer();
                return;
            }

            switch (key) {
                case 'dashboard':
                case 'analysis':
                case 'statistics':
                    this.activeMenu = key;
                    break;
            }
            
            this.activeLayer = key;
        },
        onClickUserMenu() {},
        isActiveMenu() {},
        closeLayer() {
            this.activeLayer = this.activeMenu = null;
        },
        onResize: _.debounce(function({ target }) {
            this.userMenuOffsetTop =
                target.innerHeight - USER_MENU_HEIGHT - MARGIN;
        }),
    },
    created() {
        this.alarms = alarms;
        this.menuSet = menuSet;
        this.userInfo = userInfo;
    },
};
</script>

<style></style>
