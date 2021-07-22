<template>
    <div class="activeservice-list-configure">
        <div class="configure">
            <span style="margin-right: 10px">{{ i18n.chartFontSize }} </span>
            <div>
                <dropdown
                    :selected-value="fontSize"
                    :items="fontSizeArray"
                    :width="60"
                    style="display: inline-block"
                    @onchange="onClickFontSize"
                >
                </dropdown>
                px
            </div>
        </div>
        <div class="configure" style="    margin-top: 10px;">
            <span style="margin-right: 10px">{{ i18n.minTime }} </span>
            <div>
                <dropdown
                    :selected-value="minElapsedSec"
                    :items="elapsedTimeArray"
                    :width="60"
                    style="display: inline-block"
                    @onchange="onClickMinElapsedSec"
                >
                </dropdown>
                sec
            </div>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { i18n } from '@common/utility';

export default {
    name: 'fontSizeConfigure',
    components: {
        Dropdown,
    },
    data() {
        return {
            fontSizeArray: Array.from(new Array(10).keys()).map(num => {
                const size = num + 10;
                const row = {};
                row.text = size;
                row.value = size;

                return row;
            }),

            elapsedTimeArray: Array.from(new Array(31).keys()).map(num => {
                const row = {};
                row.text = num;
                row.value = num;

                return row;
            }),
            i18n: {
                chartFontSize: i18n.get('ui.label.chart.font.size'),
                minTime: i18n.get('ui.label.performTime.min'),
            },
        };
    },
    methods: {
        ...mapMutations([
            'setFontSizeOnEditingChart',
            'setMinElapsedSecOnEditingChart',
        ]),

        onClickFontSize(item) {
            this.setFontSizeOnEditingChart(item.value);
        },
        onClickMinElapsedSec(item) {
            this.setMinElapsedSecOnEditingChart(item.value);
        },
    },
    computed: {
        ...mapState(['editingChartOptions']),

        fontSize() {
            return this.editingChartOptions.contentFontSize ?? 10;
        },
        minElapsedSec() {
            return this.editingChartOptions.minElapsedSec ?? 0;
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';

.activeservice-list-configure {
    .configure {
        display: flex;
        justify-content: space-between;
        @include themify($themes) {
            color: themed('edit-component-title2-color');
        }
    }
}
</style>
