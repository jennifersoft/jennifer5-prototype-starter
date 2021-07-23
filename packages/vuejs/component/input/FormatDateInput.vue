<template>
    <div
        :class="['date-input-wrapper', size]"
        @keydown.up="increase"
        @keydown.down="decrease"
    >
        <div class="date-field" ref="date-field" v-click-outside="close">
            <div class="field-group">
                <input
                    :value="time.format(formats.year)"
                    class="year-field"
                    maxlength="4"
                    name="year"
                    @focus="onFocus"
                    @blur="onBlur"
                    @click="onClickField"
                />
                <span class="division">-</span>
                <input
                    :value="time.format(formats.month)"
                    maxlength="2"
                    name="month"
                    @focus="onFocus"
                    @blur="onBlur"
                    @click="onClickField"
                />
                <template v-if="!hideDay">
                    <span class="division">-</span>
                    <input
                        :value="time.format(formats.day)"
                        maxlength="2"
                        name="day"
                        @focus="onFocus"
                        @blur="onBlur"
                        @click="onClickField"
                    />
                </template>
            </div>
            <svg-icon
                :icon-type="calendar"
                :width="18"
                :height="18"
                @click.native="toggleCalendar"
            />

            <template v-if="calendarOpened">
                <month-picker
                    v-if="hideDay"
                    ref="month-picker"
                    :date="time"
                    :messages="messages"
                    :offset-top="datepickerOffset"
                    @update:date="onSelectCalendar"
                />
                <date-picker
                    v-else
                    ref="date-picker"
                    :date="time"
                    :messages="messages"
                    :offset-top="datepickerOffset"
                    @update:date="onSelectCalendar"
                />
            </template>
        </div>
        <div v-if="!hideTime" class="time-field">
            <div class="left">
                <div class="field-group" ref="time-field">
                    <input
                        :value="time.format(formats.hour)"
                        maxlength="2"
                        name="hour"
                        @focus="onFocus"
                        @blur="onBlur"
                        @click="onClickField"
                    />
                    <span class="division">:</span>
                    <input
                        :value="time.format(formats.minute)"
                        :disabled="disableMinute"
                        maxlength="2"
                        name="minute"
                        @focus="onFocus"
                        @blur="onBlur"
                        @click="onClickField"
                    />
                </div>
            </div>
            <div class="right">
                <svg-icon :icon-type="accumulators" :width="18" :height="18" />
                <div class="arrow up" @click="onClickArrow('up')"></div>
                <div class="arrow down" @click="onClickArrow('down')"></div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import DatePicker from '@vuejs/component/datePicker/DatePicker';
import MonthPicker from '@vuejs/component/datePicker/MonthPicker';
import clickOutside from '@vuejs/directive/clickOutside';
import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import SizeMixin from '@vuejs/mixin/SizeMixin';

const FORMATS = {
    year: 'YYYY',
    month: 'MM',
    day: 'DD',
    hour: 'HH',
    minute: 'mm',
};
const TIME_RANGE = {
    min: startOfDayjs(
        getDayjs()
            .year(2015)
            .month(0)
            .date(1),
        'date'
    ),
    max: startOfDayjs(
        getDayjs()
            .year(getDayjs().year() + 1)
            .month(0)
            .date(1),
        'date'
    ).minute(-1),
};

function isValid(next) {
    return (
        next.isValid() &&
        next.valueOf() >= TIME_RANGE.min.valueOf() &&
        next.valueOf() <= TIME_RANGE.max.valueOf()
    );
}

