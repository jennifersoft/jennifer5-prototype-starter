<template>
    <section class="chart-axis">
        <div class="subject">{{ i18n.chartAxis }}</div>
        <div class="widgets">
            <div class="widget">
                <div class="title">{{ i18n.axisText }}</div>
                <div class="main">
                    <div class="span">
                        <dropdown
                            :items="fontSizeItems"
                            :selected-value="theme['style.gridXFontSize']"
                            @onchange="onChangeAxisFontSize"
                            style="width: 55px;"
                        ></dropdown>
                    </div>
                    <color-picker
                        :font-color="theme['style.gridXFontColor']"
                        @change-font-color="onChangeAxisFontColor"
                    ></color-picker>
                </div>
            </div>
            <div class="widget">
                <div class="title">{{ i18n.axisTextStep }}</div>
                <div class="main" style="text-align: left;">
                    <dropdown
                        :items="axisStepItems"
                        :selected-value="theme['axis.y.step']"
                        @onchange="
                            item => onChangeSetting('axis.y.step', item.value)
                        "
                    ></dropdown>
                </div>
            </div>
            <div class="widget">
                <div class="title">{{ i18n.showValue }}</div>
                <div class="main" style="text-align: left;">
                    <dropdown
                        :items="displayItems"
                        :selected-value="theme['brush.display']"
                        @onchange="
                            item => onChangeSetting('brush.display', item.value)
                        "
                    ></dropdown>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import ColorPicker from '../ui/colorPicker';
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';

export default {
    mixins: [methods],
    components: {
        ColorPicker,
        Dropdown,
    },
    inject: {
        i18n: {
            default: {
                chartAxis: 'Chart Axis',
                axisText: 'Axis Text',
                axisTextStep: 'Axis Text Step',
                showValue: 'Show Value',
            },
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'style.gridXFontSize': 12,
                        'style.gridXFontColor': '#333',
                        'style.gridYFontSize': 12,
                        'style.gridYFontColor': '#333',
                        'brush.display': 'max',
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
    data() {
        return {
            fontSizeItems: [...Array(9).fill(8)].map((item, index) => ({
                text: `${item + index}`,
                value: item + index,
            })),
            axisStepItems: [...Array(10).fill(1)].map((item, index) => ({
                text: `${item + index}`,
                value: item + index,
            })),
            displayItems: [
                {
                    text: 'Max',
                    value: 'max',
                },
                {
                    text: 'Min',
                    value: 'min',
                },
                {
                    text: 'All',
                    value: 'all',
                },
                {
                    text: 'None',
                    value: null,
                },
            ],
        };
    },
    methods: {
        onChangeAxisFontSize(item) {
            this.onChangeSetting('style.gridXFontSize', item.value);
            this.onChangeSetting('style.gridYFontSize', item.value);
        },
        onChangeAxisFontColor(color) {
            this.onChangeSetting('style.gridXFontColor', color);
            this.onChangeSetting('style.gridYFontColor', color);
        },
    },
};
</script>

<style lang="scss" scoped>
.chart-axis {
    .main {
        > .span {
            position: relative;
            display: inline-block;
            width: 57px;
            height: 28px;
            text-align: left;

            > .aries-ui-dropdown {
                position: absolute;
                top: 0px;
            }
        }
    }
}
</style>
