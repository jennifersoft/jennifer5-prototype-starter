<template>
    <section class="chart-grid">
        <div class="subject">{{ i18n.chartGrid }}</div>
        <div class="widgets">
            <div class="widget">
                <div class="title">{{ i18n.xAxis }}</div>
                <div class="main">
                    <dropdown
                        :items="gridItems"
                        :selected-value="`${theme['axis.x.line']}`"
                        @onchange="
                            item => onChangeSetting('axis.x.line', item.value)
                        "
                    ></dropdown>
                </div>
            </div>
            <div class="widget">
                <div class="title">{{ i18n.yAxis }}</div>
                <div class="main">
                    <dropdown
                        :items="gridItems"
                        :selected-value="`${theme['axis.y.line']}`"
                        @onchange="
                            item => onChangeSetting('axis.y.line', item.value)
                        "
                    ></dropdown>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import ColorPicker from '../ui/colorPicker';
import { mapState } from '../../constant';
import methods from '../mixin/methodsForSection';

export default {
    mixins: [methods],
    components: {
        ColorPicker,
        Dropdown,
    },
    inject: {
        i18n: {
            default: {
                chartGrid: 'Chart Grid',
                xAxis: 'X-axis',
                yAxis: 'Y-axis',
            },
        },
    },
    computed: {
        ...mapState({
            theme: state => {
                if (!state.editorCode) {
                    return {
                        'axis.x.line': 'solid',
                        'axis.y.line': 'solid',
                    };
                }

                return JSON.parse(state.editorCode);
            },
        }),
    },
    data() {
        return {
            gridItems: [
                {
                    text: 'Solid',
                    value: 'solid',
                },
                {
                    text: 'Dashed',
                    value: 'dashed',
                },
                {
                    text: 'Gradient',
                    value: 'gradient',
                },
                {
                    text: 'None',
                    value: false,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.chart-grid {
    .main {
        text-align: left !important;
    }
}
</style>
