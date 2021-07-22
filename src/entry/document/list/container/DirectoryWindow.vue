<template>
    <window
        @cancel="() => $emit('cancel')"
        @apply="() => $emit('apply')"
        :draggable="false"
        :messages="{
            apply: i18n.apply,
            cancel: i18n.cancel,
        }"
        :open-w="350"
        :open-h="372"
        class="directory-window"
        animation-name="fade-down"
    >
        <template #subject>
            <span>{{ title }}</span>
        </template>
        <div>
            <ListSelector
                :list="optDirectoryList"
                :active-indexes="noDirectory ? [0] : []"
                @list-select="dir => $emit('select', dir)"
            />
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import { mapState } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        Window,
        ListSelector,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        noDirectory: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        ...mapState({
            directoryList: state =>
                state.directoryList
                    .filter(dir => dir.key !== '*')
                    .map(dir => {
                        return {
                            label: dir.name,
                            key: dir.key,
                        };
                    }),
        }),
        optDirectoryList() {
            if (this.noDirectory) {
                return [
                    { label: this.i18n.noDir, key: '*' },
                    ...this.directoryList,
                ];
            }

            return this.directoryList;
        },
    },
};
</script>

<style lang="scss" scoped>
.directory-window {
    top: 120px;
    right: 58px;
    .subject {
        text-align: left;
    }
}

::v-deep .list-selector-container {
    min-height: 245px;
}
</style>
