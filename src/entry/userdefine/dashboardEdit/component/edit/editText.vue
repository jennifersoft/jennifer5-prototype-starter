<template>
    <div class="edit-text" :class="theme">
        <div class="text-configure-without-btn">
            <div class="title">
                <div>{{ i18n.text }}</div>
            </div>
            <div v-show="editingComponentDataKey === undefined">
                <input-field small v-model="textContent" style="width: 100%" />
            </div>
            <div class="text-size">
                <span>{{ i18n.size }}</span>
                <dropdown
                    ref="fontsizeDropdown"
                    v-click-outside="hideFontsizeDropdown"
                    :items="fontSizeList"
                    style="width: 60px;"
                    :selected-value="fontSize"
                    @onchange="onChangeFontSize"
                />
            </div>
            <div class="text-color" style="position: relative;">
                <span>
                    {{ i18n.textColor }}
                </span>
                <div>
                    <div
                        class="color-box-outer"
                        @click="onClickShowColorpicker"
                    >
                        <div class="color-box-inner" :style="styleInBox"></div>
                    </div>
                </div>
                <ColorPicker
                    style="position: absolute; z-index: 1000;"
                    v-click-outside="hideColorpicker"
                    v-show="showColorpicker"
                    :color="textColor"
                    @change="onChangeTextColor"
                />
            </div>
            <div class="text-align">
                <div class="description">
                    {{ i18n.alignHorizontal }}
                </div>
                <btn
                    :items="alignTypeList"
                    :selected-value="textAlign"
                    @click="onClickAlignType"
                />
            </div>
            <div class="text-align">
                <div class="description">
                    {{ i18n.alignVertical }}
                </div>
                <btn
                    :items="verticalAlignTypeList"
                    :selected-value="textVerticalAlign"
                    @click="onClickVerticalAlignType"
                />
            </div>
            <div v-show="editingComponentDataKey !== undefined">
                {{ i18n.message }}
            </div>
        </div>
        <div v-show="editingComponentDataKey === undefined" class="insert-box">
            <btn
                :items="[{ text: i18n.insert }]"
                style="width: 248px; margin: 10px auto 0 auto; text-align: center!important;"
                class="focus"
                normal
                @click="onClickInsert"
            />
        </div>
    </div>
</template>
<script>
import clickOutside from '@vuejs/directive/clickOutside';

import Btn from '@vuejs/component/button/Btn';
import InputField from '@vuejs/component/Input/InputField';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import ColorPicker from '@vuejs/component/ColorPicker/ColorPicker';

import { i18n } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

import { createNamespacedHelpers } from 'vuex';

