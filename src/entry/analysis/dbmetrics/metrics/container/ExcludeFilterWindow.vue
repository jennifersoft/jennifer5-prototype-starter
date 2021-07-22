<template>
    <window
        class="exclude-filter-window"
        animation-name="fade-down"
        :messages="messages"
        :open-x="openX - 140"
        :open-y="openY"
        :open-w="280"
        :draggable="false"
        @apply="onChangeExcludes"
        @cancel="$emit('cancel')"
    >
        <template #subject>
            {{ i18n.excludeDates }}
        </template>
        <div>
            <div class="checkbox-group">
                <div class="title">
                    <span>{{ i18n.excludeDates }}</span>
                </div>
                <option-group
                    type="checkbox"
                    :options="checkboxes"
                    :active="excludeDays"
                    @change="onChangeExcludeDays"
                />
            </div>
            <div class="checkbox-group">
                <div class="title">{{ i18n.duringTerm }}</div>
                <option-group
                    type="checkbox"
                    :options="excludeDatesWithLabel"
                    :active="excludeDates.map(d => d.valueOf())"
                    @change="onChangeExcludeDates"
                />
            </div>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import OptionGroup from '@vuejs/component/Toggle/OptionGroup';
import dayjs from '@library/dayjs';
import { mapState, mapGetters, mapMutations } from '../store';
export default {
    name: 'ExcludeFilterWindow',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                excludeDates: 'excludeDates',
                weekend: 'weekend',
                duringTerm: 'duringTerm',
                saturday: 'saturday',
                sunday: 'sunday',
                apply: 'confirm',
                cancel: 'cancel',
            }),
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
        Window,
        OptionGroup,
    },
    data() {
        return { excludeDates: [], excludeDays: [] };
    },
    computed: {
        ...mapGetters(['excludeDatesDuringTerm']),
        excludeDatesWithLabel() {
            return this.excludeDatesDuringTerm.map(d => ({
                label: d.format('YYYY-MM-DD'),
                value: d.valueOf(),
                color: this.getLabelColor(d),
            }));
        },
    },
    methods: {
        ...mapMutations(['updateExcludes']),
        onChangeExcludes() {
            this.updateExcludes(
                this.excludeDates.map(e => e.format('YYYYMMDD'))
            );
            this.$emit('apply');
        },
        onChangeExcludeDays(days) {
            for (const day of this.excludeDays) {
                if (days.includes(day)) {
                    this.excludeDates.push(
                        ...this.excludeDatesDuringTerm.filter(
                            d => d.day() === day
                        )
                    );
                } else
                    this.excludeDates = this.excludeDates.filter(
                        d => d.day() !== day
                    );
            }

            this.excludeDays = days;
        },
        onChangeExcludeDates(list) {
            this.excludeDates = list.map(l => dayjs(l));
        },
        getLabelColor(d) {
            switch (d.day()) {
                case 0:
                    return '#fe3b4d';
                case 6:
                    return '#0081ff';
                default:
                    return undefined;
            }
        },
    },
    created() {
        this.messages = { apply: this.i18n.apply, cancel: this.i18n.cancel };
        this.checkboxes = [
            { label: this.i18n.saturday, value: 6 },
            { label: this.i18n.sunday, value: 0 },
        ];
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
    ),
    dark: (
        border-color: #4e4e4e,
    ),
);
.exclude-filter-window {
    @include themify($themes) {
        .checkbox-group {
            .title {
                margin: 12px 0;
            }
            &:last-child {
                margin-top: 16px;
                border-top: 1px solid themed('border-color');
                > :last-child {
                    max-height: 180px;
                    width: 100%;
                    overflow-y: auto;
                }
            }
        }
    }
}
</style>
