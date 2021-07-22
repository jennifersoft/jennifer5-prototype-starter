<template>
    <div class="error-config">
        <div class="item">
            <oid-config
                :check-manual-domain="checkManualDomain"
                :resource-tab="resourceTab"
                :resource-list="resourceList"
                :resource-multi-select="resourceMultiSelect"
                :active-group-data="activeGroupData"
                @change-tab="tab => $emit('change-tab', tab)"
                @change-resource="
                    groupData => $emit('change-resource', groupData)
                "
            ></oid-config>
        </div>

        <div class="item errors">
            <list-selector
                @check="onChangeError"
                :list="newErrorList"
                :multi-select="true"
                :title-label="i18n.error"
                :active-indexes="activeErrorIndexes"
            ></list-selector>
        </div>
    </div>
</template>
<script>
import { i18n } from '@common/utility';
import { ErrorTypeDef } from '@common/definition';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import OidConfig from './OidConfig';

export default {
    components: {
        ListSelector,
        OidConfig,
    },
    props: {
        checkManualDomain: {
            type: Boolean,
            required: false,
            default: false,
        },
        resourceList: {
            type: Array,
            required: true,
        },
        resourceMultiSelect: {
            type: Boolean,
            required: false,
            default: false,
        },
        resourceTab: {
            type: String,
            required: false,
            default: 'domain',
        },
        activeGroupData: {
            type: String,
            required: false,
            default: '',
        },
        activeError: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        newErrorList() {
            const events = [];

            for (const key in ErrorTypeDef) {
                events.push({
                    label: key,
                    description: '',
                    value: ErrorTypeDef[key],
                });
            }

            return events;
        },
        activeErrorIndexes() {
            const activeIndexes = [];
            this.newErrorList.map((item, index) => {
                if (this.activeError.includes(item.value))
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
    },
    data() {
        return {
            i18n: {
                error: i18n.get('ui.label.error'),
            },
        };
    },
    methods: {
        onChangeError(checkedNodes) {
            this.$emit('change-error', checkedNodes);
        },
    },
};
</script>
<style lang="scss" scoped>
.error-config {
    > .item {
        display: inline-block;
        height: 235px;

        &.errors {
            width: 300px;
        }
    }
}
</style>
