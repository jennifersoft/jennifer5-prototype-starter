<template>
    <ul
        class="row-list"
        :class="[{ 'no-scroll': noScroll }, { inline }]"
        :style="cssValues"
        ref="r"
        @keydown.left.prevent="focusPrev"
        @keydown.up.prevent="focusPrev"
        @keydown.right.prevent="focusNext"
        @keydown.down.prevent="focusNext"
        @keydown.space.prevent="onClickRow(focusIndex)"
    >
        <div v-if="title" class="list-header">{{ title }}</div>
        <li
            class="row"
            v-for="(item, index) in items"
            :class="[{ selected: isRowActive(index) }]"
            :style="item.style"
            :value="item.value"
            :tabindex="isMultiSelect || noSelect ? undefined : -1"
            @click.stop="onClickRow(index)"
        >
            <template v-if="type === 'icon'">
                <svg-icon
                    v-if="isRowActive(index)"
                    :icon-type="checkIcon"
                    :width="iconSize"
                    :height="iconSize"
                />
                <span v-else class="space"></span>
            </template>
            <checkbox
                v-else-if="type === 'checkbox'"
                :active="isRowActive(index)"
                no-default-margin
            />
            <span v-else-if="type === 'space'" class="space"></span>
            <span class="text" v-html="item.text" />
            <toggle-switch v-if="type === 'switch'"
                           :[size]="true"
                           :active="isRowActive(index, false)" />
            <svg-icon v-if="removable"
                      class="trash-icon"
                      @click.native.stop="$emit('remove', index)"
                      :icon-type="trashIcon"
                      :width="iconSize"
                      :height="iconSize" />
        </li>
    </ul>
</template>

<script>
import FocusGroupMixin from '@vuejs/mixin/FocusGroupMixin';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import ToggleSwitch from "@vuejs/component/Toggle/ToggleSwitch";
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import SizeMixin from "@vuejs/mixin/SizeMixin";

