<template>
    <div
        class="composed-dropdown-wrapper"
        v-click-outside="close"
        :class="[
            size,
            { unfold: isUnfold },
            { simple: isSimpleStyle || isIconDropdown },
        ]"
        :style="cssValues"
    >
        <btn
            :items="[header]"
            :class="[
                { disabled },
                { 'border-none': isSimpleStyle || isIconDropdown },
            ]"
            :pressed="(isSimpleStyle || isIconDropdown) && isUnfold"
            :[size]="true"
            @click="onClickUnfold"
            @focus.native="focusAndOpen"
        />
        <popup-list-composed
            v-show="isUnfold"
            :offset-y="offsetY"
            :style="cssValues"
            :class="[listPosition]"
        >
            <slot></slot>
        </popup-list-composed>
    </div>
</template>

<script>
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import Btn from '@vuejs/component/button/Btn';
import PopupListComposed from './PopupListComposed';
import clickOutside from '@vuejs/directive/clickOutside';
import SizeMixin from "@vuejs/mixin/SizeMixin";

export default {
    name: 'DropdownComposed',
    directives: { clickOutside },
    mixins: [SizeMixin],
    provide() {
        return { injectedSize: this.size };
    },
    components: {
        Btn,
        PopupListComposed,
    },
    props: {
        isSimpleStyle: {
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
        buttonOptions: {
            type: Object,
            default: () => ({
                text: '',
                iconType: undefined,
                position: 'left', // left or right
            }),
        },
    },
    computed: {
        isIconDropdown() {
            return !!this.buttonOptions.iconType;
        },
        header() {
            return this.isIconDropdown
                ? { iconType: this.buttonOptions.iconType }
                : Object.assign(
                      { iconType: ICON_TYPE.arrowDropDown },
                      { text: this.buttonOptions.text || '' }
                  );
        },
        cssValues() {
            const wrapperPaddingRight =
                this.size === 'large' || this.size === 'normal'
                    ? 48
                    : 32;
            const width = this.width
                ? this.width + 'px'
                : this.isIconDropdown
                ? 'max-content'
                : '100%';

            return {
                '--dropdown-width': width,
                '--wrapper-padding-right': wrapperPaddingRight + 'px',
            };
        },
        listPosition() {
            let ret = { left: true, right: true };
            if (!this.isIconDropdown || !this.buttonOptions.position)
                return ret;

            const hori = this.buttonOptions.position;
            if (hori === 'left') ret.left = false;
            else ret.right = false;

            return ret;
        },
        offsetY() {
            let buttonHeight =
                this.size === 'small'
                    ? 26
                    : this.size === 'normal'
                    ? 36
                    : 46;
            const marginTop = 2;
            if (this.isSimpleStyle || this.isIconDropdown)
                buttonHeight += marginTop;
            return buttonHeight;
        },
        size() {
            // small by default
            return this.normal ? 'normal' : this.large ? 'large' : 'small';
        },
    },
    data() {
        return {
            isUnfold: false,
        };
    },
    methods: {
        onClickUnfold() {
            this.isUnfold = !this.isUnfold;
        },
        focusAndOpen() {
            if (!this.isUnfold) {
                this.isUnfold = true;
            }
        },
        close() {
            if (this.isUnfold) this.isUnfold = false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.composed-dropdown-wrapper {
    @include themify($themes) {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        min-width: max-content;
        width: var(--dropdown-width);

        .aries-ui-btn {
            width: inherit;
        }

        &.unfold:not(.simple) {
            /*box-shadow: 0 2px 3px 0 themed('dropdown-shadow-color');*/

            .popup-list-group {
                border-radius: 0 0 3px 3px;
                border-top: none;
            }

            .aries-ui-btn {
                border-radius: 3px 3px 0 0;

                ::v-deep {
                    .item {
                        border-bottom: 1px solid
                            themed('tab-border-bottom-color');
                    }

                    svg {
                        transform: rotate(180deg);
                    }
                }
            }
        }

        &.disabled {
            pointer-events: none;
        }
    }
}
</style>
