<template>
    <div class="event-config">
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

        <div class="item events">
            <list-selector
                @check="onChangeEvent"
                :list="newEventList"
                :multi-select="true"
                :title-label="i18n.event"
                :active-indexes="activeEventIndexes"
            ></list-selector>
        </div>

        <div class="item levels">
            <list-selector
                @check="onChangeLevel"
                :list="newLevelList"
                :multi-select="true"
                :title-label="i18n.level"
                :active-indexes="activeLevelIndexes"
            ></list-selector>
        </div>
    </div>
</template>
<script>
import { i18n } from '@common/utility';
import { ErrorTypeDef, EventLevelDef } from '@common/definition';
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

        activeEvent: {
            type: Array,
            required: false,
            default: () => [],
        },
        activeLevel: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        newEventList() {
            const events = [
                {
                    label: 'Metrics EVENT',
                    description: '',
                    value: -1,
                },
            ];

            for (const key in ErrorTypeDef) {
                events.push({
                    label: key,
                    description: '',
                    value: ErrorTypeDef[key],
                });
            }

            return events;
        },
        newLevelList() {
            const levels = [];

            for (const key in EventLevelDef) {
                levels.push({
                    label: key,
                    description: '',
                    value: EventLevelDef[key],
                });
            }

            return levels;
        },
        activeEventIndexes() {
            const activeIndexes = [];
            this.newEventList.map((item, index) => {
                if (this.activeEvent.includes(item.value))
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
        activeLevelIndexes() {
            const activeIndexes = [];
            this.newLevelList.map((item, index) => {
                if (this.activeLevel.includes(item.value))
                    activeIndexes.push(index);
            });
            return activeIndexes;
        },
    },
    data() {
        return {
            i18n: {
                event: i18n.get('ui.label.event'),
                level: i18n.get('ui.label.eventLevel'),
            },
        };
    },
    methods: {
        onChangeEvent(nodes) {
            this.$emit('change-event', nodes);
        },
        onChangeLevel(nodes) {
            this.$emit('change-level', nodes);
        },
    },
};
</script>
<style lang="scss" scoped>
.event-config {
    > .item {
        display: inline-block;
        height: 235px;

        &.events {
            width: 300px;
        }
        &.levels {
            width: 200px;
        }
    }
}
</style>
