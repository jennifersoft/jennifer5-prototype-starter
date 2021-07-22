<template>
    <section class="chart-legend">
        <div class="subject">{{ i18n.chartLegend }}</div>
        <div class="widgets">
            <div class="widget">
                <div class="title">{{ i18n.legendText }}</div>
                <div class="main">
                    <div class="span">
                        <dropdown
                            :items="fontSizeItems"
                            :selected-value="theme['style.legendFontSize']"
                            @onchange="
                                item =>
                                    onChangeSetting(
                                        'style.legendFontSize',
                                        item.value
                                    )
                            "
                            style="width: 55px;"
                        ></dropdown>
                    </div>
                    <color-picker
                        :font-color="theme['style.legendFontColor']"
                        @change-font-color="
                            color =>
                                onChangeSetting('style.legendFontColor', color)
                        "
                    ></color-picker>
                </div>
            </div>
            <div class="widget column">
                <div class="title">{{ i18n.align }}</div>
                <div class="main align">
                    <btn
                        :items="legendAlignButtons"
                        :selected-value="theme['widget.legend.orient']"
                        :type-in-group-button="'radio'"
                        @click="onChangeLegendPosition"
                    ></btn>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import ColorPicker from '../ui/colorPicker';
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';

export default {
    mixins: [methods],
    components: {
        ColorPicker,
        Dropdown,
        Btn,
    },
    inject: {
        i18n: {
            default: {
                chartLegend: 'Chart Legend',
                legendText: 'Legend Text',
                align: 'Align',
            },
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'style.legendFontSize': 10,
                        'style.legendFontColor': '#333',
                        'widget.legend.orient': 'right',
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
    data() {
        return {
            fontSizeItems: [...Array(7).fill(8)].map((item, index) => ({
                text: `${item + index}`,
                value: item + index,
            })),
            legendAlignButtons: [
                { iconType: ICON_TYPE.legendAlignLeft, value: 'left' },
                { iconType: ICON_TYPE.legendAlignRight, value: 'right' },
                { iconType: ICON_TYPE.legendAlignTop, value: 'top' },
                { iconType: ICON_TYPE.legendAlignBottom, value: 'bottom' },
            ],
        };
    },
    methods: {
        onChangeLegendPosition(item) {
            this.onChangeSetting('widget.legend.orient', item.value);
            this.onChangeSetting(
                'widget.legend.align',
                item.value === 'top' || item.value === 'bottom'
                    ? 'center'
                    : 'start'
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.chart-legend {
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

        &.align {
            ::v-deep .aries-ui-btn {
                > .item {
                    min-width: 71px;
                }
            }
        }
    }
}
</style>
