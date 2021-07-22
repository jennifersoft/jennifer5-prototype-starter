<template>
    <div class="userdefined-menu-layer">
        <div class="contents">
            <div
                class="list-contents userdefined"
                id="userdefined-thumnbails-content"
            >
                <div class="title-n-make">
                    <div class="title">{{ i18n.userdefined }}</div>
                    <div>
                        <Search
                            @change="onChangeSearch"
                            v-model="onSearchKeywordModel"
                            normal
                            :width="300"
                            :placeholder="i18n.searchDashboard"
                            class="input-search-dashboard"
                        />
                    </div>

                    <btn
                        icon-first
                        normal
                        :items="createDashboardItems"
                        @click="createUserDefineDashboard"
                    />
                </div>
                <div class="userdefine-configure-header">
                    <div class="show-group">
                        <btn
                            v-if="isShowCanAll"
                            :items="[{ value: 'allList', text: i18n.viewAll }]"
                            class="border-none edge-pill"
                            :class="{
                                'light-focus': selectedViewGroup === 'viewAll',
                            }"
                            @click="setSelectedViewGroup('viewAll')"
                        />
                        <btn
                            v-if="isShowCanAll"
                            :items="[
                                { value: 'myList', text: i18n.viewMyGroup },
                            ]"
                            class="border-none edge-pill"
                            :class="{
                                'light-focus':
                                    selectedViewGroup === 'viewMyGroup',
                            }"
                            @click="setSelectedViewGroup('viewMyGroup')"
                        />
                    </div>
                    <div class="sort-by">
                        <span>{{ i18n.align }}</span>
                        <div>
                            <dropdown
                                class="order-dropdown"
                                :width="120"
                                @onchange="
                                    item => setOrderByCondition(item.value)
                                "
                                :is-simple-style="true"
                                :items="[
                                    {
                                        value: 'updatedTime',
                                        text: i18n.updatedTime,
                                    },
                                    { value: 'name', text: i18n.name },
                                ]"
                            ></dropdown>
                        </div>
                    </div>
                </div>
                <div
                    v-if="
                        loadedUserdefinedMenus &&
                            userdefinedMenusByFilter.length === 0
                    "
                    class="no-data-to-show"
                >
                    <div class="message" v-html="message" />
                </div>
                <div class="grid-list userdefined" v-else>
                    <UserdefinedDashboardImageLink
                        v-for="menu in userdefinedMenusByFilter"
                        :key="menu.key"
                        :img-src="menu.imgSrc"
                        :title="menu.title"
                        :dashboard-key="menu.key"
                        :group-id="menu.groupId"
                        :last-updated-time="menu.lastUpdatedTime"
                        @delete="confirmWhenDelete"
                    ></UserdefinedDashboardImageLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from '@library/lodash';
import axios from '@library/axios';
import { createNamespacedHelpers } from 'vuex';
import Tab from '@vuejs/component/tab/Tab';
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import SvgIcon from '@vuejs/component/icon/SvgIcon';

import Search from '@vuejs/component/Input/Search';
import UserdefinedDashboardImageLink from './UserdefinedDashboardImageLink';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { ariesuser } from '@common/base';
import { readAllThumbnail } from '@entry/userdefine/dashboardEdit/thumbnail';
import { checkPermission } from '@common/utility';
import { PermissionDef } from '@common/definition';

