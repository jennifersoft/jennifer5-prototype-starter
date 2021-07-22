<template>
    <window
        class="service-window"
        animation-name="fade-down"
        :messages="{ apply: i18n.add, cancel: i18n.cancel }"
        :open-w="900"
        :open-h="624"
        :open-x="origin.x - 450"
        :open-y="origin.y - 312"
        @apply="onClickAddBtn"
        @cancel="$emit('close')"
    >
        <template #subject>{{ subject }}</template>
        <div>
            <navigation-bar :show-search-btn="false">
                <navigation-item>
                    <search
                        v-model="hashFilter"
                        :placeholder="i18n.hash"
                        :width="140"
                        style="margin-right: 8px;"
                        small
                        @search="onActiveFilter"
                        @clear="onInactiveFilter"
                    />
                    <search
                        v-model="textFilter"
                        :placeholder="typedLabel"
                        :width="242"
                        small
                        @search="onActiveFilter"
                        @clear="onInactiveFilter"
                    />
                </navigation-item>
            </navigation-bar>
            <div class="table-caption">
                <span>{{ checkedCountFormat }} / {{ dataCountFormat }}</span>
            </div>
            <table ref="table" class="table simple headline">
                <thead>
                    <tr>
                        <th width="70px">
                            <!-- 전체 체크 시 갯수 제한하기 위해 필터링된 상태에서만 작동 -->
                            <input
                                v-if="isFiltered"
                                type="checkbox"
                                id="ck_all"
                                v-model="allChecked"
                            />
                        </th>
                        <th width="200px">{{ i18n.hash }}</th>
                        <th>{{ i18n.name }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </window>
</template>

<script>
import SheetsXTable from 'vue-sheets/src/components/xtable';
import Window from '@vuejs/component/window/Window';
import Search from '@vuejs/component/Input/Search';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from '@common/utility';

jui.use(XTableComp);

const TEMPLATE_ROW = `
<tr>
    <td>
        <input class="inline-checkbox" type="checkbox" name="hashcode" value="<!= hash !>" <! if(checked) { !>checked<! } !> />
    </td>
    <td><!= hash !></td>
    <td><!= text !></td>
</tr>`;

export default {
    name: 'serviceWindow',
    components: {
        SheetsXTable,
        Search,
        Window,
        NavigationBar,
        NavigationItem,
    },
    inject: {
        i18n: {
            default: () => ({
                searchService: 'Search',
                serviceName: 'Service',
                hash: 'Hash',
                cancel: 'Cancel',
                add: 'Add',
                select: 'Select',
                selectedHashCount: 'Selected hash count',
                application: 'application',
                sql: 'sql',
                externalCall: 'externalCall',
                search: 'search',
                name: 'name',
            }),
        },
    },
    filters: {
        numberFormat(value) {
            return value.toLocaleForAries();
        },
    },
    props: {
        list: {
            type: Array,
            required: true,
        },
        serviceType: {
            type: String,
            required: true,
            validator(t) {
                return ['application', 'sql', 'externalCall'].includes(t);
            },
        },
    },
    data() {
        return {
            checkedList: this.list.filter(e => e.checked),
            hashSet: new Set(),
            textFilter: '',
            hashFilter: '',
            isFiltered: false,
            allChecked: false,
            dataCount: 0,
            origin: {
                x: (window.innerWidth - 154) / 2,
                y: window.innerHeight / 2 + 50,
            },
        };
    },
    computed: {
        subject() {
            return `${this.i18n[this.serviceType]} ${this.i18n.search}`;
        },
        typedLabel() {
            return `${this.i18n[this.serviceType]} ${this.i18n.name}`;
        },
        checkedCountFormat() {
            return this.checkedList.length.toLocaleForAries();
        },
        dataCountFormat() {
            return this.dataCount.toLocaleForAries();
        },
    },
    watch: {
        list(next) {
            this.table.update(next);
        },
        isFiltered(next) {
            const filteredList =
                next && (this.textFilter !== '' || this.hashFilter !== '')
                    ? this.list.filter(
                          row =>
                              row.text.includes(this.textFilter) ||
                              row.hash.toString() === this.hashFilter
                      )
                    : this.list;

            this.table.update(
                filteredList.map(e => ({
                    ...e,
                    checked: this.hashSet.has(e.hash),
                }))
            );
            this.dataCount = filteredList.length;
        },
        allChecked(checked) {
            const data = this.table.listData();

            if (checked) {
                this.checkedList = data;
                for (const { hash } of data) {
                    this.hashSet.add(hash);
                }
            } else {
                this.hashSet.clear();
                this.checkedList = [];
            }

            this.table.update(
                data.map(e => ({
                    ...e,
                    checked,
                }))
            );
        },
    },
    methods: {
        onClickAddBtn() {
            this.$emit('add-hash', this.checkedList);
            this.$emit('close');
        },
        onClickTableRow(row, e) {
            const { classList, checked } = e.target;
            const { hash } = row.data;
            if (classList.contains('inline-checkbox')) {
                if (checked) {
                    if (!this.hashSet.has(hash)) {
                        this.checkedList.push(row.data);
                        this.hashSet.add(hash);
                    }
                } else {
                    this.checkedList = this.checkedList.filter(
                        k => k.hash !== hash
                    );
                    this.hashSet.delete(hash);
                }
                row.data.checked = checked;
            }
        },
        onActiveFilter() {
            if (!this.isFiltered) this.isFiltered = true;
        },
        onInactiveFilter() {
            if (this.isFiltered) this.isFiltered = false;
        },
    },
    created() {
        for (const { hash } of this.list.filter(e => e.checked)) {
            this.hashSet.add(hash);
        }
    },
    mounted() {
        const self = this;

        this.table = jui.create('grid.xtable', self.$refs.table, {
            fields: [null, 'hash', 'name'],
            resize: true,
            buffer: 'vscroll',
            sort: true,
            sortCache: true,
            scrollHeight: 370,
            event: {
                sort: function(column, e) {
                    setSortEff(column, e, true);
                },
                click: self.onClickTableRow,
            },
            tpl: {
                row: TEMPLATE_ROW,
            },
        });

        this.table.update(this.list);
        this.dataCount = this.list.length;
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';
$themes: (
    classic: (
        count-text-color: #616161,
    ),
    dark: (
        count-text-color: #999999,
    ),
);
.service-window {
    @include themify($themes) {
        .table-caption {
            height: 36px;
            line-height: 48px;
            color: themed('count-text-color');
            font-size: 12px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
