<template>
    <div :class="['tab-wrapper', borderClass, { flexible, animate }]">
        <ul
            class="tab-container"
            ref="tabRef"
            tabindex="0"
            @focus="onFocusAscendant"
            @keydown.left.prevent="selectPrev"
            @keydown.up.prevent="selectPrev"
            @keydown.right.prevent="selectNext"
            @keydown.down.prevent="selectNext"
            @keydown.space.prevent="onTabChange(tabs[focusIndex], focusIndex)"
        >
            <li
                v-for="(tab, i) in tabs"
                :key="i"
                :class="[
                    'tab-item',
                    size,
                    borderClass,
                    tab.key === activeTab ? 'active' : 'default',
                    { disabled: tab.disabled },
                ]"
                @mousedown.prevent="onTabChange(tab, i)"
                @mouseover="onMouseOver(tab)"
                @mouseleave="onMouseLeave"
                @blur="onBlur"
                tabindex="-1"
            >
                <tooltip-balloon
                    v-if="
                        tab.tooltipMessage !== undefined &&
                            tab.tooltipMessage !== '' &&
                            showTooltip
                    "
                    :style="tooltipStyles"
                    cursor-none
                >
                    {{ tab.tooltipMessage }}
                </tooltip-balloon>
                <span class="text">
                    {{ tab.value }}
                </span>
                <badge
                    v-if="tab.caption !== undefined"
                    style="margin-left: 4px;"
                    :type="badgeProps(tab.caption).type"
                    :value="badgeProps(tab.caption).value"
                />
            </li>
        </ul>
        <div
            v-if="borderPosition !== 'none' && animate"
            class="indicator"
            ref="indicatorRef"
        ></div>
    </div>
</template>

<script>
import Badge from '@vuejs/component/label/Badge';
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';
import { tooltipStyle } from '@vuejs/component/tooltip/Tooltip';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'Tab',
    mixins: [SizeMixin],
    components: {
        TooltipBalloon,
        Badge,
    },
    props: {
        tabs: {
            type: Array,
            required: true,
        },
        activeTab: {
            type: String,
            required: false, // key of active tab object
        },
        borderPosition: {
            type: String,
            validator: b => ['top', 'bottom', 'none'].indexOf(b) !== -1,
            default: 'bottom',
        },
        tooltipPosition: {
            type: String,
            default: 'top-center',
        },
        flexible: {
            type: Boolean,
            default: false,
        },
        animate: {
            type: Boolean,
            default: true,
        },
        delay: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        borderClass() {
            return 'border-' + this.borderPosition;
        },
        activeIndex() {
            return this.activeTab
                ? this.tabs.findIndex(t => t.key === this.activeTab)
                : -1;
        },
        tooltipStyles() {
            return tooltipStyle(this.tooltipPosition, 0);
        },
    },
    watch: {
        tabs: {
            handler(next) {
                //사용자 정의 대시보드 편집화면에서 tabs가 변경될때가 있음. (비즈니스가 빠질때가 있음)
                //이때 $nextTick를 써야 계산을 정확히 함.
                this.$nextTick(() => {
                    if (next.length > 0) {
                        this.moveIndicator(this.activeIndex);
                    }
                });
            },
        },
        activeTab(next, prev) {
            if (prev !== next) {
                const index = this.tabs.findIndex(t => t.key === next);
                this.moveIndicator(index);
            }
        },
    },
    data() {
        return {
            focusIndex: 0,
            showTooltip: false,
        };
    },
    methods: {
        moveIndicator(index) {
            if (!this.$refs.tabRef || index < 0) return;
            if (this.animate && this.borderPosition !== 'none') {
                const { offsetLeft, clientWidth } = this.$refs.tabRef.children[
                    index
                ];
                const indicator = this.$refs['indicatorRef'];
                indicator.style.left = offsetLeft + 'px';
                indicator.style.width = clientWidth + 'px';
            }
        },
        onTabChange(tab, i) {
            if (tab.disabled) return;
            this.$emit('change', tab.key);
            this.focusIndex = i;
        },
        selectPrev() {
            let prevIndex = this.focusIndex - 1;
            if (prevIndex < 0) prevIndex = this.tabs.length - 1;

            const prevItem = this.$refs['tabRef'].children[prevIndex];
            prevItem.focus();
            this.focusIndex = prevIndex;
        },
        selectNext() {
            let nextIndex = this.focusIndex + 1;
            if (nextIndex >= this.tabs.length) nextIndex = 0;

            const nextItem = this.$refs['tabRef'].children[nextIndex];
            nextItem.focus();
            this.focusIndex = nextIndex;
        },
        onFocusAscendant() {
            const lastFocused = this.$refs['tabRef'].children[this.focusIndex];
            lastFocused.focus();
        },
        onBlur() {
            this.focusIndex = this.activeIndex;
        },
        badgeProps(value) {
            let type;
            switch (value) {
                case 'unknown':
                    type = 'warning';
                    break;
                case 0:
                    type = 'secondary';
                    break;
                default:
                    type = 'primary';
                    break;
            }

            return {
                value: value === 'unknown' ? '!' : value,
                type,
            };
        },
        onMouseOver(tab) {
            if (tab.tooltipMessage !== undefined && tab.tooltipMessage !== '')
                this.showTooltip = true;
        },
        onMouseLeave() {
            if (this.showTooltip) this.showTooltip = false;
        },
    },
    mounted() {
        if (this.activeIndex > -1) {
            this.onTabChange(this.tabs[this.activeIndex], this.activeIndex);
            setTimeout(() => this.moveIndicator(this.activeIndex), this.delay);
        }
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
@mixin size($h, $p, $f) {
    height: $h + px;
    padding: 0 $p + px;
    font-size: $f + px;
    line-height: $h + px;
}
.tab-wrapper {
    @include themify($themes) {
        position: relative;
        font-weight: bold;
        pointer-events: none;

        &:not(.animate) {
            &.border-bottom .tab-item.active {
                border-bottom: 2px solid themed('background-color-purple');
            }
            &.border-top .tab-item.active {
                border-top: 2px solid themed('background-color-purple');
            }
        }

        &.border-top {
            border-top: 1px solid themed('tab-border-bottom-color');
            .indicator {
                top: 0;
            }
        }

        &.border-bottom {
            border-bottom: 1px solid themed('tab-border-bottom-color');
            .indicator {
                bottom: 0;
            }
        }

        .tab-container {
            padding: 0;
            margin: 0;
            outline: none;
        }

        .tab-item {
            pointer-events: initial;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            color: themed('typography-color-grey1');

            &.large {
                @include size(66, 20, 16);
            }

            &.normal {
                @include size(46, 17, 14);
            }

            &.small {
                @include size(32, 10, 12);
            }

            &:hover:not(.disabled):not(.active) {
                color: themed('typography-color-primary');
            }

            &:focus {
                outline: 1px solid themed('background-color-purple');
            }

            &.active {
                color: themed('typography-color-purple');
            }

            &.disabled {
                .text {
                    opacity: 0.5;
                }
                cursor: default;
                &:active {
                    pointer-events: inherit;
                }
            }
        }

        .indicator {
            position: absolute;
            left: 0;
            border: none;
            height: 2px;
            background-color: themed('background-color-purple');
            transition: width 0.25s, left 0.25s;
        }

        &.flexible {
            .tab-container {
                display: flex;
                .tab-item {
                    flex: 1;
                    text-align: center;
                }
            }
        }
    }
}
</style>
