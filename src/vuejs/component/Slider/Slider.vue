<template>
    <div class="aries-ui-slider"
         :class="[size]"
         @click="onClick"
         @mousemove="onMouseoverFill"
         @mouseleave="hoverPos = null"
         ref="slider">
        <span
            v-if="type === 'ranged'"
            class="slider-btn left"
            :class="{ pressed: dragTarget === 'left' }"
            :style="{ left: positionPercentage(pos[0] - min) }"
            @mousedown="onDragStart('left')"
            ref="button"
        >
            <tooltip-balloon
                v-if="showTooltip && dragTarget === 'left'"
                position="top-center"
                cursor-none
            >
                <span>{{ pos[0].toString() }}</span>
            </tooltip-balloon>
        </span>
        <span
            class="slider-btn right"
            :class="{ pressed: dragTarget === 'right' }"
            :style="{ left: positionPercentage(pos[1] - min) }"
            @mousedown="onDragStart('right')"
            ref="button"
            ><tooltip-balloon
                v-if="showTooltip && dragTarget === 'right'"
                position="top-center"
                cursor-none
            >
                <span>{{ pos[1].toString() }}</span>
            </tooltip-balloon>
        </span>
        <span
            class="slider-fill"
            :style="{
                left: positionPercentage(pos[0] - min),
                width: positionPercentage(pos[1] - pos[0]),
            }"
        ></span>
        <tooltip-balloon v-if="showTooltip && dragTarget === null && hoverPos !== null"
                         class="on-fill"
                         :style="{ left: positionPercentage(hoverPos - min) }"
                         cursor-none>
            <span>{{ getSteppedValue(hoverPos).toString() }}</span>
        </tooltip-balloon>
    </div>
</template>

<script>
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';
import SizeMixin from "@vuejs/mixin/SizeMixin";

export default {
    name: 'Slider',
    mixins: [SizeMixin],
    components: { TooltipBalloon },
    props: {
        type: {
            type: String,
            default: 'default',
            validator(t) {
                return ['default', 'ranged'].indexOf(t) !== -1;
            },
        },
        initialValue: {
            type: [Number, Array], // type Array if ranged slider
            required: true,
        },
        max: {
            type: Number,
            required: true,
            validator(val) {
                return val >= 0;
            },
        },
        min: {
            type: Number,
            default: 0,
            validator(val) {
                return val >= 0;
            },
        },
        step: {
            type: Number,
            default: 1,
        },
        showTooltip: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            hoverTarget: null,
            dragTarget: null,
            pos: this.type === 'ranged' ? [...this.initialValue] : [this.min, this.initialValue],
            hoverPos: null,
        };
    },
    computed: {
        width() {
            return this.max - this.min;
        }
    },
    methods: {
        onClick(e) {
            if (this.type === 'default') this.dragTarget = 'right';
            else {
                const steppedValue = this.getValueFromAxis(e);
                const [first, second] = this.pos;
                if (Math.abs(steppedValue - first) < Math.abs(steppedValue - second)) {
                    this.dragTarget = 'left';
                } else this.dragTarget = 'right';
            }
            this.onDrag(e);
            this.onDragEnd();
        },
        onMouseoverFill(e) {
            this.hoverPos = this.getValueFromAxis(e, false);
        },
        onDragStart(target) {
            this.dragTarget = target;
        },
        onDrag(e) {
            if (!this.dragTarget) return;

            const steppedValue = this.getValueFromAxis(e);

            if (this.dragTarget === 'left') {
                if (this.pos[1] < steppedValue) return;
                this.$set(this.pos, 0, steppedValue);
            } else {
                if (this.pos[0] > steppedValue) return;
                this.$set(this.pos, 1, steppedValue);
            }
        },
        onDragEnd() {
            if (!this.dragTarget) return;
            this.$emit('update:value', [...this.pos]);
            this.dragTarget = null;
        },
        getSteppedValue(val) {
            val = Math.floor(val);
            const rest = val % this.step;
            if (rest >= this.step / 2) return val + this.step - rest;
            else return val - rest;
        },
        getValueFromAxis(e, stepped = true) {
            const { clientX } = e;
            const { left, width } = this.$refs.slider.getBoundingClientRect();

            const relativeValue = (clientX - left) / width;

            if (relativeValue > 1) return this.max;
            if (clientX - left < 0) return this.min;

            const multiplied = stepped ? this.getSteppedValue(relativeValue * this.width) : Math.floor(relativeValue * this.width);
            return multiplied + this.min;
        },
        positionPercentage(pos) {
            return (pos / this.width) * 100 + '%';
        },
    },
    mounted() {
        window.addEventListener('mousemove', this.onDrag);
        window.addEventListener('mouseup', this.onDragEnd);
    },
    beforeDestroy() {
        window.removeEventListener('mousemove', this.onDrag);
        window.addEventListener('mouseup', this.onDragEnd);
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
@mixin size($h, $r, $bw) {
    height: $h + px;
    border-radius: $r + px;
    .slider-btn {
        width: $bw + px;
        height: $bw + px;
        top: -($bw/2 - $h/2) + px;
    }
}
.aries-ui-slider {
    @include themify($themes) {
        display: inline-flex;
        position: relative;
        width: 100%;
        cursor: pointer;
        background-color: themed('slider-background-color');

        --tooltip-offset: 18px;
        --btn-radius: 4px;

        .slider-btn {
            z-index: 10;
            position: absolute;
            border-radius: 50%;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2),
                0 0 2px 0 rgba(0, 0, 0, 0.2);
            background-color: themed('slider-button-background-color');
            transform: translateX(-50%);
            &:hover {
                &::before {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    background-color: themed('behaviors-hover-color');
                }
            }

            &.pressed {
                &::before {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    background-color: themed('behaviors-press-color');
                }
            }
        }

        .slider-fill {
            display: inline-block;
            border-radius: inherit;
            position: absolute;
            height: 100%;
            background-color: themed('background-color-purple');
        }

        &.small {
            @include size(4, 3, 12);
        }

        &.normal {
            @include size(6, 3, 18);
            --btn-radius: 6px;
            --tooltip-offset: 24px;
        }

        &.large {
            @include size(8, 4, 24);
            --btn-radius: 8px;
            --tooltip-offset: 30px;
        }

        ::v-deep .tooltip-balloon {
            bottom: var(--tooltip-offset);
            left: 50%;
            transform: translateX(-50%);
            &.on-fill {
                bottom: calc(var(--tooltip-offset) - var(--btn-radius));
            }
        }
    }
}
</style>
