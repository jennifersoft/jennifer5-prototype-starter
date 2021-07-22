<template>
    <window
        class="filtering-window"
        draggable
        :messages="i18n"
        :open-w="400"
        :open-h="350"
        :open-x="left"
        :open-y="165"
        @cancel="() => $emit('cancel')"
        @apply="onApplyFilters"
    >
        <template #subject>{{ i18n.filtering }}</template>
        <div class="form">
            <div class="item">
                <input-field
                    normal
                    :placeholder="i18n.application"
                    v-model="serviceName"
                ></input-field>
            </div>
            <div class="item">
                <input-field
                    normal
                    :placeholder="i18n.clientIp"
                    v-model="ip"
                ></input-field>
            </div>
            <div class="item">
                <input-field
                    normal
                    :placeholder="i18n.userId"
                    v-model="userId"
                ></input-field>
            </div>
            <div class="item">
                <input-field
                    normal
                    :placeholder="i18n.guid"
                    v-model="guid"
                ></input-field>
            </div>
            <div class="item">
                <checkbox
                    normal
                    :label="i18n.showOnlyException"
                    v-model="isException"
                ></checkbox>
            </div>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import InputField from '@vuejs/component/Input/InputField';
import Checkbox from '@vuejs/component/Toggle/Checkbox';

export default {
    inject: ['i18n'],
    components: {
        Window,
        InputField,
        Checkbox,
    },
    computed: {
        left() {
            return 254;
        },
    },
    props: {
        form: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            serviceName: this.form.serviceName,
            ip: this.form.ip,
            userId: this.form.userId,
            guid: this.form.guid,
            isException: this.form.isException,
        };
    },
    methods: {
        onApplyFilters() {
            this.$emit('apply', { ...this.$data });
        },
    },
};
</script>

<style lang="scss" scoped>
.filtering-window {
    .form {
        > .item {
            margin-bottom: 8px;
        }
    }
}
</style>
