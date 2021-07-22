<template>
    <div class="filter-condition-on-n-off">
        <btn
            class="close-btn border-none"
            :items="[{ iconType: closeIcon }]"
            @click="closeFilterUI"
        />
        <div class="head">
            <span>{{ i18n.filtering }}</span>
        </div>
        <div class="body">
            <div class="condition-box">
                <span>{{ i18n.filteringCondition }}</span>
                <dropdown
                    :items="filterItems"
                    normal
                    @onchange="updateFilter"
                />
                <div class="filter-values-ux">
                    <dropdown
                        v-show="currentFilterItem.compareTime"
                        :width="82"
                        :items="inequalityItems"
                        normal
                        @onchange="updateInequality"
                    />
                    <input-field
                        :class="{ compareTime: currentFilterItem.compareTime }"
                        normal
                        :placeholder="currentFilterItem.text"
                        v-model="inputFilterValue"
                        @keyup.native.enter="appendFilterOnEnter"
                    ></input-field>
                </div>

                <checkbox
                    v-model="showOnlyException"
                    normal
                    :label="i18n.showOnlyException"
                />
            </div>
            <div class="filter-condition-list-box" v-show="hasFilterList">
                <div class="title-n-remove-all">
                    <span>{{ i18n.filterAdded }}</span>
                    <btn
                        class="border-none"
                        :items="[{ text: i18n.deleteAll }]"
                        @click="deleteAllFilterList"
                    />
                </div>
                <filter-list-box
                    v-show="serviceNameFilterList.length > 0"
                    :type="'serviceName'"
                    :title="i18n.application"
                    :filter-list="serviceNameFilterList"
                ></filter-list-box>
                <filter-list-box
                    v-show="excludeServiceNameFilterList.length > 0"
                    :type="'excludeServiceName'"
                    :title="i18n.excludeApplication"
                    :filter-list="excludeServiceNameFilterList"
                ></filter-list-box>
                <filter-list-box
                    v-show="ipFilterList.length > 0"
                    :type="'ip'"
                    :title="i18n.ipaddr"
                    :filter-list="ipFilterList"
                ></filter-list-box>
                <filter-list-box
                    v-show="userIdFilterList.length > 0"
                    :type="'userId'"
                    :title="i18n.userId"
                    :filter-list="userIdFilterList"
                ></filter-list-box>
                <filter-list-box
                    v-show="guidFilterList.length > 0"
                    :type="'guid'"
                    :title="i18n.guid"
                    :filter-list="guidFilterList"
                ></filter-list-box>
                <filter-list-box
                    v-show="compareTimeFilterList.length > 0"
                    :type="'compareTime'"
                    :title="i18n.compareTime"
                    :filter-list="compareTimeFilterList"
                ></filter-list-box>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script>
