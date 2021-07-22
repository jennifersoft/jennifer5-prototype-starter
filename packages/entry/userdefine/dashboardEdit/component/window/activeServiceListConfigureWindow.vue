<template>
    <window
        :open-w="310"
        :open-h="style.height"
        :open-x="style.left"
        :open-y="style.top"
        :messages="messages"
        class="active-service-list-configure-window"
        @cancel="$emit('cancel')"
        @apply="apply"
    >
        <template v-slot:subject>
            {{ i18n.title }}
        </template>
        <div class="conditionList">
            <option-group
                :options="columnList"
                :active="checkedShowValue"
                type="checkbox"
                @change="onCheckedShowValue"
            />
        </div>
    </window>
</template>
<script>
import Window from '@vuejs/component/window/Window';
import OptionGroup from '@vuejs/component/Toggle/OptionGroup';
import { i18n } from '@common/utility';
import { mapMutations, mapState } from 'vuex';
import messages from '@vuejs/component/messages';

export default {
    name: 'activeServiceListConfigureWindow',
    components: { Window, OptionGroup },
    inject: {
        platform: {
            type: String,
            default: 'java',
        },
    },
    data() {
        return {
            messages,
            i18n: {
                title: i18n.get('ui.label.manageTableColumns'),
            },
            style: {
                left: 0,
                top: 0,
                height: '416px',
            },

            activeServiceColumns: [
                { label: i18n.get('ui.label.domain'), value: 'domainName' },
                { label: i18n.get('ui.label.instance'), value: 'sysId' },
                { label: i18n.get('ui.label.business'), value: 'bizId' },
                { label: i18n.get('ui.label.clientIp'), value: 'ipaddr' },
                { label: i18n.get('ui.label.startTime'), value: 'startTime' },
                {
                    label:
                        i18n.get('ui.label.cpu') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'cpuTime',
                },
                {
                    label:
                        i18n.get('ui.label.performTime') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'elapsedTime',
                },
                { label: i18n.get('ui.label.sqlCount'), value: 'sqlCount' },
                { label: i18n.get('ui.label.fetchCount'), value: 'fetchCount' },
                {
                    label: i18n.get('ui.label.status.performTime'),
                    value: 'statusName',
                },
                {
                    label: i18n.get('ui.label.application'),
                    value: 'serviceHashText',
                },
                {
                    label: i18n.get('ui.label.applicationAlias'),
                    value: 'alias',
                },
            ],

            activeSqlColumns: [
                { label: i18n.get('ui.label.domain'), value: 'domainName' },
                { label: i18n.get('ui.label.instance'), value: 'sysId' },
                { label: i18n.get('ui.label.business'), value: 'bizId' },
                {
                    label:
                        this.platform === 'net'
                            ? i18n.get('ui.label.connectionString')
                            : i18n.get('ui.label.jndiAndDBName'),
                    value: 'jndiAndDb',
                },
                {
                    label:
                        i18n.get('ui.label.sql') +
                        i18n.get('ui.label.performTime') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'runningTime',
                },
                {
                    label:
                        i18n.get('ui.label.performTime') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'elapsedTime',
                },
                { label: i18n.get('ui.label.sql'), value: 'runningFullText' },
                {
                    label: i18n.get('ui.label.application'),
                    value: 'serviceHashText',
                },
                {
                    label: i18n.get('ui.label.applicationAlias'),
                    value: 'alias',
                },
            ],

            activeExcallColumns: [
                { label: i18n.get('ui.label.domain'), value: 'domainName' },
                { label: i18n.get('ui.label.instance'), value: 'sysId' },
                { label: i18n.get('ui.label.business'), value: 'bizId' },
                {
                    label:
                        i18n.get('ui.label.txCall') +
                        i18n.get('ui.label.performTime') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'runningTime',
                },
                {
                    label:
                        i18n.get('ui.label.performTime') +
                        '(' +
                        i18n.get('ui.label.unit.ms') +
                        ')',
                    value: 'elapsedTime',
                },
                {
                    label: i18n.get('ui.label.txCall'),
                    value: 'runningFullText',
                },
                {
                    label: i18n.get('ui.label.application'),
                    value: 'serviceHashText',
                },
                {
                    label: i18n.get('ui.label.applicationAlias'),
                    value: 'alias',
                },
            ],

            checkedShowValue: [],
        };
    },
    methods: {
        ...mapMutations('userdefine', [
            'setColumnsOnEditingChart',
            'setComponent',
            'emitShowWindowWhenActiveServiceListChartEdit',
        ]),
        onCheckedShowValue(actives) {
            this.checkedShowValue = actives;
        },

        apply() {
            //기존 선언된 순서와 정렬을 맞추기 위해 바로 넣지 않고 forEach를 수행한다.
            const columns = [];
            this.columnList.forEach(column => {
                if (this.checkedShowValue.includes(column.value))
                    columns.push(column.value);
            });
            // const columns = this.checkedShowValue.join(',');
            this.setColumnsOnEditingChart(columns.join(','));

            if (this.editingComponentDataKey)
                this.setComponent(
                    Object.assign({ ...this.editingChartOptions })
                );

            this.$emit('apply');
        },
    },
    computed: {
        ...mapState('userdefine', [
            'editingChartOptions',
            'componentsAreaSize',
            'editingComponentDataKey',
        ]),

        columnList() {
            if (
                this.editingChartOptions.perspective === 'active_service_list'
            ) {
                return this.activeServiceColumns;
            } else if (
                this.editingChartOptions.perspective === 'active_sql_list'
            ) {
                return this.activeSqlColumns;
            } else if (
                this.editingChartOptions.perspective === 'active_excall_list'
            ) {
                return this.activeExcallColumns;
            }
            console.error(
                'can not get columnList in activeServerConfigureWindow'
            );
        },
    },
    mounted() {
        if (this.editingChartOptions.charttype === 'list.activeservice') {
            this.checkedShowValue = this.editingChartOptions.columns.split(',');
        }

        const { width, height } = this.componentsAreaSize;

        this.style = {
            left: width * this.editingChartOptions.endx * 0.01 + 70 + 'px',
            top: height * this.editingChartOptions.starty * 0.01 + 145 + 'px',
            height:
                this.editingChartOptions.perspective === 'active_service_list'
                    ? '516px'
                    : '416px',
        };
    },
    watch: {
        editingComponentDataKey() {
            this.emitShowWindowWhenActiveServiceListChartEdit(false);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '../themes.scss';
.active-service-list-configure-window {
    .body {
        .chapter {
            height: 32px;
            line-height: 32px;
            @include themify($themes) {
                border-bottom: 1px solid
                    themed('window-content-border-bottom-color');
            }
        }
        .conditionList {
            display: flex;
            flex-direction: column;

            > .condition {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 32px;
                line-height: 32px;
                @include themify($themes) {
                    border-bottom: 1px solid
                        themed('window-content-border-bottom-color');
                }

                input[type='checkbox'] {
                    height: 16px;
                    width: 16px;
                }

                input + span {
                    margin-left: 8px;
                }

                span + input {
                    margin-left: 8px;
                }
            }
        }
    }
}
</style>
