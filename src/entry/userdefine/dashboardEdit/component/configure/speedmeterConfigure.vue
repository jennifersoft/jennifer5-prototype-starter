<template>
    <div class="speedmeter-box">
        <div class="show-line-by-domain">
            <Checkbox v-model="editingChartOptions.isDivideByDomain" />

            <span>{{ i18n.domainDivideLine }}</span>
        </div>

        <div class="show-name-box">
            <div>
                <Checkbox
                    v-model="editingChartOptions.showInstanceNameInSpeedMeter"
                />

                <span>{{ i18n.instanceName }}</span>
            </div>
            <div>
                <Checkbox
                    v-model="editingChartOptions.showDomainNameInSpeedMeter"
                />

                <span>{{ i18n.domainName }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers(
    'userdefine'
);

export default {
    name: 'speedmeterConfigure',
    components: {
        Checkbox,
    },
    data() {
        return {
            i18n: {
                domainDivideLine: i18n.get('ui.label.domain.divide.line'),
                instanceName: i18n.get('ui.label.instanceName'),
                domainName: i18n.get('ui.label.domain.name'),
            },

            isDivideByDomain: false,
            isShowInstanceNameInSpeedMeter: false,
            isShowDomainNameInSpeedMeter: false,
        };
    },
    methods: {
        ...mapMutations([
            'toggleIsDivideByDomainOnEditingChart',
            'toggleShowDomainNameInSpeedMeterOnEditingChart',
            'toggleShowInstanceNameInSpeedMeterOnEditingChart',
        ]),
    },
    computed: {
        ...mapState(['editingChartOptions']),
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.speedmeter-box {
    @include themify($themes) {
        color: themed('edit-component-title2-color');

        span {
            margin-left: 8px;
            font-size: 14px;
        }

        .show-line-by-domain {
            display: flex;
            align-items: center;
            height: 32px;
            line-height: 32px;
        }

        .show-name-box {
            margin-top: 10px;
            border-radius: 4px;
            border: solid 1px themed('edit-chart-tab-thumbnail-border-color');
            padding: 8px 10px;

            > div {
                display: flex;
                align-items: center;
                height: 24px;
                line-height: 24px;
            }
        }
    }
}
</style>
