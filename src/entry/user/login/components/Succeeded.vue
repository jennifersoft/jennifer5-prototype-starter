<template>
    <div class="succeeded">
        <div class="title">{{ i18n.M0640 }}</div>
        <div class="description">{{ i18n.M0107 }}</div>
        <btn :items="[{ text: i18n.login }]"
             large
             @click="$emit('login')" />
    </div>
</template>

<script>
import Btn from "@vuejs/component/button/Btn";
export default {
    name: "SignUpSuccess",
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        Btn,
    }
}
</script>

<style lang="scss" scoped>
.succeeded {

    display: flex;
    flex-direction: column;
    > .title {
        font-size: 32px;
        font-weight: bold;
        color: #212121;
        width: 280px;
        white-space: pre-line;
    }
    .description {
        margin: 40px 0 56px;
        font-size: 16px;
        line-height: 1.5;
        color: #616161;
    }

    .footer {
        display: flex;
        justify-content: flex-end;
    }
}
</style>