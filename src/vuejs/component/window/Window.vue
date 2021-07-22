<template>
    <transition :name="animationName" appear>
        <div
            :class="['aries-ui-window', { draggable }, { resizable }]"
            :style="stylesFromProps"
            ref="window"
        >
            <div
                class="handle top left"
                style="cursor: nw-resize"
                @mousedown="onResizeStart(true, false, true)"
            ></div>
            <div
                class="handle top center"
                style="cursor: n-resize"
                @mousedown="onResizeStart(false, false, true)"
            ></div>
            <div
                class="handle top right"
                style="cursor: ne-resize"
                @mousedown="onResizeStart(false, true, true)"
            ></div>
            <div
                class="handle middle right"
                style="cursor: e-resize"
                @mousedown="onResizeStart(false, true)"
            ></div>
            <div
                class="handle bottom right"
                style="cursor: se-resize"
                @mousedown="onResizeStart(false, true, false, true)"
            ></div>
            <div
                class="handle bottom center"
                style="cursor: s-resize"
                @mousedown="onResizeStart(false, false, false, true)"
            ></div>
            <div
                class="handle bottom left"
                style="cursor: sw-resize"
                @mousedown="onResizeStart(true, false, false, true)"
            ></div>
            <div
                class="handle middle left"
                style="cursor: w-resize"
                @mousedown="onResizeStart(true)"
            ></div>
            <div
                class="head"
                v-if="!!$slots.subject || closeBtnType !== 'none'"
                :class="{ grap: !!dragging }"
                @mousedown="onDragStart"
            >
                <div class="icons">
                    <slot name="icons" />
                    <btn
                        v-if="closeBtnType !== 'none'"
                        :items="[{ iconType: closeBtnType }]"
                        class="close-icon transparent"
                        @mousedown.native.stop
                        @click="close"
                    />
                </div>
            </div>
            <div class="body">
                <div class="title">
                    <slot name="subject" />
                </div>
                <div class="subtitle" v-if="!!$slots.subtitle">
                    <slot name="subtitle" />
                </div>
                <div class="content">
                    <slot />
                </div>
            </div>
            <div class="foot" v-if="!hideFooter">
                <slot name="tools" />
                <btn
                    v-if="!hideCancelBtn"
                    :items="[{ text: messages.cancel }]"
                    normal
                    class="cancel transparent"
                    @click="cancel"
                />
                <btn
                    :items="[{ text: messages.apply }]"
                    normal
                    class="apply transparent"
                    :class="applyBtnType"
                    @click="apply"
                />
            </div>
        </div>
    </transition>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import _ from '@library/lodash';

const THROTTLE_INTERVAL = 16;

