<template>
    <div class="tx-terminated-page">
        <div class="content">
            <img svg-inline class="logo" src="./fill-1.svg" />
            <div class="title">{{ i18n.activeServiceEnd }}</div>
            <div class="detail" v-html="i18n.M0285" />
            <btn
                :items="[{ text: i18n.activeProfile }]"
                large
                @click="$emit('click')"
            />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
export default {
    name: 'PageTxTerminated',
    components: {
        Btn,
    },
    inject: {
        i18n: {
            default: () => ({
                activeServiceEnd: 'activeServiceEnd',
                M0285: 'M0285',
                activeProfile: 'activeProfile',
            }),
        },
        theme: {
            default: 'classic',
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        typography-color-grey: #616161,
        logo-background: rgba(0, 0, 0, 0.1),
    ),
    dark: (
        typography-color-grey: #999999,
        logo-background: rgba(255, 255, 255, 0.1),
    ),
);
.tx-terminated-page {
    @include themify($themes) {
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: themed('typography-color-grey');
            text-align: center;
            margin-top: 170px;
            .title {
                margin-top: 48px;
                font-size: 24px;
            }
            .detail {
                margin: 24px 0 32px;
                font-size: 14px;
            }
            .logo > path {
                fill: themed('logo-background');
            }
        }
    }
}
</style>