import { GenerateKey } from '@module/global/GenerateKey';

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'editText',
    components: { ColorPicker, Dropdown, Btn, InputField },
    directives: { clickOutside },
    inject: {
        theme: {
            default: 'classic',
        },
    },
    data() {
        return {
            i18n: {
                text: i18n.get('ui.label.text'),
                size: i18n.get('ui.label.size'),
                textColor: i18n.get('ui.label.text.color'),
                alignHorizontal: i18n.get('ui.label.text.align.horizontal'),
                alignVertical: i18n.get('ui.label.text.align.vertical'),
                message: i18n.get('M0609'),
                insert: i18n.get('ui.label.insert'),
            },

            fontSizeList: Array.from(new Array(36).keys()).map(value => {
                const size = value * 2 + +10;
                return { text: size, value: size };
            }),

            alignTypeList: [
                { value: 'left', iconType: ICON_TYPE.alignLeft },
                { value: 'center', iconType: ICON_TYPE.alignCenter },
                { value: 'right', iconType: ICON_TYPE.alignRight },
            ],

            verticalAlignTypeList: [
                { value: 'flex-start', iconType: ICON_TYPE.verticalAlignTop },
                { value: 'center', iconType: ICON_TYPE.verticalAlignCenter },
                { value: 'flex-end', iconType: ICON_TYPE.verticalAlignBottom },
            ],

            ICON_TYPE: ICON_TYPE,
            textContent: '',
            showColorpicker: false,
        };
    },
    methods: {
        ...mapMutations([
            'setFontSizeOnTextbox',
            'setColorOnTextbox',
            'setAlignTypeOnTextbox',
            'setVerticalAlignTypeOnTextbox',
            'setComponent',
        ]),

        onChangeFontSize(item) {
            this.setFontSizeOnTextbox(item.value);
            this.updateComponent();
        },

        onChangeTextColor(hex, rgb) {
            this.setColorOnTextbox(hex);
            this.updateComponent();
        },

        onClickAlignType(item) {
            this.setAlignTypeOnTextbox(item.value);
            this.updateComponent();
        },

        onClickVerticalAlignType(item) {
            this.setVerticalAlignTypeOnTextbox(item.value);
            this.updateComponent();
        },

        updateComponent() {
            if (this.editingComponentDataKey)
                this.setComponent(
                    Object.assign({ ...this.editingTextOptions })
                );
        },

        onClickShowColorpicker() {
            this.showColorpicker = !this.showColorpicker;
        },

        onClickInsert() {
            if (this.textContent.trim() === '') return;

            const componentOption = Object.assign(
                { ...this.editingTextOptions },
                this.defaultComponentPosition
            );

            componentOption.content = this.textContent;
            componentOption.dataKey = GenerateKey.makeLongKeyByTime();
            componentOption.zIndex = this.nextZIndex;
            this.textContent = '';

            this.setComponent(componentOption);
        },

        hideFontsizeDropdown() {
            this.$refs.fontsizeDropdown.isUnfold = false;
        },

        hideColorpicker(event) {
            const className = event.target.className;

            if (
                className !== 'color-box-inner' &&
                className !== 'color-box-outer'
            )
                this.showColorpicker = false;
        },
    },
    computed: {
        ...mapState([
            'defaultComponentPosition',
            'editingTextOptions',
            'editingComponentDataKey',
        ]),

        ...mapGetters(['nextZIndex']),

        styleInBox() {
            return {
                'background-color': this.textColor,
            };
        },

        textColor() {
            return this.editingTextOptions.color
                ? this.editingTextOptions.color
                : this.theme === 'classic'
                ? '#333333'
                : '#ffffff';
        },

        fontSize() {
            return this.editingTextOptions.fontSize
                ? this.editingTextOptions.fontSize
                : 10;
        },

        textAlign() {
            return this.editingTextOptions.textAlign
                ? this.editingTextOptions.textAlign
                : 'left';
        },

        textVerticalAlign() {
            return this.editingTextOptions.textVerticalAlign
                ? this.editingTextOptions.textVerticalAlign
                : 'flex-start';
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.edit-text {
    width: 280px;
    height: calc(100% - 41px);
    @include themify($themes) {
        background-color: themed('area-menu-background-color');
        > .text-configure-without-btn {
            height: calc(100% - 67px);
            overflow-y: auto;
            color: themed('edit-component-title2-color');
            div.title {
                height: 40px;
                > div {
                    height: 24px;
                    margin: 8px 0 8px 16px;
                    font-size: 14px;
                    font-weight: bold;
                    color: themed('edit-component-title1-color');
                }
            }

            > div:not(.title) {
                display: flex;
                flex-direction: row;
                padding: 16px;
                > span {
                    line-height: 28px;
                    flex-grow: 1;
                }

                &.text-align {
                    flex-direction: column;
                }
            }

            .color-box-outer {
                width: 41px;
                height: 28px;
                vertical-align: middle;
                border-radius: 4px;
                border: 1px solid themed('edit-text-tab-default-color');

                > .color-box-inner {
                    width: 33px;
                    height: 20px;
                    margin: 4px;
                    border-radius: 2px;
                }
            }

            .text-align {
                > .description {
                    margin-bottom: 10px;
                }
            }

            .uix-colorpicker {
                position: absolute;
                z-index: 5000;
            }
        }
        .insert-box {
            border-top: solid 1px themed('area-menu-border-color');
            margin-top: auto;
            display: flex;
        }
    }
}
</style>
