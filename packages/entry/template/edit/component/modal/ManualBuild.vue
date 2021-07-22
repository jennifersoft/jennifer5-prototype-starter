<template>
    <base-window
        class="manual-build"
        :width="370"
        :height="height"
        @cancel="onClickCancelBtn"
        @apply="onClickBuildBtn"
    >
        <template #subject>{{ i18n.build }}</template>
        <template #contents>
            <div class="contents">
                <div class="subject">{{ i18n.reportDirectory }}</div>
                <div class="item">
                    <checkbox
                        :active="activeNoDir"
                        :label="i18n.noDir"
                        :disabled="newDirectoryList.length === 0"
                        @change="onChangeActiveNoDir"
                    />
                    <dropdown
                        :items="newDirectoryList"
                        :disabled="activeNoDir"
                        :selected-value="selectedDirectory"
                        @onchange="onChangeDirectory"
                        v-if="selectedDirectory !== '*'"
                    />
                </div>
                <div class="subject">{{ i18n.dateSetting }}</div>
                <div class="item">
                    <radio
                        :active="!selectedManualBuild"
                        :label="i18n.defaultValue"
                        @change="() => (selectedManualBuild = false)"
                    ></radio>
                    <radio
                        :active="selectedManualBuild"
                        :label="i18n.manual"
                        @change="() => (selectedManualBuild = true)"
                    ></radio>
                </div>
                <div class="item" v-if="selectedManualBuild">
                    <date-picker
                        ref="picker"
                        :date="selectedStartDate"
                        :date-format="'yyyy-MM-dd'"
                        :select-count="searchRangeCount"
                        :only-select-day="onlySearchDay"
                        :only-select-date="onlySearchDate"
                        :messages="componentMessages"
                        prevent-future
                        type="inline"
                        @update:date="onChangeStartDate"
                        @prev="onChangeMonth"
                        @next="onChangeMonth"
                    />
                </div>
            </div>
        </template>
    </base-window>
</template>
<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import Radio from '@vuejs/component/Toggle/Radio';
import DatePicker from '@vuejs/component/DatePicker/DatePicker';
import BaseWindow from './BaseWindow';
import componentMessages from '@vuejs/component/messages';
import { createNamespacedHelpers } from 'vuex';
import { getDayjs, getDayjsUseFullYear } from '@common/base';
import { getTimeRangeBasedOnDayOfWeek, i18n } from '@common/utility';
import { startOfDayjs } from '@common/dayjsWrapper';

const { mapState, mapActions } = createNamespacedHelpers('template');

