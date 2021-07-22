<template>
    <div class="statistics-header">
        <common-header
            :subject="menuName"
            :description="i18nMessages.help"
            :is-domain-group-page="false"
            :loading="loading"
        >
            <template #tools>
                <div class="btn-group">
                    <div
                        class="btn-group-item"
                        v-click-outside="hideSearchConditionBox"
                    >
                        <loading-btn
                            :progress="loading ? 0 : 1"
                            ref="search-target-btn"
                            :disabled="disableInteraction"
                            :show-progress="false"
                            @search="toggleSearchCondition"
                            @stop-search="$emit('stop-search')"
                            normal
                            transparent
                        />
                        <search-condition-box
                            v-show="showSearchCondition"
                            :open-x="searchTargetPosition.x"
                            :open-y="searchTargetPosition.y"
                            v-on:close="hideSearchConditionBox"
                        >
                        </search-condition-box>
                    </div>
                    <div
                        class="btn-group-item"
                        v-click-outside="hideDetailConditionBox"
                    >
                        <btn
                            :items="[
                                { text: i18nMessages.targetSpecificCondition },
                            ]"
                            :disabled="disableInteraction"
                            ref="detail-con-btn"
                            class="transparent"
                            normal
                            @click="toggleDetailBox"
                        />
                        <detail-condition-box
                            v-show="showDetailCondition"
                            :open-x="detailBoxPosition.x"
                            :open-y="detailBoxPosition.y"
                            @close="hideDetailConditionBox"
                            @apply="hideDetailConditionBox(true)"
                        >
                        </detail-condition-box>
                    </div>
                    <circle-loading-btn v-if="printLoading"
                                        type="loading"
                                        :loading="true"
                                        :suspendible="false" />
                    <btn v-else
                         :items="[{ iconType: printIcon }]"
                         :disabled="disableInteraction"
                         :loading="printLoading"
                         :tooltip-options="{
                             message: i18nMessages.print,
                             position: 'bottom-center',
                         }"
                         class="transparent"
                         normal
                         @click="onClickPrint" />
                    <span class="divider"></span>
                </div>
            </template>
        </common-header>

        <confirm-window
            v-if="showPrintConfirmForLoading"
            id="print-confirm"
            :animation-name="'fade-down'"
            :message="i18nMessages.M0651"
            @apply="onConfirmPrint"
            @cancel="showPrintConfirmForLoading = false"
        />
    </div>
</template>
<script>
import Btn from '@vuejs/component/button/Btn';
import LoadingBtn from '@vuejs/component/button/LoadingBtn';
import CircleLoadingBtn from "@vuejs/component/button/CircleLoadingBtn";
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import DetailConditionBox from '@entry/statistics/common/component/layer/DetailConditionBox';
import SearchConditionBox from '@entry/statistics/common/component/layer/SearchConditionBox';
import clickOutside from '@vuejs/directive/clickOutside';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import CommonHeader from '@layout/container/header/CommonHeader';
import i18nMessages from '../../i18n';

export default {
    directives: { clickOutside },
    components: {
        Btn,
        CircleLoadingBtn,
        LoadingBtn,
        CommonHeader,
        DetailConditionBox,
        SearchConditionBox,
        ConfirmWindow,
    },
    provide: {
        i18n: {
            search: i18nMessages.searchCondition,
            searching: i18nMessages.searching,
            stopSearch: i18nMessages.stopSearch,
        },
    },
    props: {
        menuName: {
            type: String,
            required: true,
        },
        disableInteraction: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showSearchCondition: false,
            showDetailCondition: false,
            detailBoxPosition: {
                x: 0,
                y: 0,
            },
            searchTargetPosition: {
                x: 0,
                y: 0,
            },
            showPrintConfirmForLoading: false,
            printIcon: ICON_TYPE.print,
            printLoading: false,
            i18nMessages,
        };
    },
    methods: {
        toggleDetailBox() {
            this.showDetailCondition = !this.showDetailCondition;
        },
        toggleSearchCondition() {
            if (this.loading) {
                this.$emit('stop-search');
                return;
            }
            this.showSearchCondition = !this.showSearchCondition;
        },
        hideDetailConditionBox(moveHash = false) {
            this.showDetailCondition = false;
            if (moveHash === true) {
                this.scrollToSection();
            }
        },
        hideSearchConditionBox() {
            this.showSearchCondition = false;
        },
        onClickPrint() {
            if (this.loading) {
                this.showPrintConfirmForLoading = true;
                return;
            }
            this.print();
        },
        onConfirmPrint() {
            this.showPrintConfirmForLoading = false;
            this.$nextTick(this.print);
        },
        print() {
            this.printLoading = true;
            this.$emit('before-print');

            setTimeout(() => {
                window.print();
                this.printLoading = false;
            }, 100);
        },
        afterPrint() {
            this.$emit('after-print');
        },
        setDetailBoxPos() {
            const { width, height, left, top } = this.$refs[
                'detail-con-btn'
            ].$el.getBoundingClientRect();
            this.detailBoxPosition = {
                x: left + width - 300,
                y: top + height + 8,
            };
        },
        setSearchTargetPos() {
            const { width, height, left, top } = this.$refs[
                'search-target-btn'
            ].$el.getBoundingClientRect();
            this.searchTargetPosition = {
                x: left + width,
                y: top + height + 8,
            };
        },
        scrollToSection(hash = 'perf-detail-in-instance') {
            const targetEl = document.querySelector(`#${hash}`);
            if (!!targetEl && targetEl.scrollIntoView) {
                setTimeout(() => {
                    targetEl.scrollIntoView({
                        block: 'start',
                        behavior: 'smooth',
                    });
                }, 200);
            }
        },
    },
    mounted() {
        this.setDetailBoxPos();
        this.setSearchTargetPos();
    },
    beforeMount() {
        window.addEventListener('afterprint', this.afterPrint);
    },
    beforeDestroy() {
        window.removeEventListener('afterprint', this.afterPrint);
    },
};
</script>

<style lang="scss" scoped>
@import './themes';

.statistics-header {
    @include themify($themes) {
        position: relative;

        .menu-name {
            font-size: 20px;
            font-weight: bold;
            color: themed('typography-color-primary');
        }
        .btn-group {
            display: flex;
            align-items: center;
            .btn-group-item {
                margin-right: 8px;
            }
        }
        .divider {
            display: inline-block;
            width: 1px;
            height: 16px;
            margin: 0 8px;
            background-color: themed('border-color');
        }
        .shadow-layer {
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -12px;
            z-index: -1;
        }

        // TODO: 레이아웃 변경 시 제거
        ::v-deep .aries-loading-indicator {
            top: 0;
            left: -20px;
            right: -20px;
        }
    }
}
</style>
