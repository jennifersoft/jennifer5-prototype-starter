<template>
    <div class="build-config">
        <div class="item title">{{ i18n.M0674 }}</div>
        <div class="item manual">
            <div class="item">
                <tooltip :message="i18n.M0260">
                    <checkbox
                        :active="activeManualDomain"
                        :disabled="checkManualDomainDisabled"
                        :label="i18n.domain"
                        @change="onChangeManualDomain"
                    />
                </tooltip>
            </div>
            <div class="item" v-if="!checkManualDayHidden">
                <div class="left">
                    <checkbox
                        :active="activeManualDay"
                        :label="i18n.period"
                        @change="onChangeManualDay"
                    />
                </div>
                <div class="right">
                    <dropdown
                        small
                        :width="120"
                        :disabled="!activeManualDay"
                        :items="periodList"
                        :selected-value="selectedPeriod"
                        @onchange="onChangePeriodEvent"
                    ></dropdown>

                    <span
                        :class="[
                            'component-group',
                            !activeManualDay ? 'prevent' : '',
                        ]"
                    >
                        <template v-if="selectedPeriod === 2">
                            <dropdown
                                small
                                :width="100"
                                :items="dayList"
                                :selected-value="selectedStartDay"
                                :disabled="!activeManualDay"
                                @onchange="onChangeStartDayEvent"
                            ></dropdown>
                            <i class="blank">~</i>
                            <dropdown
                                small
                                :width="100"
                                :items="dayList"
                                :selected-value="selectedEndDay"
                                :disabled="!activeManualDay"
                                @onchange="onChangeEndDayEvent"
                            ></dropdown>
                        </template>
                        <template v-else-if="selectedPeriod === 4">
                            <label-with-dropdown
                                :label="'D-'"
                                :width="50"
                                :items="dateList"
                                :disabled="!activeManualDay"
                                :selected-value="selectedStartDate"
                                @change="onChangeStartDateEvent"
                            ></label-with-dropdown>
                            <i class="blank">~</i>
                            <label-with-dropdown
                                :label="'D-'"
                                :width="50"
                                :items="dateList"
                                :disabled="!activeManualDay"
                                :selected-value="selectedEndDate"
                                @change="onChangeEndDateEvent"
                            ></label-with-dropdown>
                        </template>
                    </span>
                </div>
            </div>
            <div class="item" v-if="selectedPeriod === 1">
                <div class="left">
                    <checkbox
                        :active="activeOperatingTime"
                        :label="i18n.operatingTime"
                        @change="onChangeOperatingTime"
                    />
                </div>
                <div class="right">
                    <span
                        :class="[
                            'component-group',
                            !activeOperatingTime ? 'prevent' : '',
                        ]"
                    >
                        <dropdown
                            small
                            :width="80"
                            :items="startHourList"
                            :selected-value="selectedStartHour"
                            :disabled="!activeOperatingTime"
                            @onchange="onChangeStartHourEvent"
                        ></dropdown>
                        <i class="blank">~</i>
                        <dropdown
                            small
                            :width="80"
                            :items="endHourList"
                            :selected-value="selectedEndHour"
                            :disabled="!activeOperatingTime"
                            @onchange="onChangeEndHourEvent"
                        ></dropdown>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { i18n } from '@common/utility';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Radio from '@vuejs/component/Toggle/Radio';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import LabelWithDropdown from './ui/LabelWithDropdown';
import { HOURS, DAYS, DATES, PERIODS } from '../../../constant';

