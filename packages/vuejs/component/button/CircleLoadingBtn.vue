<template>
    <div class="aries-ui-circle-loading-btn" :class="[size]">
        <div
            v-if="!disabled && (loading || progress < 1)"
            class="loading-layer"
            :class="{ suspendible }"
            :style="cssValues"
            @mouseover="onMouseover"
            @mouseleave="onMouseleave"
        >
            <svg
                class="circle-loading-svg"
                :class="`${type}-circle`"
                :width="radius * 2"
                :height="radius * 2"
            >
                <circle
                    v-if="type === 'progress'"
                    class="gauge-background"
                    :r="normalizedRadius"
                    :cx="radius"
                    :cy="radius"
                    :stroke-width="stroke"
                    stroke="black"
                    fill="transparent"
                />
                <circle
                    class="gauge-fill"
                    :r="normalizedRadius"
                    :cx="radius"
                    :cy="radius"
                    :stroke-width="stroke"
                    stroke="black"
                    :stroke-dasharray="strokeDasharray"
                    :stroke-dashoffset="strokeDashoffset"
                    fill="transparent"
                />
            </svg>
            <svg-icon
                v-if="stopActive"
                class="stop-btn"
                :icon-type="closeIcon"
                :width="iconSize"
                :height="iconSize"
                @click.native="onClickStopSearch"
            />
            <tooltip-balloon
                v-if="stopActive && !!i18n.M0629"
                position="bottom-right"
                cursor-none
                :style="tooltipOptions"
            >
                {{ i18n.M0629 }}
            </tooltip-balloon>
        </div>
        <div
            v-else
            class="default-btn"
            :class="{ disabled }"
            @click="onClickSearch"
        >
            <svg-icon
                :icon-type="searchIcon"
                :width="iconSize"
                :height="iconSize"
            />
        </div>
    </div>
</template>

<script>
import LoadingBtnMixin from '@vuejs/mixin/LoadingBtnMixin';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';
import { tooltipStyle } from '@vuejs/component/tooltip/Tooltip';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'CircleLoading',
    inject: {
        i18n: {
            default: () => ({
                M0629: 'Stop searching at this point',
            }),
        },
    },
    components: {
        TooltipBalloon,
        SvgIcon,
    },
    mixins: [SizeMixin, LoadingBtnMixin],
    props: {
        stroke: {
            type: Number,
            default: 2,
        },
        type: {
            type: String,
            default: 'progress',
            validator(t) {
                return ['progress', 'loading'].includes(t);
            },
        },
        loading: {
            type: Boolean,
            default: undefined,
        },
    },
    computed: {
        radius() {
            return this.small ? 9 : this.large ? 17 : 13;
        },
        iconSize() {
            return this.small ? 16 : this.large ? 24 : 20;
        },
        normalizedRadius() {
            return this.radius - this.stroke / 2;
        },
        circumference() {
            return this.normalizedRadius * 2 * Math.PI;
        },
        strokeDasharray() {
            if (this.type === 'loading') return this.circumference;
            return `${this.circumference * this.progress} ${this.circumference *
                (1 - this.progress)}`;
        },
        strokeDashoffset() {
            if (this.type === 'loading') return null;
            return this.circumference / 4;
        },
        tooltipOptions() {
            const position = 'bottom-right';
            return tooltipStyle(position);
        },
        cssValues() {
            return {
                '--diameter': this.normalizedRadius * 2 + 'px',
            };
        },
    },
    created() {
        this.searchIcon = ICON_TYPE.search;
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';

.aries-ui-circle-loading-btn {
    @include themify($themes) {
        display: inline-flex;
        align-items: center;
        border-radius: 3px;
        height: 36px;
        min-width: 36px;

        &.small {
            height: 26px;
            min-width: 26px;
            .default-btn {
                padding: 0 5px;
            }
            .loading-layer {
                padding: 0 4px;
            }
        }

        &.large {
            height: 46px;
            min-width: 46px;
            .default-btn {
                padding: 0 11px;
            }
            .loading-layer {
                padding: 0 6px;
            }
        }

        .icon {
            color: themed('typography-color-grey1');
        }

        .loading-layer,
        .default-btn {
            position: relative;
            height: inherit;
            border-radius: inherit;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .loading-layer {
            padding: 0 5px;
            .circle-loading-svg {
                .gauge-background {
                    stroke: #{themed('slider-background-color')};
                }

                .gauge-fill {
                    stroke: #{themed('toggle-border-color-on')};
                    stroke-linecap: round;
                }

                &.loading-circle {
                    .gauge-fill {
                        transform-origin: calc(0.5px * var(--diameter))
                            calc(0.5px * var(--diameter)) 0;
                        animation: dash 2s linear infinite;
                    }
                }

                &.progress-circle > .gauge-fill {
                    transition: stroke-dasharray 0.2s;
                }
            }

            .stop-btn {
                position: absolute;
                z-index: 10;
            }

            &:not(.suspendible) {
                pointer-events: none;
            }
        }

        .default-btn {
            padding: 0 8px;
            &.disabled {
                background: themed('background-color-none') !important;
                opacity: 0.5;
                cursor: default;
                pointer-events: none;
            }
        }
    }

    @keyframes dash {
        0% {
            transform: rotate(0deg);
            stroke-dashoffset: calc(0.66 * var(--diameter));
        }
        50% {
            transform: rotate(720deg);
            stroke-dashoffset: calc(3.14 * var(--diameter));
        }
        100% {
            transform: rotate(1080deg);
            stroke-dashoffset: calc(0.66 * var(--diameter));
        }
    }

    @import '~@vuejs/style/hover-and-active.scss';
    .loading-layer,
    .default-btn {
        @include hover-and-active;
    }
}
</style>
