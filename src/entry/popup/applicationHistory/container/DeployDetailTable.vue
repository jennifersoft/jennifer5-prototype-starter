<template>
    <div id="deployResourceTable" class="xtable scroll" ref="table">
        <table class="table simple headline stripeless hover">
            <thead>
                <tr>
                    <th>{{ i18n.lastModifiedTime }}</th>
                    <th>{{ i18n.resourceType }}</th>
                    <th>{{ i18n.resourceStatus }}</th>
                    <th width="35%">
                        {{ i18n.resourceName }}
                    </th>
                    <th>{{ i18n.compareCode }}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>

<script>
import jui from 'juijs';
import XTableComp from 'juijs-grid/src/components/xtable';
import { setSortEff } from "@common/utility";
import axios from '@library/axios';
import { mapState } from '@entry/popup/applicationHistory/vuex';
import {
    TEMPLATE_ROW_RESOURCE,
} from '@entry/popup/applicationHistory/templates';

jui.use(XTableComp);

export default {
    name: 'DeployDetailTable',
    inject: {
        i18n: {
            default: {
                M0471: 'M0471',
                lastModifiedTime: 'Last modified time',
                resourceType: 'Resource type',
                resourceStatus: 'Resource status',
                resourceName: 'Resource name',
            },
        },
    },
    props: {
        height: {
            type: Number,
            default: 435,
        },
        rows: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        height(next, prev) {
            if (next !== prev) {
                this.table.scrollHeight(next);
                this.table.resize();
            }
        },
        rows(next) {
            this.table.update(next);
        },
    },
    computed: {
        ...mapState({
            deployList: state => state.deployList,
            resourceList: state => state.resourceList,
            targetRow: state => state.targetRow,
        }),
    },
    methods: {
        popupCompareCode({  sid, lastModified, resourceName, contents }) {
            const { key, collectTime } = this.deployList[this.targetRow];
            axios
                .get('/deploydata/before/contents', {
                    params: {
                        sid,
                        lastModified,
                        resourceName,
                        key,
                        collectTime,
                    },
                })
                .then(({ data }) => {
                    if (!data) {
                        // alert(this.i18n.M0471);
                    } else {
                        const pop = window.open(
                            '/popup/codeDiff',
                            'compareSourceCode',
                            "width=1024,height=768,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
                        );

                        if (pop) pop.focus();

                        document.getElementById('baseText').value = data;
                        document.getElementById('newText').value = contents;

                        document.getElementById('pipe').submit();
                    }
                });
        },
    },
    mounted() {
        const self = this;
        this.table = jui.create('grid.xtable', this.$refs.table, {
            fields: [
                'lastModified',
                'resourceType',
                'resourceStatus',
                'resourceName',
                null,
            ],
            resize: true,
            scrollHeight: self.height,
            sort: [0, 3],
            sortLoading: true,
            buffer: 'scroll',
            bufferCount: 30,
            event: {
                click: (row, e) => {
                    if (e.target.className === 'code-diff-btn') {
                        this.popupCompareCode(row.data);
                    }
                },
                sort: function(column, e) {
                    setSortEff(column, e, true);
                },
            },
            tpl: {
                row: TEMPLATE_ROW_RESOURCE,
            },
        });
    },
};
</script>

<style lang="scss" scoped>
@import '~@common/scss/themes.scss';

$themes: (
    classic: (
        behaviors-hover-color: rgba(0, 0, 0, 0.05),
        behaviors-press-color: rgba(0, 0, 0, 0.16),
        table-panel-label-font-color: #212121,
        table-panel-label-default-background-color: #cce4f9,
        table-panel-label-new-background-color: #cce7e1,
        table-panel-label-modified-background-color: #d7d7d5,
        table-panel-label-removed-background-color: #fddfcc,
    ),
    dark: (
        behaviors-hover-color: rgba(255, 255, 255, 0.05),
        behaviors-press-color: rgba(255, 255, 255, 0.16),
        table-panel-label-font-color: #fff,
        table-panel-label-default-background-color: #4986E7,
        table-panel-label-new-background-color: #2DA2BB,
        table-panel-label-modified-background-color: #5E5E5E,
        table-panel-label-removed-background-color: #E57128,
    ),
);

.table {
    @include themify($themes) {
        ::v-deep tr {
            .code-diff-btn {
                padding: 0 8px;
                display: inline-block;
                cursor: pointer;
                border-radius: 3px;
                height: 18px;
                line-height: 18px;

                &:hover {
                    background-color: themed('behaviors-hover-color');
                }

                &:active {
                    background-color: themed('behaviors-press-color');
                }
            }

            span.resource-label {
                border-radius: 3px;
                padding: 0px 4px;
                color: themed('table-panel-label-font-color');

                &.default {
                    background-color: themed(
                                    'table-panel-label-default-background-color'
                    );
                }
                &.new {
                    background-color: themed(
                                    'table-panel-label-new-background-color'
                    );
                }
                &.modified {
                    background-color: themed(
                                    'table-panel-label-modified-background-color'
                    );
                }
                &.removed {
                    background-color: themed(
                                    'table-panel-label-removed-background-color'
                    );
                }
            }
        }
    }
}
</style>