export default {
    name: 'PopupList',
    mixins: [FocusGroupMixin, SizeMixin],
    components: {
        Checkbox,
        SvgIcon,
        ToggleSwitch,
    },
    inject: {
        injectedSize: {
            type: String,
            default: undefined,
        },
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        activeIndex: {
            type: [Number, Array], // number if single-select, array if multi-select
            default: -1,
        },
        title: {
            type: String,
            required: false,
        },
        noScroll: {
            type: Boolean,
            default: true,
        },
        displayRowCount: {
            type: Number,
            default: 3,
        },
        width: {
            type: Number,
            default: undefined,
        },
        overflowX: {
            // dropdown의 button width보다 list width가 클 때 true
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'default',
            validator(t) {
                return ([
                        'default',
                        'space',
                        'icon',
                        'checkbox',
                        'switch',
                    ].indexOf(t) !== -1
                    // multi-select if type checkbox
                );
            },
        },
        noSelect: {
            // can toggle if true
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
        removable: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            focusTarget: 'row',
            checkIcon: ICON_TYPE.check,
            trashIcon: ICON_TYPE.trashcan,
        };
    },
    computed: {
        size() {
            // small by default
            if (!!this.injectedSize) return this.injectedSize;
            return this.normal ? 'normal' : this.large ? 'large' : 'small';
        },
        getSize() {
            return this.injectedSize || this.size;
        },
        cssValues() {
            const paddingLeft =
                this.getSize === 'large' || this.getSize === 'normal'
                    ? 16
                    : 8;
            let paddingRight =
                this.getSize === 'large' || this.getSize === 'normal'
                    ? 48
                    : 32;
            const paddingTop = 8;
            if (this.removable) paddingRight = paddingRight / 2;
            const fontSize =
                this.getSize === 'large'
                    ? 16
                    : this.getSize === 'normal'
                    ? 14
                    : 12;
            const rowHeight =
                this.getSize === 'large'
                    ? 44
                    : this.getSize === 'normal'
                    ? 34
                    : 24;
            const headerHeight =
                this.getSize === 'large' || this.getSize === 'normal'
                    ? 24
                    : 20;
            const topIfSimpleStyle =
                this.getSize === 'large' || this.getSize === 'normal'
                    ? rowHeight + 8
                    : rowHeight + 4;
            const checkboxMargin = this.getSize === 'large'

            return {
                '--dropdown-padding-left': paddingLeft + 'px',
                '--dropdown-padding-right': paddingRight + 'px',
                '--dropdown-font-size': fontSize + 'px',
                '--dropdown-row-height': rowHeight + 'px',
                '--dropdown-rowlist-max-height':
                    rowHeight * this.displayRowCount + 2 * paddingTop + 'px',
                '--dropdown-top-if-simple-style': topIfSimpleStyle + 'px',
                '--dropdown-header-height': headerHeight + 'px',
                '--dropdown-inline-type-size': this.iconSize + 'px',
                '--checkbox-margin': (this.iconSize - 16) / 2 + 'px',
                width: this.width
                    ? this.width + 'px'
                    : this.overflowX
                    ? 'max-content'
                    : '100%',
            };
        },
        iconSize() {
            return this.getSize === 'large'
                ? 24
                : this.getSize === 'normal'
                ? 20
                : 16;
        },
        isMultiSelect() {
            return this.type === 'checkbox' || this.type === 'switch';
        },
    },
    methods: {
        onClickRow(index) {
            if (this.isMultiSelect) {
                const ret = [...this.activeIndex];
                ret[index] = !ret[index];
                this.$emit('update:active-index', ret);
            } else {
                let ret = index;
                if (this.noSelect && this.activeIndex === index) ret = -1;
                this.$emit('update:active-index', ret);
            }
        },
        isRowActive(index, rowStyle = true) {
            if (rowStyle && this.type === 'switch') return false;
            if (this.isMultiSelect) return this.activeIndex[index];
            return this.activeIndex === index;
        },
    },
    mounted() {
        if (this.activeIndex < 0 || this.isMultiSelect) return;
        this.$refs.r.children[this.activeIndex].focus();
        this.focusIndex = this.activeIndex;
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.row-list {
    @include themify($themes) {
        border: solid 1px themed('border-color');
        box-sizing: border-box;
        overflow-x: hidden;
        list-style: none;
        font-size: var(--dropdown-font-size);
        padding: 8px 0;
        margin: 0;
        border-radius: 3px;

        &:not(.inline) {
            box-shadow: 0 2px 3px 0 themed('dropdown-shadow-color');
            background-color: themed('dropdown-list-background-color');
            z-index: 1000;
            position: absolute;
        }

        &:not(.no-scroll) {
            max-height: var(--dropdown-rowlist-max-height);
            overflow-y: auto;
        }

        // NOTICE: no-scroll일 때는 ellipsis로 padding-right를 명시적으로 표현함.
        &.no-scroll > .row {
            > .text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .list-header {
            display: flex;
            align-items: flex-end;
            padding: 0 var(--dropdown-padding-left);
            color: themed('typography-color-grey1');
            font-size: 12px;
            height: var(--dropdown-header-height);
            line-height: var(--dropdown-header-height);
            vertical-align: text-bottom;
            cursor: default;
        }

        .row {
            padding: 0 var(--dropdown-padding-right) 0
                var(--dropdown-padding-left);
            height: var(--dropdown-row-height);
            line-height: var(--dropdown-row-height);
            color: themed('typography-color-grey1');
            list-style: none;
            user-select: none;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            align-items: center;
            cursor: pointer;

            &:hover,
            &:focus {
                background-color: themed('toggle-behaviors-hover-color');
                color: themed('typography-color-primary');
                outline: none;
            }

            &.selected {
                background-color: themed('background-color-lightpurple');
                color: themed('toggle-behaviors-active-lightpurple-text-color');
            }

            > .icon {
                vertical-align: text-bottom;
                flex-shrink: 0;
                &.trash-icon {
                    margin: 0 0 0 auto;
                }
            }

            .aries-checkbox-wrapper {
                margin: 0 var(--checkbox-margin);
            }

            .aries-checkbox-wrapper, .aries-switch-wrapper {
                vertical-align: 5%;
            }

            .aries-switch-wrapper {
                margin-left: auto;
                margin-right: -24px;
                &.large, &.normal {
                    margin-right: -32px;
                }
            }

            .space {
                display: inline-block;
                width: var(--dropdown-inline-type-size);
            }

            ::v-deep .text {
                &:not(:first-child) {
                    margin-left: 8px;
                }
                .marked {
                    font-weight: bold;
                    color: themed('typography-color-primary')
                }
            }
        }
    }
}
</style>
