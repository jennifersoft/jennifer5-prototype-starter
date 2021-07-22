<template>
    <div class="help-navigation-wrapper">
        <span
            v-for="(token, i) in path"
            class="token"
            @click="onClickNavigationItem(token)"
        >
            {{ token.name }}
            <span v-if="i < path.length - 1">&nbsp;>&nbsp;</span>
        </span>
    </div>
</template>

<script>
export default {
    name: 'HelpNavigation',
    props: {
        path: {
            type: Array,
            required: true,
        },
    },
    methods: {
        onClickNavigationItem(item) {
            this.$emit('update-tree', item);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@vuejs/component/themes.scss';
.help-navigation-wrapper {
    @include themify($themes) {
        border-bottom: 1px solid themed('border-color');
        color: themed('typography-color-grey2');
        margin: 16px 24px 0 24px;
        padding-bottom: 8px;
        font-size: 12px;
        font-weight: bold;
        .token {
            cursor: pointer;
        }
    }
}
</style>
