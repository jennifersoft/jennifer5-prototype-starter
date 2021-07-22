<template>
    <div class="report-table">
        <div class="subject" v-if="subject !== ''">
            <a :href="link" v-html="subject" v-if="link !== ''"></a>
            <span v-html="subject" v-else></span>

            <span class="count">
                <a :href="link" v-if="link !== ''">{{ rows.length }}</a>
                <span v-else>{{ rows.length }}</span>
            </span>
        </div>
        <x-table
            :key="tableSequence"
            :table-type="'nowrap'"
            :table-effect="'hover stripeless vborderless'"
            :table-size="'large'"
            :scroll-height="scrollHeight"
            :columns="columns"
            :data="rows"
            :template-row="rowTemplate"
            :row-height="35"
            :resize="true"
            :sort-type="'single'"
            @click="onClickTableRow"
        ></x-table>
    </div>
</template>

<script>
import XTable from 'vue-sheets/src/components/xtable';
import _ from '@library/lodash';
import { getDayjs, serverDateFormat } from '@common/base';
import { printEscape } from '@common/utility';
import { linkToEditorPage } from '../utility';

export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        XTable,
    },
    props: {
        scrollHeight: {
            type: Number,
            required: true,
        },
        reportList: {
            type: Array,
            required: true,
        },
        subject: {
            type: String,
            required: false,
            default: '',
        },
        link: {
            type: String,
            required: false,
            default: '',
        },
        activeDirectory: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    watch: {
        directoryName(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.tableSequence += 1;
        },
        reportList() {
            this.rowChecked = {};
        },
    },
    computed: {
        columns() {
            return [
                {
                    key: 'key',
                    name: '',
                    width: '30px',
                },
                {
                    key: 'directoryName',
                    name: this.i18n.directory,
                    width: '150px',
                    sort: true,
                    active: this.activeDirectory,
                },
                {
                    key: 'title',
                    name: this.i18n.title,
                    sort: true,
                    width: '50%',
                },
                {
                    key: 'writerId',
                    name: this.i18n.creator,
                    sort: true,
                },
                {
                    key: 'updateId',
                    name: this.i18n.modifier,
                    sort: true,
                },
                {
                    key: 'timeFormat',
                    name: this.i18n.creationTime,
                    sort: true,
                },
            ];
        },
        rows() {
            return this.reportList.map(report => {
                return {
                    rowChecked: this.rowChecked, // 공통 참조 데이터를 넘기는게 좋은 방법일까?
                    timeFormat: getDayjs(report.time).format(
                        `${serverDateFormat.longWithSec}.SSS`
                    ),
                    titleFormat: printEscape(report.title),
                    ...report,
                };
            });
        },
    },
    data() {
        return {
            tableSequence: 1,
            rowTemplate: `
<tr>
    <td width="30px"><input type="checkbox" name="keys" value="<!= key !>" <! if(rowChecked[key] === true) { !>checked<! } !> /></td>
    <td><!= directoryName !></td>
    <td><a name="link"><!= titleFormat !></a></td>
    <td><!= writerId !></td>
    <td><!= updateId !></td>
    <td><!= timeFormat !></td>
</tr>
            `,
            rowChecked: {},
            resizeHandler: null,
        };
    },
    methods: {
        onClickTableRow(row, e) {
            if (e.target.name === 'keys') {
                this.rowChecked[row.data.key] = e.target.checked;
                this.$emit('check#row', this.getRowStatusKeys());
            } else if (e.target.name === 'link') {
                linkToEditorPage('/report/document/edit', row.data.key);
            }
        },
        getRowStatusKeys() {
            const checkedKeys = [];
            const uncheckedKeys = [];

            for (let key in this.rowChecked) {
                if (this.rowChecked[key] === true) checkedKeys.push(key);
                else uncheckedKeys.push(key);
            }
            return {
                checked: checkedKeys,
                unchecked: uncheckedKeys,
            };
        },
    },
    beforeMount() {
        this.resizeHandler = _.throttle(() => {
            this.tableSequence += 1;
        }, 1000);

        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
};
</script>

<style lang="scss" scoped>
@import '../themes.scss';

.report-table {
    @include themify($themes) {
        margin-bottom: 23px;

        > .subject {
            margin-bottom: 16px;

            > .count {
                float: right;

                > a {
                    color: themed('report-table-link-font-color') !important;
                }
            }

            * {
                font-size: 13px;
                color: themed('report-table-font-color') !important;
            }
        }

        ::v-deep a[name='link'] {
            cursor: pointer !important;
        }
    }
}
</style>
