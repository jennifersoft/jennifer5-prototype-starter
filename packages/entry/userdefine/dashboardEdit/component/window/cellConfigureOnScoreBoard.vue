<template>
    <window
        :open-w="270"
        :open-h="392"
        :open-x="editingCellOptionOnScoreBoard.left"
        :open-y="editingCellOptionOnScoreBoard.top"
        :messages="messages"
        class="cell-configure-window"
        @cancel="cancel"
        @apply="apply"
    >
        <template v-slot:subject>
            {{ i18n.cellConfigure }}
        </template>
        <div class="row">
            <span>{{ i18n.label }} </span>
            <input-field small v-model="cellLabel" style="width: 180px" />
        </div>
        <div class="row">
            <span>{{ i18n.date }}</span>
            <dropdown
                :selected-value="dateCondition"
                :items="searchDateConditionList"
                @onchange="onChangeDateCondition"
                style="width: 80px;"
            />
        </div>
        <div class="data-choose">
            <span>
                {{ i18n.selectData }}
            </span>
            <div style="margin-top: 11px;">
                <list-selector
                    class="metrcis-box"
                    @list-select="selectMetrics"
                    :active-indexes="selectedMetricIndexes"
                    :list="metricsList"
                    :no-search="true"
                    :title-label="'Metrics'"
                />
            </div>
        </div>
    </window>
</template>
<script>
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import InputField from '@vuejs/component/Input/InputField';
import Window from '@vuejs/component/window/Window';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import { MxDef } from '@common/definition';
import { i18n } from '@common/utility';
import { mapMutations, mapGetters, mapState } from 'vuex';
import messages from '@vuejs/component/messages';

export default {
    name: 'cellConfigureOnScoreBoard',
    components: { Window, Dropdown, ListSelector, InputField },
    data() {
        return {
            messages,
            i18n: {
                cellConfigure: i18n.get('ui.label.cell.configure'),
                selectData: i18n.get('ui.label.select.data'),
                label: i18n.get('ui.label.label'),
                date: i18n.get('ui.label.date'),
                nonSelectMxid: i18n.get('M0268'),
            },
            searchDateConditionList: [
                { text: i18n.get('ui.label.time.today'), value: 'today' },
                {
                    text: i18n.get('ui.label.time.yesterday'),
                    value: 'yesterday',
                },
                { text: i18n.get('ui.label.time.lastweek'), value: 'lastweek' },
                {
                    text: i18n.get('ui.label.time.lastmonth'),
                    value: 'lastmonth',
                },
            ],

            METRICS_NAME_IN_SCOREBOARD: [
                'visit_day',
                'service_count',
                'event_count',
                'service_rate',
            ],
            cellLabel: '',
            dateCondition: 'today',
            selectedMetricIndexes: [],
            mxid: undefined,
            MxDef: MxDef,
        };
    },
    methods: {
        ...mapMutations('userdefine', [
            'setCellOptionOnScoreBoard',
            'showCheckWindowWithMessage',
            'nonSelectEditingCellOptionOnScoreBoard',
        ]),

        onChangeDateCondition(item) {
            this.dateCondition = item.value;
        },

        selectMetrics(data) {
            this.mxid = data.value;
        },

        cancel() {
            this.$emit('cancel');
        },

        apply() {
            if (this.mxid === undefined) {
                this.showCheckWindowWithMessage(this.i18n.nonSelectMxid);
                return;
            }

            const cellOptions = {
                label: this.cellLabel,
                dateCondition: this.dateCondition,
                mxid: this.mxid,
            };

            this.setCellOptionOnScoreBoard(cellOptions);

            this.$emit('apply');
        },
    },
    computed: {
        ...mapGetters('userdefine', ['getCellOptionFromCellIndex']),

        ...mapState('userdefine', [
            'editingComponentDataKey',
            'editingCellOptionOnScoreBoard',
        ]),

        selectedCellIndex() {
            return this.editingCellOptionOnScoreBoard.cellIndex;
        },

        metricsList() {
            return this.METRICS_NAME_IN_SCOREBOARD.map(key => {
                return {
                    value: MxDef[key],
                    label: i18n.get('ui.mx.' + key),
                    description: i18n.get('ui.mx.' + key + '.tooltip'),
                };
            });
        },
    },
    mounted() {
        if (this.getCellOptionFromCellIndex) {
            this.cellLabel = this.getCellOptionFromCellIndex.label;
            this.dateCondition = this.getCellOptionFromCellIndex.dateCondition;
            this.mxid = this.getCellOptionFromCellIndex.mxid;
        } else {
            this.cellLabel = '';
            this.dateCondition = 'today';
            this.mxid = undefined;
        }
    },
    watch: {
        selectedCellIndex() {
            if (this.getCellOptionFromCellIndex) {
                this.cellLabel = this.getCellOptionFromCellIndex.label;
                this.dateCondition = this.getCellOptionFromCellIndex.dateCondition;
                this.mxid = this.getCellOptionFromCellIndex.mxid;
            } else {
                this.cellLabel = '';
                this.dateCondition = 'today';
                this.mxid = undefined;
            }
        },

        mxid() {
            const index = this.metricsList.findIndex(
                metrics => metrics.value === this.mxid
            );
            this.selectedMetricIndexes = index > -1 ? [index] : [];
        },

        editingComponentDataKey() {
            this.nonSelectEditingCellOptionOnScoreBoard();
        },
    },
};
</script>
<style lang="scss" scoped>
.cell-configure-window {
    .row {
        display: flex;
        flex-direction: row;
        padding: 8px 0;

        > span {
            flex-grow: 1;
        }
    }

    .data-choose {
        flex-direction: column;

        .metrcis-box {
            min-height: 135px !important;
        }
    }
}
</style>
