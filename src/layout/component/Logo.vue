<template>
    <img :class="['logo', { clickable }]"
         :src="logoUrl"
         alt="JENNIFER 5"
         width="32"
         height="32"
         @click="onClick" />
</template>

<script>
export default {
    props: {
        logoUrl: {
            type: String,
            required: true,
        },
        clickable: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        onClick() {
            if (!this.clickable) return;
            this.$emit('click');
        }
    }
};
</script>

<style lang="scss" scoped>
.logo {
    &.clickable {
        cursor: pointer;
    }
}
</style>
