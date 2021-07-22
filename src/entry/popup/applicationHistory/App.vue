<template>
    <div class="application-history-wrapper">
        <div class="popup-header">
            <div class="header-text">
                {{ i18n.applicationHistory }}
            </div>
            <div class="header-btn-group">
                <btn
                    :items="[{ iconType: manualIcon }]"
                    class="transparent"
                    normal
                    @click="openManualPopup"
                >
                </btn>
            </div>
        </div>
        <div class="popup-body">
            <div class="body-title">
                {{ i18n.deployList }}
            </div>
            <deploy-list-table
                ref="table-top"
                :table-type="'simple nowrap'"
                :columns="deployListColumns"
                :template-row="deployListTemplateRow"
                scroll="scroll"
                :scroll-height="132"
                :data="deployList"
                :resize="true"
                @click="onSelectDeploy"
            >
            </deploy-list-table>
            <div class="body-title" style="margin-top: 24px;">
                <div class="header-text">{{ i18n.detail }}</div>
                <search
                    v-model="searchText"
                    small
                    :placeholder="i18n.resourceName"
                >
                </search>
            </div>
            <deploy-detail-table
                :height="tableBottomHeight"
                :rows="filteredResourceList"
            >
            </deploy-detail-table>
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import XTable from 'vue-sheets/src/components/xtable';
import Search from '@vuejs/component/Input/Search';
import DeployDetailTable from '@entry/popup/applicationHistory/container/DeployDetailTable';
import {
    mapActions,
    mapMutations,
    mapState,
} from '@entry/popup/applicationHistory/vuex';
import { hashManual } from '@common/utility';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import _ from '@library/lodash';
import {
    TEMPLATE_ROW_DEPLOY,
    COLUMNS_DEPLOY,
} from '@entry/popup/applicationHistory/templates';

export default {
    name: 'App',
    components: {
        Btn,
        'deploy-list-table': XTable,
        Search,
        DeployDetailTable,
    },
    props: {
        list: {
            type: Object,
            required: true,
        },
        stime: {
            type: Number,
            required: true,
        },
        etime: {
            type: Number,
            required: true,
        },
    },
    inject: {
        i18n: {
            default: {
                applicationHistory: 'Application History',
                deployList: 'Deploy list',
                detail: 'Detail',
                resourceName: 'Resource name',
            },
        },
    },
    data() {
        return {
            searchText: '',
            tableBottomHeight: 0,
        };
    },
    computed: {
        ...mapState({
            params: state => state.params,
            targetRow: state => state.targetRow,
            deployList: state => state.deployList,
            resourceList: state => state.resourceList,
        }),
        filteredResourceList() {
            return !!this.searchText
                ? this.resourceList.filter(
                      l => l.resourceName.indexOf(this.searchText) !== -1
                  )
                : this.resourceList;
        },
    },
    methods: {
        ...mapMutations(['updateParams', 'updateTargetRow']),
        ...mapActions(['loadDeployList', 'loadResourceList']),
        openManualPopup() {
            hashManual('popup_applicationHistory');
        },
        onSelectDeploy({ rownum }) {
            this.updateTargetRow(rownum);
            this.loadResourceList(this.deployList[this.targetRow]);
            this.$refs['table-top'].sheet.select(rownum);
        },
        onResize: _.throttle(function() {
            const rowHeight = 27;
            const header = 32;
            const padding = 18;
            this.tableBottomHeight =
                window.innerHeight -
                padding -
                (226 + rowHeight * this.deployList.length + header);
        }, 100),
    },
    created() {
        this.manualIcon = ICON_TYPE.help;
        this.deployListTemplateRow = TEMPLATE_ROW_DEPLOY;
        this.deployListColumns = COLUMNS_DEPLOY;
    },
    beforeMount() {
        this.updateParams({
            list: this.list,
            stime: this.stime,
            etime: this.etime,
        });
    },
    async mounted() {
        window.addEventListener('resize', this.onResize);

        await this.loadDeployList(this.params);
        this.onResize();
        if (this.deployList.length > 0) {
            this.onSelectDeploy({ rownum: 0 });
        }
    },
};
</script>

<style scoped></style>
