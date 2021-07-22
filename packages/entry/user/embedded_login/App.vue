<template>
    <div class="row main" style="height: 160px; margin-top: -80px;">
        <div class="images">
            <i class="icon-server2"></i>
            <div>
                <img src="../asset/connecting.gif" />
            </div>
            <i class="icon-server1"></i>
        </div>
        <div class="title">
            {{ i18n.M0339 }}
        </div>
        <div class="description" v-html="i18n.M0340"></div>

        <form
            ref="redirectForm"
            name="form"
            action="/login/embedded"
            method="post"
        >
            <input name="id" type="hidden" :value="userId" />
            <input name="group" type="hidden" :value="userGroup" />
            <input name="url" type="hidden" :value="url" />
            <input name="params" type="hidden" :value="params" />
        </form>
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
        userId: {
            type: String,
            required: false,
            default: '',
        },
        userGroup: {
            type: String,
            required: false,
            default: '',
        },
        url: {
            type: String,
            required: false,
            default: '',
        },
        params: {
            type: String,
            required: false,
            default: '',
        },
    },
    mounted() {
        this.$refs.redirectForm.submit();
    },
};
</script>

<style scoped></style>
