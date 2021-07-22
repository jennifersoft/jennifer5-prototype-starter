<template>
    <window
        class="naming-rule-window"
        :messages="{ apply: i18n.apply, cancel: i18n.cancel }"
        :open-w="width"
        :open-h="height"
        :open-x="x"
        :open-y="y"
        @cancel="() => $emit('cancel')"
        @apply="onClickApplyBtn"
    >
        <template #subject>{{ i18n.firstInstanceNamingRule }}</template>
        <div class="main">
            <div class="message">{{ i18n.M0414 }}</div>
            <div class="menu">
                <dropdown
                    normal
                    :items="overwriteTypes"
                    :selected-value="isOverwrite"
                    @onchange="data => (isOverwrite = data.value)"
                ></dropdown>
            </div>
            <div class="splitter"></div>
            <div class="message">{{ i18n.M0417 }}</div>
        </div>
    </window>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { mapState, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    props: {
        namingRule: {
            type: Number,
            required: true,
        },
    },
    components: {
        Window,
        Dropdown,
    },
    data() {
        const width = 400;
        const height = 300;
        return {
            width,
            height,
            x: window.innerWidth / 2 - width / 2,
            y: window.innerHeight / 2 - height / 2,
            overwriteTypes: [
                {
                    value: 'false',
                    text: this.i18n.M0415,
                },
                {
                    value: 'true',
                    text: this.i18n.M0416,
                },
            ],
            isOverwrite: 'false',
        };
    },
    computed: {
        ...mapState({
            selectedDomain: state => state.selectedDomain,
        }),
    },
    methods: {
        ...mapActions(['updateAgentNamingRule']),
        async onClickApplyBtn() {
            await this.updateAgentNamingRule({
                sid: this.selectedDomain.sid,
                ruleType: this.namingRule,
                isOverwrite: this.isOverwrite === 'true',
            });

            this.$emit('cancel');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.naming-rule-window {
    @include themify($themes) {
        .message {
            font-size: 12px;
            &:last-child {
                color: themed('common-message-font-color');
            }
        }
        .menu {
            margin: 24px 0;
        }
        .splitter {
            width: 100%;
            height: 1px;
            margin: 16px 0;
            background-color: themed('common-border-color');
        }
    }
}
</style>
