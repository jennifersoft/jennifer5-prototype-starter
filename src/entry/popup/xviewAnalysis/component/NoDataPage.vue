<template>
    <div class="loading-page no-data">
        <div class="layer">
            <div class="top">
                <img svg-inline class="logo" src="../asset/no-data.svg" />
            </div>
            <div class="title">{{ i18n.M0004 }}</div>
            <div class="detail" v-html="i18n.M0631"></div>
            <div class="tool">
                <btn large
                    :items="[{ text: i18n.confirm }]"
                    @click="closeXViewAnalysisPopup"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';

export default {
    inject: {
        i18n: {
            default: {
                M0004: 'M0004',
                M0631: 'M0631',
                confirm: 'confirm',
            },
        },
    },
    components: {
        Btn,
    },
    methods: {
        closeXViewAnalysisPopup() {
            window.close();
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../style/LoadingPage.scss';

.loading-page {
    @include loading-page;

    &.no-data {
        @include themify($themes) {
            .logo {
                display: inline-block;
                width: 100px;
                height: 100px;

                > path {
                    fill: themed('no-data-page-logo-background-color');
                }
            }
        }
    }
}
</style>
