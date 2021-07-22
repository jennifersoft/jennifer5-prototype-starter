<template>
    <window
        class="search-target-window"
        :messages="i18n"
        :open-x="openX - contentWidth"
        :open-y="openY"
        :open-w="contentWidth"
        :draggable="false"
        animation-name="fade-down"
        @apply="save"
        @cancel="cancel"
    >
        <template #subject>
            <span>{{ i18n.lookupZone }}</span>
        </template>
        <div class="search-target-content" :style="gridVariables">
            <date-picker
                v-if="pageType === PAGE_TYPE.DAILY"
                class="condition-box item-1"
                :date.sync="selectedTimestmap"
                :messages="messages"
                type="inline"
            />
            <month-picker
                v-else-if="pageType === PAGE_TYPE.MONTHLY"
                :date.sync="selectedYearAndMonth"
                class="condition-box item-1"
                type="inline"
            />
            <date-picker
                v-if="pageType === PAGE_TYPE.PERIOD"
                :date.sync="selectedDates.startTime"
                :messages="messages"
                type="inline"
            />
            <date-picker
                v-if="pageType === PAGE_TYPE.PERIOD"
                :messages="messages"
                type="inline"
                :date.sync="selectedDates.endTime"
            />
            <list-selector
                style="height: 240px;"
                ref="targetListSelector"
                @check="checkHandler"
                :multi-select="true"
                :list="targetList"
                :disabled="loadingTargetList"
            />
            <div class="select-group" v-if="pageType !== PAGE_TYPE.MONTHLY">
                <span class="select-group-label">{{ i18n.operatingTime }}</span>
                <div class="number-input-group">
                    <format-number-input
                        v-model="startHour"
                        :min="0"
                        :max="24"
                        use-stepper
                    />
                    &nbsp;~&nbsp;
                    <format-number-input
                        v-model="endHour"
                        :min="0"
                        :max="24"
                        use-stepper
                    />
                </div>
            </div>
            <div class="select-group">
                <span class="select-group-label">{{
                    i18n.peakTimeCondition
                }}</span>
                <dropdown
                    :items="peakTimeConditionArray"
                    @onchange="onChangePeakTimeCondition"
                    normal
                />
            </div>
            <alert :message="i18n.M0204" class="message-block" />
        </div>
    </window>
</template>

<script>
import { i18n } from '@common/utility';
import { OTypeDef } from '@common/definition';
import { getDayjs, getDayjsUseFullYear } from '@common/base';
import ListSelector from '@vuejs/component/ListSelector/ListSelector.vue';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Alert from '@vuejs/component/Alert/Alert';
import Window from '@vuejs/component/window/Window';
import MonthPicker from '@vuejs/component/DatePicker/MonthPicker';
import DatePicker from '@vuejs/component/DatePicker/DatePicker';
import messages from '@vuejs/component/messages';
import { PAGE_TYPE } from '@entry/statistics/common/common';

import { createNamespacedHelpers } from 'vuex';
import { loadTarget } from '@entry/statistics/common/http';
import { startOfDayjs } from '@common/dayjsWrapper';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'statistics'
);

