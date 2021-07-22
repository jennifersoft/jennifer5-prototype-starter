<template>
    <div class="aries-ui-loading-btn" :class="[size, { transparent }]">
        <div
            v-if="!disabled && progress < 1"
            class="loading"
            :class="{ suspendible }"
            @mouseover="onMouseover"
            @mouseleave="onMouseleave"
            @click="onClickStopSearch"
        >
            {{ loadingMessage }}
            <div
                class="loading-layer"
                :style="{ width: progress * 100 + '%' }"
            ></div>
        </div>
        <div
            v-else
            class="default"
            :class="{ disabled }"
            @click="onClickSearch"
        >
            {{ i18n.search }}
        </div>
    </div>
</template>

<script>
import LoadingBtnMixin from '@vuejs/mixin/LoadingBtnMixin';
import SizeMixin from '@vuejs/mixin/SizeMixin';
export default {
    name: 'LoadingBtn',
    inject: {
        i18n: {
            default: () => ({
                search: 'Search',
                searching: 'Searching...',
                stopSearch: 'Stop searching',
            }),
        },
    },
    mixins: [SizeMixin, LoadingBtnMixin],
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        showProgress: {
            type: Boolean,
            default: true,
        },
        transparent: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        loadingMessage() {
            if (this.stopActive) return this.i18n.stopSearch;
            let msg = this.i18n.searching;
            if (this.showProgress) msg += `${Math.floor(this.progress * 100)}%`;
            return msg;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.aries-ui-loading-btn {
    @include themify($themes) {
        display: inline-flex;
        height: 36px;
        line-height: 36px;
        min-width: 36px;
        font-size: 14px;
        border-radius: 3px;
        color: themed('typography-color-grey1');
        border: 1px solid themed('border-color');
        text-align: center;

        &.small {
            height: 26px;
            line-height: 26px;
            min-width: 26px;
            font-size: 12px;
            .default {
                padding: 0 12px;
            }
            .loading {
                width: 120px;
            }
        }

        &.large {
            height: 46px;
            line-height: 46px;
            min-width: 46px;
            font-size: 16px;
            .default {
                padding: 0 24px;
            }
            .loading {
                width: 180px;
            }
        }

        &.transparent {
            border-color: transparent;
        }

        .default {
            padding: 0 16px;
            &.disabled {
                background: themed('background-color-none') !important;
                opacity: 0.5;
                pointer-events: none;
            }
        }

        .loading {
            // '검색 중' 메세지와 '검색중단' 메세지의 길이가 달라 hover시에 전체 길이가 변하는 이유로 고정 너비
            width: 150px;
            &:not(.suspendible) {
                pointer-events: none;
            }

            .loading-layer {
                transition: width 0.2s;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: themed('loading-btn-layer-background');
                border-bottom: 1px solid themed('background-color-purple');
                border-top-left-radius: inherit;
                border-bottom-left-radius: inherit;
            }
        }
    }

    @import '~@vuejs/style/hover-and-active.scss';
    .loading,
    .default {
        cursor: pointer;
        border-radius: inherit;
        @include hover-and-active;
    }
}
</style>