export default {
    name: 'Window',
    components: { Btn, SvgIcon },
    props: {
        messages: {
            type: Object,
            default: () => ({
                apply: 'Apply',
                cancel: 'Cancel',
            }),
            validator(m) {
                return m.apply !== undefined && m.cancel !== undefined;
            },
        },
        openX: {
            type: [Number, String],
            required: undefined,
        },
        openY: {
            type: [Number, String],
            required: undefined,
        },
        openW: {
            type: Number,
            required: undefined,
        },
        openH: {
            type: Number,
            required: undefined,
        },
        minTop: {
            type: Number,
            required: undefined,
        },
        draggable: {
            type: Boolean,
            default: true,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        closeBtnType: {
            type: String,
            default: ICON_TYPE.close, // 'none' if don't need
        },
        hideCancelBtn: {
            type: Boolean,
            default: false,
        },
        hideFooter: {
            type: Boolean,
            default: false,
        },
        applyBtnType: {
            type: String,
            default: 'primary',
            validator(t) {
                return ['primary', 'danger', 'success'].includes(t);
            },
        },
        animationName: {
            type: String,
            default: 'default',
            validator(name) {
                return ['default', 'fade-down'].includes(name);
            },
        },
    },
    computed: {
        typedOpenX() {
            return typeof this.openX === 'number'
                ? this.openX + 'px'
                : this.openX;
        },
        typedOpenY() {
            return typeof this.openY === 'number'
                ? this.openY + 'px'
                : this.openY;
        },
        stylesFromProps() {
            const ret = {};
            if (!!this.openX) ret.left = this.typedOpenX;
            if (!!this.openY) ret.top = this.typedOpenY;
            if (!!this.openW) ret.width = this.openW + 'px';
            if (!!this.openH) ret.height = this.openH + 'px';
            return ret;
        },
    },
    data() {
        return {
            dragging: null,
            resizing: null,
        };
    },
    methods: {
        onResizeStart(
            left = false,
            right = false,
            top = false,
            bottom = false
        ) {
            if (!this.resizable) return;
            this.resizing = { left, right, top, bottom };
        },
        onResize(e) {
            const popupRef = this.$refs['window'];
            const {
                left,
                right,
                top,
                bottom,
            } = popupRef.getBoundingClientRect();
            const { clientX, clientY } = e;

            if (this.resizing.left && right - clientX > this.minWidth) {
                popupRef.style.left = clientX + 'px';
                popupRef.style.width = right - clientX + 'px';
            }
            if (this.resizing.right && clientX - left > this.minWidth) {
                popupRef.style.width = clientX - left + 'px';
            }
            if (this.resizing.top && bottom - clientY > this.minHeight) {
                popupRef.style.height = bottom - clientY + 'px';
                popupRef.style.top = clientY + 'px';
            }
            if (this.resizing.bottom && clientY - top > this.minHeight) {
                popupRef.style.height = clientY - top + 'px';
            }
        },
        onDragStart(e) {
            if (!this.draggable) return;
            const { clientX, clientY } = e;
            const { top, left } = e.currentTarget.getBoundingClientRect();
            this.dragging = { offsetX: clientX - left, offsetY: clientY - top };
        },
        onDrag(e) {
            const { clientX, clientY } = e;
            const popupRef = this.$refs['window'];
            const { offsetX, offsetY } = this.dragging;
            popupRef.style.left = `${clientX - offsetX}px`;

            //JQA-855, Window.vue의 최소 높이를 제한함.
            let top = clientY - offsetY;
            if (this.minTop !== undefined && top < this.minTop)
                top = this.minTop;
            popupRef.style.top = `${top}px`;
        },
        onMouseMove(event) {
            if (this.draggable && !!this.dragging) {
                this.onDrag(event);
            } else if (this.resizable && !!this.resizing) {
                this.onResize(event);
            }
        },
        onMouseUp() {
            if (this.dragging) {
                this.dragging = null;
                this.$emit('drag-end');
            }
            if (this.resizing) {
                this.resizing = null;
                this.$emit('resize-end');
            }
        },
        close() {
            this.$emit('cancel');
        },

        cancel() {
            this.$emit('cancel');
        },

        apply() {
            this.$emit('apply');
        },
        initializePosition() {
            // 데이터 등을 이유로 v-show를 사용하여 toggle할 경우 사용
            const popupRef = this.$refs['window'];
            popupRef.style.left = this.typedOpenX;
            popupRef.style.top = this.typedOpenY;
        },
    },
    created() {
        this.onMousemoveThrottled = _.throttle(
            e => this.onMouseMove(e),
            THROTTLE_INTERVAL
        );
    },
    mounted() {
        window.addEventListener('mousemove', this.onMousemoveThrottled);
        window.addEventListener('mouseup', this.onMouseUp);
        const { width, height } = this.$refs.window.getBoundingClientRect();

        // Set initial width & height as resize minimum
        this.minWidth = width;
        this.minHeight = height;
    },
    beforeDestroy() {
        window.removeEventListener('mousemove', this.onMousemoveThrottled);
        window.removeEventListener('mouseup', this.onMouseUp);
    },
};
</script>
<style lang="scss" scoped>
.aries-ui-window {
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 2000;
    will-change: transform;
    border-radius: 8px;
    box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.08),
        0 1px 3px 0 rgba(0, 0, 0, 0.2);
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        background-color: themed('window-background-color');
        color: themed('typography-color-primary');
        &:not(.draggable) {
            .head {
                cursor: default;
            }
        }

        &:not(.resizable) {
            .handle {
                display: none;
            }
        }

        .handle {
            position: absolute;
            width: 10px;
            height: 10px;
            box-sizing: border-box;
            z-index: 10;
            &.top {
                top: -5px;
            }
            &.middle {
                height: 100%;
            }
            &.center {
                width: 100%;
            }
            &.bottom {
                bottom: -5px;
            }
            &.left {
                left: -5px;
            }
            &.right {
                right: -5px;
            }
        }

        .head {
            cursor: grab;
            padding: 20px 20px 4px;
            height: 16px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            border-radius: inherit;

            &.grap {
                cursor: grabbing;
            }

            > .icons {
                margin: -8px -8px 0 0;
                text-align: right;
            }
        }

        .body {
            flex-grow: 1;
            padding: 20px;
            font-size: 14px;
            > .title {
                margin-right: 20px;
                font-size: 16px;
                font-weight: bold;
                box-sizing: border-box;
            }
            > .subtitle {
                margin-top: 8px;
                color: themed('typography-color-grey1');
            }
            > .content {
                margin-top: 20px;
            }
        }

        .foot {
            display: flex;
            justify-content: flex-end;
            padding: 0 8px 8px 8px;
            height: 36px;
        }
    }
}

@import '~@vuejs/transition/fade-down.scss';
@include fade-down(-4px);
</style>
