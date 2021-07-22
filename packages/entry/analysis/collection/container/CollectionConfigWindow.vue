<template>
    <window animation-name="fade-down"
            :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
            :open-x="openX"
            :open-y="openY"
            :open-h="310"
            :open-w="360"
            @cancel="$emit('close')"
            @apply="onClickApply">
        <template #subject>{{ i18n.collectionSetting }}</template>
        <div class="collection-config-body">
            <div class="config-group">
                <span class="config-label">{{ i18n.minimumStacktrace }}</span>
                <format-number-input v-model="minimumStacktrace"
                                     :min="configMin"
                                     :max="configMax"
                                     :step="configStep"
                                     use-stepper/>
            </div>
            <div class="config-group">
                <span class="config-label">{{ i18n.autoStacktrace }}</span>
                <format-number-input v-model="autoStacktrace"
                                     :min="configMin"
                                     :max="configMax"
                                     :step="configStep"
                                     use-stepper/>
            </div>
        </div>
    </window>
</template>

<script>
    import Window from "@vuejs/component/window/Window";
    import FormatNumberInput from "@vuejs/component/Input/FormatNumberInput";
    import { mapActions } from "../vuex";

    const CONFIG_STEP = 1000;
    const CONFIG_MIN = 0;
    const CONFIG_MAX = 60000;
    export default {
        name: "CollectionConfigWindow",
        inject: {
            i18n: {
                default: () => ({
                    cancel: 'cancel',
                    apply: 'apply',
                    collectionSetting: 'collectionSetting',
                    autoStacktrace: 'autoStacktrace',
                    minimumStacktrace: 'minimumStacktrace',
                }),
            },
        },
        components: {
            Window,
            FormatNumberInput,
        },
        props: {
            openX: Number,
            openY: Number,
            minStack: Number,
            autoStack: Number,
        },
        data() {
            return {
                minimumStacktrace: this.minStack,
                autoStacktrace: this.autoStack,
            }
        },
        methods: {
            ...mapActions(['saveStacktraceConfig']),
            async onClickApply() {
                const { minimumStacktrace, autoStacktrace } = this;
                await this.saveStacktraceConfig({ minimumStacktrace, autoStacktrace });
                this.$emit('close');
            }
        },
        created() {
            this.configStep = CONFIG_STEP;
            this.configMin = CONFIG_MIN;
            this.configMax = CONFIG_MAX;
        }
    }
</script>

<style lang="scss" scoped>
.collection-config-body {
    .config-group {
        display: flex;
        flex-direction: column;
        &:first-child {
            margin-bottom: 24px;
        }
        .config-label {
            margin-bottom: 16px;
        }
    }
}
</style>