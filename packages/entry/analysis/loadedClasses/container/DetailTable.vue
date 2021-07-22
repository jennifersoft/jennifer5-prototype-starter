<template>
    <div class="detail-table">
        <x-table
            :table-type="'nowrap'"
            :table-effect="'hover'"
            :resize="true"
            :template-row="templateRow"
            :columns="columns"
            :data="rows"
            :scroll-height="mainHeight"
            @click="onClickTableRow"
        ></x-table>
        <window
            :draggable="true"
            :resizable="true"
            :hide-footer="true"
            :messages="i18n"
            @cancel="onHideDetailCode"
            v-if="showDetailCode"
        >
            <template #subject>{{ detailName }}</template>
            <detail-code :max-height="450"></detail-code>
        </window>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import Window from '@vuejs/component/window/Window';
import DetailCode from './DetailCode';
import { LoadedClassListSearchTypeDef } from '@common/definition';
import { mapState, mapMutations, mapActions } from '../store/loadedClasses';

export default {
    inject: ['i18n'],
    components: {
        XTable,
        Window,
        DetailCode,
    },
    computed: {
        ...mapState({
            mainHeight: state => state.mainHeight,
            loadedClasses: state => state.loadedClasses,
            searchLimit: state => state.searchLimit,
            className: state => state.className,
        }),
        rows() {
            return this.loadedClasses.map(row => {
                return {
                    ...row,
                    noFormat: row.no.toLocaleForAries(),
                    classloaderFormat: row.classloader ?? '',
                };
            });
        },
    },
    data() {
        return {
            showDetailCode: false,
            detailName: '',

            columns: [
                {
                    key: 'no',
                    name: this.i18n.num,
                    width: '50px',
                    sort: false,
                },
                {
                    key: 'name',
                    name: this.i18n.class,
                    sort: true,
                },
                {
                    key: 'superClass',
                    name: this.i18n.superClass,
                    sort: true,
                },
                {
                    key: 'interfaces',
                    name: this.i18n.interface,
                    sort: false,
                },
                {
                    key: 'classloader',
                    name: this.i18n.classLoader,
                    sort: true,
                },
            ],
            templateRow: `<tr>
    <td align="right"><!= noFormat !></td>
    <td><span class="class-link"><!= name !></span></td>
    <td>
        <! if(superClassSearchable) { !>
        <span class="superclass-link"><!= superClass !></span>
        <! } else { !>
        <!= superClass !>
        <! } !>
    </td>
    <td>
        <! for(let i = 0; i < interfaces.length; i++) { !>
            <! if(interfaces[i].searchable) { !>
            <span class="interface-link"><!= interfaces[i].name !></span>
            <! } else { !>
            <!= interfaces[i].name !>
            <! } !>
        <! } !>
    </td>
    <td><!= classloaderFormat !></td>
</tr>`,
        };
    },
    methods: {
        ...mapMutations(['updateDetailName', 'updateSearchCondition']),
        ...mapActions(['loadClassListInAgent']),
        onClickTableRow(row, e) {
            const type = e.target.className;
            const text = e.target.innerText;

            if (type === 'superclass-link') {
                this.updateSearchCondition({
                    type:
                        LoadedClassListSearchTypeDef.SUPER_CLASS_MATCH_KEYWORD,
                    keyword: text,
                    limit: this.searchLimit,
                });
                this.loadClassListInAgent();
            } else if (type === 'interface-link') {
                this.updateSearchCondition({
                    type: LoadedClassListSearchTypeDef.INTERFACE_MATCH_KEYWORD,
                    keyword: text,
                    limit: this.searchLimit,
                });
                this.loadClassListInAgent();
            } else if (type === 'class-link') {
                this.showDetailCode = true;
                this.detailName = text;
                this.updateDetailName(text);
            }
        },
        onHideDetailCode() {
            this.showDetailCode = false;
            this.updateDetailName('');
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-table {
    ::v-deep tr {
        .class-link,
        .superclass-link,
        .interface-link {
            cursor: pointer;
            text-decoration: underline;
        }
    }

    ::v-deep .aries-ui-window {
        width: 800px;
        height: 600px;
        bottom: 35px;
        left: 85px;
    }
}
</style>
