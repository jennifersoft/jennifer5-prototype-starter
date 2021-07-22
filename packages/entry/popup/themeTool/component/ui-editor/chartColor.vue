<template>
    <section class="chart-color">
        <div class="subject">{{ i18n.chartColor }}</div>
        <div class="widgets" v-click-outside="onClickAwayHandler">
            <div class="widget">
                <div
                    class="block"
                    v-for="(color, index) in theme['style.colors']"
                    :style="{ 'background-color': color }"
                    @click="e => onShowColorPicker(index, e)"
                ></div>
            </div>
            <div class="color-picker-layer">
                <color-picker
                    v-show="active"
                    :color="activeColor"
                    :style="{ top: activeTop + 'px' }"
                    @change="onChangeColor"
                ></color-picker>
            </div>
        </div>
    </section>
</template>

<script>
import ColorPicker from '@vuejs/component/ColorPicker/ColorPicker';
import clickOutside from '@vuejs/directive/clickOutside';
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';

export default {
    mixins: [methods],
    components: {
        ColorPicker,
    },
    directives: {
        clickOutside,
    },
    inject: {
        i18n: {
            default: {
                chartColor: 'Chart Color',
            },
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'style.colors': [],
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
    data() {
        return {
            active: false,
            activeColor: '#000',
            activeIndex: 0,
            activeTop: 0,
        };
    },
    methods: {
        onShowColorPicker(index, e) {
            this.active = this.activeIndex !== index ? true : !this.active;
            this.activeIndex = index;
            this.activeColor = this.theme['style.colors'][index];
            this.activeTop = e.target.offsetTop - 70;
        },
        onChangeColor(color) {
            const newColors = [...this.theme['style.colors']];
            newColors[this.activeIndex] = color;
            this.onChangeSetting('style.colors', newColors);
        },
        onClickAwayHandler() {
            this.active = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.chart-color {
    margin-bottom: 48px !important;

    > .widgets {
        position: relative;
        margin-top: 16px;

        > .widget {
            flex-wrap: wrap;
            padding: 4px;
            border-radius: 4px;
            border: solid 1px #dadada;

            > .block {
                flex: 1 1 calc(20% - 4px);
                cursor: pointer;
                border: 1px solid #fff;
                height: 18px;
            }
        }

        > .color-picker-layer {
            position: absolute;
            left: 4px;
            z-index: 1;
        }
    }
}
</style>
