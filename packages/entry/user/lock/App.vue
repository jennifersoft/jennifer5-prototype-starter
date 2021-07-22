<template>
    <login-wrapper :logo-url="logoUrl">
        <div class="account-locked">
            <img class="svg"
                 :src="svgPath"
                 :width="42"
                 :height="56" />
            <div class="title">{{ i18n.accountLocked }}</div>
            <div class="description">{{ i18n[messageKey] }}</div>
            <logout-btn />
        </div>
    </login-wrapper>
</template>

<script>
import LogoutBtn from "@entry/user/common/LogoutBtn";
import LoginWrapper from "@entry/user/common/LoginWrapper";

export default {
    components: {
        LogoutBtn,
        LoginWrapper,
    },
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        logoUrl: {
            type: String,
            required: true,
        },
        messageKey: {
            type: String,
            required: false,
            default: '',
        },
    },
    created() {
        this.svgPath = require('@entry/user/asset/locked.svg');
    }
};
</script>

<style lang="scss" scoped>
@import "~@entry/user/styles/font-style.scss";
.account-locked {
    display: flex;
    flex-direction: column;
    .svg {
        margin-bottom: 40px;
    }
    .description {
        margin-bottom: 56px;
    }
    @include font-style;
}
</style>
