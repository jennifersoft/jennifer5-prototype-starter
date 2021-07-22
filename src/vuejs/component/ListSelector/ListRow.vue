<template>
    <div
        v-tooltip="{
            content: listRow.description,
            isScrolling: isScrolling,
            tooltipOnLeft: tooltipOnLeft,
        }"
        class="list-row"
        :class="{ selected: selected || checked, tail: tailStyle, checkable }"
        @click="clickHandler"
    >
        <checkbox v-if="checkable" :active="checked" :disabled="!checkable" />
        <span class="list-row-label" v-html="listRow.label"></span>
    </div>
</template>

<script>
import Checkbox from '@vuejs/component/Toggle/Checkbox.vue';
import VTooltip from './vTooltip';

export default {
    components: {
        Checkbox,
    },
    directives: {
        tooltip: VTooltip,
    },
    props: {
        listRow: {
            type: Object,
            required: true,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        checkable: {
            type: Boolean,
            default: false,
        },
        tailStyle: {
            type: Boolean,
            default: false,
        },
        index: {
            type: Number,
        },
        tooltipOnLeft: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            isScrolling: false,
            timer: null,
        };
    },
    computed: {
        checked() {
            return this.listRow.check === 'on';
        },
    },
    mounted() {
        document
            .querySelector('.list-container')
            .addEventListener('scroll', () => {
                this.isScrolling = true;

                if (this.timer !== null) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    this.isScrolling = false;
                }, 1000);
            });
    },
    methods: {
        clickHandler() {
            if (!this.checkable) {
                this.$emit('click');
                return;
            }
            this.$emit('checkClicked');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
$border-radius: 4px;

.list-row {
    @include themify($themes) {
        display: flex;
        align-content: center;
        transition: 0.2s;
        transition-property: background-color, color, $border-radius;
        cursor: pointer;
        box-sizing: border-box;
        height: 24px;
        padding: 4px 6px;

        color: themed('typography-color-grey1');
        &:hover {
            background: themed('behaviors-hover-color');
            color: themed('typography-color-primary');
        }
        &.selected {
            color: themed('typography-color-purple');
            background: themed('background-color-lightpurple');
        }
    }
}

.list-row-label {
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
}
</style>

<style lang="scss">
.tooltip {
    font-size: 11px;
    color: #d5d5d5;
}

.tooltip {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        border-radius: 3px;
        padding: 4px 8px;
        max-width: 200px;
    }

    &[x-placement^='right'] {
        margin-left: 10px;
    }

    &[x-placement^='left'] {
        margin-right: 10px;
    }

    &[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.15s, visibility 0.15s;
    }

    &[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.15s;
    }
}
</style>
