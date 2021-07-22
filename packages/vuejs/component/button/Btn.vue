<template>
    <div
        class="aries-ui-btn"
        :class="[...uiClass, { loading }, { disabled }, size]"
        ref="r"
        :tabindex="focusable ? 0 : -1"
        @focus="onFocusAscendant"
        @mousedown.stop
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
        @keydown.left.prevent="focusPrev"
        @keydown.up.prevent="focusPrev"
        @keydown.right.prevent="focusNext"
        @keydown.down.prevent="focusNext"
        @keydown.space.prevent="onClickRow(focusIndex)"
    >
        <!--        default: { cursor-none: true, position: 'bottom-center', offset: 4 }-->
        <tooltip-balloon
            v-if="activeTooltip"
            :position="tooltipOptionsComputed.position"
            :style="tooltipStyle(tooltipOptionsComputed.position)"
            cursor-none
        >
            <span v-html="tooltipOptionsComputed.message"></span>
        </tooltip-balloon>
        <div
            class="item"
            tabindex="-1"
            v-for="(item, index) in items"
            :class="[
                {
                    selected:
                        isBtnGroup &&
                        isRadioOrCheckbox &&
                        selectedIndexArray.includes(index),
                },
                {
                    pressed,
                },
            ]"
            :id="item.id"
            :value="item.value"
            @click="onClickRow(index)"
            @blur="onBlur"
        >
            <svg-icon
                v-if="item.iconType !== undefined && iconFirst
                    || isSingleIcon"
                :icon-type="item.iconType"
            />
            <span v-if="item.text !== undefined">{{ item.text }}</span>
            <svg-icon
                v-if="item.iconType !== undefined && !iconFirst
                    && !isSingleIcon"
                :iconType="item.iconType"
            />
            <svg-icon
                    v-if="loading"
                    :icon-type="loadingIcon"
                    class="spinning"
            />
        </div>
    </div>
</template>
<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import FocusMixin from '@vuejs/mixin/FocusGroupMixin';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import TooltipBalloon from '@vuejs/component/tooltip/TooltipBalloon';
import { tooltipStyle } from '@vuejs/component/tooltip/Tooltip';
import SizeMixin from '@vuejs/mixin/SizeMixin';

