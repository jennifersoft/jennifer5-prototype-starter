<template>
    <div class="tooltip-balloon" :style="styles">
        <slot />
        <span
            class="triangle"
            v-if="!cursorNone"
            :class="cursorPosition"
        ></span>
    </div>
</template>

<script>
export default {
    name: 'TooltipBalloon',
    props: {
        position: {
            type: String,
            default: 'center-right',
            validator(p) {
                return (
                    [
                        'top-left',
                        'top-center',
                        'top-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right',
                        'center-right',
                        'center-left',
                    ].indexOf(p) !== -1
                );
            },
        },
        cursorNone: {
            type: Boolean,
            default: false,
        },
        backgroundColor: {
            type: String,
            default: () => 'rgba(0, 0, 0, 0.75)',
        },
        width: {
            type: Number,
            default: undefined,
        },
    },
    computed: {
        cursorPosition() {
            const [vert, hori] = this.position.split('-');

            if (vert === 'top' || vert === 'bottom') return [vert, hori];
            return hori;
        },
        styles() {
            const width = this.width ? this.width + 'px' : 'max-content';
            const backgroundColor = this.backgroundColor;
            return {
                '--tooltip-width': width,
                '--tooltip-background-color': backgroundColor,
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.tooltip-balloon {
    display: inline-block;
    box-sizing: border-box;
    width: var(--tooltip-width);
    white-space: normal;
    word-break: break-all;
    user-select: none;
    position: absolute;
    z-index: 1000;
    line-height: 16px;
    font-size: 11px;
    font-weight: normal;
    padding: 4px 8px;
    border-radius: 3px;
    background: var(--tooltip-background-color);
    color: #fff;
    .triangle {
        position: absolute;
        display: inline-block;
        width: 0;
        height: 0;
        border: 4px solid var(--tooltip-background-color);
        &.top {
            bottom: -4px;
            border-bottom-width: 0;
            left: 50%;
            transform: translateX(-50%);
            border-left-color: transparent;
            border-right-color: transparent;
        }
        &.bottom {
            top: -4px;
            border-top-width: 0;
        }

        &.top,
        &.bottom {
            left: 50%;
            transform: translateX(-50%);
            border-left-color: transparent;
            border-right-color: transparent;
            &.right {
                left: unset;
                transform: unset;
                right: 15%;
            }
            &.left {
                left: 15%;
            }
        }

        &:not(.left):not(.right) {
            left: 50%;
            transform: translateX(-50%);
            border-left-color: transparent;
            border-right-color: transparent;
        }

        &:not(.top):not(.bottom) {
            top: 50%;
            transform: translateY(-50%);
            border-top-color: transparent;
            border-bottom-color: transparent;

            &.left {
                right: -4px;
                border-right-width: 0;
            }
            &.right {
                left: -4px;
                border-left-width: 0;
            }
        }
    }
}
</style>
