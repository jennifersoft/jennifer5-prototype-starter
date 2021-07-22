<template>
    <login-wrapper :logo-url="logoUrl">
        <div class="wait-for-approval classic">
            <img class="svg"
                 :src="svgPath"
                 :width="56"
                 :height="56" />
            <div class="title">{{ i18n.approvedWait }}</div>
            <div class="description">
                <span>{{ i18n.M0108 }}</span><br/>
                <span>{{ i18n.M0106 }}</span>
            </div>
            <logout-btn />
        </div>
    </login-wrapper>
</template>

<script>
import LogoutBtn from "@entry/user/common/LogoutBtn";
import LoginWrapper from "@entry/user/common/LoginWrapper";
import Btn from "@vuejs/component/button/Btn";

export default {
    components: {
        LogoutBtn,
        LoginWrapper,
        Btn,
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
    },
    created() {
        this.svgPath = require('@entry/user/asset/unauthorized.svg');
    }
};
</script>

<style lang="scss" scoped>
@import "~@entry/user/styles/font-style.scss";
.wait-for-approval {
    display: flex;
    flex-direction: column;
    .svg {
        margin-bottom: 40px;
    }
    .description {
        margin-bottom: 56px;
        word-break: keep-all;
    }
    @include font-style;
}
</style>
