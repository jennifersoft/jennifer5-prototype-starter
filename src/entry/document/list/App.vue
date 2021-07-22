<template>
    <div class="document-list">
        <div class="left">
            <side-menu></side-menu>
        </div>
        <div class="right">
            <top-menu></top-menu>
            <main-contents></main-contents>
        </div>
    </div>
</template>

<script>
import SideMenu from './container/SideMenu';
import TopMenu from './container/TopMenu.vue';
import MainContents from './container/MainContents';
import { mapMutations, mapActions } from './vuex';

export default {
    components: {
        SideMenu,
        TopMenu,
        MainContents,
    },
    props: {
        isAdmin: {
            type: Boolean,
            required: true,
        },
        directoryKey: {
            type: String,
            required: true,
        },
    },
    methods: {
        ...mapMutations(['updateDirectoryKey']),
        ...mapActions(['loadDirectoryList', 'loadReportList']),
    },
    async created() {
        await this.loadDirectoryList(this.directoryKey);
        await this.loadReportList();
    },
};
</script>

<style lang="scss" scoped>
@import './themes.scss';

.document-list {
    @include themify($themes) {
        display: flex;
        flex-direction: row;
        height: 100%;

        > .left {
            flex: 0 0 240px;
            background-color: themed('layout-background-color');
        }

        > .right {
            flex: 1;
        }
    }
}
</style>
