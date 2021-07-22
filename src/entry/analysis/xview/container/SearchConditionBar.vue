<template>
    <navigation-bar
        @search="onClickSearch"
        @stop-search="onClickStopSearch"
        :disable-search-btn="searchDisabled"
        :progress="loadingDataProgress"
        :suspendible="true"
    >
        <navigation-item>
            <format-date-input
                :messages="calendarMessages"
                :time="time.start"
                @change="onChangeStart"
            />
            <format-date-input
                :messages="calendarMessages"
                :time="time.end"
                @change="onChangeEnd"
            />
        </navigation-item>
        <resource-popup
            :resources="resourceData"
            popup-position-left
            @submit="onChangeResource"
        >
        </resource-popup>
        <format-number-input
            small
            v-model="minResponseTime"
            :label="i18n.minResponseTime"
            unit="ms"
            :width="200"
        />

        <btn
            :items="[{ text: i18n.advancedFilter }]"
            @click="openAdvancedSearchCondition"
        />
    </navigation-bar>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import messages from '@vuejs/component/messages';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';

import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Btn from '@vuejs/component/button/Btn';

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { startOfDayjs } from '@common/dayjsWrapper';
import { getDayjs } from '@common/base';
import { Observer } from '@common/legacy/Observer';
import { XViewChartKeywordInObserver } from '@common/ObserverKeyword';

export default {
    name: 'SearchConditionBar',
    components: {
        Btn,
        Checkbox,
        Dropdown,
        FormatDateInput,
        FormatNumberInput,
        NavigationBar,
        NavigationItem,

        ResourcePopup,
    },

    inject: {
        i18n,
        theme: {
            type: String,
            default: 'classic',
        },
    },
    data() {
        return {
            focusTarget: null,
            startDateOpened: false,
            endDateOpened: false,
            time: {
                start: startOfDayjs(getDayjs(), 'date'),
                end: startOfDayjs(getDayjs(), 'date'),
            },
            target: {
                oidList: {},
                otypeString: 'instance',
            },
            filters: {
                ...this.initialFilters,
            },
            calendarMessages: messages,
        };
    },

    methods: {
        ...mapMutations('xviewAnalysis', [
            'updateStartTimeInSearchedCondition',
            'updateEndTimeInSearchedCondition',
            'updateMinResponseTimeInSearchedCondition',
            'clearTransactions',
            'openAdvancedSearchCondition',
        ]),
        ...mapActions('xviewAnalysis', [
            'fetchResource',
            'fetchTransaction',
            'clearFilterIdsOnTopbar',
            'updateResourceInSearchedCondition',
        ]),

        onChangeStart(start) {
            this.time = {
                ...this.time,
                start,
            };
        },
        onChangeEnd(end) {
            this.time = {
                ...this.time,
                end,
            };
        },
        onFocus(e) {
            this.focusTarget = e.currentTarget.name;
        },
        onBlur() {
            this.focusTarget = null;
        },
        onChangeFilter(value, type) {
            console.log('onChangeFilter', value, type);
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
            this.target = {
                oidList: grouped,
                otypeString: resourceType,
            };
        },
        onClickSearch() {
            this.clearFilterIdsOnTopbar();
            this.updateStartTimeInSearchedCondition(this.time.start);
            this.updateEndTimeInSearchedCondition(this.time.end);
            this.updateResourceInSearchedCondition(this.target);

            this.clearTransactions();
            this.fetchTransaction();
        },
        onClickStopSearch() {
            Observer.emit(XViewChartKeywordInObserver.END_XVIEW_ANALYSIS);
        },
    },
    computed: {
        ...mapGetters('domain', ['sidList']),
        ...mapState('xviewAnalysis', {
            resourceData: state => state.resourceData,
            startTimeInSearchedCondition: state =>
                state.searchedCondition.time.start,
            endTimeInSearchedCondition: state =>
                state.searchedCondition.time.end,
            minResponseTimeInSearchedCondition: state =>
                state.searchedCondition.minResponseTime,
            loadingDataProgress: state => state.loadingDataProgress,
        }),
        minResponseTime: {
            get() {
                return this.minResponseTimeInSearchedCondition;
            },
            set(value) {
                this.updateMinResponseTimeInSearchedCondition(parseInt(value));
            },
        },
        searchDisabled() {
            return this.time.end <= this.time.start;
        },
    },
    watch: {
        sidList() {
            this.fetchResource(this.sidList);
        },
        time() {
            this.fetchResource(this.sidList);
        },
    },
    mounted() {
        this.fetchResource(this.sidList);
    },
};
</script>

<style lang="scss" scoped></style>
