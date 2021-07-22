<template>
    <window
        animation-name="fade-down"
        :messages="{ apply: i18n.select, cancel: i18n.close }"
        :open-h="400"
        :open-w="600"
        :open-x="openX"
        :open-y="openY"
        @apply="onApply"
        @cancel="$emit('close')"
    >
        <template #subject>{{ title }}</template>
        <method-tree
            :enable-search-list-type="enableSearchListType"
            :width="560"
            :height="270"
            :allow-method="allowMethod"
            @select="onSelectNode"
        />
    </window>
</template>

<script>
import MethodTree from '@entry/analysis/loadedClasses/container/MethodTree';
import Window from '@vuejs/component/window/Window';

export default {
    name: 'MethodTreeWindow',
    inject: {
        i18n: {
            default: () => ({
                select: 'select',
                close: 'close',
                M0635: 'M0635',
                selectMethod: 'selectMethod',
                selectClass: 'selectClass',
            }),
        },
    },
    components: {
        MethodTree,
        Window,
    },
    props: {
        allowMethod: {
            type: Boolean,
            default: false,
        },
        allowPackage: {
            type: Boolean,
            default: false,
        },
        openX: {
            type: Number,
            default: 0,
        },
        openY: {
            type: Number,
            default: 0,
        },
        enableSearchListType: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            selected: null,
        };
    },
    computed: {
        title() {
            if (this.allowMethod) return this.i18n.selectMethod;
            else
                return this.allowPackage
                    ? this.i18n.selectPackageAndClass
                    : this.i18n.selectClass;
        },
    },
    methods: {
        onSelectNode(data, isListItem = false) {
            if (isListItem) {
                this.selected = data.label;
                return;
            }
            const { icon, key } = data;

            if (this.allowMethod && icon === 'method') {
                const tokens = key.split('.');
                this.selected = `${tokens.slice(0, -1).join('.')} ${
                    tokens[tokens.length - 1]
                }`;
            } else if (
                (this.allowPackage && icon === 'resource') ||
                icon === 'class'
            )
                this.selected = key;
            else this.selected = null;
        },
        onApply() {
            if (!this.selected) {
                this.$emit('alert', this.i18n.M0635);
                return;
            }
            this.$emit('add', this.selected);
        },
    },
};
</script>

<style scoped></style>
