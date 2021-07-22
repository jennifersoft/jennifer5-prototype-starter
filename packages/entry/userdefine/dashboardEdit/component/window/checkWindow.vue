<template>
    <window
        :hide-footer="true"
        :open-w="320"
        :open-h="148"
        :open-x="'calc(33.33% + 10px)'"
        :open-y="'calc(50% - 65px)'"
        class="check-window"
        @cancel="cancel"
    >
        <template v-slot:subject>
            {{ i18n.title }}
        </template>
        <div>
            <div style="margin-right: 10px" v-html="message"></div>
        </div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import { i18n } from '@common/utility';

export default {
    name: 'checkWindow',
    components: { Window },
    props: {
        message: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            i18n: {
                title: i18n.get('ui.label.confirmMessage'),
            },
        };
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },

        apply() {
            this.$emit('apply');
        },
    },
    computed: {},
};
</script>
<style lang="scss" scoped>
.check-window {
    .body {
        > div {
            display: flex;
            flex-direction: row;
            margin: 8px 0;
        }
    }

    /deep/ .foot {
        display: none;
    }
}
</style>
