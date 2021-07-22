<template>
    <div class="table-panel">
        <div class="toolbar">
            <table-tool-bar
                :key="filterSequence"
                @change-filter="onFilterResourceTable"
            ></table-tool-bar>
        </div>

        <resource-table
            :rows="resourceData"
            :height="mainHeight"
            :filters="filterKeywords"
            @show-contents="onShowResourceContents"
        ></resource-table>

        <form ref="form">
            <input type="hidden" name="useEscaping" :value="useEscaping" />
            <input type="hidden" name="baseText" :value="beforeContents" />
            <input type="hidden" name="newText" :value="contents" />
            <textarea name="prettyText" v-html="prettyContents"></textarea>
        </form>
    </div>
</template>

<script>
import TableToolBar from '../component/TableToolBar';
import ResourceTable from '../component/ResourceTable';
import { mapState, mapActions } from '../vuex';

export default {
    components: {
        TableToolBar,
        ResourceTable,
    },
    inject: ['i18n'],
    computed: {
        ...mapState({
            contents: state => state.contents,
            beforeContents: state => state.beforeContents,
            prettyContents: state => state.prettyContents,
            useEscaping: state => state.useEscaping,
            resourceData: state => state.resourceData,
            mainHeight: state => state.mainHeight,
        }),
    },
    data() {
        return {
            filterSequence: 1,
            filterKeywords: {
                type: '',
                name: '',
            },
        };
    },
    watch: {
        resourceData() {
            this.filterSequence += 1;
            this.filterKeywords = {
                type: '',
                name: '',
            };
        },
    },
    methods: {
        ...mapActions(['loadResourceContents']),
        onFilterResourceTable({ type, name }) {
            this.filterKeywords = {
                type,
                name,
            };
        },
        async onShowResourceContents(data) {
            await this.loadResourceContents({
                lastModified: data.lastModified,
                resourceName: data.resourceName,
                contents: data.contents,
                resourceType: data.resourceType,
            });

            this.openCodeDiffPopup();
        },
        openCodeDiffPopup() {
            const _frm = this.$refs['form'];
            const popup = window.open(
                '',
                'compareSourceCode',
                "width=1024,height=768,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            );

            if (popup) {
                popup.focus();
                _frm.method = 'post';
                _frm.action = '/popup/codeDiff';
                _frm.target = 'compareSourceCode';
                _frm.submit();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';

.table-panel {
    @include themify($themes) {
        ::v-deep tr {
            span.popup-btn {
                cursor: pointer;
                border-radius: 2px;
                padding: 3px 8px;
                font-size: 12px;
                font-weight: 500;
                border: 1px solid themed('table-panel-button-border-color');
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

    textarea[name='prettyText'] {
        display: none;
    }
}
</style>