export default {
    name: 'searchConditionBox',
    inject: {
        pageType: {
            default: PAGE_TYPE.DAILY,
        },
        otype: {
            default: OTypeDef.SYSTEM,
        },
    },
    props: {
        openX: {
            type: Number,
            required: true,
        },
        openY: {
            type: Number,
            required: true,
        },
    },
    components: {
        FormatNumberInput,
        Dropdown,
        DatePicker,
        MonthPicker,
        ListSelector,
        Window,
        Alert,
        // UixComboBox
    },
    data() {
        return {
            PAGE_TYPE: PAGE_TYPE,
            targetList: [],
            checkedTargetList: [],

            hoursInDay: Array.from(Array(25).keys()).map(num => ({
                text: num.toString(),
                value: num.toString(),
            })),
            startHour: 0,
            endHour: 24,
            peakTimeConditionArray:
                this.pageType === PAGE_TYPE.DAILY
                    ? [
                          {
                              text: i18n.get('ui.mx.service_count'),
                              value: 'service_count',
                          },
                          {
                              text: i18n.get('ui.mx.visit_hour'),
                              value: 'visit_hour',
                          },
                      ]
                    : [
                          {
                              text: i18n.get('ui.mx.service_count'),
                              value: 'service_count',
                          },
                          {
                              text: i18n.get('ui.mx.visit_day'),
                              value: 'visit_day',
                          },
                      ],
            peakTimeCondition: 'service_count',
            oids: [],
            selectedYearAndMonth: startOfDayjs(getDayjs(), 'month'),
            selectedTimestmap: startOfDayjs(getDayjs(), 'date'),
            selectedDates: {
                startTime: startOfDayjs(getDayjs(), 'date').subtract(6, 'day'),
                endTime: startOfDayjs(getDayjs(), 'date'),
            },

            i18n: {
                operatingTime: i18n.get('ui.label.operatingTime'),
                instance: i18n.get('ui.label.instance'),
                peakTimeCondition: i18n.get('ui.label.peakTimeCondition'),

                lookupZone: i18n.get('ui.label.lookupZone'),
                cancel: i18n.get('ui.button.cancel'),
                apply: i18n.get('ui.button.done'),
                M0204: i18n.get('M0204'),
            },
            messages,
            loadingTargetList: false,
        };
    },
    watch: {
        async domainId() {
            await this.loadTargetList();

            this.saveSearchCondition();
        },
        selectedTimestmap() {
            this.loadTargetList();
        },

        selectedYearAndMonth() {
            this.loadTargetList();
        },

        startHour() {
            this.loadTargetList();
        },

        endHour() {
            this.loadTargetList();
        },
    },

    methods: {
        checkHandler(list) {
            this.checkedTargetList = list;
        },

        saveSearchCondition() {
            const searchCondition = {
                checkedTargetList: this.checkedTargetList,
                operateStartHour: Number(this.startHour),
                operateEndHour: Number(this.endHour),

                //MxDef 키값
                metricByPeakTimeCondition: this.peakTimeCondition,

                //instance or business
                isBusiness: this.otype === OTypeDef.BUSINESS,
            };

            this.configureSearchCondition(searchCondition);

            if (this.pageType === PAGE_TYPE.DAILY) {
                this.configureSearchTimeInDaily({
                    time: this.selectedTimestmap.valueOf(),
                });
            } else if (this.pageType === PAGE_TYPE.MONTHLY) {
                this.configureSearchTimeInMonthly({
                    year: this.selectedYearAndMonth.year(),
                    month: this.selectedYearAndMonth.month(),
                });
            } else if (this.pageType === PAGE_TYPE.PERIOD) {
                this.configureSearchTimeInPeriod({
                    startTime: this.selectedDates.startTime.valueOf(),
                    endTime: this.selectedDates.endTime.valueOf(),
                });
            }
        },

        save() {
            this.saveSearchCondition();
            this.$emit('close');
        },

        cancel() {
            const checkedTargetList = this.searchCondition.checkedTargetList;
            if (checkedTargetList.length > 0) {
                this.$refs.targetListSelector.uncheckAll();
                checkedTargetList.forEach((data, index) => {
                    this.$refs.targetListSelector.listRowCheckHandler(index);
                });
            }

            this.$emit('close');
        },
        onChangePeakTimeCondition(data) {
            this.peakTimeCondition = data.value;
        },
        getSearchTime() {
            let searchTime;
            if (this.pageType === PAGE_TYPE.DAILY) {
                searchTime = {
                    startTime: this.selectedTimestmap.valueOf(),
                    endTime:
                        this.selectedTimestmap.valueOf() + 1000 * 60 * 60 * 24,
                };
            } else if (this.pageType === PAGE_TYPE.MONTHLY) {
                searchTime = {
                    startTime: getDayjsUseFullYear(
                        this.selectedYearAndMonth.year(),
                        this.selectedYearAndMonth.month(),
                        1
                    ).valueOf(),
                    endTime: getDayjsUseFullYear(
                        this.selectedYearAndMonth.year(),
                        this.selectedYearAndMonth.month(),
                        1
                    )
                        .add(1, 'month')
                        .subtract(1, 'second')
                        .valueOf(),
                };
            } else if (this.pageType === PAGE_TYPE.PERIOD) {
                searchTime = {
                    startTime: this.selectedDates.startTime.valueOf(),
                    endTime:
                        this.selectedDates.endTime.valueOf() +
                        1000 * 60 * 60 * 24,
                };
            }
            return searchTime;
        },

        async loadTargetList() {
            this.loadingTargetList = true;
            const targetData = await loadTarget(
                this.otype,
                this.domainId,
                this.getSearchTime()
            );

            this.targetList =
                this.otype === OTypeDef.BUSINESS
                    ? this.listOnBusiness(targetData.data)
                    : this.listOnSystem(targetData.data);
            this.checkedTargetList = this.targetList;

            this.$nextTick(() => this.allCheck());
            this.loadingTargetList = false;
        },

        listOnSystem(responseData) {
            return responseData.map(object => ({
                label: object.shortName,
                description: object.longName,
                oid: object.oid,
            }));
        },

        listOnBusiness(responseData) {
            const list = responseData.list;
            return list.map(object => ({
                label: object.shortName,
                description: object.ruleList,
                oid: object.oid,
            }));
        },

        allCheck() {
            this.$refs.targetListSelector.allCheckHandler();
        },

        ...mapMutations([
            'configureSearchCondition',
            'configureSearchTimeInDaily',
            'configureSearchTimeInMonthly',
            'configureSearchTimeInPeriod',
        ]),
    },

    computed: {
        ...mapGetters({
            searchCondition: 'searchCondition',
            searchTimeInDaily: 'searchTimeInDaily',
            searchTimeInMonthly: 'searchTimeInMonthly',
            searchTimeInPeriod: 'searchTimeInPeriod',
        }),

        ...mapState({
            domainId: 'domainId',
        }),

        targetName() {
            return this.otype === OTypeDef.BUSINESS ? 'Business' : 'Instance';
        },
        gridVariables() {
            const columns = this.pageType === PAGE_TYPE.PERIOD ? 3 : 2;
            return {
                '--col-count': columns,
            };
        },
        contentWidth() {
            return this.pageType === PAGE_TYPE.PERIOD ? 840 : 580;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.search-target-window {
    .search-target-content {
        display: grid;
        grid-template-columns: repeat(var(--col-count), 1fr);
        grid-gap: 20px;

        .select-group {
            display: flex;
            flex-direction: column;
            .select-group-label {
                font-size: 14px;
                margin-bottom: 16px;
            }
            .number-input-group {
                display: flex;
                align-items: center;
            }
        }

        .message-block {
            grid-column: 1 / calc(var(--col-count) + 1);
        }
    }
}
</style>
