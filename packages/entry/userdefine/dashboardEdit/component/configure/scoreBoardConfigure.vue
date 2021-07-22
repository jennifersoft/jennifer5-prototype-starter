<template>
    <div class="scoreboard-box">
        <div>
            <span>
                {{ i18n.gridRow }}
            </span>
            <dropdown
                :items="countArray"
                :selected-value="rowCount"
                @onchange="onchangeRowCount"
                class="cell-count"
            />
        </div>
        <div>
            <span>
                {{ i18n.gridColumn }}
            </span>
            <dropdown
                :items="countArray"
                :selected-value="columnCount"
                @onchange="onchangeColumnCount"
                class="cell-count"
            />
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);
import Dropdown from '@vuejs/component/Dropdown/Dropdown';

export default {
    name: 'scoreBoardConfigure',
    components: {
        Dropdown,
    },
    data() {
        return {
            i18n: {
                gridRow: i18n.get('ui.label.grid.row'),
                gridColumn: i18n.get('ui.label.grid.column'),
            },
            countArray: [1, 2, 3, 4].map(num => {
                return { value: num, text: num };
            }),
        };
    },
    methods: {
        ...mapMutations([
            'setRowCountOnEditingChart',
            'setColumnCountOnEditingChart',
        ]),

        onchangeRowCount(item) {
            this.setRowCountOnEditingChart(item.value);
        },

        onchangeColumnCount(item) {
            this.setColumnCountOnEditingChart(item.value);
        },
    },
    computed: {
        ...mapState([
            'editingChartOptions',
            'editingComponentDataKey',
            'optionsOnScoreboard',
        ]),

        rowCount() {
            return this.editingChartOptions.rowcount
                ? this.editingChartOptions.rowcount
                : 1;
        },

        columnCount() {
            return this.editingChartOptions.columncount
                ? this.editingChartOptions.columncount
                : 1;
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.scoreboard-box {
    @include themify($themes) {
        color: themed('edit-component-title2-color');
    }
    display: flex;
    flex-direction: row;

    > div {
        flex-grow: 1;

        > span {
            margin-right: 10px;
        }

        > .cell-count {
            width: 60px;
            display: inline-block;
        }
    }
}
</style>