export default {
    components: {
        BaseWindow,
        Checkbox,
        Dropdown,
        Radio,
        DatePicker,
    },
    props: {
        directoryList: {
            type: Array,
            required: true,
        },
    },
    computed: {
        ...mapState({
            key: state => state.key,
            buildDay: state => state.buildDay,
        }),
        newDirectoryList() {
            return this.directoryList.map(item => {
                return {
                    text: item.name,
                    value: item.key,
                };
            });
        },
        height() {
            return this.selectedManualBuild ? 610 : 410;
        },
    },
    data() {
        return {
            i18n: {
                build: i18n.get('ui.label.build'),
                cancel: i18n.get('ui.button.cancel'),
                dateSetting: i18n.get('ui.label.template.dateSetting'),
                defaultValue: i18n.get('ui.label.defaultValue'),
                manual: i18n.get('ui.label.template.manual'),
                reportDirectory: i18n.get('ui.label.template.directory'),
                noDir: i18n.get('ui.label.noDir'),
                M0614: i18n.get('M0614'),
            },

            activeNoDir: true,
            selectedDirectory: '*',
            selectedManualBuild: false,

            // 분석 화면과 달리 시작/종료 날짜가 같아도 된다. (종료 날짜에 하루를 더해주는듯)
            selectedStartDate: this.getTodayTime(0),
            selectedEndDate: this.getTodayTime(1),

            // 기간 설정 타입에 따라 변경해야하며, selectedStartDate/selectedEndDate 값이 영향받는다.
            searchRangeCount: 1,
            onlySearchDay: undefined,
            onlySearchDate: undefined,

            // 달력 컴포넌트 메시지
            componentMessages,
        };
    },
    methods: {
        onClickCancelBtn() {
            this.$emit('hide-layer');
        },
        onClickBuildBtn() {
            this.$emit('build-template', {
                key: this.key,
                directoryKey: this.selectedDirectory,
                isManualBuild: this.selectedManualBuild,
                manualBuildTime: [
                    this.selectedStartDate.valueOf(),
                    this.selectedEndDate.valueOf(),
                ],
            });

            this.onClickCancelBtn();
        },
        onChangeActiveNoDir(active) {
            this.activeNoDir = active;
            this.selectedDirectory =
                active && this.newDirectoryList.length > 0
                    ? '*'
                    : this.newDirectoryList[0].value;
        },
        onChangeDirectory(data) {
            this.selectedDirectory = data.value;
        },
        onChangeStartDate(date) {
            this.selectedStartDate = date;
            this.selectedEndDate = date.add(this.searchRangeCount, 'day');
        },
        onChangeMonth(date) {
            const tokens = this.buildDay.split(',');
            const year = date.year();
            const month = date.month();

            // 월 단위 선택에서만 searchRangeCount를 변경해준다.
            if (parseInt(tokens[0]) === 3) {
                this.searchRangeCount = this.getRangeForMonth(year, month);
                this.selectedStartDate = getDayjsUseFullYear(year, month, 1);
            }
        },
        getTodayTime(addDays = 0) {
            let today = startOfDayjs(getDayjs(), 'date');
            today = today.add(addDays, 'day');
            return today;
        },
        getRangeForDays(startDay, endDay) {
            const timeRange = getTimeRangeBasedOnDayOfWeek(
                this.getTodayTime(-1),
                startDay,
                endDay
            );
            const startDate = getDayjs(timeRange[0]);
            const endDate = getDayjs(timeRange[1]);
            return endDate.diff(startDate, 'day') + 1;
        },
        getRangeForMonth(year, month) {
            return getDayjsUseFullYear(year, month, 1)
                .add(1, 'month')
                .date(0)
                .date();
        },
    },
    created() {
        const tokens = this.buildDay.split(',');
        const type = parseInt(tokens[0]);

        if (type === 1) {
            // 조회 기간: 하루
            this.selectedStartDate = this.getTodayTime(0);
            this.searchRangeCount = 1;
            this.onlySearchDay = undefined;
            this.onlySearchDate = undefined;
        } else if (type === 2) {
            // 조회 기간: 한 주
            const startDay = parseInt(tokens[1]) - 1;
            const endDay = parseInt(tokens[2]) - 1;

            this.selectedStartDate = this.getTodayTime(-1);
            this.searchRangeCount = this.getRangeForDays(startDay, endDay);
            this.onlySearchDay = startDay;
            this.onlySearchDate = undefined;
        } else if (type === 3) {
            // 조회 기간: 한 달
            const m = getDayjs().date(1);

            this.selectedStartDate = m;
            this.searchRangeCount = this.getRangeForMonth(m.year(), m.month());
            this.onlySearchDay = undefined;
            this.onlySearchDate = 1;
        } else if (type === 4) {
            // 조회 기간: 사용자 정의
            const prevStartDay = parseInt(tokens[1]);
            const prevEndDay = parseInt(tokens[2]);

            this.selectedStartDate = this.getTodayTime(-prevStartDay);
            this.searchRangeCount = prevStartDay - prevEndDay + 1;
            this.onlySearchDay = undefined;
            this.onlySearchDate = undefined;
        }
    },
};
</script>
<style lang="scss" scoped>
.manual-build {
    @import '../../style/window-sub-title';
    @include window-sub-title;

    @import '../../themes';
    @include themify($themes) {
        .contents {
            > .subject {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 16px;
                color: themed('common-font-color');
            }

            > .item {
                margin-bottom: 16px;
                ::v-deep .aries-ui-dropdown {
                    margin-top: 16px;
                }
                ::v-deep .aries-radio-wrapper {
                    display: block;
                    margin-bottom: 8px;
                }

                ::v-deep .popup-wrapper {
                    max-width: 100% !important;
                    min-width: 100% !important;
                    height: 288px !important;
                }
            }
        }
    }
}
</style>
