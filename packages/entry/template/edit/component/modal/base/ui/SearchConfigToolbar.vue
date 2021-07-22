<template>
    <div class="search-config-toolbar">
        <div class="item">
            {{ i18n.target }} : <strong>{{ domainGroupText }}</strong>
        </div>
        <div class="item">
            {{ i18n.searchTerm }} : <strong>{{ searchTermText }}</strong>
        </div>
        <div class="item">
            {{ i18n.operatingTime }} : <strong>{{ operationTimeText }}</strong>
        </div>
        <div class="item" v-if="title !== ''">
            {{ i18n.chartTitle }} : <strong>{{ title }}</strong>
        </div>
        <div class="item" v-if="maxRow !== -1">
            {{ i18n.maxRow }} : <strong>{{ maxRow }}</strong>
        </div>
        <div class="item right" @click="() => $emit('show-config')">
            <span>{{ i18n.setting }}</span>
        </div>
    </div>
</template>
<script>
import { getDayjs, serverDateFormat } from '@common/base';
import { getTimeRangeBasedOnDayOfWeek, i18n } from '@common/utility';

export default {
    props: {
        // 차트 제목
        title: {
            type: String,
            required: false,
            default: '',
        },
        // 테이블 최대 행수
        maxRow: {
            type: Number,
            required: false,
            default: -1,
        },

        // 선택된 대상 이름
        domainGroupTitle: {
            type: String,
            required: false,
            default: '',
        },

        // Domain 수동 설정
        checkManualDomain: {
            type: Boolean,
            required: false,
            default: false,
        },

        // 기간 설정
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
        buildDay: {
            // 위와 동일, 하지만 전역 설정임
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
        buildTime: {
            // 위와 동일, 하지만 전역 설정임 (기간 수동 설정이랑 키 이름이 비슷해서 주의해야 함!!!)
            type: String,
            required: false,
            default: '0,0,24',
        },

        // 사용자정의 정보
        customText: {
            type: String,
            required: false,
            default: '',
        },
    },
    computed: {
        domainGroupText() {
            return `${this.domainGroupTitle} (${
                this.checkManualDomain ? this.i18n.manual : this.i18n.auto
            })`;
        },
        searchTermText() {
            let result = '';

            const tokens = (this.checkManualDay
                ? this.buildTimeValue
                : this.buildDay
            ).split(',');
            const type = tokens[0];
            const dateFormatStr = serverDateFormat.short;

            if (type == '1') {
                // 하루
                const all = getDayjs().subtract(1, 'day');

                const format = all.format(dateFormatStr);
                result = [format, format].join(' ~ ');
            } else if (type == '2') {
                // 한주
                const start = parseInt(tokens[1]) - 1;
                const end = parseInt(tokens[2]) - 1;
                const timeRange = getTimeRangeBasedOnDayOfWeek(
                    getDayjs().valueOf(),
                    start,
                    end
                );
                const startDate = getDayjs(timeRange[0]);
                const endDate = getDayjs(timeRange[1]);
                const diff = endDate.diff(startDate, 'day') + 1;

                result =
                    [
                        startDate.format(dateFormatStr),
                        endDate.format(dateFormatStr),
                    ].join(' ~ ') + ` (${diff} ${this.i18n.day})`;
            } else if (type == '3') {
                // 한달
                const all = getDayjs().subtract(1, 'month');
                const startDate = all.date(1);
                const format = startDate.format(dateFormatStr);
                const endDate = startDate
                    .clone()
                    .add(1, 'month')
                    .subtract(1, 'day');
                const format2 = endDate.format(dateFormatStr);

                result = [format, format2].join(' ~ ');
            } else if (type == '4') {
                // 사용자정의
                const all = getDayjs();
                const start = parseInt(tokens[1]);
                const end = parseInt(tokens[2]);
                const startDate = all.clone().subtract(start, 'day');
                const endDate = all.clone().subtract(end, 'day');
                const format = startDate.format(dateFormatStr);
                const format2 = endDate.format(dateFormatStr);

                result = [format, format2].join(' ~ ');
            }

            return `${result} (${
                this.checkManualDay ? this.i18n.manual : this.i18n.auto
            })`;
        },
        operationTimeText() {
            const manualTokens = this.runTimeValue.split(',');
            const autoTokens = this.buildTime.split(',');
            const isManual = manualTokens[0] == '1';
            let startHour = parseInt(
                isManual ? manualTokens[1] : autoTokens[1]
            );
            let endHour = parseInt(isManual ? manualTokens[2] : autoTokens[2]);
            if (startHour < 10) startHour = `0${startHour}`;
            if (endHour < 10) endHour = `0${endHour}`;

            return `${startHour} ~ ${endHour} (${
                isManual ? this.i18n.manual : this.i18n.auto
            })`;
        },
    },
    data() {
        return {
            i18n: {
                target: i18n.get('ui.label.target'),
                auto: i18n.get('ui.label.template.auto'),
                manual: i18n.get('ui.label.template.manual'),
                searchTerm: i18n.get('ui.label.template.searchTerm'),
                day: i18n.get('ui.label.day'),
                operatingTime: i18n.get('ui.label.template.operatingTime'),
                chartTitle: i18n.get('ui.label.chartTitle'),
                maxRow: i18n.get('ui.label.maxRows'),
                setting: i18n.get('ui.label.setting'),
            },
        };
    },
};
</script>
<style lang="scss" scoped>
@import '../../../../themes';

.search-config-toolbar {
    @include themify($themes) {
        height: 44px;
        line-height: 44px;
        border-radius: 3px;
        padding: 0px 16px;
        color: themed('search-config-toolbar-font-color');
        background-color: themed('search-config-toolbar-background-color');

        > .item {
            display: inline-block;
            font-size: 12px;
            &:not(:last-child) {
                margin-right: 12px;
            }
            &.right {
                float: right;

                > span {
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 3px;
                    &:hover {
                        background-color: themed(
                            'search-config-toolbar-btn-background-color'
                        );
                        color: themed('common-font-color');
                    }
                }
            }
        }
    }
}
</style>
