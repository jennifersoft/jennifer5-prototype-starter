<template>
    <div class="app">
        <common-header
            :subject="menuName"
            :description="i18n.help"
            :hide-more-button="iframeLayout"
            :is-domain-group-page="isDomainGroupUsage"
        ></common-header>

        <div class="contents">
            <top-bar
                :type="domainBar.type"
                :use-multi-domain="domainBar.multidomain"
                :use-multi-instance="domainBar.multiinstance"
                :batchjob-mode="domainBar.batchjobMode"
            ></top-bar>

            <navigation-bar :show-search-btn="false">
                <navigation-item>
                    <resource-popup
                        ref="r"
                        :popup-position-left="true"
                        :resources="resources"
                        @submit="onSubmitResourcePopup"
                    ></resource-popup>

                    <btn
                        style="margin-left: 7px;"
                        :items="[{ text: filterData.label }]"
                        :pressed="filterData.active"
                        @click.native="onToggleFilteringWindow"
                    ></btn>
                </navigation-item>
                <template #right>
                    <div class="range-label">{{ i18n.xRange }} :</div>
                    <div class="slider-wrapper">
                        <span> 1{{ i18n.minute }} </span>
                        <slider
                            ref="slider"
                            :initial-value="rangeOfMinutes"
                            :max="120"
                            :min="1"
                            :step="1"
                            :show-tooltip="true"
                            @update:value="onChangeRange"
                            small
                        />
                        <span> 120{{ i18n.minute }} </span>
                    </div>
                </template>
            </navigation-bar>

            <filtering-window
                :form="filterData.form"
                @cancel="onToggleFilteringWindow"
                @apply="onChangeFilterValues"
                v-if="filterData.active"
            ></filtering-window>

            <div class="chart">
                <dashboard-content-area></dashboard-content-area>
            </div>
        </div>
    </div>
</template>

<script>
import CommonHeader from '@layout/container/header/CommonHeader';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup';
import DashboardContentArea from '@entry/userdefine/dashboard/component/DashboardContentArea';
import TopBar from '@vuejs/container/topbar/TopBar';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import LabelWithDropdown from '@entry/template/edit/component/modal/base/ui/LabelWithDropdown';

import FilteringWindow from '@entry/realtime/xview/FilteringWindow';
import Btn from '@vuejs/component/button/Btn';
import Slider from '@vuejs/component/Slider/Slider';
import { dashboardProp } from '@data/xview';

import storeInDashboard from '@entry/dashboard/storeInDashboard';
import { Business, Instance } from '@service/oidConfig';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import {
    ChartKeywordInObserver,
    XViewChartKeywordInObserver,
} from '@common/ObserverKeyword';
import { Observer } from '@common/legacy/Observer';
import { DashboardChartHandler } from '@module/common/DashboardChartHandler';
import { fixDataForLegacy } from '@entry/dashboard/common';
import { startOfDayjs } from '@common/dayjsWrapper';
import { getDayjs } from '@common/base';
import { ClientUtilities } from '@common/legacy/ClientUtilities';

