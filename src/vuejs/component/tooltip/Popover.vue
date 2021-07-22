<template>
    <div class="popover-wrapper" ref="r">
        <div
            style="display: inline;"
            @mouseover="onMouseover"
            @mouseleave="onMouseleave"
        >
            <slot></slot>
        </div>
        <transition :name="animate && 'appear'">
            <div
                class="popover-balloon"
                v-if="isActive"
                :style="tooltipPosition"
            >
                <div class="title" v-if="title">
                    {{ title }}
                </div>
                <div class="content">
                    {{ content }}
                </div>
                <span
                    class="triangle"
                    v-if="!cursorNone"
                    :class="cursorPosition"
                ></span>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Popover',
    props: {
        content: {
            type: String,
            required: true,
            default: '',
        },
        title: {
            type: String,
            default: undefined,
        },
        offset: {
            type: Number,
            default: 10,
        },
        width: {
            type: Number,
            default: 358,
        },
        position: {
            type: String,
            default: 'right',
            validator(p) {
                return (
                    [
                        'top-left',
                        'top-center',
                        'top-right',
                        'bottom-left',
                        'bottom-center',
                        'bottom-right',
                        'right',
                        'left',
                    ].indexOf(p) !== -1
                );
            },
        },
        cursorNone: {
            type: Boolean,
            default: false,
        },
        showPopover: {
            type: Boolean,
            default: undefined, // set on mouseover by default
        },
        delay: {
            type: Number, // ms
            default: undefined, // work if showTooltip is undefined
            validator(d) {
                return d > 0;
            },
        },
        animate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            active: false,
            timer: null,
        };
    },
    computed: {
        cursorOffset() {
            return this.cursorNone ? this.offset : this.offset + 8;
        },
        tooltipPosition() {
            let ret = {};
            const [vert, hori = undefined] = this.position.split('-');

            if (vert === 'top')
                ret.bottom = `calc(100% + ${this.cursorOffset}px)`;
            else if (vert === 'bottom')
                ret.top = `calc(100% + ${this.cursorOffset}px)`;
            else {
                ret.top = '-25%';

                if (vert === 'left')
                    ret.right = `calc(100% + ${this.cursorOffset}px)`;
                else ret.left = `calc(100% + ${this.cursorOffset}px)`;

                return ret;
            }

            if (hori === 'left') ret.left = 0;
            else if (hori === 'right') ret.right = 0;
            else {
                ret.left = `calc(50% - ${this.width / 2}px)`;
            }

            return ret;
        },
        cursorPosition() {
            const [vert, hori = undefined] = this.position.split('-');

            if (vert === 'top' || vert === 'bottom') return [vert, hori];
            return ['side', vert];
        },
        isActive() {
            return this.showPopover !== undefined
                ? this.showPopover
                : this.active;
        },
    },
    watch: {
        active(next) {
            if (next === true && this.delay !== undefined) {
                this.timer = setTimeout(() => {
                    this.active = false;
                    clearTimeout(this.timer);
                }, this.delay);
            }
        },
    },
    methods: {
        onMouseover() {
            this.active = true;
        },
        onMouseleave() {
            if (this.timer) return;
            this.active = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.popover-wrapper {
    @include themify($themes) {
        display: inline-flex;
        width: max-content;
        position: relative;
        .popover-balloon {
            display: inline-block;
            width: max-content;
            max-width: 358px;
            box-sizing: border-box;
            position: absolute;
            z-index: 1000;
            font-size: 14px;
            padding: 24px;
            border-radius: 8px;
            background-color: themed('window-background-color');
            color: themed('typography-color-primary');
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))
                drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));

            .title {
                margin-bottom: 23px;
                font-weight: bold;
                font-size: 16px;
            }

            .triangle {
                position: absolute;
                display: inline-block;
                width: 0;
                height: 0;
                border: 8px solid themed('window-background-color');

                &:not(.side) {
                    border-left-color: transparent;
                    border-right-color: transparent;
                    &.top {
                        bottom: -8px;
                        border-bottom-width: 0;
                    }

                    &.bottom {
                        top: -8px;
                        border-top-width: 0;
                    }

                    &.center {
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    &.left {
                        left: 8%;
                    }

                    &.right {
                        right: 8%;
                    }
                }

                &.side {
                    top: 15%;
                    border-top-color: transparent;
                    border-bottom-color: transparent;
                    &.left {
                        right: -8px;
                        border-right-width: 0;
                    }

                    &.right {
                        left: -8px;
                        border-left-width: 0;
                    }
                }
            }
        }
    }

    .appear-enter-active {
        animation: bounce 0.2s;
    }

    .appear-leave-active {
        animation: bounce 0.15s reverse;
    }

    @keyframes bounce {
        0% {
            transform: scale(0.9);
        }
        80% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
}
</style>
