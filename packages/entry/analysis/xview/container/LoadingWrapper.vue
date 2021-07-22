<template>
    <div class="loading-wrapper">
        <loading-indicator :indicator-color="'#8652ff'" />
        <div class="loading-data-message">
            <div class="title">
                {{ i18n.M0630 }}
            </div>
            <div class="content">
                {{ i18n.M0320 }}
            </div>

            <btn
                normal
                :items="[{ text: i18n.stopSearch }]"
                @click="stopSearch"
            />
        </div>
    </div>
</template>

<script>
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';
import { mapState } from 'vuex';
import { Observer } from '@common/legacy/Observer';
import Btn from '@vuejs/component/button/Btn';
import { XViewChartKeywordInObserver } from '@common/ObserverKeyword';

export default {
    name: 'LoadingWrapper',
    components: { LoadingIndicator, Btn },
    inject: ['i18n'],
    computed: {
        ...mapState('xviewAnalysis', {
            loadingData: state => state.loadingData,
        }),
    },
    methods: {
        stopSearch() {
            Observer.emit(XViewChartKeywordInObserver.END_XVIEW_ANALYSIS);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        border-color: #e8e8e8,
        typography-color-primary: #212121,
        typography-color-grey1: #616161,
        interval-text-color: #999999,
        values-box-bg-color: #ffffff,
        values-box-box-shadow1: rgba(0, 0, 0, 0.2),
        values-box-box-shadow2: rgba(0, 0, 0, 0.1),
    ),
    dark: (
        border-color: #4e4e4e,
        typography-color-primary: #e8e8e8,
        typography-color-grey1: #999999,
        interval-text-color: #616161,
        values-box-bg-color: #292929,
        values-box-box-shadow1: rgba(0, 0, 0, 0.2),
        values-box-box-shadow2: rgba(0, 0, 0, 0.1),
    ),
);
.loading-wrapper {
    .loading-data-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;

        padding: 24px;
        border-radius: 4px;
        text-align: center;
        @include themify($themes) {
            background: themed('values-box-bg-color');
            box-shadow: 0 1px 3px 0 themed('values-box-box-shadow1'),
                0 2px 8px 0 themed('values-box-box-shadow2');

            .title {
                font-size: 16px;
                color: themed('typography-color-primary');
            }
            .content {
                font-size: 12px;
                color: themed('typography-color-grey1');
                margin: 16px 0 24px 0;
            }
        }
    }
}
</style>
