<template>
    <div class="color-picker">
        <div
            class="color"
            :style="{ 'background-color': baseColor }"
            @mouseleave="onLeaveSaturation"
        >
            <div class="saturation">
                <div
                    class="value"
                    ref="saturation"
                    @mousemove="onDragMoveSaturation"
                    @mouseup="onLeaveSaturation"
                    @click="onChangeSaturation"
                >
                    <div
                        class="drag-pointer"
                        :style="{
                            left: saturationBarLeft,
                            top: saturationBarTop,
                        }"
                        @mousedown="onDragStartSaturation"
                    ></div>
                </div>
            </div>
        </div>
        <div class="control">
            <div class="hue">
                <div class="container" @mouseup="onChangeHue">
                    <div class="drag-bar" :style="{ left: hueBarLeft }"></div>
                </div>
            </div>
            <div class="opacity">
                <div class="container" @mouseup="onChangeOpacity">
                    <div
                        class="drag-bar"
                        :style="{ left: opacityBarLeft }"
                    ></div>
                </div>
            </div>
            <input class="input" type="text" :value="opacityText" disabled />
            <div class="empty"></div>
            <div class="color" :style="{ 'background-color': rgbaText }"></div>
        </div>
        <div class="information">
            <input
                class="input"
                type="text"
                maxlength="7"
                :value="rgbaText"
                @keyup.enter="onEnterHex"
                @focusout="onEnterHex"
            />
            <input
                class="input"
                type="text"
                maxlength="3"
                :value="rgba.r"
                @keyup.enter="onEnterR"
                @focusout="onEnterR"
            />
            <input
                class="input"
                type="text"
                maxlength="3"
                :value="rgba.g"
                @keyup.enter="onEnterG"
                @focusout="onEnterG"
            />
            <input
                class="input"
                type="text"
                maxlength="3"
                :value="rgba.b"
                @keyup.enter="onEnterB"
                @focusout="onEnterB"
            />
            <div class="title">HEX</div>
            <div class="title">R</div>
            <div class="title">G</div>
            <div class="title">B</div>
        </div>
    </div>
</template>

<script>
import jui from 'juijs';
import _ from '@library/lodash';

const colorUtils = jui.include('util.color');

const HUE_COLORS = [
    { rgb: '#ff0000', start: 0.0 },
    { rgb: '#ffff00', start: 0.17 },
    { rgb: '#00ff00', start: 0.33 },
    { rgb: '#00ffff', start: 0.5 },
    { rgb: '#0000ff', start: 0.67 },
    { rgb: '#ff00ff', start: 0.83 },
    { rgb: '#ff0000', start: 1 },
];

const MAX_VALUES = {
    hue: 157,
    opacity: 119,
    width: 226,
    height: 145,
};

const eventFunc = _.throttle((self, rgba) => {
    self.$emit(
        'change',
        rgba.a === 1 ? colorUtils.format(rgba, 'hex') : self.getRGBAStr(rgba)
    );
}, 500);

