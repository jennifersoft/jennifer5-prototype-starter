<template>
    <div class="main-contents">
        <template v-if="isViewAll">
            <div
                class="scroll-view"
                :style="{ 'max-height': `${mainScrollHeight}px` }"
            >
                <report-table
                    v-for="(data, index) in totalTableData"
                    :key="index"
                    :scroll-height="data.height"
                    :report-list="data.value"
                    :active-directory="data.first"
                    :subject="data.name"
                    :link="data.link"
                    @check#row="addCheckedKeys"
                ></report-table>
            </div>
        </template>
        <template v-else>
            <div class="table-view">
                <report-table
                    :scroll-height="individualTableHeight"
                    :report-list="reportList"
                    :active-directory="false"
                    @check#row="addCheckedKeys"
                ></report-table>
            </div>
        </template>
    </div>
</template>

<script>
import _ from '@library/lodash';
import ReportTable from '../component/ReportTable';
import { mapMutations, mapState } from '../vuex';

export default {
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        ReportTable,
    },
    computed: {
        ...mapState({
            directoryKey: state => state.directoryKey,
            directoryNameMap: state => state.directoryNameMap,
            reportList: state => state.reportList,
            reportListInDirectory: state => state.reportListInDirectory,
            checkedReportKeys: state => state.checkedReportKeys,
        }),
        totalTableData() {
            const result = [];

            for (let directoryKey in this.reportListInDirectory) {
                const reportList = this.reportListInDirectory[directoryKey];

                if (reportList.length > 0) {
                    const name =
                        directoryKey === '*'
                            ? this.i18n.noDir
                            : this.directoryNameMap[directoryKey];
                    const isLastWeek = directoryKey === 'lastWeek';

                    result.push({
                        key: directoryKey,
                        value: reportList.sort((a, b) => b.time - a.time),
                        name: isLastWeek ? this.i18n.lastWeekUpload : name,
                        link:
                            isLastWeek || directoryKey === '*'
                                ? ''
                                : `/report/document/list?directoryKey=${directoryKey}`,
                        height: isLastWeek || directoryKey === '*' ? 350 : 140,
                        first: isLastWeek,
                    });
                }
            }

            return result;
        },
        isViewAll() {
            return this.directoryKey === '' || this.directoryKey === '*';
        },
    },
    data() {
        return {
            individualTableHeight: this.getIndividualTableHeight(),
            mainScrollHeight: this.getMainScrollHeight(),
        };
    },
    methods: {
        ...mapMutations(['updateCheckedReportKeys']),
        addCheckedKeys(keys) {
            // 체크 해제한 로우가 있다면 기존의 키값들에서 제외한다.
            const filteredKeys = this.checkedReportKeys.filter(
                k => !keys.unchecked.includes(k)
            );
            this.updateCheckedReportKeys([...filteredKeys, ...keys.checked]);
        },
        getIndividualTableHeight() {
            return window.innerHeight - 236;
        },
        getMainScrollHeight() {
            return window.innerHeight - 188;
        },
        onResizeMainContents() {
            this.individualTableHeight = this.getIndividualTableHeight();
            this.mainScrollHeight = this.getMainScrollHeight();
        },
    },
    mounted() {
        const resizeFunc = _.throttle(() => {
            this.onResizeMainContents();
        }, 500);

        window.addEventListener('resize', resizeFunc);
    },
};
</script>

<style lang="scss" scoped>
.main-contents {
    overflow-x: auto;

    > .scroll-view {
        overflow: auto;
        padding: 24px;
    }
    > .table-view {
        overflow: hidden;
        padding: 24px;
    }
}
</style>
