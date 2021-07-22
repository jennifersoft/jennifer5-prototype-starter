<template>
    <div
        v-click-outside="close"
        class="aries-ui-dropdown"
        :class="[
            { unfold: isUnfold },
            { simple: isSimpleStyle || isIconDropdown },
            { 'hide-selected-text': hideSelectedText },
            { disabled },
        ]"
        :style="cssValues"
        @keydown.tab="close"
    >
        <btn
            v-if="hideSelectedText === false"
            :items="[header]"
            :class="[
                { disabled },
                { 'border-none': isSimpleStyle || isIconDropdown },
            ]"
            :pressed="(isSimpleStyle || isIconDropdown) && isUnfold"
            :[buttonSize]="true"
            @click="onClickUnfold"
            @focus.native="focusAndOpen"
        />
        <popup-list
            v-if="isUnfold"
            :style="!hideSelectedText && listPosition"
            :items="items"
            :active-index="currentIndex"
            :overflow-x="isIconDropdown"
            :no-scroll="noScrollComputed"
            :display-row-count="displayRowCount"
            :[size]="true"
            @update:active-index="onClickRow"
        />
    </div>
</template>
<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import clickOutside from '@vuejs/directive/clickOutside';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'Dropdown',
    components: {
        Btn,
        PopupList,
    },
    mixins: [SizeMixin],
    props: {
        isSimpleStyle: {
            type: Boolean,
            required: false,
            default: false,
        },
        items: {
            type: Array,
            required: true,
            validator(items) {
                return items.every(
                    item => item.value !== undefined && item.text !== undefined
                );
            },
        },
        selectedValue: {
            // no item selected if undefined
            type: [String, Number],
            required: false,
        },
        buttonOptions: {
            type: Object,
            default: () => ({
                text: '',
                iconType: undefined,
                size: 'normal',
                position: 'bottom-left',
            }),
        },
        hideSelectedText: {
            type: Boolean,
            required: false,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: undefined,
        },
        noScroll: {
            type: Boolean,
            default: undefined,
        },
        displayRowCount: {
            type: Number,
            default: undefined,
        },
    },
    directives: {
        clickOutside,
    },
    data() {
        return {
            // NOTICE: icon dropdown 의 경우 selected value 가 undefined 라면 어떤 index 도 선택하지 않는다. 사용 빈도가 높음
            currentIndex:
                this.selectedValue !== undefined
                    ? this.items.findIndex(
                          item => item.value === this.selectedValue
                      )
                    : !!this.buttonOptions.iconType
                    ? -1
                    : 0,
            isUnfold: false,
        };
    },
    methods: {
        onClickUnfold() {
            this.isUnfold = !this.isUnfold;
            this.$emit('unfold', this.isUnfold);
        },
        onClickRow(index) {
            this.$emit('onchange', this.items[index]);
            this.isUnfold = false;

            /*
             * 1. 상위 코드에서 selectedValue 값이 없을 때
             * 2. icon dropdown일 때
             */
            if (this.selectedValue === undefined && !this.isIconDropdown)
                this.currentIndex = index;
        },
        close() {
            if (this.hideSelectedText) return;
            if (this.isUnfold) this.isUnfold = false;
        },
        focusAndOpen() {
            if (!this.isUnfold) {
                this.isUnfold = true;
            }
        },
    },
    computed: {
        size() {
            // small by default
            return this.normal ? 'normal' : this.large ? 'large' : 'small';
        },
        selectedItem() {
            return this.items[this.currentIndex]
                ? Object.assign(
                      { iconType: ICON_TYPE.arrowDropDown },
                      this.items[this.currentIndex]
                  )
                : { value: '', text: '', iconType: ICON_TYPE.arrowDropDown };
        },

        header() {
            return this.isIconDropdown
                ? { iconType: this.buttonOptions.iconType }
                : this.buttonOptions.text
                ? Object.assign(
                      { iconType: ICON_TYPE.arrowDropDown },
                      { text: this.buttonOptions.text }
                  )
                : this.selectedItem.keyword
                ? Object.assign({}, this.selectedItem, {
                      text: this.selectedItem.keyword,
                  })
                : this.selectedItem;
        },

        cssValues() {
            const paddingLeft =
                this.size === 'large' ? 17 : this.size === 'normal' ? 16 : 9;
            const fontSize =
                this.size === 'large' ? 16 : this.size === 'normal' ? 14 : 12;
            const rowHeight =
                this.size === 'large' ? 44 : this.size === 'normal' ? 34 : 24;

            let buttonHeight =
                this.buttonSize === 'small'
                    ? 26
                    : this.buttonSize === 'normal'
                    ? 36
                    : 46;
            if (this.isSimpleStyle || this.isIconDropdown) buttonHeight += 2;
            const width = this.width ? this.width + 'px' : '100%';

            return {
                '--dropdown-padding-left': paddingLeft + 'px',
                '--dropdown-font-size': fontSize + 'px',
                '--dropdown-row-height': rowHeight + 'px',
                '--dropdown-rowlist-max-height': rowHeight * 3 + 'px',
                '--dropdown-btn-height': buttonHeight,
                '--dropdown-width': width,
            };
        },

        listPosition() {
            const buttonHeight = this.cssValues['--dropdown-btn-height'];
            if (!this.isIconDropdown || !this.buttonOptions.position)
                return {
                    top: buttonHeight + 'px',
                };

            let ret = {};
            let [vert, hori] = this.buttonOptions.position.split('-');
            const offsetY = buttonHeight + 2 + 'px';

            if (vert === 'top') ret.bottom = offsetY;
            else ret.top = offsetY;

            if (hori === 'left') ret.right = 0;
            else ret.left = 0;

            return ret;
        },
        isIconDropdown() {
            return !!this.buttonOptions.iconType;
        },
        buttonSize() {
            if (this.isIconDropdown && !!this.buttonOptions.size)
                return this.buttonOptions.size;
            return this.size;
        },
        noScrollComputed() {
            /*
             * 1. noScroll props 가 가장 우선한다.
             * 2. icon dropdown 일 경우 사용빈도에 의해 true
             * 3. row count가 지정되면 icon dropdown 에서도 scroll할 수 있다.
             */
            return this.noScroll || this.displayRowCount === undefined && this.isIconDropdown;
        }
    },
    watch: {
        selectedValue(newVal) {
            this.currentIndex = this.items.findIndex(
                item => item.value === newVal
            );
        },

        items() {
            if (this.selectedValue) {
                this.currentIndex = this.items.findIndex(
                    item => item.value === this.selectedValue
                );
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';

.aries-ui-dropdown {
    @include themify($themes) {
        position: relative;
        display: inline-flex;
        cursor: pointer;
        border-radius: 3px;
        font-size: var(--dropdown-font-size);
        min-width: max-content;
        width: var(--dropdown-width);

        &.unfold {
            transition: opacity 1s, height 1s;
            box-shadow: 0 2px 3px 0 themed('dropdown-shadow-color'); // TODO: top position일 경우 예외 처리

            &:not(.simple):not(.hide-selected-text) {
                border-radius: 3px 3px 0 0;

                .aries-ui-btn {
                    border-radius: inherit;

                    ::v-deep svg {
                        transform: rotate(180deg);
                    }
                }

                .row-list {
                    border-radius: 0 0 3px 3px;
                    border-top: none;
                }
            }
        }

        &.simple {
            border: none;
            box-shadow: none;
            .button {
                border-radius: 0;
            }
            .row-list {
                border-radius: 3px;
            }
        }

        &.hide-selected-text {
            border: none;
            box-shadow: none;
            border-radius: 0;
            .row-list {
                top: 10px;
            }
        }

        ::v-deep .aries-ui-btn {
            display: flex;
            width: inherit;
            box-sizing: border-box;
            font-size: var(--dropdown-font-size);
            border-radius: inherit;
            > .item {
                overflow: hidden;
                > span {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding-left: var(--dropdown-padding-left);
                }
                > svg {
                    overflow: visible;
                }
            }
        }

        &.disabled {
            pointer-events: none;
        }
    }
}
</style>