export default {
    name: 'FormatDateInput',
    components: { MonthPicker, DatePicker, SvgIcon },
    mixins: [SizeMixin],
    directives: {
        clickOutside,
    },
    props: {
        time: {
            type: Object, // dayjs object
            required: true,
        },
        hideDay: {
            type: Boolean,
            default: false,
        },
        hideTime: {
            type: Boolean,
            default: false,
        },
        hideOnSelect: {
            type: Boolean,
            default: true,
        },
        disableMinute: {
            type: Boolean,
            default: false,
        },
        messages: {
            type: Object,
            default: () => ({
                apply: 'apply',
                cancel: 'cancel',
                dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            }),
            required: true,
            validator(m) {
                return m.apply && m.cancel && m.dayLabels;
            },
        },
    },
    computed: {
        datepickerOffset() {
            return this.size === 'small' ? 32 : 42;
        },
        size() {
            return this.normal ? 'normal' : 'small';
        },
    },
    data() {
        return {
            accumulators: ICON_TYPE.unfoldMore,
            calendar: ICON_TYPE.calendar,
            lastFocusTarget: null,
            calendarOpened: false,
        };
    },
    methods: {
        onFocus({ target }) {
            this.lastFocusTarget = target;
        },
        onBlur({ target }) {
            const { name, value } = target;
            let parsed = parseInt(value);
            if (name === 'month') parsed -= 1;

            // NOTICE: dayjs의 날짜는 기본 get, set에서는 date, add와 subtract에서는 day를 사용한다.
            let converted = name;
            if (name === 'day') converted = 'date';

            const rawInput = this.time[converted](parsed);

            if (!isValid(rawInput)) return;

            if (this.time.valueOf() !== rawInput.valueOf())
                this.$emit('change', rawInput);
        },
        increase() {
            const next = this.time.add(1, this.lastFocusTarget.name);
            if (!this.lastFocusTarget || !isValid(next)) return;
            this.$emit('change', next);
        },
        decrease() {
            const next = this.time.subtract(1, this.lastFocusTarget.name);
            if (!this.lastFocusTarget || !isValid(next)) return;
            this.$emit('change', next);
        },
        toggleCalendar() {
            this.calendarOpened = !this.calendarOpened;
        },
        onSelectCalendar(date) {
            this.$emit(
                'change',
                date.hour(this.time.hour()).minute(this.time.minute())
            );

            const calendarRef = this.$refs[
                this.hideDay ? 'month-picker' : 'date-picker'
            ];
            if (this.hideOnSelect && !!calendarRef) this.calendarOpened = false;
        },
        close() {
            if (this.calendarOpened) this.calendarOpened = false;
        },
        onClickArrow(type) {
            const isTimeField =
                this.lastFocusTarget?.name === 'hour' ||
                this.lastFocusTarget?.name === 'minute';
            if (isTimeField) this.lastFocusTarget.focus();
            else {
                const target = this.$refs['time-field'].children[0];
                target.focus();
            }
            if (type === 'up') this.increase();
            else this.decrease();
        },
        onClickField({ target }) {
            target.select();
        },
    },
    created() {
        this.formats = FORMATS;
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.date-input-wrapper {
    @include themify($themes) {
        display: inline-flex;
        position: relative;
        border: 1px solid themed('border-color');
        border-radius: 2px;
        box-sizing: border-box;
        height: 26px;
        line-height: 1;
        font-size: 12px;
        justify-content: space-between;

        input,
        .colon,
        .division {
            font-family: 'Noto Sans KR';
            color: themed('typography-color-primary');
        }

        &.normal {
            height: 36px;
            font-size: 14px;
            line-height: 36px;
            .date-field,
            .time-field {
                padding: 0 8px;
            }
            input {
                width: 18px;
                &.year-field {
                    width: 36px;
                }
            }
        }

        input {
            border: none;
            outline: none;
            background: none;
            cursor: pointer;
            caret-color: transparent;
            text-align: center;
            width: 14px;
            &:focus {
                background: themed('behaviors-selection-color');
            }
            &::selection {
                background: transparent;
            }
            &.year-field {
                width: 28px;
            }
        }

        .date-field,
        .time-field {
            padding: 0 4px;
            user-select: none;
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            .icon {
                color: themed('icon-color');
                cursor: pointer;
            }
            .field-group {
                display: inline-flex;
                align-items: center;
                margin-right: 8px;
                .division {
                    display: inline-flex;
                    align-items: center;
                }
            }
        }

        .date-field {
            position: relative;
            flex: 1;
        }

        .time-field {
            border-left: 1px solid themed('border-color');
            flex-basis: 35%;

            .left,
            .right {
                display: flex;
                align-items: center;
            }

            .right {
                position: relative;
                .arrow {
                    position: absolute;
                    height: 9px;
                    width: 18px;
                    z-index: 10;
                    cursor: pointer;
                    &.up {
                        bottom: 9px;
                    }
                    &.down {
                        top: 9px;
                    }
                }
            }
        }
    }
}
</style>
