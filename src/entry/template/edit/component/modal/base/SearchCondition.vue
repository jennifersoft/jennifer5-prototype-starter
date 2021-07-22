<template>
    <div class="search-condition">
        <div class="left">
            <metrics-config
                :check-manual-domain="checkManualDomain"
                :resource-list="resourceList"
                :resource-multi-select="resourceMultiSelect"
                :resource-tab="selectedData.mtype"
                :metrics-map="metricsMap"
                :metrics-multi-select="metricsMultiSelect"
                @change-tab="onChangeResourceTab"
                @change-resource="onChangeResourceGroupData"
                @change-metrics="onChangeMetricsNodes"
            ></metrics-config>
        </div>

        <div class="center">
            <btn
                :items="[{ iconType: addIcon.type }]"
                :tooltip-options="{ message: addIcon.message }"
                @click.native="onClickAddCondition"
            ></btn>
        </div>

        <div class="right">
            <condition-list
                :items="conditions"
                @delete="onClickDeleteCondition"
            ></condition-list>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { OTypeDef } from '@common/definition';
import { i18n } from '@common/utility';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import MetricsConfig from './ui/MetricsConfig';
import ConditionList from './ui/ConditionList';
const { mapState, mapMutations } = createNamespacedHelpers('template/modal');
const resourcesIndex = { domain: 0, instance: 1, business: 2 };

export default {
    components: {
        Btn,
        MetricsConfig,
        ConditionList,
    },
    props: {
        checkManualDomain: Boolean,
        metricsMap: Object,
        metricsMultiSelect: Boolean,
        resourceList: Array,
        resourceMultiSelect: Boolean,
    },
    computed: {
        ...mapState({
            request: state => state.request || [],
        }),
        conditions() {
            if (!this.request) return [];

            return this.request.map(item => {
                const names = this.checkManualDomain
                    ? this.getTargetName(item)
                    : i18n.get('ui.label.all');

                return {
                    title:
                        i18n.get(`ui.mx.${item.metricsCode}`) +
                        ' ' +
                        item.mtype +
                        `(${names})`,
                    key: this.createRequestKey(item),
                };
            });
        },
    },
    data() {
        return {
            i18n: {
                addCondition: i18n.get('ui.label.addCondition'),
                M0014: i18n.get('M0014'),
                M0015: i18n.get('M0015'),
                M0123: i18n.get('M0123'),
            },
            selectedData: {
                mtype: 'domain',
                otype: OTypeDef.SYSTEM,
                metrics: '',
                metricsCode: '',
                groupData: '',
            },
            addIcon: {
                type: ICON_TYPE.arrowRight,
                message: i18n.get('ui.button.add'),
            },
        };
    },
    methods: {
        ...mapMutations(['setDataImage']),
        onChangeResourceTab(tab) {
            this.selectedData.mtype = tab;
            this.selectedData.otype =
                tab == 'business' ? OTypeDef.BUSINESS : OTypeDef.SYSTEM;
            this.$emit('change-tab', tab);
        },
        onChangeResourceGroupData(groupData) {
            this.selectedData.groupData = groupData;
            this.$emit('change-resource', groupData);
        },
        onChangeMetricsNodes(nodes) {
            this.selectedData.metrics = nodes[0].value;
            this.selectedData.metricsCode = nodes[0].code;
            this.$emit('change-metrics', nodes);
        },
        onClickAddCondition() {
            const groupData = this.selectedData.groupData;

            if (
                this.checkManualDomain &&
                (groupData === '' || groupData === '{}')
            ) {
                // alert(this.i18n.M0015);
                return;
            }

            if (!this.selectedData.metrics) {
                // alert(this.i18n.M0014);
                return;
            }

            if (this.existRequestKey(this.selectedData)) {
                // alert(this.i18n.M0123);
                return;
            }

            this.setDataImage({
                request: this.request.concat([
                    JSON.parse(JSON.stringify(this.selectedData)),
                ]),
            });
        },
        onClickDeleteCondition(targetKey) {
            const newRequest = [];

            this.request.forEach(item => {
                if (targetKey != this.createRequestKey(item))
                    newRequest.push(item);
            });

            this.setDataImage({ request: newRequest });
        },
        createRequestKey(item) {
            return `${item.metricsCode}-${item.mtype}-${item.groupData}`;
        },
        existRequestKey(targetData) {
            return this.request.some(
                item =>
                    this.createRequestKey(targetData) ==
                    this.createRequestKey(item)
            );
        },
        getTargetName(item) {
            const nameMap = {};
            const names = [];
            const name = i18n.get('ui.label.unknown');
            const groupData = JSON.parse(item.groupData);

            this.resourceList[resourcesIndex[item.mtype]].tree.forEach(node => {
                const key = `${node.data.sid}-${
                    node.data.oid == -1 ? 0 : node.data.oid
                }`;
                nameMap[key] = node.data.shortName;
            });

            for (const sid in groupData) {
                groupData[sid].forEach(oid => {
                    names.push(nameMap[`${sid}-${oid}`]);
                });
            }

            return names.length == 0 ? name : names.join(',');
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../../../style/search-condition';

.search-condition {
    @include search-condition;
}
</style>
