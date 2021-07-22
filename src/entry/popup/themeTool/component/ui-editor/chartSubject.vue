<template>
    <section class="chart-subject">
        <div class="subject">{{ i18n.chartTitle }}</div>
        <div class="widgets">
            <div class="widget">
                <div class="title">{{ i18n.sizeAndWidth }}</div>
                <div class="main">
                    <font-style
                        :font-size="theme['style.titleFontSize']"
                        :font-weight="theme['style.titleFontWeight']"
                        @change-font-size="
                            item =>
                                onChangeSetting(
                                    'style.titleFontSize',
                                    item.value
                                )
                        "
                        @change-font-weight="
                            item =>
                                onChangeSetting(
                                    'style.titleFontWeight',
                                    item.value
                                )
                        "
                    ></font-style>
                </div>
            </div>
            <div class="widget">
                <div class="title">{{ i18n.textColor }}</div>
                <div class="main">
                    <color-picker
                        :font-color="theme['style.titleFontColor']"
                        @change-font-color="
                            color =>
                                onChangeSetting('style.titleFontColor', color)
                        "
                    ></color-picker>
                </div>
            </div>
            <div class="widget column">
                <div class="title">{{ i18n.align }}</div>
                <div class="main align">
                    <btn
                        :items="fontAlignButtons"
                        :selected-value="theme['widget.title.align']"
                        :type-in-group-button="'radio'"
                        @click="
                            btn =>
                                onChangeSetting('widget.title.align', btn.value)
                        "
                    ></btn>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import FontStyle from '../ui/fontStyle';
import ColorPicker from '../ui/colorPicker';
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';

export default {
    mixins: [methods],
    components: {
        FontStyle,
        ColorPicker,
        Btn,
    },
    inject: {
        i18n: {
            default: {
                chartTitle: 'Chart Title',
                align: 'Align',
                textColor: 'Text Color',
                sizeAndWidth: 'Size and thickness',
            },
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'style.titleFontSize': 10,
                        'style.titleFontWeight': 'normal',
                        'style.titleFontColor': '#000',
                        'widget.title.align': 'middle',
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
    data() {
        return {
            fontAlignButtons: [
                { iconType: ICON_TYPE.alignLeft, value: 'start' },
                { iconType: ICON_TYPE.alignCenter, value: 'middle' },
                { iconType: ICON_TYPE.alignRight, value: 'end' },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.chart-subject {
    > .widgets {
        > .widget {
            > .align {
                ::v-deep .aries-ui-btn {
                    > .item {
                        min-width: 94px;
                    }
                }
            }
        }
    }
}
</style>
