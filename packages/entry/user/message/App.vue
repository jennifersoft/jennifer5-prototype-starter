<template>
    <div class="connection-failed">
        <logo :logo-url="logoUrl" />
        <div class="content">
            <span class="badge">{{ i18n.error }}</span>
            <div class="title">{{ i18n.M0341 }}</div>
            <div class="description">
                <span v-html="i18n.M0342"></span><br/>
                <span>({{ i18n.errorCode }}: {{ i18n[messageKey] }})</span>
            </div>
            <a href="/login">
                <btn :items="[{ text: i18n.M0343 }]"
                     class="primary"
                     large />
            </a>
        </div>
    </div>
</template>

<script>
import Btn from "@vuejs/component/button/Btn";
import Logo from "@layout/component/Logo";
export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        Btn,
        Logo,
    },
    props: {
        messageKey: {
            type: String,
            required: false,
            default: '',
        },
        logoUrl: {
            type: String,
            required: true,
        }
    },
};
</script>

<style lang="scss" scoped>
.connection-failed {
    background-color: #fff;
    width: 100%;
    height: 100vh;

    > .logo {
        position: absolute;
        top: 48px;
        left: 48px;
    }

    > .content {
        height: 340px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        position: relative;
        top: 50%;
        transform: translateY(-50%);
        > .badge {
            box-sizing: border-box;
            border-radius: 32px;
            border-bottom-right-radius: 0;
            width: 135px;
            height: 64px;
            padding: 20px 36px 20px 37px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 48px;

            color: #8652ff;
            font-size: 18px;
            font-weight: bold;
        }
        > .title {
            font-size: 24px;
            color: #212121;
            margin-bottom: 32px;
        }
        > .description {
            font-size: 16px;
            color: #616161;
            margin-bottom: 48px;
        }
    }
}
</style>
