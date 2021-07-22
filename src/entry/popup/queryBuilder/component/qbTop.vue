<template>
    <div class="top">
        <monaco-editor
            :language="'sql'"
            :theme="editorTheme"
            :width="width"
            :height="height"
            :code="code"
            @change="newCode => $emit('change', newCode)"
            @ready="() => $emit('ready')"
        ></monaco-editor>

        <div
            v-if="activeSchema"
            class="schema"
            :style="{ width: schemaWidth + 'px', height: height + 5 + 'px' }"
        >
            <div
                class="items"
                :style="{ 'max-height': tabSchemaHeight + 'px' }"
            >
                <div class="item" v-for="schema in tabSchemaItems">
                    <div class="table">
                        <i
                            @click.stop="onToggleSchemaItem(schema.name)"
                            :class="[
                                !schemaItemFolds[schema.name]
                                    ? 'icon-right'
                                    : 'icon-left',
                            ]"
                        ></i>
                        <span @click.stop="onSelectQuerySchema(schema.name)">{{
                            schema.name
                        }}</span>
                    </div>
                    <div class="columns" v-if="!schemaItemFolds[schema.name]">
                        <div class="column" v-for="column in schema.columns">
                            {{ column.name }} <span>{{ column.type }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ariesuser } from '@common/base';

export default {
    components: {
        'monaco-editor': () =>
            import(
                /* webpackChunkName: "queryBuilder.editor" */ '@vuejs/component/MonacoEditor/MonacoEditor'
            ),
    },
    inject: {
        i18n: {
            default: {
                tables: 'TABLES',
                data: 'DATA',
                public: 'PUBLIC',
            },
        },
    },
    props: {
        activeSchema: {
            type: Boolean,
            required: true,
        },
        schemaItems: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
    },
    computed: {
        tabSchemaItems() {
            return this.schemaItems;
        },
        tabSchemaHeight() {
            return this.height - 4;
        },
    },
    data() {
        return {
            editorTheme: ariesuser.theme == 'classic' ? 'vs' : 'vs-dark',
            schemaWidth: 250,
            schemaItemFolds: {},
        };
    },
    methods: {
        onToggleSchemaItem(table) {
            this.$set(
                this.schemaItemFolds,
                table,
                !this.schemaItemFolds[table]
            );
        },
        onSelectQuerySchema(table) {
            this.$emit('add-tab', table, `SELECT * FROM ${table}`);
        },
    },
};
</script>

<style lang="scss" scoped>
.top {
    position: relative;

    > .schema {
        position: absolute;
        top: 0px;
        right: 0px;
        overflow: hidden;
        font-size: 11px;

        > .menus {
            line-height: 26px;
            > .menu {
                display: inline-block;
                height: 26px;
                padding: 0px 10px;
                &:not(.active) {
                    cursor: pointer;
                }
            }
        }

        > .items {
            overflow: auto;
            padding: 5px 10px;
            > .item {
                margin-bottom: 5px;
                > .table {
                    cursor: pointer;
                }
                > .columns {
                    margin-left: 30px;
                    > .column {
                        white-space: nowrap;
                        > span {
                            oapcity: 0.9;
                            font-size: 9px;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