export default {
    name: 'Btn',
    components: { TooltipBalloon, SvgIcon },
    mixins: [FocusMixin, SizeMixin],
    props: {
        uiClass: {
            type: Array,
            required: false,
            default: () => [],
        },
        typeInGroupButton: {
            type: String,
            required: false,
            default: 'radio', // or 'checkbox', 'noselect'
        },
        selectedValue: {
            type: [String, Array],
            required: false,
            default: undefined, // typeInGroupButton 이 'radio' 인것만 현재 지원한다.
        },
        items: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        pressed: {
            type: Boolean,
            default: false,
        },
        tooltipOptions: {
            type: Object,
            default: null,
        },
        iconFirst: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            typeListInGroupButton: ['radio', 'checkbox', 'noselect'],
            selectedIndexArray:
                this.typeInGroupButton === 'radio'
                    ? this.selectedValue
                        ? [
                              this.items.findIndex(
                                  item => item.value === this.selectedValue
                              ),
                          ]
                        : [0]
                    : [],
            focusable: true,
            loadingIcon: ICON_TYPE.loading,
            activeTooltip: false,
        };
    },
    methods: {
        click() {
            this.$emit('click');
        },

        onClickRow(index) {
            if (this.typeInGroupButton === 'radio')
                this.selectedIndexArray = [index];
            else if (this.typeInGroupButton === 'checkbox') {
                const oldSelectedIndexArray = this.selectedIndexArray;
                const foundIndexOrSeletedIndexArray = oldSelectedIndexArray.findIndex(
                    selectedIndex => selectedIndex === index
                );
                foundIndexOrSeletedIndexArray > -1
                    ? oldSelectedIndexArray.splice(
                          foundIndexOrSeletedIndexArray,
                          1
                      )
                    : oldSelectedIndexArray.push(index);

                this.selectedIndexArray = oldSelectedIndexArray;
            }

            const selectedItem = this.items[index];
            this.$emit('click', selectedItem);
        },
        onBlur() {
            this.focusIndex = 0;
        },
        onMouseover() {
            if (!!this.tooltipOptions) this.activeTooltip = true;
        },
        onMouseleave() {
            if (!!this.tooltipOptions) this.activeTooltip = false;
        },
    },

    computed: {
        isBtnGroup() {
            return this.items.length > 1;
        },

        isRadioOrCheckbox() {
            return (
                this.typeInGroupButton === 'radio' ||
                this.typeInGroupButton === 'checkbox'
            );
        },
        isSingleIcon() {
            // if single icon btn, be replaced with loading icon when loading
            return (
                this.items.length === 1 &&
                Object.keys(this.items[0]).length === 1 &&
                this.items[0].iconType !== undefined
            );
        },
        tooltipOptionsComputed() {
            return {
                position: this.tooltipOptions?.position || 'bottom-center',
                message: this.tooltipOptions?.message || '',
                offset: 4,
            };
        },
        size() {
            return this.normal
                ? 'size-medium'
                : this.large
                ? 'size-large'
                : 'size-small';
        },
    },

    watch: {
        items(items) {
            if (items.length === 0)
                console.error('btn.vue - items props is empty');
        },

        selectedValue() {
            const selectedIndex = this.items.findIndex(
                item => item.value === this.selectedValue
            );
            this.selectedIndexArray = [selectedIndex];
        },
    },
    mounted() {
        this.focusable = !this.$refs['r'].classList.contains('disabled');
        this.tooltipStyle = tooltipStyle;
    },
};
</script>
<style lang="scss" scoped>
.aries-ui-btn {
    @import '~@vuejs/component/themes.scss';
    @include themify($themes) {
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        outline: none;

        display: inline-flex;
        flex-direction: row;
        position: relative;

        height: 26px;
        line-height: 26px;
        min-width: 26px;
        font-size: 12px;
        border-radius: 3px;

        &.edge-pill {
            border-radius: 12px;
        }

        &.loading {
            pointer-events: none;

            @keyframes spin {
                from {
                    transform: rotate(0);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            .spinning {
                animation: spin 0.8s infinite linear;
            }
        }

        .item {
            border-top: 1px solid themed('border-color');
            border-bottom: 1px solid themed('border-color');

            padding: inherit;
            &:first-child {
                border-left: 1px solid themed('border-color');
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;
            }
            &:last-child {
                border-right: 1px solid themed('border-color');
                border-top-right-radius: inherit;
                border-bottom-right-radius: inherit;
            }
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            transition: background-color .2s, color .2s;

            .icon {
                width: 16px;
                height: 16px;
            }

            > span + svg {
                margin-left: auto;
                margin-right: 5px;
            }

            > svg {
                &:first-child:last-child {
                    width: 26px;
                }
            }

            > span {
                padding: 0 8px;
            }

            background: themed('background-color-none');
            color: themed('typography-color-grey1');

            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 100%;
                border-radius: inherit;
                transition: background-color .18s, color .18s;
            }

            &:hover {
                &::before {
                    background-color: themed('behaviors-hover-color');
                }
                color: themed('typography-color-primary');
            }

            &:active,
            &.pressed {
                &::before {
                    background-color: themed('behaviors-press-color');
                }
                color: themed('typography-color-grey1');
            }

            /*mixin 을 사용해서 상태별 컬러값을 모듈화 하자.*/
            /*.selected .focus 는 상태가 같다.*/
            /*https://sass-lang.com/documentation/at-rules/mixin*/

            &.selected {
                border-color: themed('background-color-purple');
                background-color: themed('background-color-purple');
                color: themed('typography-color-white');
            }

            /*
            /* 키보드 이벤트에 의한 포커스만 동작하는 pseudo selector로 크롬 최신 버전이 아니면 제대로 동작하지 않을 수 있음.
            /* https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
            */
            &:focus-visible {
                outline: none;
                box-shadow: 0 0 0 1px themed('background-color-purple');
                z-index: 1;
            }

            &:focus:not(:focus-visible) {
                outline: none;
            }
        }

        .tooltip-balloon + .item {
            border-left: 1px solid themed('border-color');
            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
            &.selected {
                border-color: themed('background-color-purple');
            }
        }

        //요하랑 3가지 크기로 상의함.
        &.size-small {
            height: 26px;
            line-height: 26px;
            min-width: 26px;
            font-size: 12px;
            border-radius: 3px;

            &.edge-pill {
                border-radius: 12px;
            }

            > .item {
                .icon {
                    width: 16px;
                    height: 16px;
                }
                span + svg {
                    margin-right: 5px;
                }
                .spinning:not(:last-child) {
                    margin: 0 -4px 0 8px;
                }
                > svg:first-child:not(:last-child) {
                    margin-left: 5px;
                }
            }
        }

        &.size-medium {
            height: 36px;
            line-height: 36px;
            min-width: 36px;
            font-size: 14px;
            border-radius: 3px;

            > .item {
                .icon {
                    width: 20px;
                    height: 20px;
                }

                > span {
                    padding: 0 16px;
                }

                > svg {
                    &:first-child:not(:last-child) {
                        margin-left: 9px;
                    }
                    &:first-child:last-child {
                        width: 36px;
                    }
                    &.spinning:not(:last-child) {
                        margin: 0 -8px 0 16px;
                    }
                }

                > span + svg {
                    margin-right: 9px;
                }
            }

            &.edge-pill {
                border-radius: 18px;
            }
        }

        &.size-large {
            height: 46px;
            line-height: 46px;
            min-width: 46px;
            font-size: 16px;
            border-radius: 3px;

            &.edge-pill {
                border-radius: 23px;
            }

            > .item {
                .icon {
                    width: 24px;
                    height: 24px;
                }

                > span {
                    padding: 0 24px;
                }

                > svg {
                    &:first-child:not(:last-child) {
                        margin-left: 12px;
                    }
                    &:first-child:last-child {
                        width: 46px;
                    }
                    &.spinning:not(:last-child) {
                        margin: 0 -12px 0 24px;
                    }
                }

                > span + svg {
                    margin-right: 12px;
                }
            }
        }

        --text-color: #{themed('typography-color-grey1')};
        --background-color: #{themed('background-color-none')};

        &.primary,
        &.focus {
            --text-color: #{themed('typography-color-purple')};
            --background-color: #{themed('background-color-purple')};
        }

        &.primary-reverse,
        &.light-focus {
            > .item {
                border: none;
                background: themed('background-color-lightpurple');
                color: themed('toggle-behaviors-active-lightpurple-text-color');
            }
        }

        &.danger {
            --text-color: #{themed('typography-color-red')};
            --background-color: #{themed('background-color-red')};
        }

        &.success {
            --text-color: #{themed('typography-color-green')};
            --background-color: #{themed('background-color-green')};
        }

        &.primary,
        &.danger,
        &.success,
        &.focus {
            &:not(.outlined):not(.transparent):not(.disabled) > .item {
                border: none;
                background: var(--background-color);
                color: themed('typography-color-white');
            }
            &.outlined,
            &.transparent,
            &.border-none {
                > .item {
                    color: var(--text-color);
                    background: none;
                }
            }
        }

        &.outlined > .item {
            border-color: var(--background-color);
        }

        &.hoverd {
            > .item {
                background-color: themed('behaviors-hover-color');
                color: themed('typography-color-primary');
            }
        }

        &.border-none,
        &.transparent {
            > .item {
                border: none;
            }
        }

        &.disabled {
            background: themed('background-color-none') !important;
            opacity: 0.5;
            pointer-events: none;
        }

        .item + .item {
            border-left: solid 1px themed('border-color');
        }
    }
}
</style>
