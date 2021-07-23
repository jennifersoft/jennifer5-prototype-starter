<template>
    <popup-wrapper
        @prev="onClickPrev"
        @next="onClickNext"
        :style="
            type !== 'inline' && {
                top: offsetTop + 'px',
                left: offsetLeft + 'px',
            }
        "
        :type="type"
    >
        <template #title>
            <span>{{ title }}</span>
        </template>
        <template #calendar>
            <transition :name="animationName" mode="out-in">
                <table
                    class="datepicker-wrapper"
                    :class="type"
                    :key="refDate.month()"
                >
                    <thead>
                        <tr>
                            <th
                                v-for="(message, i) in messages.dayLabels"
                                :key="i"
                            >
                                {{ message }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(week, i) in dates" :key="i">
                            <cell
                                v-for="(day, j) in week"
                                :value="day"
                                :key="j"
                                :is-today="day.valueOf() === today.valueOf()"
                                :is-this-month="day.month() === refDate.month()"
                                :primary="
                                    day.month() === refDate.month() &&
                                        (day.valueOf() === selected.valueOf() ||
                                            day.valueOf() ===
                                                selected
                                                    .add(selectCount - 1, 'day')
                                                    .valueOf())
                                "
                                :disabled="
                                    (preventFuture &&
                                        day.valueOf() > today.valueOf()) ||
                                        !isSelectable(day)
                                "
                                :secondary="
                                    day.month() === refDate.month() &&
                                        day.valueOf() > selected.valueOf() &&
                                        day.valueOf() <
                                            selected
                                                .add(selectCount, 'day')
                                                .valueOf()
                                "
                                @click="onSelectDate(day)"
                            />
                        </tr>
                    </tbody>
                </table>
            </transition>
        </template>
    </popup-wrapper>
</template>

<script>
import PopupWrapper from '@vuejs/component/datePicker/PopupWrapper';
import Cell from '@vuejs/component/datePicker/Cell';
import { getDayjs } from '@common/base';
import { endOfDayjs, startOfDayjs } from '@common/dayjsWrapper';

export default {
    name: 'DatePicker',
    components: {
        Cell,
        PopupWrapper,
    },
    props: {
        date: {
            type: Object, // dayjs Object
            required: true,
        },
        type: {
            type: String,
            default: 'single',
            validator: type => ['single', 'inline'].indexOf(type) !== -1,
        },
        preventFuture: {
            type: Boolean,
            default: false,
        },
        onlySelectDay: {
            type: Number,
            default: undefined,
            validator: day => [...Array(7).keys()].indexOf(day) !== -1,
        },
        onlySelectDate: {
            type: Number,
            default: undefined,
            validator: date =>
                [...Array(32).keys()].slice(1).indexOf(date) !== -1,
        },
        selectCount: {
            type: Number,
            default: 1,
        },
        offsetTop: {
            type: Number,
            default: 0,
        },
        offsetLeft: {
            type: Number,
            default: 0,
        },
        messages: {
            type: Object,
            default: () => ({
                apply: '적용',
                cancel: '취소',
                dayLabels: ['일', '월', '화', '수', '목', '금', '토'],
            }),
            required: true,
            validator(m) {
                return m.apply && m.cancel && m.dayLabels;
            },
        },
        animate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            refDate: startOfDayjs(this.date, 'date'),
            selected: startOfDayjs(this.date, 'date'),
            today: startOfDayjs(getDayjs(), 'date'),
            moveDirection: 'right',
        };
    },
    computed: {
        title() {
            return this.refDate.format('YYYY.MM');
        },
        startOfMonth() {
            return startOfDayjs(this.refDate, 'month');
        },
        endOfMonth() {
            return startOfDayjs(endOfDayjs(this.refDate, 'month'), 'date');
        },
        dates() {
            const ret = [];
            const dayOffset = this.startOfMonth.day();
            const date = startOfDayjs(this.startOfMonth, 'week');
            for (
                let week = 0;
                week < Math.ceil((dayOffset + this.endOfMonth.date()) / 7);
                week++
            ) {
                const row = [];
                for (let day = 0; day < 7; day++) {
                    row.push(date.add(week, 'week').add(day, 'day'));
                }
                ret.push(row);
            }
            return ret;
        },
        animationName() {
            return this.animate ? `slide-${this.moveDirection}` : '';
        },
    },
    methods: {
        onSelectDate(date) {
            this.selected = date;
            this.$emit('update:date', date);
        },
        onClickPrev() {
            this.refDate = this.refDate.subtract(1, 'month');
            this.moveDirection = 'right';
            this.$emit('prev', this.refDate);
        },
        onClickNext() {
            this.refDate = this.refDate.add(1, 'month');
            this.moveDirection = 'left';
            this.$emit('next', this.refDate);
        },
        isSelectable(date) {
            let flag = true;
            if (this.onlySelectDay !== undefined)
                flag &= this.onlySelectDay === date.day();
            if (this.onlySelectDate !== undefined)
                flag &= this.onlySelectDate === date.date();
            return flag;
        },
    },
    beforeMount() {
        this.onSelectDate(this.selected);
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.datepicker-wrapper {
    @include themify($themes) {
        box-sizing: border-box;
        border-collapse: collapse;
        width: 100%;
        th {
            width: 38px;
            height: 24px;
            line-height: 22px;
            box-sizing: border-box;
            font-size: 11px;
            font-weight: normal;
            text-align: center;
            overflow-x: hidden;
            user-select: none;
            color: themed('typography-color-grey1');
        }

        td {
            height: 38px;
        }

        &.inline {
            height: calc(100% - 27px);
            th {
                width: 32px;
            }
            td {
                height: unset;
            }
        }
    }
}
.slide-right-leave-to,
.slide-left-leave-to {
    opacity: 0;
}

.slide-right-leave-to,
.slide-left-enter {
    transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter {
    transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-leave-active,
.slide-left-enter-active {
    transition: opacity 0.1s, transform 0.18s;
}
</style>
