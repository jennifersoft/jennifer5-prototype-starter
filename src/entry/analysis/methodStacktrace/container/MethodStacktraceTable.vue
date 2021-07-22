<template>
    <div class="table-panel">
        <div class="toolbar">
            <div class="tool-right" v-click-outside="closeMethodTreeWindow">
                <btn
                    :items="[{ text: i18n.stacktraceRemove }]"
                    @click="$emit('remove-stack')"
                />
                <btn
                    ref="method-tree-btn"
                    :items="[
                        { text: i18n.addStackMethod, key: 'method' },
                        { text: i18n.addStackClass, key: 'class' },
                    ]"
                    type-in-group-button="noselect"
                    @click="openMethodTreeWindow"
                />
                <btn
                    :items="[{ text: i18n.deleteStackClass }]"
                    @click="onClickRemoveClasses"
                />
                <method-tree-window
                    v-if="showMethodTreeWindow"
                    :allow-method="allowMethod"
                    :open-x="methodTreePosition.x"
                    :open-y="methodTreePosition.y"
                    enable-search-list-type
                    @add="onAddStacktraceClass"
                    @close="showMethodTreeWindow = false"
                    @alert="msg => (alertMessage = msg)"
                />
            </div>
        </div>
        <table class="table classic large stripeless hover" ref="table">
            <thead>
                <tr>
                    <th width="30px">
                        <input
                            type="checkbox"
                            id="ck_all"
                            v-model="allChecked"
                        />
                    </th>
                    <th width="50px">{{ i18n.num }}</th>
                    <th width="200px">{{ i18n.time }}</th>
                    <th>{{ i18n.class }} / {{ i18n.method }}</th>
                    <th>{{ i18n.classloader }}</th>
                    <th width="200px">{{ i18n.stacktrace }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { i18n, setSortEff } from '@common/utility';
import Btn from '@vuejs/component/button/Btn';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import MethodTreeWindow from '@entry/analysis/methodStacktrace/container/MethodTreeWindow';
import {
    mapActions,
    mapMethodTreeActions,
} from '@entry/analysis/methodStacktrace/vuex';
import clickOutside from '@vuejs/directive/clickOutside';
import { TEMPLATE_ROW } from '@entry/analysis/methodStacktrace/templates';

jui.use(XTableComp);

function existClassName(list, clazz) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === clazz) {
            return true;
        }
    }
    return false;
}

export default {
    name: 'MethodStacktraceTable',
    inject: {
        i18n: {
            default: () => ({
                num: 'num',
                time: 'time',
                method: 'method',
                class: 'class',
                classloader: 'classloader',
                stacktrace: 'stacktrace',
                stacktraceRemove: 'stacktraceRemove',
                addStackMethod: 'addStackMethod',
                deleteStackClass: 'deleteStackClass',
                M0261: 'M0261',
            }),
        },
    },
    components: {
        Btn,
        MethodTreeWindow,
        AlertWindow,
    },
    directives: {
        clickOutside,
    },
    props: {
        list: {
            type: Array,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        height(next) {
            this.table.scrollHeight(next);
        },
        allChecked(checked) {
            const data = this.table.listData();
            const elements = document.getElementsByClassName('inline-checkbox');

            if (checked) this.checkedKeys = data.map(row => row.key);
            else this.checkedKeys = [];

            for (let i = 0; i < elements.length; i++) {
                elements[i].checked = checked;
            }
        },
    },
    data() {
        return {
            allChecked: false,
            checkedKeys: [],
            showMethodTreeWindow: false,
            allowMethod: true,
            methodTreePosition: {
                x: 0,
                y: 0,
            },
            alertMessage: '',
        };
    },
    methods: {
        ...mapActions(['addStacktraceClass', 'removeStacktraceClasses']),
        ...mapMethodTreeActions(['loadMethodTreeNodes', 'searchClassList']),
        onClickTableRow(row, event) {
            const { target } = event;
            const { data, index } = row;
            const { key } = data;

            if (target.classList.contains('round-btn')) {
                switch (target.classList.item(0)) {
                    case 'show-stack':
                        this.$emit('show-stack', data);
                        return;
                    case 'wait-stack':
                        return;
                    case 'receive-stack':
                        this.$emit('receive-stack', { key });
                        return;
                }
            } else if (target.classList.contains('inline-checkbox')) {
                if (target.checked) {
                    if (!this.checkedKeys.includes(key))
                        this.checkedKeys.push(key);
                } else {
                    this.checkedKeys = this.checkedKeys.filter(k => k !== key);
                }
            }
        },
        async openMethodTreeWindow({ key }) {
            this.allowMethod = key === 'method';
            await Promise.all([
                this.loadMethodTreeNodes(),
                this.searchClassList({}),
            ]);
            this.$nextTick(() => {
                if (!this.showMethodTreeWindow)
                    this.showMethodTreeWindow = true;
            });
        },
        closeMethodTreeWindow() {
            this.showMethodTreeWindow = false;
        },
        onClickRemoveClasses() {
            if (this.checkedKeys.length === 0) {
                this.alertMessage = this.i18n.M0338;
                return;
            }
            this.removeStacktraceClasses(this.checkedKeys);
            this.checkedKeys = [];
        },
        onAddStacktraceClass(name) {
            if (existClassName(this.list, name)) {
                this.alertMessage = this.i18n.M0261;
                return;
            }
            this.addStacktraceClass(name);
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [null, 'key', 'time', 'name', 'classLoader', null],
            resize: true,
            sort: [1, 2, 3, 4],
            sortCache: true,
            sortLoading: true,
            event: {
                sort: setSortEff,
                click: self.onClickTableRow,
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });
        this.table.scrollHeight(this.height);
        const { bottom, right } = this.$refs[
            'method-tree-btn'
        ].$el.getBoundingClientRect();
        this.methodTreePosition = {
            x: right - 600,
            y: bottom + 12,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/analysis/socket/styles/table-panel.scss';
@import '~@entry/analysis/socket/styles/stacktrace-cell.scss';
.table-panel {
    .toolbar > .tool-right > .aries-ui-btn {
        margin-left: 8px;
    }
    .table {
        @include stacktrace-cell;
    }
}
</style>