export default {
    props: {
        color: {
            type: String,
            required: false,
            default: '#DCDCDC',
        },
    },
    watch: {
        color(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.initColor(newVal);
            }
        },
    },
    data() {
        return {
            baseColor: '#FFF',
            baseOpacity: 1,
            rgba: { r: 255, g: 0, b: 0, a: 1 },
            hueValue: 0,
            opacityValue: MAX_VALUES.opacity,
            saturationValueX: 0,
            saturationValueY: 0,
            isDragging: false,
            clientRect: null,
        };
    },
    computed: {
        hueBarLeft() {
            return `${this.hueValue - 1}px`;
        },
        opacityBarLeft() {
            return `${this.opacityValue - 1}px`;
        },
        saturationBarLeft() {
            return `${this.saturationValueX - 5}px`;
        },
        saturationBarTop() {
            return `${this.saturationValueY - 5}px`;
        },
        opacityText() {
            return `${Math.round(this.baseOpacity * 100)}%`;
        },
        rgbaText() {
            if (this.rgba.a === 1) return colorUtils.format(this.rgba, 'hex');
            return this.getRGBAStr(this.rgba);
        },
    },
    methods: {
        getRGBAStr(rgba) {
            return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        },
        calculateColor() {
            const h = (this.hueValue / MAX_VALUES.hue) * 360;
            const s = this.saturationValueX / MAX_VALUES.width;
            const v =
                (MAX_VALUES.height - this.saturationValueY) / MAX_VALUES.height;

            console.log('this.saturationValueY', this.saturationValueY);

            const rgba = colorUtils.HSVtoRGB(h, s, v);
            rgba.a = this.baseOpacity;

            eventFunc(this, rgba);

            return rgba;
        },
        calculateHue(value) {
            let startColor, endColor;

            for (let i = 0; i < HUE_COLORS.length; i++) {
                if (HUE_COLORS[i].start >= value) {
                    startColor = HUE_COLORS[i - 1];
                    endColor = HUE_COLORS[i];
                    break;
                }
            }

            if (startColor && endColor) {
                let scale = colorUtils
                    .scale()
                    .domain(startColor.rgb, endColor.rgb);
                return scale(
                    (value - startColor.start) /
                        (endColor.start - startColor.start),
                    'hex'
                );
            }

            return null;
        },
        onChangeSaturation(e) {
            //ColorPicker.vue가 v-show로 토글될때 값이 변경된다.
            //this.$el.getBoundingClientRect() 값은 계속 연산해야한다.
            //   this.saturationValueX = e.x - this.clientRect.left;
            //   this.saturationValueY = e.y - this.clientRect.top;

            const clientRect = this.$el.getBoundingClientRect();
            this.saturationValueX = e.x - clientRect.left;
            this.saturationValueY = e.y - clientRect.top;

            // rgba 데이터 갱신
            this.rgba = this.calculateColor();
        },
        onLeaveSaturation(e) {
            if (!this.isDragging) return;
            this.onChangeSaturation(e);
            this.isDragging = false;
        },
        onDragStartSaturation() {
            if (this.isDragging) return;
            this.isDragging = true;
        },
        onDragMoveSaturation(e) {
            if (!this.isDragging) return;
            this.onChangeSaturation(e);
        },
        onChangeHue(e) {
            // 범위: 0~157
            this.hueValue = e.offsetX;

            // 상단 베이스 컬러 영역
            this.baseColor = this.calculateHue(this.hueValue / MAX_VALUES.hue);

            // rgba 데이터 갱신
            this.rgba = this.calculateColor();
        },
        onChangeOpacity(e) {
            // 범위: 0~119
            this.opacityValue = e.offsetX;

            // 베이스 컬러 투명도
            this.baseOpacity = parseFloat(
                (this.opacityValue / MAX_VALUES.opacity).toFixed(2)
            );

            // rgba 데이터 갱신
            this.rgba = this.calculateColor();
        },
        onEnterHex(e) {
            const rgb = colorUtils.rgb(e.target.value);

            if (
                rgb != null &&
                !isNaN(rgb.r) &&
                !isNaN(rgb.g) &&
                !isNaN(rgb.b)
            ) {
                this.initColor(e.target.value);
                e.target.blur();
            } else {
                e.target.value = '';
                e.target.focus();
            }
        },
        onEnterR(e) {
            this.updateRGB(e.target.value, this.rgba.g, this.rgba.b, e.target);
        },
        onEnterG(e) {
            this.updateRGB(this.rgba.r, e.target.value, this.rgba.b, e.target);
        },
        onEnterB(e) {
            this.updateRGB(this.rgba.r, this.rgba.g, e.target.value, e.target);
        },
        checkRGBValue(value) {
            const n = parseInt(value);

            if (!isNaN(n) && value !== '') {
                if (n >= 0 && n <= 255) return true;
            }

            return false;
        },
        updateRGB(r, g, b, elem) {
            if (this.checkRGBValue(elem.value)) {
                this.initColor(
                    colorUtils.format(
                        {
                            r: parseInt(r),
                            g: parseInt(g),
                            b: parseInt(b),
                        },
                        'hex'
                    )
                );
                elem.blur();
            } else {
                elem.value = '';
                elem.focus();
            }
        },
        initColor(newColor) {
            this.baseColor = newColor;
            this.rgba = colorUtils.rgb(newColor);

            const hsv = colorUtils.RGBtoHSV(
                this.rgba.r,
                this.rgba.g,
                this.rgba.b
            );
            this.saturationValueX = MAX_VALUES.width * hsv.s;
            this.saturationValueY = MAX_VALUES.height * (1 - hsv.v);
            this.hueValue = MAX_VALUES.hue * (hsv.h / 360);
            this.opacityValue = MAX_VALUES.opacity * (this.rgba.a || 0);
        },
    },
    mounted() {
        this.initColor(this.color);
        //ColorPicker.vue가 v-show로 토글될때 값이 변경된다.
        //this.$el.getBoundingClientRect() 값은 계속 연산해야한다.
        //this.clientRect = this.$el.getBoundingClientRect();
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';

.color-picker {
    position: relative;
    width: 226px;
    height: 300px;
    border-radius: 5px;

    > .color {
        position: relative;
        height: 145px;
        overflow: hidden;

        > .saturation {
            position: relative;
            width: 100%;
            height: 100%;

            > .value {
                position: relative;
                width: 100%;
                height: 100%;

                > .drag-pointer {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    left: -5px;
                    top: -5px;
                    cursor: move;
                }
            }
        }
    }

    > .control {
        position: relative;
        padding: 18px 0px 20px 0px;
        user-select: none;

        > .color,
        > .empty {
            position: absolute;
            left: 11px;
            top: 24px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            box-sizing: border-box;
        }

        > .hue {
            position: relative;
            padding: 8px 12px;
            margin: 0px 0px 0px 45px;
            box-sizing: border-box;

            > .container {
                position: relative;
                width: 157px;
                height: 6px;
                border-radius: 5px;
            }
        }

        > .opacity {
            position: relative;
            width: 143px;
            padding: 8px 12px;
            margin: 0px 0px 0px 45px;
            box-sizing: border-box;

            > .container {
                position: relative;
                width: 100%;
                height: 3px;
                z-index: 2;
                border-radius: 3px;
            }
        }

        > .input {
            position: absolute;
            font-size: 10px;
            right: 10px;
            bottom: 20px;
            width: 30px;
            height: 20px;
            padding: 0 0 0 2px;
            box-sizing: border-box;
            border-radius: 5px;

            &:disabled {
                cursor: not-allowed;
            }
        }

        .drag-bar {
            position: absolute;
            top: 50% !important;
            margin-top: -7px !important;
            left: -3px;
            width: 2px;
            height: 12px;
        }
    }

    > .information {
        position: relative;
        height: 73px;

        > .input {
            position: absolute;
            font-size: 10px;
            height: 20px;
            bottom: 20px;
            padding: 0 0 0 2px;
            box-sizing: border-box;
            user-select: text;
            border-radius: 5px;

            &:nth-child(1) {
                width: 93px;
                left: 10px;
            }
            &:nth-child(2) {
                width: 30px;
                right: 74px;
            }
            &:nth-child(3) {
                width: 30px;
                right: 42px;
            }
            &:nth-child(4) {
                width: 30px;
                right: 10px;
            }
        }

        > .title {
            position: absolute;
            font-size: 11px;
            top: 15px;

            &:nth-child(5) {
                left: 10px;
            }
            &:nth-child(6) {
                left: 123px;
            }
            &:nth-child(7) {
                left: 155px;
            }
            &:nth-child(8) {
                left: 187px;
            }
        }
    }

    @include themify($themes) {
        border: 1px solid themed('color-picker-border-color');
        background-color: themed('color-picker-background-color');
        box-shadow: themed('color-picker-box-shadow');

        > .color {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;

            > .saturation {
                background-color: themed('color-picker-saturation-to-color');
                background-image: linear-gradient(
                    to right,
                    themed('color-picker-saturation-from-color'),
                    themed('color-picker-saturation-to-color')
                );
                background-repeat: repeat-x;

                > .value {
                    background-image: linear-gradient(
                        to top,
                        themed('color-picker-value-from-color'),
                        themed('color-picker-value-to-color')
                    );

                    > .drag-pointer {
                        border: 1px solid
                            themed(
                                'color-picker-value-drag-pointer-border-color'
                            );
                        box-shadow: themed(
                            'color-picker-drag-pointer-box-shadow'
                        );
                    }
                }
            }
        }

        > .control {
            > .hue {
                > .container {
                    background: linear-gradient(
                        to right,
                        #ff0000 0%,
                        #ffff00 17%,
                        #00ff00 33%,
                        #00ffff 50%,
                        #0000ff 67%,
                        #ff00ff 83%,
                        #ff0000 100%
                    );
                }
            }

            > .opacity {
                > .container {
                    background: themed('color-picker-opacity-background-color');
                }
            }

            > .input {
                color: themed('color-picker-input-font-color');
                border: 1px solid themed('color-picker-input-border-color');
                background-color: themed('color-picker-input-background-color');
            }

            > .empty {
                background: url(themed('color-picker-pattern-image-url')) repeat;
            }

            .drag-bar {
                border: 1px solid
                    themed('color-picker-drag-pointer-border-color');
                box-shadow: themed('color-picker-drag-pointer-box-shadow');
                background-color: themed(
                    'color-picker-drag-pointer-background-color'
                );
            }
        }

        > .information {
            border-top: 1px solid
                themed('color-picker-information-border-color');

            > .title {
                color: themed('color-picker-font-color');
            }

            > .input {
                color: themed('color-picker-input-font-color');
                border: 1px solid themed('color-picker-input-border-color');
                background-color: themed('color-picker-input-background-color');
            }
        }
    }
}
</style>
