<template>
    <div class="config-toolbar">
        <slot></slot>
        <btn
            small
            class="right"
            :items="[{ text: i18n.templateChartSetting }]"
            @click="() => $emit('open-theme')"
            v-if="isChart"
        ></btn>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { i18n } from '@common/utility';

export default {
    components: {
        Btn,
    },
    props: {
        isChart: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            i18n: {
                templateChartSetting: i18n.get('ui.title.templateChartSetting'),
            },
        };
    },
};
</script>

<style lang="scss" scoped>
@import '../../../../themes';

.config-toolbar {
    @include themify($themes) {
        padding: 8px;
        height: 26px;
        max-height: 26px;
        border-radius: 4px;
        background-color: themed('common-background-color');
        border: 1px solid themed('window-template-setting-side-border-color');

        ::v-deep .aries-ui-btn.right {
            float: right;
        }
    }
}
</style>
