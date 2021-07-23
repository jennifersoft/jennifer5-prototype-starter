<template>
    <div
        class="list-selector-container"
        :class="[{ 'header-none': hideHeader }]"
    >
        <div class="head-tab" v-if="!hideHeader">
            <div class="tab-left">
                <checkbox
                    v-if="multiSelect"
                    :active="allChecked"
                    :disabled="disabled"
                    @change="allCheckHandler"
                />
                <span
                    class="head-label"
                    :class="{ multiSelect }"
                    @click="multiSelect && allCheckHandler()"
                    >{{ titleLabel }}</span
                >
            </div>
            <transition name="flip" type="in-out" v-if="!noSearch">
                <svg-icon
                    v-if="!searchEnable"
                    class="search-icon-before"
                    :icon-type="iconType"
                    :width="16"
                    :height="16"
                    @click.native="enableSearchMode"
                    key="not-search"
                />
                <search
                    v-else
                    :value="searchText"
                    @clear="disableSearchMode"
                    @blur="disableSearchMode"
                    @change="_setSearchText"
                    @keydown.esc.native="disableSearchMode"
                    small
                    cancelable
                    key="search"
                    ref="search"
                />
            </transition>
        </div>
        <div class="list-container">
            <ListRow
                v-for="(m, i) of innerList"
                v-if="isMatch(m)"
                :tooltip-on-left="tooltipOnLeft"
                :key="i"
                :index="i"
                :list-row="m"
                :selected="i === selectedListRowIndex"
                :checkable="multiSelect"
                :tail-style="m.tailStyle"
                @click="listRowSelectHandler(i, m)"
                @checkClicked="listRowCheckHandler(i)"
            >
            </ListRow>
        </div>
        <div class="prevent-layer" v-if="disabled"></div>
    </div>
</template>

<script>
import _ from '@library/lodash';

import Checkbox from '@vuejs/component/toggle/Checkbox.vue';
import ListRow from './ListRow';
import SvgIcon from '../icon/SvgIcon';
import { ICON_TYPE } from '../icon/iconType';
import Search from '../input/Search';

export default {
    components: {
        Checkbox,
        ListRow,
        SvgIcon,
        Search,
    },
    props: {
        list: {
            type: Array,
            required: true,
        },
        titleLabel: {
            type: String,
            default: '',
        },
        multiSelect: {
            type: Boolean,
            default: false,
        },
        noSearch: {
            type: Boolean,
            default: false,
        },
        activeIndexes: {
            type: Array,
            required: false,
            default: () => [],
        },
        tooltipOnLeft: {
            type: Boolean,
            required: false,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        hideHeader: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            searchEnable: false,
            searchText: '',
            // 단일 선택일 때에 대한 최초 설정값 처리
            selectedListRowIndex:
                !this.multiSelect && this.activeIndexes.length === 1
                    ? this.activeIndexes[0]
                    : -1,
            innerList: this.list.map((l, i) => ({
                // 멀티선택일 때에 대한 최초 설정값 처리
                check:
                    this.multiSelect && this.activeIndexes.includes(i)
                        ? 'on'
                        : 'off',
                data: l,
                label: l.label || '',
                description: l.description || '',
            })),
            iconType: ICON_TYPE.search,
        };
    },
    computed: {
        allChecked() {
            if (!this.innerList.length) {
                return false;
            }
            return this.innerList.every(r => r.check === 'on');
        },
    },

    watch: {
        list() {
            this.innerList = this.list.map(l => ({
                data: l,
                label: l.label || '',
                description: l.description || '',
            }));
        },
        activeIndexes() {
            this.selectedListRowIndex =
                !this.multiSelect && this.activeIndexes.length === 1
                    ? this.activeIndexes[0]
                    : -1;
        },
    },
    methods: {
        toggleSearch() {
            if (this.searchEnable) {
                this.disableSearchMode();
            } else {
                this.enableSearchMode();
            }
        },
        _setSearchText(t) {
            this.searchText = t;
        },
        searchInputHandler: _.debounce(function(e) {
            return this._setSearchText(e.target.value);
        }, 300),
        enableSearchMode() {
            if (!this.searchEnable) this.searchEnable = true;
            this.$nextTick(() => {
                // focus after mount
                this.$refs.search.$el.getElementsByTagName('input')[0].focus();
            });
        },
        disableSearchMode() {
            if (this.searchText?.length > 0) return;
            this.searchEnable = false;
        },
        listRowSelectHandler(i, r) {
            this.selectedListRowIndex = i;
            this.$emit('list-select', r.data);
        },
        unselectList() {
            this.selectedListRowIndex = -1;
        },
        listRowCheckHandler(i) {
            this.$set(this.innerList, i, {
                ...this.innerList[i],
                check: this.innerList[i].check === 'on' ? 'off' : 'on',
            });
            this.$emit(
                'check',
                this.innerList.filter(r => r.check === 'on').map(r => r.data)
            );
        },
        allCheckHandler() {
            this.innerList = this.innerList.map(r => ({
                ...r,
                check: this.allChecked ? 'off' : 'on',
            }));
            this.$emit(
                'check',
                this.innerList.filter(r => r.check === 'on').map(r => r.data)
            );
        },
        uncheckAll() {
            this.innerList = this.innerList.map(r => ({
                ...r,
                check: 'off',
            }));
            this.$emit('check', []);
        },
        isMatch(m) {
            const cleanSearchText = this.searchText.trim().toLowerCase();
            const labelMatch = m.label
                .trim()
                .toLowerCase()
                .includes(cleanSearchText);
            const descriptionMatch = m.description
                .trim()
                .toLowerCase()
                .includes(cleanSearchText);
            return labelMatch || descriptionMatch;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        border-color: #dadada,
        tab-border-color: #d8d8d8,
        head-label-color: #333333,
        search-icon-before-color: #616161,
        prevent-layer-bg-color: #000,
    ),
    dark: (
        border-color: #4e4e4e,
        tab-border-color: #4e4e4e,
        head-label-color: #e8e8e8,
        search-icon-before-color: #999999,
        prevent-layer-bg-color: #fff,
    ),
);

.list-selector-container {
    @include themify($themes) {
        position: relative;
        border-radius: 3px;
        border: 1px solid themed('border-color');
        min-width: 100px;
        min-height: 180px;
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        font-size: 0;
        overflow: hidden;
        user-select: none;

        .prevent-layer {
            position: absolute;
            display: inline-block;
            width: 100%;
            height: calc(100% - 35px);
            z-index: 1;
            top: 35px;
            left: 0;
            opacity: 0.05;
            background-color: themed('prevent-layer-bg-color');
        }

        > .list-container {
            position: absolute;
            top: 34px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
            padding: 4px 2px 4px;
        }

        &.header-none {
            > .list-container {
                top: 0;
            }
        }

        .head-tab {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5px 0 9px;
            height: 34px;
            box-sizing: border-box;
            border-bottom: 1px solid themed('tab-border-color');
        }
        .head-label {
            font-size: 12px;
            line-height: 12px;
            color: themed('head-label-color');

            &.multiSelect {
                cursor: pointer;
            }
        }

        .search-icon-before {
            cursor: pointer;
            right: 9px;
            position: absolute;
            color: themed('search-icon-before-color');
        }
        .search-input-wrapper {
            max-width: 150px;
        }
    }
}

.flip-enter {
    opacity: 0;
}
.flip-leave-to {
    opacity: 0;
}
.flip-enter-active,
.flip-leave-active {
    transition-duration: 0.2s;
}
</style>
