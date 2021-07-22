<template>
    <div class="template-list">
        <top-menu
            :directory-key="directoryKey"
            @alert="message => (alertMessage = message)"
        ></top-menu>
        <main-contents
            @alert="message => (alertMessage = message)"
        ></main-contents>
        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import TopMenu from './container/TopMenu';
import MainContents from './container/MainContents';
import { mapActions } from './vuex';
import { mapActions as baseMapActions } from '@entry/document/list/vuex';

export default {
    components: {
        AlertWindow,
        TopMenu,
        MainContents,
    },
    props: {
        directoryKey: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            alertMessage: '',
        };
    },
    methods: {
        ...mapActions([
            'loadTemplateList',
            'loadUserMailList',
            'loadUserGroupList',
        ]),
        ...baseMapActions(['loadDirectoryList']),
    },
    async created() {
        await this.loadTemplateList();
        this.loadDirectoryList();
        this.loadUserMailList();
        this.loadUserGroupList();
    },
};
</script>

<style lang="scss" scoped></style>
