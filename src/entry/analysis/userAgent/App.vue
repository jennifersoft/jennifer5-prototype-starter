<template>
    <div class="user-agent-wrapper">
        <div class="user-agent-navigation-bar">
            <navigation-bar
                :progress="progress"
                :suspendible="false"
                :disable-search-btn="!isValidTimeRange"
                @search="onClickSearch"
                @stop-search="onClickStopSearch"
            >
                <navigation-item>
                    <format-date-input
                        :time="timeFilter.start"
                        :messages="messagesForDateInput"
                        @change="updateStartTime"
                    >
                    </format-date-input>
                    <format-date-input
                        :time="timeFilter.end"
                        :messages="messagesForDateInput"
                        @change="updateEndTime"
                    >
                    </format-date-input>
                </navigation-item>
                <resource-popup
                    :resources="resourceData"
                    popup-position-left
                    @submit="onChangeResource"
                >
                </resource-popup>
            </navigation-bar>
        </div>

        <div class="user-agent-category">
            <tab
                class="user-agent-tab"
                :tabs="tabData"
                :active-tab="currentTab"
                @change="updateCurrentTab"
            >
            </tab>
            <div v-click-outside="closeDetailFilter">
                <btn
                    ref="detail-filter-btn"
                    class="detail-filter-btn"
                    :items="[{ text: i18n.detailFiltering }]"
                    @click="toggleDetailFilter"
                >
                </btn>
                <detail-filter-window
                    v-if="showDetailFilter"
                    :open-x="detailFilterPosition.x"
                    :open-y="detailFilterPosition.y"
                    @close="toggleDetailFilter"
                >
                </detail-filter-window>
            </div>
        </div>

        <div class="user-agent-result">
            <div class="left">
                <user-agent-donut
                    :data="donutData"
                    :height="contentHeight"
                    :title="i18n.hit"
                    :help-messages="i18n.helpMessages"
                >
                </user-agent-donut>
            </div>
            <div class="right">
                <div class="title">
                    <div class="h5">
                        <strong>{{ i18n.versionedData }}</strong>
                    </div>
                    <btn
                        :items="[{ text: i18n.export }]"
                        @click="exportData"
                    ></btn>
                </div>
                <user-agent-table
                    ref="table"
                    :list="tableData"
                    :height="contentHeight - 90"
                    :data-type="currentTab"
                >
                </user-agent-table>
            </div>
        </div>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import UserAgentDonut from '@entry/analysis/userAgent/container/UserAgentDonut';
import UserAgentTable from '@entry/analysis/userAgent/component/UserAgentTable';
import DetailFilterWindow from '@entry/analysis/userAgent/container/DetailFilterWindow';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup';
import Tab from '@vuejs/component/tab/Tab';
import Btn from '@vuejs/component/button/Btn';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import { downloadCsv } from '@common/utility';
import clickOutside from '@vuejs/directive/clickOutside';

import { mapState, mapActions, mapMutations, mapGetters } from './store';
import _ from '@library/lodash';

export default {
    name: 'App',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                detailFiltering: 'detailFiltering',
                versionedData: 'versionedData',
                export: 'export',
                hit: 'hit',
                responseTime: 'responseTime',
                ms: 'ms',
                browser: 'browser',
                os: 'os',
                device: 'device',
            }),
        },
    },
    props: {
        contentHeight: {
            type: Number,
            default: 0,
        },
    },
    components: {
        UserAgentTable,
        UserAgentDonut,
        DetailFilterWindow,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        ResourcePopup,
        Tab,
        Btn,
        AlertWindow,
    },
    directives: {
        clickOutside,
    },
    data() {
        return {
            showDetailFilter: false,
            detailFilterPosition: { x: 0, y: 0 },
            alertMessage: '',
        };
    },
    computed: {
        ...mapState({
            domains: state => state.domains,
            oidList: ({ filters }) => filters.oidList,
            timeFilter: ({ filters }) => filters.time,
            resourceData: state => state.resourceData,
            tabData: state => state.tabData,
            currentTab: state => state.currentTab,
            loading: state => state.loading,
            progress: state => state.progress,
        }),
        ...mapGetters(['tableData', 'donutData']),
        messagesForDateInput() {
            return {
                apply: this.i18n.apply,
                cancel: this.i18n.cancel,
                dayLabels: this.i18n.dayLabels,
            };
        },
        isValidTimeRange() {
            return (
                this.timeFilter.start.valueOf() < this.timeFilter.end.valueOf()
            );
        },
    },
    methods: {
        ...mapMutations([
            'updateStartTime',
            'updateEndTime',
            'updateCurrentTab',
            'updateLoading',
            'updateFilteredResource',
        ]),
        ...mapActions(['fetchUserAgentData']),
        onClickSearch() {
            const { domains, oidList } = this;

            // 선택대상이 없을 경우
            if (!oidList[domains.sid]) {
                this.alertMessage = this.i18n.M0266;
                return;
            }

            // 도메인 그룹으로 조회할 경우
            if (domains.sid === -1) {
                this.alertMessage = this.i18n.M0410;
                return;
            }

            this.updateLoading(true);
            this.fetchUserAgentData();
        },
        onClickStopSearch() {
            this.updateLoading(false);
        },
        onChangeResource({ resourceType, tree }) {
            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                return t.check === 'on' && t.data.oid !== -1;
            });
            let grouped = {};
            let nameBySid = {};
            sids.forEach(s => {
                grouped[s] = [];
                nameBySid[s] = [];
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

                if (nameBySid.hasOwnProperty(c.data.sid)) {
                    nameBySid[c.data.sid].push({
                        oid: c.data.oid,
                        name: c.data.shortName,
                    });
                } else {
                    nameBySid[c.data.sid] = [
                        {
                            oid: c.data.oid,
                            name: c.data.shortName,
                        },
                    ];
                }
            });
            this.updateFilteredResource({
                oidList: grouped,
                otypeString: resourceType,
            });
        },
        exportData() {
            const name = this.currentTab;
            const { hit, responseTime, ms } = this.i18n;

            const names = [this.i18n[name], hit, responseTime + '(' + ms + ')'];

            const rows = [];
            const oldRows = this.$refs.table.table.listData();

            for (let i = 0; i < oldRows.length; i++) {
                const data = _.clone(oldRows[i]);
                data.name =
                    data.version != ''
                        ? data.name + ' ' + data.version
                        : data.name;
                data.hit = data.hit.toShortForAries();
                data.responseTime = data.responseTime.toShortForAries();
                rows.push(data);
            }

            downloadCsv('user_agent', {
                fields: ['name', 'hit', 'responseTime'],
                names: names,
                rows: rows,
            });
        },
        toggleDetailFilter() {
            this.showDetailFilter = !this.showDetailFilter;
        },
        closeDetailFilter() {
            if (this.showDetailFilter) this.showDetailFilter = false;
        },
    },
    mounted() {
        const { left, top, height, width } = this.$refs[
            'detail-filter-btn'
        ].$el.getBoundingClientRect();
        this.detailFilterPosition = {
            x: left + width - 540,
            y: top + height + 12,
        };
    },
};
</script>

<style lang="scss" scoped>
.user-agent-wrapper {
    padding: 0px 24px;
}
</style>
