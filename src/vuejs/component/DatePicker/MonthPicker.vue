<template>
    <popup-wrapper
        @prev="onClickPrev"
        @next="onClickNext"
        :style="{ top: offsetTop + 'px', left: offsetLeft + 'px' }"
        :type="type"
    >
        <template #title>
            <span>{{ title }}</span>
        </template>
        <template #calendar>
            <transition :name="animationName" mode="out-in">
                <table
                    class="month-picker-wrapper"
                    :class="type"
                    :key="refDate.year()"
                >
                    <thead>
                        <tr>
                            <th v-for="(_, j) in [...Array(3)]" :key="j"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in months" :key="i">
                            <cell
                                v-for="(month, j) in row"
                                :key="j"
                                :value="month"
                                :is-today="
                                    month.valueOf() === thisMonth.valueOf()
                                "
                                :type="'month'"
                                :primary="
                                    month.valueOf() === selected.valueOf()
                                "
                                :disabled="
                                    preventFuture &&
                                        month.valueOf() > thisMonth.valueOf()
                                "
                                @click="onSelectMonth(month)"
                            />
                        </tr>
                    </tbody>
                </table>
            </transition>
        </template>
    </popup-wrapper>
</template>

<script>
import PopupWrapper from '@vuejs/component/DatePicker/PopupWrapper';
import { getDayjs } from '@common/base';
import Cell from '@vuejs/component/DatePicker/Cell';
import { startOfDayjs } from '@common/dayjsWrapper';

export default {
    name: 'MonthPicker',
    components: {
        PopupWrapper,
        Cell,
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
        offsetTop: {
            type: Number,
            default: 0,
        },
        offsetLeft: {
            type: Number,
            default: 0,
        },
        animate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            refDate: startOfDayjs(this.date, 'month'),
            thisMonth: startOfDayjs(getDayjs(), 'month'),
            moveDirection: 'right',
        };
    },
    computed: {
        selected() {
            return startOfDayjs(this.date, 'month');
        },
        title() {
            return this.refDate.format('YYYY');
        },
        months() {
            const ret = [];
            const month = startOfDayjs(this.refDate, 'year');
            for (let i = 0; i < 4; i++) {
                const row = [];
                for (let j = 0; j < 3; j++) {
                    row.push(month.month(i * 3 + j));
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
        onClickPrev() {
            this.refDate = this.refDate.subtract(1, 'year');
            this.moveDirection = 'right';
        },
        onClickNext() {
            this.refDate = this.refDate.add(1, 'year');
            this.moveDirection = 'left';
        },
        onSelectMonth(month) {
            this.refDate = month;
            this.$emit('update:date', month);
        },
    },
    beforeMount() {
        this.onSelectMonth(this.refDate);
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.month-picker-wrapper {
    @include themify($themes) {
        box-sizing: border-box;
        border-collapse: collapse;
        width: 100%;
        th {
            height: 0;
            padding: 0;
        }

        td {
            height: 40px;
        }

        &.inline {
            height: calc(100% - 27px);
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
