<template>
    <div class="dashboard-template">
        <!--        layout=iframe이라면 hidden 처리-->
        <template v-if="noneKeyWhenUserdefineDashboard">
            <userdefined-menu-layer />
        </template>

        <template v-else>
            <common-header
                v-if="topbar !== undefined || iframeLayout === false"
                :subject="menuNameOrUserDefineTitle"
                :description="i18n.help"
                :is-domain-group-page="isDomainGroupUsage"
                :menu-items="menuItemsInMoreBtn"
                :hide-more-button="iframeLayout"
                @edit-userdefine-dashboard="editUserdefineDashboard"
                @delete-userdefine-dashboard="deleteUserdefineDashboard"
            >
            </common-header>

            <business-tree-layer
                v-if="needBusinessSelect"
                :active-business-tree.sync="activeBusinessTree"
            ></business-tree-layer>
            <div
                class="contents"
                :class="{ iframe: iframeLayout, 'is-open-layer': isOpenLayer }"
            >
                <div class="topbar-wrapper">
                    <div
                        class="barbtn"
                        v-if="needBusinessSelect"
                        @click="activeBusinessTree = true"
                    >
                        <span class="business-tree-btn">
                            {{ i18n.bizSelect }}
                        </span>
                    </div>
                    <top-bar
                        v-if="topbar !== undefined"
                        :type="topbar.type"
                        :use-multi-domain="topbar.multidomain"
                        :use-multi-instance="topbar.multiinstance"
                        :batchjob-mode="topbar.batchjobMode"
                    ></top-bar>
                </div>

                <div id="defineContentArea">
                    <dashboard-content-area />
                </div>
            </div>
        </template>
        <modal-when-dashboard-delete></modal-when-dashboard-delete>
    </div>
</template>
<script>
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import CommonHeader from '@layout/container/header/CommonHeader';
import TopBar from '@vuejs/container/topbar/TopBar';
import DashboardContentArea from '@entry/userdefine/dashboard/component/DashboardContentArea';
import { mapGetters, mapMutations, mapState } from 'vuex';
import { ElementManager } from '@common/legacy/ElementManager';
import { Observer } from '@common/legacy/Observer';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import ModalWhenDashboardDelete from '@entry/userdefine/dashboard/menu/ModalWhenDashboardDelete';
import UserdefinedMenuLayer from '@entry/userdefine/dashboard/menu/UserdefinedMenuLayer';
import BusinessTreeLayer from '@entry/userdefine/dashboard/component/BusinessTreeLayer';
import { BusinessManager } from '@common/legacy/BusinessManager';

export default {
    name: 'DashboardTemplate',
    inject: {
        i18n,
        menuName: {
            type: String,
            required: false,
            default: undefined,
        },
        isDomainGroupUsage: {
            type: Boolean,
            required: true,
        },
    },
    props: {
        bookmarkStatus: {
            type: Boolean,
            required: false,
        },
        needBusinessSelect: {
            type: Boolean,
            default: false,
            required: false,
        },
        userdefineDashboard: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    components: {
        BusinessTreeLayer,
        UserdefinedMenuLayer,
        ModalWhenDashboardDelete,
        CommonHeader,
        PopupList,
        TopBar,
        DashboardContentArea,
        Btn,
        Tooltip,
    },
    data() {
        return {
            iframeLayout: false,

            activeBusinessTree: false,
            menuItemsInMoreBtn: [],
        };
    },
    methods: {
        ...mapMutations('dashboardMenus', [
            'toggleLayer',
            'setDeleteDashboardKey',
        ]),

        editUserdefineDashboard() {
            document.location =
                '/userdefine/dashboardEdit?key=' + this.dashboardKey;
        },
        deleteUserdefineDashboard() {
            this.setDeleteDashboardKey(this.dashboardKey);
        },
    },
    computed: {
        ...mapState('dashboard', ['topbar', 'title']),
        ...mapState('dashboardMenus', ['isOpenLayer']),
        ...mapGetters('domain', ['allSidList']),

        menuNameOrUserDefineTitle() {
            return this.title !== '' ? this.title : this.menuName;
        },
        noneKeyWhenUserdefineDashboard() {
            return this.userdefineDashboard && !this.dashboardKey;
        },
    },

    mounted() {
        if (this.userdefineDashboard) {
            this.menuItemsInMoreBtn = [
                {
                    value: 'edit',
                    text: this.i18n.edit,
                    event: 'edit-userdefine-dashboard',
                },
                {
                    value: 'delete',
                    text: this.i18n.delete,
                    event: 'delete-userdefine-dashboard',
                },
            ];
        }
    },
    created() {
        const urlParams = new URLSearchParams(location.search);
        this.iframeLayout = urlParams.get('layout') === 'iframe';
        this.dashboardKey = urlParams.get('key');

        if (this.topbar === undefined) {
            ElementManager.init(Observer.get('elements'));
        }

        BusinessManager.load(this.allSidList);

        DashboardChartHandler.initMultiDomainBar({});
    },
};
</script>
<style lang="scss" scoped>
.dashboard-template {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    > div {
        &.contents {
            flex-grow: 1;

            display: flex;
            flex-direction: column;
            position: relative;
            &.is-open-layer {
                padding: 0;
            }

            > #defineContentArea {
                flex-grow: 1;
                padding: 20px;
            }

            &.iframe {
                > #defineContentArea {
                    padding: 0;
                }
            }
        }
    }
}
</style>