const {
    mapGetters,
    mapState,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('dashboardMenus');

export default {
    name: 'DashboardMenuLayer',
    components: {
        Dropdown,

        UserdefinedDashboardImageLink,
        Search,
        Tooltip,
        Btn,
        Tab,
        SvgIcon,
    },
    inject: {
        groupId: {
            type: String,
        },
        i18n: {
            default: {
                dashboard: 'Dashboard',
                realtime: 'Realtime',
                userdefined: 'User-defined dashboard',
                align: 'Align',
                updatedTime: 'updated',
                name: 'name',
                viewAll: 'View all',
                viewMyGroup: 'View My Group',
                confirmMessage: 'Confirm message',
                M0270: 'Are you sure you want to delete?',
                apply: 'apply',
                cancel: 'cancel',
                searchDashboard: 'Search Dashboard',
                M0621:
                    'No results were found for this search. <br/> Please search again.',
            },
        },
    },
    data() {
        return {
            ICON_TYPE: ICON_TYPE,
            add: [
                {
                    value: 'add',
                    iconType: ICON_TYPE.add,
                },
            ],
            createDashboardItems: [
                { text: this.i18n.make, iconType: ICON_TYPE.add },
            ],

            activeTab: undefined,

            orderTypes: [
                { value: 'updatedTime', text: this.i18n.updatedTime },
                { value: 'name', text: this.i18n.name },
            ],
            // needShadow: false,

            onSearchKeywordModel: '',
            scrollingByClickTab: false,
            loadedUserdefinedMenus: false,
        };
    },
    computed: {
        ...mapState([
            'isOpenLayer',
            'selectedViewGroup',
            'dashboardMenus',
            'realtimeMenus',
            'searchByText',
        ]),

        ...mapGetters([
            'isShowContents',
            'noDataToShow',
            'userdefinedMenusByGroup',
            'dashboardMenusByFilter',
            'realtimeMenusByFilter',
            'userdefinedMenusByFilter',
        ]),

        isShowCanAll() {
            return checkPermission(PermissionDef.VIEW_ALL_USERDEFINE_DASHBOARD);
        },
        message() {
            return this.userdefinedMenusByGroup.length === 0
                ? this.i18n.M0654
                : this.i18n.M0621;
        },
    },
    methods: {
        ...mapMutations([
            'setGroupId',
            'setUserdefinedMenus',
            'setSearchByText',
            'setSelectedViewGroup',
            'setOrderByCondition',
            'setDeleteDashboardKey',
            'removeUserDefinedMenu',
        ]),

        onChangeSearch: _.debounce(function(text) {
            this.setSearchByText(text);
        }, 200),

        createUserDefineDashboard() {
            document.location = '/userdefine/dashboardEdit';
        },

        changeTab(tab) {
            if (tab !== '') {
                window.location.href = `#${tab}-thumnbails-content`;
                this.activeTab = tab;
                this.scrollingByClickTab = true;
            }
        },

        confirmWhenDelete({ dashboardKey }) {
            this.setDeleteDashboardKey(dashboardKey);
        },

        onSearchDashboard() {},

        checkPermission: checkPermission,

        async loadMenus() {
            Promise.all([
                axios.get('/userdefine/dashboard/list?isAll=true'),
                readAllThumbnail(),
            ]).then(([userDefineMenusRawData, allThumbnail]) => {
                const defaultThumnailSrc =
                    '/image/thumbnail/' +
                    ariesuser.theme +
                    '/UserDefinedThumbnail.png';

                const userdefinedMenus = JSON.parse(
                    userDefineMenusRawData.data
                ).map(dashboardData => {
                    return {
                        imgSrc:
                            allThumbnail?.[dashboardData.key]?.dataURL ??
                            defaultThumnailSrc,
                        key: dashboardData.key,
                        groupId: dashboardData.groupId,
                        title: dashboardData.title,
                        lastUpdatedTime: dashboardData.lastUpdatedTime,
                    };
                });

                this.setUserdefinedMenus(userdefinedMenus);
                this.loadedUserdefinedMenus = true;
            });
        },
    },
    mounted() {
        this.setGroupId(this.groupId);
        this.loadMenus();
    },
};
</script>
<style lang="scss" scoped>
div.userdefined-menu-layer {
    visibility: visible;
    opacity: 1;
    top: 0;

    > .contents {
        > .list-contents {
            &.userdefined {
                opacity: 1;
                transition: opacity 0.5s 0.9s;
            }
        }
    }

    bottom: 0;

    display: flex;

    flex-direction: column;
    position: absolute;
    z-index: 3001;
    width: 100%;

    @import './themes.scss';
    .tab-contents {
        > div {
            opacity: 0;
        }
        z-index: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 66px;
        @include themify($themes) {
            background-color: themed('dashboard-header-color');
            border-bottom: 1px solid
                themed('dashboard-header-border-bottom-color');

            &.shadow {
                box-shadow: 0 4px 4px 0
                    themed('dashboard-menu-layer-tabs-shadow');
            }
        }
    }

    .contents {
        flex-grow: 1;

        @include themify($themes) {
            background-color: themed(
                'dashboard-menu-layer-contents-background'
            );
        }

        padding: 0 24px 24px 24px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        scroll-behavior: smooth;

        > .list-contents {
            flex-grow: 1;
            opacity: 0;
            display: flex;
            flex-direction: column;

            > .title-n-make {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 75px;
                align-items: center;
                font-size: 20px;
                font-weight: bold;
                @include themify($themes) {
                    color: themed('dashboard-menu-layer-tab-title-color');
                    border-bottom: 1px solid
                        themed('dashboard-menu-layer-tab-title-border-color');
                }
            }

            @import '~@vuejs/component/themes.scss';
            .userdefine-configure-header {
                display: flex;
                justify-content: space-between;
                height: 26px;
                margin-top: 16px;

                span {
                    line-height: 26px;
                    @include themify($themes) {
                        color: themed('typography-color-grey1');
                    }
                }

                div {
                    display: inline-flex;

                    &.show-group {
                        .aries-ui-btn + .aries-ui-btn {
                            margin-left: 4px;
                        }
                    }
                }

                .sort-by {
                    span + div {
                        margin-left: 4px;
                    }
                }
            }

            > .grid-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, 300px);
                grid-gap: 16px;
                justify-content: center;
                margin: 24px 0 0 0;

                &.userdefined {
                    grid-template-columns: repeat(auto-fit, 193px);
                }
            }
        }

        @import '~@vuejs/component/themes.scss';
        .no-data-to-show {
            flex-grow: 1;
            @include themify($themes) {
                font-size: 24px;
                color: themed('typography-color-grey1');
            }
            display: flex;

            align-items: center;
            justify-content: center;
            .message {
                text-align: center;
            }
        }
    }
}
</style>
