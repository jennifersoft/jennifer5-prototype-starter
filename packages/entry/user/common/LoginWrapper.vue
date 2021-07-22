<template>
    <div class="login-wrapper" :class="{ expanded }">
        <loading-indicator v-if="loading" :height="4" />
        <div class="header">
            <logo :logo-url="logoUrl" />
        </div>
        <div class="body">
            <slot></slot>
        </div>
        <div class="footer" v-if="showFooter">
            {{ i18n.M0428 }}
        </div>
    </div>
</template>

<script>
import Logo from "@layout/component/Logo";
import LoadingIndicator from "@vuejs/component/Loading/LoadingIndicator";

export default {
    name: "LoginWrapper",
    components: {
        Logo,
        LoadingIndicator
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
        showFooter: {
            type: Boolean,
            default: false,
        },
        expanded: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        }
    },
}
</script>

<style lang="scss">
.login-wrapper {
    position: absolute;
    top: calc(50vh - 322px);
    left: calc(50vw - 256px);
    z-index: 1000;
    transition: top 0.3s ease-in-out;

    width: 512px;
    min-height: 644px;
    min-width: 360px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 48px 56px;
    border-radius: 8px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;

    &.expanded {
        top: calc(50vh - 446px);
    }
    > .body {
        flex: 1;
        padding-top: 32px;
    }
    > .footer {
        padding-top: 24px;
        border-top: 1px solid #e8e8e8;
        color: #616161;
        text-align: center;
    }

    @media screen and (max-width: 768px) {
        position: static;
        width: 100%;
        height: 100%;
        padding: 40px 32px;
        min-width: 100%;
    }
}
.login {
    background: url('../asset/bg-blurred.png') no-repeat center center fixed;
    background-size: cover;
}
</style>