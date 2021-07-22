<template>
    <div class="top-section">
        <div class="left">
            <deploy-chart
                :chart-data="chartData"
                @change="onClickChartNode"
            ></deploy-chart>
        </div>
        <div class="right">
            <div class="subject">{{ i18n.deployList }}</div>
            <div class="table">
                <deploy-table
                    :rows="deployData"
                    :index="0"
                    :height="224"
                    @change="onClickTableRow"
                ></deploy-table>
            </div>
        </div>
    </div>
</template>

<script>
import DeployChart from '../component/DeployChart';
import DeployTable from '../component/DeployTable';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        DeployChart,
        DeployTable,
    },
    computed: {
        ...mapState({
            day: state => state.day,
            deployCount: state => state.deployCount,
            deployData: state => state.deployData,
        }),
        chartData() {
            return {
                index: this.day,
                data: this.deployCount,
            };
        },
    },
    methods: {
        ...mapMutations([
            'selectDeployIndex',
            'updateDeploySearchTimes',
            'updateResourceSearchParams',
            'updateFetching',
        ]),
        ...mapActions(['loadDeployData', 'loadResourceData']),
        async onClickChartNode(index) {
            this.selectDeployIndex(index);
            this.updateDeploySearchTimes();
            this.updateFetching();
            await this.loadDeployData();
            await this.onClickTableRow(0);
            this.updateFetching(false);
        },
        onClickTableRow(index) {
            this.updateFetching();
            this.updateResourceSearchParams(index);
            this.loadResourceData();
            this.updateFetching(false);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.top-section {
    @include themify($themes) {
        display: flex;
        height: 300px;
        margin-top: 16px;
        border-radius: 4px;
        border: solid 1px themed('top-section-border-color');

        > div {
            flex: 1;
            &.right {
                border-left: solid 1px themed('top-section-border-color');
                > .subject {
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 42px;
                    height: 42px;
                    padding-left: 16px;
                    color: themed('top-section-font-color');
                }

                > .table {
                    ::v-deep tr {
                        cursor: pointer;

                        th:first-child {
                            border-top-left-radius: 0px !important;
                            border-bottom-left-radius: 0px !important;
                            border-left-width: 0px !important;
                        }
                        th:last-child {
                            border-top-right-radius: 0px !important;
                            border-bottom-right-radius: 0px !important;
                            border-right-width: 0px !important;
                        }
                    }
                }
            }
        }
    }
}
</style>
