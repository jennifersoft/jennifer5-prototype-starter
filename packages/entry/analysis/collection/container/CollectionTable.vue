<template>
    <div class="table-panel">
        <div class="toolbar">
            <div class="tool-right">
                <btn
                    :items="[{ text: i18n.stacktraceRemove }]"
                    @click="clearStacktrace"
                />
                <btn
                    class="receive-all-stack-btn"
                    :items="[{ text: i18n.stackReceive }]"
                    :tooltip-options="agentNotSupportedTooltip"
                    @click="receiveStacktraceAll"
                />
                <btn
                    :items="[{ text: i18n.gc }]"
                    :disabled="!gcPermission"
                    @click="gcStacktrace"
                />
            </div>
            <div class="tool-left" v-click-outside="closeConfigWindow">
                <labeled-btn
                    ref="config-btn"
                    :value="collectionCountString"
                    :label="i18n.collectionCount"
                    :tooltip-message="collectionTooltipString"
                    @click="toggleConfigWindow"
                />
                <collection-config-window
                    v-if="showConfigWindow"
                    @close="showConfigWindow = false"
                    :open-x="popupPositions.x"
                    :open-y="popupPositions.y"
                    :min-stack="minimumStacktraceCount"
                    :auto-stack="autoStacktraceCount"
                />
            </div>
        </div>
        <table class="table classic hover nowrap large stripeless" ref="table">
            <thead>
                <tr>
                    <th width="50px">{{ i18n.num }}</th>
                    <th>{{ i18n.creationTime }}</th>
                    <th>{{ i18n.collectionSize }}</th>
                    <th>{{ i18n.delta }} {{ i18n.collectionSize }}</th>
                    <th width="20%">{{ i18n.collectionName }}</th>
                    <th>{{ i18n.hash }}</th>
                    <th width="20%">{{ i18n.serviceName }}</th>
                    <th width="200px">{{ i18n.stacktrace }}</th>
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
import LabeledBtn from '@entry/analysis/collection/component/LabeledBtn';
import CollectionConfigWindow from '@entry/analysis/collection/container/CollectionConfigWindow';
import { onClickStacktraceBtn } from '@entry/analysis/socket/component/DetailTable';
import { mapState, mapActions } from '../vuex';
import { setSortEff } from '@common/utility';
import clickOutside from '@vuejs/directive/clickOutside';
import { TEMPLATE_ROW } from "@entry/analysis/collection/template";

jui.use(XTableComp);

export default {
    name: 'CollectionTable',
    components: {
        Btn,
        LabeledBtn,
        CollectionConfigWindow,
    },
    directives: {
        clickOutside,
    },
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                num: 'num',
                creationTime: 'creationTime',
                collection: 'collection',
                count: 'count',
                delta: 'delta',
                collectionName: 'collectionName',
                hash: 'hash',
                serviceName: 'serviceName',
                stacktrace: 'stacktrace',
                stacktraceRemove: 'stacktraceRemove',
                stackReceive: 'stackReceive',
                gc: 'gc',
                collectionCount: 'collectionCount',
                collectionSize: 'collectionSize',
                edit: 'edit',
                minimumStacktrace: 'minimumStacktrace',
                atuoStacktrace: 'atuoStacktrace',
            }),
        },
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        height: {
            type: Number,
            required: true,
        },
        gcPermission: {
            type: Boolean,
            required: true,
        },
        agentStatus: {
            type: String,
            default: 'Supported',
        },
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        height(next, prev) {
            if (next !== prev) {
                this.table.scrollHeight(next);
            }
        },
    },
    computed: {
        ...mapState({
            autoStacktraceCount: state => state.autoStacktraceCount,
            minimumStacktraceCount: state => state.minimumStacktraceCount,
        }),
        collectionCountString() {
            return `${this.minimumStacktraceCount} / ${this.autoStacktraceCount}`;
        },
        collectionTooltipString() {
            return `${this.i18n.minimumStacktrace} / ${this.i18n.autoStacktrace}`;
        },
        agentNotSupportedTooltip() {
            if (this.agentStatus === 'Supported') return null;
            return {
                message: this.agentStatus,
                position: 'top-center',
            };
        },
    },
    data() {
        return {
            showConfigWindow: false,
            popupPositions: {
                x: 0,
                y: 0,
            },
        };
    },
    methods: {
        ...mapActions([
            'receiveStacktraceAll',
            'clearStacktrace',
            'gcStacktrace',
        ]),
        toggleConfigWindow() {
            this.showConfigWindow = !this.showConfigWindow;
        },
        updatePopupPosition() {
            const { top, left, height } = this.$refs[
                'config-btn'
            ].$el.getBoundingClientRect();
            this.popupPositions = { x: left, y: top + height + 12 };
        },
        closeConfigWindow() {
            if (this.showConfigWindow) this.showConfigWindow = false;
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [
                null,
                'time',
                'size',
                'dsize',
                'name',
                'hash',
                'application',
                null,
            ],
            resize: true,
            sort: [1, 2, 3, 4, 5, 6],
            sortCache: true,
            sortLoading: true,
            rowHeight: 35,
            event: {
                sort: setSortEff,
                click: onClickStacktraceBtn.bind(self),
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.scrollHeight(this.height);

        this.updatePopupPosition();
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/socket/styles/table-panel.scss';
@import '~@entry/analysis/socket/styles/stacktrace-cell.scss';
.table-panel {
    > .toolbar > .tool-right > * {
        margin-left: 8px;
    }
    .table {
        @include stacktrace-cell;
    }
}
</style>