export default {
    name: 'App',
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
    components: {
        CommonHeader,
        ResourcePopup,
        DashboardContentArea,
        TopBar,
        NavigationBar,
        NavigationItem,
        LabelWithDropdown,

        FilteringWindow,
        Btn,
        Slider,
    },
    data() {
        return {
            resources: [
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
            domainBar: dashboardProp.domainBar,

            filterData: {
                label: this.i18n.filtering,
                active: false,
                form: {
                    serviceName: '',
                    ip: '',
                    userId: '',
                    guid: '',
                    isException: false,
                },
            },
            rangeOfMinutes: 10,
        };
    },
    watch: {
        sidList() {
            this.updateTotalAndPeakData();
        },
    },
    computed: {
        sidList() {
            return storeInDashboard.getters['domain/sidList'];
        },
    },
    methods: {
        onChangeRange([start, rangeMin]) {
            let range = rangeMin * ClientUtilities.ONE_MINUTE;

            range = Math.max(range, ClientUtilities.ONE_MINUTE);
            range = Math.min(range, ClientUtilities.ONE_HOUR * 2);

            const xviewChart = DashboardChartHandler.bigdataCharts()[0];
            xviewChart.model.changeRange(range);
            this.rangeOfMinutes = rangeMin;
        },
        emitPosSlider(range) {
            this.rangeOfMinutes = range / ClientUtilities.ONE_MINUTE;
            this.$refs.slider.pos = [0, this.rangeOfMinutes];
        },
        getResKey(norm) {
            return norm.map(r => `${r.data.oid}-${r.data.sid}`).join();
        },
        updateTotalAndPeakData() {
            const date = startOfDayjs(getDayjs(), 'date');
            const startTime = date.valueOf();
            const endTime = date.add(1, 'day').valueOf();

            return Promise.all([
                Instance.get(this.sidList, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'instance');
                    if (
                        this.getResKey(this.resources[0].tree) ===
                        this.getResKey(n)
                    ) {
                        return;
                    }
                    this.$set(this.resources, 0, {
                        resourceType: 'instance',
                        tree: Array.from(n),
                    });
                }),
                Business.get(this.sidList, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'business');
                    if (
                        this.getResKey(this.resources[1].tree) ===
                        this.getResKey(n)
                    ) {
                        return;
                    }
                    this.$set(this.resources, 1, {
                        resourceType: 'business',
                        tree: Array.from(n),
                    });
                }),
            ]);
        },
        onSubmitResourcePopup({ tree }) {
            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                return t.check === 'on' && t.data.oid !== -1;
            });
            let grouped = {};
            sids.forEach(s => {
                grouped[s] = [];
            });
            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(c.data.oid);
                } else {
                    grouped[c.data.sid] = [c.data.oid];
                }
            });

            const keywordInObserver =
                this.$refs.r.currentTab === 'business'
                    ? ChartKeywordInObserver.CHANGE_SELECT_BUSINESS_FROM_CONFIG
                    : ChartKeywordInObserver.CHANGE_SELECT_DOMAIN_OR_INSTANCE_FROM_CONFIG;
            Observer.emit(keywordInObserver, [grouped]);
        },

        onToggleFilteringWindow() {
            this.$set(this.filterData, 'active', !this.filterData.active);
        },
        onChangeFilterValues(filter) {
            const xviewChart = DashboardChartHandler.bigdataCharts()[0];

            if (xviewChart) {
                const chartKey = xviewChart.getModel().key;

                const ipList = filter.ip.trim() !== '' ? [filter.ip] : [];
                Observer.emit(
                    XViewChartKeywordInObserver.FILTER_WHITE_IP_LIST,
                    [ipList]
                );

                const userIdList =
                    filter.userId.trim() !== '' ? [filter.userId] : [];
                Observer.emit(XViewChartKeywordInObserver.FILTER_USERID_LIST, [
                    userIdList,
                ]);

                const guidList = filter.guid.trim() !== '' ? [filter.guid] : [];
                Observer.emit(XViewChartKeywordInObserver.FILTER_GUID_LIST, [
                    guidList,
                ]);

                const serviceNameList =
                    filter.serviceName.trim() !== ''
                        ? [filter.serviceName]
                        : [];
                Observer.emit(
                    XViewChartKeywordInObserver.FILTER_SERVICENAME_LIST,
                    [serviceNameList]
                );

                Observer.emit(
                    XViewChartKeywordInObserver.SHOW_ONLY_ERROR_IN_XVIEW_WITH_CHARTKEY(
                        chartKey
                    ),
                    [filter.isException]
                );
            }

            this.$set(this.filterData, 'form', filter);
            this.onToggleFilteringWindow();
        },
    },
    created() {
        this.$store.commit(
            'dashboard/setOriginOrExtendInChartPosition',
            'extend'
        );
        this.$store.commit(
            'dashboard/setComponents',
            fixDataForLegacy(dashboardProp.charts)
        );
        this.$store.commit('dashboard/setTopbar', dashboardProp.domainBar);

        const urlParams = new URLSearchParams(location.search);
        this.iframeLayout = urlParams.get('layout') === 'iframe';
    },
    mounted() {
        this.updateTotalAndPeakData();

        const xviewChart = DashboardChartHandler.bigdataCharts()[0];

        this.$el.addEventListener(
            'keydown',
            keyboardEvent => {
                if (
                    keyboardEvent.key === 'ArrowRight' ||
                    keyboardEvent.key === 'ArrowLeft'
                ) {
                    this.emitPosSlider(xviewChart.model.range);
                }
            },
            { capture: false }
        );
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.app {
    height: 100%;

    .tooltip-balloon {
        z-index: 1001;
    }

    .open-menu-layer {
        top: 56px;
        z-index: 1000;
    }

    > .contents {
        height: calc(100vh - 110px);

        > .aries-ui-navigation-bar {
            margin: 24px 24px 12px 24px;
            width: auto !important;
            .label-with-dropdown {
                .row-list {
                    max-height: 160px !important;
                }
            }
            @include themify($themes) {
                .range-label {
                    color: themed('typography-color-grey1');
                }

                .slider-wrapper {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    > span {
                        margin: 0 8px;
                        color: themed('typography-color-primary');
                    }
                    > .aries-ui-slider {
                        width: 260px;
                    }
                }
            }
        }

        > .chart {
            margin-top: 10px;
            padding: 0px 22px;
            height: calc(100% - 38px - 48px);
        }
    }
}
</style>
