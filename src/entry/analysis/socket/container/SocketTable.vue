<template>
    <div class="table-panel">
        <div class="toolbar">
            <div class="tool-right">
                <btn
                    :items="[{ text: i18n.stacktraceRemove }]"
                    @click="$emit('remove-stack')"
                />
                <btn
                    class="receive-all-stack-btn"
                    :class="{ 'prevent-event': !agentSupported }"
                    :tooltip-options="tooltipOptions"
                    :items="[{ text: i18n.stackReceive }]"
                    @click="$emit('receive-stack-all')"
                />
                <btn
                    v-if="gcPermission"
                    :items="[{ text: i18n.gc }]"
                    @click="$emit('gc')"
                />
            </div>
        </div>
        <table class="table classic hover large stripeless" ref="table">
            <thead>
                <tr>
                    <th width="50px">{{ i18n.num }}</th>
                    <th>{{ i18n.localPort }}</th>
                    <th>{{ i18n.ip }}</th>
                    <th>{{ i18n.remotePort }}</th>
                    <th>{{ i18n.streamAndSocketCount }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import Btn from '@vuejs/component/button/Btn';
import { AgentFeatureMessageDef } from '@common/definition';
import { setSortEff } from '@common/utility';
import { TEMPLATE_ROW_SOCKET } from '@entry/analysis/socket/templates';

jui.use(XTableComp);

export default {
    name: 'SocketTable',
    inject: ['i18n'],
    props: {
        list: {
            type: Array,
            required: true,
        },
        gcPermission: {
            type: Boolean,
            default: true,
        },
        agentStatus: {
            type: String,
            default: '',
        },
        height: {
            type: Number,
            required: true,
        },
    },
    components: {
        Btn,
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        height(next, prev) {
            if (next !== prev) this.table.scrollHeight(next);
        },
    },
    computed: {
        agentSupported() {
            return this.agentStatus === AgentFeatureMessageDef.SUPPORTED;
        },
        tooltipOptions() {
            if (this.agentSupported) return null;
            return {
                position: 'bottom-center',
                message: this.agentStatus,
            };
        },
    },
    methods: {
        onClickTableRow(row, _) {
            this.$emit('row-click', row);
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [null, 'localport', 'host', 'port', null],
            resize: true,
            sort: [1, 2, 3],
            sortCache: true,
            sortLoading: true,
            rowHeight: 35,
            event: {
                sort: setSortEff,
                click: self.onClickTableRow,
            },
            tpl: {
                row: TEMPLATE_ROW_SOCKET,
            },
        });
        this.table.scrollHeight(this.height);
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/socket/styles/table-panel.scss';
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        badge-color-done: #cce4f9,
        badge-color-waiting: #d7d7d5,
        typography-color-primary: #212121,
    ),
    dark: (
        badge-color-done: #4986e7,
        badge-color-waiting: #5e5e5e,
        typography-color-primary: #e8e8e8,
    ),
);
.table-panel {
    .toolbar > .tool-right > * {
        margin-left: 8px;
    }

    .table {
        @include themify($themes) {
            ::v-deep .badge-cell {
                height: unset;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .badge {
                    border-radius: 3px;
                    padding: 0 4px;
                    /*line-height: 20px;*/
                    color: themed('typography-color-primary');

                    &.done {
                        background-color: themed('badge-color-done');
                    }

                    &.waiting {
                        background-color: themed('badge-color-waiting');
                    }

                    &:not(:last-child) {
                        margin-right: 4px;
                    }
                }
            }
        }
    }
}
</style>
