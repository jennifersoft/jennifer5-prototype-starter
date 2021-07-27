<template>
    <side-bar-wrapper>
        <template #upper>
            <logo logo-url="/images/logo.svg" />
            <side-bar-item :menu-name="{ key: 'dashboard', displayName: '대시보드' }"
                            @click="onClickMenuItem" />
            <side-bar-item :menu-name="{ key: 'analysis', displayName: '분석' }"
                            @click="onClickMenuItem" />
            <side-bar-item :menu-name="{ key: 'statistics', displayName: '통계' }"
                            @click="onClickMenuItem" />
        </template>
        <template #lower>
            <side-bar-item :menu-name="{ key: 'alarm', displayName: '알람' }"
                            @click="onClickMenuItem" />
        </template>
        <alarm-layer v-if="showAlarm"
                    :new-list="alarms"
                    @close="() => (this.showAlarm = false)" />
        <menu-layer v-if="showMenu"
                    :list="menus"
                    title="Dashboard"
                    @mouseleave="() => (this.showMenu = false)" />
    </side-bar-wrapper>
</template>

<script>
import MenuLayer from '@layout/component/layer/MenuLayer';
import AlarmLayer from '@layout/component/layer/AlarmLayer';
import SideBarItem from '@layout/component/item/SideBarItem';
import SideBarWrapper from '@layout/component/SideBarWrapper';
import Logo from '@layout/component/Logo';

import { menus, alarms } from '../sample-data';

export default {
    name: 'SideBar',
    components: {
        MenuLayer,
        AlarmLayer,
        SideBarItem,
        SideBarWrapper,
        Logo,
    },
    data() {
        return {
            showMenu: false,
            showAlarm: false,
        };
    },
    methods: {
        onClickMenuItem(key) {
            if (key === 'alarm') this.showAlarm = !this.showAlarm;
            else if (key === 'dashboard') this.showMenu = !this.showMenu;
            else {
                this.showMenu = false;
                this.showAlarm = false;
            }
        },
    },
    created() {
        this.alarms = alarms;
        this.menus = menus;
    }
};
</script>

<style>

</style>
