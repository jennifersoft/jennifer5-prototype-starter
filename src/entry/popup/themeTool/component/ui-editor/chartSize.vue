<template>
    <section class="chart-size">
        <div class="subject">{{ i18n.chartHeight }}</div>
        <div class="widgets">
            <div class="widget column">
                <format-number-input
                    small
                    :value="theme['height']"
                    :unit="'px'"
                    :formatter="formatter"
                    @input="height => onChangeSetting('height', height)"
                />
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';
import FormatNumberInput from '@vuejs/component/Input/FormatNumberInput';

export default {
    mixins: [methods],
    components: {
        FormatNumberInput,
    },
    inject: {
        i18n: {
            default: {
                chartHeight: 'Chart Height',
            },
        },
    },
    methods: {
        formatter(n) {
            return n.toLocaleString();
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        height: 300,
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
};
</script>

<style lang="scss" scoped>
.chart-size {
}
</style>