import InputField from '@vuejs/component/Input/InputField';
import Btn from '@vuejs/component/button/Btn';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import { i18n } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import {
    filterTypes,
    yAxisTypesInGroupTab,
} from '@entry/analysis/xview/common';
import FilterListBox from '@entry/analysis/xview/container/FilterListBox';
export default {
    name: 'FilterConditionOnNOff',
    inject: {
        i18n,
        theme: {
            type: String,
            default: 'classic',
        },
    },
    components: {
        FilterListBox,
        Btn,
        Checkbox,
        Dropdown,
        InputField,
    },
    data() {
        const filterItems = filterTypes.map(({ key, i18nKey, compareTime }) => {
            return {
                text: this.i18n[i18nKey],
                value: key,
                compareTime: compareTime,
            };
        });
        const inequalityItems = [
            { text: '>', value: '>' },
            { text: '>=', value: '>=' },
            { text: '=', value: '=' },
            { text: '<', value: '<' },
            { text: '<=', value: '<=' },
        ];
        return {
            inputFilterValue: undefined,
            filterItems: filterItems,
            inequalityItems: inequalityItems,
            currentFilterItem: filterItems[0],
            currentInequalityItem: inequalityItems[0],
        };
    },
    methods: {
        ...mapMutations('xviewAnalysis', ['closeFilterUI']),
        ...mapActions('xviewAnalysis', [
            'appendFilter',
            'deleteAllFilterList',
            'updateShowOnlyExceptionInFilter',
        ]),
        updateFilter(item) {
            this.inputFilterValue = undefined;
            this.currentFilterItem = item;
        },
        updateInequality(item) {
            this.currentInequalityItem = item;
        },
        appendFilterOnEnter() {
            const [type, standardTime, inequality] = this.currentFilterItem
                .compareTime
                ? [
                      'compareTime',
                      this.currentFilterItem.value,
                      this.currentInequalityItem.value,
                  ]
                : [this.currentFilterItem.value, undefined, undefined];

            const value = this.inputFilterValue;
            this.appendFilter({ type, value, standardTime, inequality });
            this.inputFilterValue = undefined;
        },
    },
    computed: {
        ...mapState('xviewAnalysis', {
            filteredCondition: state => state.filteredCondition,
            isShowOnlyException: state =>
                state.filteredCondition.showOnlyException,
            serviceNameFilterList: state => state.filteredCondition.serviceName,
            excludeServiceNameFilterList: state =>
                state.filteredCondition.excludeServiceName,
            ipFilterList: state => state.filteredCondition.ip,
            userIdFilterList: state => state.filteredCondition.userId,
            guidFilterList: state => state.filteredCondition.guid,
            compareTimeFilterList: state => state.filteredCondition.compareTime,
        }),
        showOnlyException: {
            get() {
                return this.isShowOnlyException;
            },
            set(value) {
                this.updateShowOnlyExceptionInFilter(Boolean(value));
            },
        },
        hasFilterList() {
            return (
                this.serviceNameFilterList.length > 0 ||
                this.excludeServiceNameFilterList.length > 0 ||
                this.ipFilterList.length > 0 ||
                this.userIdFilterList.length > 0 ||
                this.guidFilterList.length > 0 ||
                this.compareTimeFilterList.length
            );
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        head-text-color: #212121,
        label-text-color: #616161,
    ),
    dark: (
        border-color: #4e4e4e,
        head-text-color: #e8e8e8,
        label-text-color: #616161,
    ),
);
.filter-condition-on-n-off {
    @include themify($themes) {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        overflow-y: auto;
        height: 100%;
        flex: 0 0 320px;
        width: 320px;

        border-left: 1px solid themed('border-color');

        > .head {
            padding: 24px 24px 16px 24px;
            span {
                font-size: 16px;
                color: themed('head-text-color');
            }
        }
        > .body {
            border-top: 1px solid themed('border-color');
            padding: 16px 24px;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            height: 100%;

            > .condition-box {
                display: flex;
                flex-direction: column;
                > span {
                    font-size: 12px;
                    color: themed('label-text-color');
                }

                ::v-deep > .aries-ui-dropdown {
                    margin: 10px 0 8px 0;
                    > .row-list {
                        max-height: none;
                    }
                }

                > .filter-values-ux {
                    display: flex;
                    > .aries-ui-dropdown {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        ::v-deep > .aries-ui-btn .item:last-child {
                            border-right: 0;
                        }
                    }
                    > .input-field-wrapper {
                        &.compareTime {
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                    }
                }

                > .aries-checkbox-wrapper {
                    margin: 32px 0;
                }
            }

            > .filter-condition-list-box {
                > .title-n-remove-all {
                    margin-top: 17px;
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span {
                        color: themed('head-text-color');
                    }
                }
                border-top: 1px solid themed('border-color');
                .filter-list-box {
                    + .filter-list-box {
                        margin-top: 24px;
                    }

                    ::v-deep .aries-ui-btn .item + .item {
                        border-left: none;
                    }
                }
            }
        }
        .close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
        }
    }
}
</style>
