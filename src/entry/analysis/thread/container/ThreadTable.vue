<template>
    <div class="table-panel">
        <div class="toolbar">
            <div class="tool-right">
                <div class="badge-group">
                    <status-badge
                        :label="i18n.started"
                        :value="count.started"
                    />
                    <status-badge
                        :label="i18n.deadLock"
                        :value="count.deadlock"
                        color="red"
                    />
                    <status-badge
                        :label="i18n.currentThreadCount"
                        :value="count.current"
                        color="blue"
                    />
                </div>
                <div
                    class="badge-group counted"
                    v-if="Object.keys(statusMap).length > 0"
                >
                    <status-badge
                        v-for="(key, i) in Object.keys(statusMap)"
                        :key="i"
                        :label="key"
                        :value="statusMap[key]"
                    />
                </div>
            </div>
            <search
                v-model="searchText"
                :placeholder="i18n.threadName"
                :width="160"
                @search="searching = true"
                @clear="searching = false"
                small
            />
        </div>
        <table class="table classic hover" ref="table">
            <thead>
                <tr>
                    <th style="width: 70px;">{{ i18n.id }}</th>
                    <th>{{ i18n.thread }}</th>
                    <th>{{ i18n.cpuTime }} ({{ i18n.ms }})</th>
                    <th>{{ i18n.deltaCpuTime }} ({{ i18n.ms }})</th>
                    <th>{{ i18n.state }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';
import { i18n } from '@common/utility';

import Search from '@vuejs/component/Input/Search';
import StatusBadge from '@entry/analysis/thread/component/StatusBadge';
import { mapState, mapGetters, mapMutations } from '../vuex';

jui.use(XTableComp);

const TEMPLATE_ROW = `
<tr style="cursor: pointer">
    <td align="right"><!= id !></td>
    <td><!= name !></td>
    <td align="right"><!= cpu.toLocaleForAries() !></td>
    <td align="right"><!= dcpu.toLocaleForAries() !></td>
    <td><!= stat !></td>
</tr>`;

export default {
    name: 'ThreadTable',
    inject: {
        i18n: {
            default: () => ({
                id: 'id',
                thread: 'thread',
                cpuTime: 'cpuTime',
                ms: 'ms',
                deltaCpuTime: 'deltaCpuTime',
                state: 'state',
                started: 'started',
                deadLock: 'deadLock',
                currentThreadCount: 'currentThreadCount',
                threadName: 'threadName',
            }),
        },
    },
    components: {
        Search,
        StatusBadge,
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        height: {
            type: Number,
            default: 0,
        },
    },
    watch: {
        filteredList(next) {
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
            count: state => state.count,
        }),
        ...mapGetters(['statusMap']),
        filteredList() {
            if (!this.searching) return this.list;
            return this.list.filter(e => e.name.includes(this.searchText));
        },
    },
    data() {
        return {
            searchText: '',
            searching: false,
        };
    },
    methods: {
        onClickTableRow(row, _) {
            this.$emit('row-click', row.data.id);
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: ['id', 'name', 'cpu', 'dcpu', 'stat'],
            resize: true,
            sort: [0, 1, 2, 3, 4],
            sortCache: true,
            sortLoading: true,
            event: {
                click: self.onClickTableRow,
                sort: setSortEff,
            },
            tpl: {
                row: TEMPLATE_ROW,
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
        division-color: #e8e8e8,
    ),
    dark: (
        division-color: #4e4e4e,
    ),
);
.table-panel {
    @include themify($themes) {
        .badge-group {
            padding: 0 8px;
            &.counted {
                border-left: 1px solid themed('division-color');
            }
        }
    }
}
</style>
