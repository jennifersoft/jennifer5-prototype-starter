<template>
    <div class="edit-area-menu">
        <div class="menu-bar">
            <btn
                :items="[{ text: message.dashboardFileImport }]"
                class="border-none"
                @click="$refs.dashboardImportFile.click()"
            />
            <div class="separator"></div>
            <a :download="exportJSONFileName" :href="toHrefJSONDashboardProp">
                <btn
                    :items="[{ text: message.dashboardFileExport }]"
                    class="border-none"
                />
            </a>
            <div class="separator"></div>
            <dropdown
                class="import-dashboard-dropdown"
                v-click-outside="hideImportDashboardDropdown"
                ref="importDashboardDropdown"
                :button-options="{ text: message.importExistingDahsboard }"
                :is-simple-style="true"
                :items="importDashboardList"
                @onchange="onClickImportDashboard"
            />
            <div class="separator" style="margin-right: 16px;"></div>
            <div>
                <span> {{ message.group }} </span>
                <dropdown
                    v-click-outside="hideGroupDropdown"
                    ref="groupDropdown"
                    :items="groupList"
                    :selected-value="groupId"
                    :is-simple-style="true"
                    style="display: inline-block; width: 150px;"
                    @onchange="onClickGroup"
                >
                </dropdown>
            </div>
            <input
                type="file"
                ref="dashboardImportFile"
                class="file-input"
                accept=".json"
                @change="importJSONFile"
                style="display: none;"
            />
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { i18n } from '@common/utility';
import {
    loadDashboardData,
    loadGroupList,
    loadMenuList,
} from '@entry/userdefine/dashboardEdit/http';
import {
    IMPORTABLE_REALTIMEMENU_URL,
    TOPBAR_TYPES,
} from '@entry/userdefine/dashboardEdit/const';

import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { GenerateKey } from '@module/global/GenerateKey';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Btn from '@vuejs/component/button/Btn';
import clickOutside from '@vuejs/directive/clickOutside';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'userDefineEditAreaMenu',
    directives: {
        clickOutside,
    },
    components: {
        Dropdown,
        Btn,
    },
    data: function() {
        return {
            message: {
                dashboardFileExport: i18n.get('ui.button.export'),
                dashboardFileImport: i18n.get('ui.button.import'),
                importExistingDahsboard: i18n.get(
                    'ui.label.importExistingDahsboard'
                ),
                group: i18n.get('ui.label.group'),
            },

            importDashboardList: [],
            groupList: [],
            ICON_TYPE: ICON_TYPE,
        };
    },
    methods: {
        ...mapMutations(['setGroupId']),

        hideImportDashboardDropdown() {
            this.$refs.importDashboardDropdown.isUnfold = false;
        },

        hideGroupDropdown() {
            this.$refs.groupDropdown.isUnfold = false;
        },

        async fetchMenuList() {
            const [dashboardMenuData, realtimeMenuData] = await Promise.all([
                loadMenuList('dashboard'),
                loadMenuList('realtime'),
            ]);

            const dashboardMenuList = dashboardMenuData.data
                .filter(menu => menu.url.includes('realtimeAdmin'))
                .map(menu => {
                    const originAndExtend = [];
                    originAndExtend.push(
                        Object.assign({}, menu, {
                            originOrExtend: 'origin',
                            value: menu.url,
                            text:
                                '[' +
                                i18n.get('ui.label.originType') +
                                ']' +
                                menu.name,
                        })
                    );
                    if (!menu.url.includes('realtimeAdmin_front')) {
                        originAndExtend.push(
                            Object.assign({}, menu, {
                                originOrExtend: 'extend',
                                value: menu.url,
                                text:
                                    '[' +
                                    i18n.get('ui.label.extendType') +
                                    ']' +
                                    menu.name,
                            })
                        );
                    }

                    return originAndExtend;
                })
                .flat();

            const realtimeMenuList = realtimeMenuData.data
                .filter(menu => IMPORTABLE_REALTIMEMENU_URL.includes(menu.url))
                .map(menu => {
                    menu.text = menu.name;
                    menu.value = menu.url;
                    menu.originOrExtend = 'origin';
                    return menu;
                });

            this.importDashboardList = dashboardMenuList.concat(
                realtimeMenuList
            );
        },

        async fetchGroupList() {
            const groupListData = await loadGroupList();

            this.groupList = groupListData.data.map(group => {
                return { text: group.name, value: group.id };
            });
        },

        async onClickImportDashboard(menu) {
            const dashboardRawData = await loadDashboardData(menu.url);

            //.json 파일을 로드해서 적절한값을 상수로 변경함.
            const dashboardProp = DashboardChartHandler.redefineStringToVariable(
                dashboardRawData.data
            );

            // 확장형, 기본형의 좌표중 없는것들은 제외.
            dashboardProp.charts = dashboardProp.charts.filter(
                chartOption => chartOption[menu.originOrExtend]
            );
            // 확장형, 기본형의 좌표중에 선택해서 값을 입력.
            dashboardProp.charts.forEach(chartOption => {
                if (!chartOption.dataKey)
                    chartOption.dataKey = GenerateKey.makeLongKeyByTime();

                Object.assign(chartOption, chartOption[menu.originOrExtend]);
                delete chartOption.origin;
                delete chartOption.extend;

                chartOption.targetType = chartOption.datatype;
                chartOption.title = chartOption.i18nTitle
                    ? i18n.get(chartOption.i18nTitle)
                    : chartOption.title;
                chartOption.zIndex = chartOption.zIndex
                    ? chartOption.zIndex
                    : 20;
            });

            this.$emit('showConfirmWindow', dashboardProp);
        },

        importJSONFile(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    const contents = e.target.result;
                    const dashboardProp = JSON.parse(contents);

                    //TODO 과거버젼의 .json 파일이라면 dashboardProp.charts 내의 값 들중에 metrics, otype 등등의 값이 string이라서 변환해줘야한다.

                    this.$emit('showConfirmWindow', dashboardProp);
                };

                reader.readAsText(file);
            }
        },

        onClickGroup(group) {
            this.setGroupId(group.value);
        },
    },
    computed: {
        ...mapState(['title', 'components', 'groupId', 'topbar']),

        toHrefJSONDashboardProp() {
            const dashboardProp = {};
            dashboardProp.charts = Object.values(this.components);

            if (this.topbar !== TOPBAR_TYPES.NONE) {
                dashboardProp.domainBar = {};
                dashboardProp.domainBar.type = 'agent';
                dashboardProp.domainBar.multi =
                    this.topbar === TOPBAR_TYPES.DOMAIN_INSTANCE_MULTI;
            }

            return (
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(dashboardProp))
            );
        },

        exportJSONFileName() {
            return this.title + '.json';
        },
    },
    mounted() {
        this.fetchMenuList();
        this.fetchGroupList();
    },
};
</script>
<style lang="scss" scoped>
@import 'themes.scss';
.edit-area-menu {
    @include themify($themes) {
        height: 40px;
        border-bottom: solid 1px themed('area-menu-border-color');
        background: themed('area-menu-background-color');

        padding-left: 20px;
        .menu-bar {
            display: flex;
            flex-direction: row;
            > div,
            a {
                margin: 7px 0;
                &.import-dashboard-dropdown {
                    width: 250px;
                }

                &.separator {
                    margin: 10px 5px;
                    width: 1px;
                    height: 20px;
                    background: themed('area-menu-border-color');
                    vertical-align: middle;
                }

                > span {
                    font-size: 12px;
                    color: themed('area-menu-text-color');
                }
            }
        }
    }
}
</style>
