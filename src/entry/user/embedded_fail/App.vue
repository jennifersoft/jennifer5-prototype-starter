<template>
    <div class="row main" style="height: 220px; margin-top: -120px;">
        <div class="images">
            <i class="icon-unhappy"></i>
        </div>
        <div class="title">
            {{ i18n.M0341 }}
        </div>
        <div class="description">
            <span v-html="i18n.M0342"></span>
            <br />
            <small style="opacity: 0.5;"
                >({{ i18n.errorCode }}: {{ status }})</small
            >
        </div>
        <a href="/login" class="btn small focus">{{ i18n.M0343 }}</a>
    </div>
</template>

<script>
export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        status: {
            type: String,
            required: false,
            default: '',
        },
    },
};
</script>

<style lang="scss" scoped>
a.focus {
    color: #fff;
    border: 1px solid #9663f4;
    background-color: #9c75ec;
    background-image: linear-gradient(top, #9c75ec, #885ed5);
    border-radius: 3px;
    padding: 0 10px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    position: relative;
    display: inline-block;
    text-align: left;
    vertical-align: middle;
    cursor: pointer;
    text-decoration: none;
}
</style>
