<template>
    <div class="domain-list">
        <div
            class="group"
            v-for="item in domainListInGroup"
            v-if="item.domainList.length > 0"
        >
            <div class="subject" v-if="useDomainGroup">
                {{ item.isUnknown ? i18n.unknownGroup : item.fullName }}
            </div>
            <setting-table
                :columns="columns"
                :rows="item.domainList"
                @check="addCheckedDomainIds"
                @select="loadDetailDomain"
                selectable
            >
                <template #row="{ data, index }">
                    <td>{{ data.sid }}</td>
                    <td>{{ data.shortName }}</td>
                    <td>{{ data.longName }}</td>
                    <td>{{ data.ip }}</td>
                    <td>{{ data.port }}</td>
                    <td class="status">
                        <span class="active-icon" v-if="data.status"></span>
                    </td>
                </template>
            </setting-table>
        </div>
    </div>
</template>

<script>
import SettingTable from '../../base/component/SettingTable';
import { mapState, mapMutations, mapActions } from '../vuex';
import { createDomainListInGroup } from '../../base/utility';

export default {
    inject: ['i18n'],
    components: {
        SettingTable,
    },
    computed: {
        ...mapState({
            useDomainGroup: state => state.useDomainGroup,
            domainGroupTree: state => state.domainGroupTree,
            domainList: state => state.domainList,
        }),
        domainListInGroup() {
            return createDomainListInGroup(
                this.useDomainGroup,
                this.domainGroupTree,
                this.domainList
            );
        },
    },
    data() {
        return {
            columns: [
                {
                    field: 'sid',
                    label: this.i18n.domainId,
                    sortable: true,
                },
                {
                    field: 'shortName',
                    label: this.i18n.domainName,
                    sortable: true,
                },
                {
                    field: 'longName',
                    label: this.i18n.description,
                    sortable: true,
                },
                {
                    field: 'ip',
                    label: this.i18n.dataServerIP,
                    sortable: true,
                },
                {
                    field: 'port',
                    label: this.i18n.dataServerPort,
                    sortable: true,
                },
                {
                    field: 'status',
                    label: this.i18n.condition,
                    width: '100px',
                    class: 'status',
                },
            ],
        };
    },
    methods: {
        ...mapMutations(['addCheckedDomainIds']),
        ...mapActions(['loadDomainList', 'loadDetailDomain']),
    },
    async created() {
        await this.loadDomainList();
    },
};
</script>

<style lang="scss" scoped>
.domain-list {
    > .group {
        margin-bottom: 24px;
        > .subject {
            font-size: 14px;
            margin-bottom: 16px;
        }

        .active-icon {
            display: inline-block;
            background-image: url('../../base/asset/basic-check.png');
            width: 16px;
            height: 16px;
        }

        ::v-deep .setting-table {
            .status {
                text-align: center;
            }
        }
    }
}
</style>