export default {
    components: {
        Checkbox,
        Radio,
        Dropdown,
        Tooltip,
        LabelWithDropdown,
    },
    props: {
        // Domain 수동 설정
        checkManualDomain: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 기간 수동 설정
        checkManualDay: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 기간 수동 설정 (하루:1 | 한주:2,시작요일,종료요일 | 한달:3 | 사용자정의:4,시작d-day,종료d-day
        buildTimeValue: {
            type: String,
            required: false,
            default: '1',
        },
        // 운영시간 (active status, start hour, end hour)
        runTimeValue: {
            type: String,
            required: false,
            default: '0,0,24',
        },

        // Domain 수동 설정 활성화
        checkManualDomainDisabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        // 기간 수동 설정 숨기는 설정
        checkManualDayHidden: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        const buildTimeValue = this.parseBuildTimeValue(
            `${this.buildTimeValue}`
        );
        const runTimeValue = this.parseRunTimeValue(`${this.runTimeValue}`);

        return {
            i18n: {
                domain: i18n.get('ui.label.domain'),
                operatingTime: i18n.get('ui.label.operatingTime'),
                period: i18n.get('ui.label.period'),
                M0260: i18n.get('M0260'),
                M0674: i18n.get('M0674'),
            },

            selectedPeriod: buildTimeValue.period,
            selectedStartDay: buildTimeValue.startDay,
            selectedEndDay: buildTimeValue.endDay,
            selectedStartDate: buildTimeValue.startDate,
            selectedEndDate: buildTimeValue.endDate,

            activeManualDomain: this.checkManualDomain,
            activeManualDay: this.checkManualDay,

            activeOperatingTime: runTimeValue.active,
            selectedStartHour: runTimeValue.startHour,
            selectedEndHour: runTimeValue.endHour,

            periodList: PERIODS,
            dayList: DAYS,
            dateList: DATES,
            startHourList: HOURS,
            endHourList: HOURS,
        };
    },
    methods: {
        parseBuildTimeValue(value) {
            const tokens = value.split(',');
            return {
                period: parseInt(tokens[0]),
                startDay: parseInt(tokens[1]) || 1,
                endDay: parseInt(tokens[2]) || 1,
                startDate: parseInt(tokens[1]) || 1,
                endDate: parseInt(tokens[2]) || 1,
            };
        },
        parseRunTimeValue(value) {
            const tokens = value.split(',');
            return {
                active: parseInt(tokens[0]) === 1,
                startHour: parseInt(tokens[1]) || 0,
                endHour: parseInt(tokens[2]) || 24,
            };
        },
        onChangeManualDomain(active) {
            this.activeManualDomain = active;
            this.updateParameters();
        },
        onChangeManualDay(active) {
            this.activeManualDay = active;
            this.updateParameters();
        },
        onChangeOperatingTime(active) {
            this.activeOperatingTime = active;
            this.updateParameters();
        },
        onChangePeriodEvent(data) {
            // 기간 설정이 하루가 아니면 운영시간은 사용하지 않는다.
            if (data.value !== 1) this.activeOperatingTime = false;
            this.selectedPeriod = data.value;
            this.updateParameters();
        },
        onChangeStartDayEvent(data) {
            this.selectedStartDay = data.value;
            this.updateParameters();
        },
        onChangeEndDayEvent(data) {
            this.selectedEndDay = data.value;
            this.updateParameters();
        },
        onChangeStartDateEvent(data) {
            this.selectedStartDate = data.value;
            this.updateParameters();
        },
        onChangeEndDateEvent(data) {
            this.selectedEndDate = data.value;
            this.updateParameters();
        },
        onChangeStartHourEvent(data) {
            this.selectedStartHour = data.value;
            this.updateParameters();
        },
        onChangeEndHourEvent(data) {
            this.selectedEndHour = data.value;
            this.updateParameters();
        },
        updateParameters() {
            const buildTimeValueTokens = [this.selectedPeriod];
            if (this.selectedPeriod === 2) {
                buildTimeValueTokens.push(this.selectedStartDay);
                buildTimeValueTokens.push(this.selectedEndDay);
            } else if (this.selectedPeriod === 4) {
                buildTimeValueTokens.push(this.selectedStartDate);
                buildTimeValueTokens.push(this.selectedEndDate);
            }

            const runTimeValueTokens = [
                this.activeOperatingTime ? 1 : 0,
                this.selectedStartHour,
                this.selectedEndHour,
            ];

            this.$emit('update', {
                checkManualDomain: this.activeManualDomain,
                checkManualDay: this.activeManualDay,
                buildTimeValue: buildTimeValueTokens.join(','),
                runTimeValue: runTimeValueTokens.join(','),
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../../themes';

.build-config {
    @include themify($themes) {
        > .item {
            margin-bottom: 12px;

            ::v-deep .aries-radio-wrapper {
                cursor: default !important;
                .aries-radio {
                    opacity: 0.6;
                }
            }

            &.title {
                font-size: 12px;
                padding: 6px 0px;
                color: themed('window-build-config-message-font-color');
            }

            &.manual {
                > .item {
                    display: flex;
                    height: 26px;
                    line-height: 26px;
                    padding-bottom: 16px;

                    &:not(:last-child) {
                        border-bottom: 1px solid
                            themed('window-build-config-manual-border-color');
                        margin-bottom: 16px;
                    }

                    > * {
                        display: inline-flex;
                    }
                    > .left {
                        flex: 0 0 130px;
                    }
                    > .right {
                        flex: 1;
                        ::v-deep .aries-ui-dropdown {
                            margin-right: 5px;
                        }
                        .blank {
                            margin-right: 8px;
                        }
                        .component-group {
                            display: inline-flex;
                            &.prevent {
                                i.blank {
                                    opacity: 0.5;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
