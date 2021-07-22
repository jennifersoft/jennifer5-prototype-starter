<template>
    <div id="diff-main">
        <tab :tabs="tabs" :active-tab="activeTab" @change="onChangeTab"></tab>

        <div class="viewType" v-if="activeTab !== 'origin'">
            <div class="label-group">
                <span class="ckbox">
                    <checkbox
                        :label="i18n.viewChangeLineOnly"
                        v-model="changedLineOnly"
                    />
                </span>
                <span><i class="delete"></i> {{ i18n.delete }}</span>
                <span><i class="add"></i> {{ i18n.add }}</span>
            </div>
        </div>

        <template v-if="activeTab === 'origin'">
            <pre v-if="useEscaping">{{ prettyText }}</pre>
            <pre v-html="prettyText" v-else></pre>
        </template>
        <div v-html="outputHtml" v-else></div>
    </div>
</template>

<script>
import $ from '@library/jquery';
import Tab from '@vuejs/component/tab/Tab';
import Checkbox from '@vuejs/component/Toggle/Checkbox';
import { difflib } from './lib/difflib';
import { diffview } from './lib/diffview';

export default {
    components: {
        Tab,
        Checkbox,
    },
    inject: {
        i18n: {
            default: {
                sideDiff: 'Side Diff',
                inlineDiff: 'Inline Diff',
                code: 'Code',
                baseText: 'Base Text',
                newText: 'New Text',
                add: 'Add',
                delete: 'Delete',
                viewChangeLineOnly: 'Changed Line Only',
            },
        },
    },
    props: {
        baseText: {
            type: String,
            required: false,
            default: '',
        },
        newText: {
            type: String,
            required: false,
            default: '',
        },
        prettyText: {
            type: String,
            required: false,
            default: '',
        },
        useEscaping: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    watch: {
        changedLineOnly(isHide) {
            if (isHide) {
                $('table.diff')
                    .find('.equal')
                    .hide();
            } else {
                $('table.diff')
                    .find('.equal')
                    .show();
            }
        },
    },
    data() {
        return {
            diffType: 0,
            changedLineOnly: false,
            tabs: [
                {
                    key: 'origin',
                    value: this.i18n.code,
                    disabled: this.prettyText === '',
                },
                {
                    key: 'sideDiff',
                    value: this.i18n.sideDiff,
                },
                {
                    key: 'inlineDiff',
                    value: this.i18n.inlineDiff,
                },
            ],
            activeTab: this.prettyText === '' ? 'sideDiff' : 'origin',
            outputHtml: '',
        };
    },
    methods: {
        onChangeTab(tab) {
            if (tab !== 'origin') {
                this.changedLineOnly = false;
                this.diffType = tab === 'sideDiff' ? 0 : 1;
                this.diffUsingJS();
            }

            this.activeTab = tab;
        },
        diffUsingJS() {
            let base = difflib.stringAsLines(this.baseText),
                newtxt = difflib.stringAsLines(this.newText),
                sm = new difflib.SequenceMatcher(base, newtxt),
                opcodes = sm.get_opcodes();

            this.outputHtml = diffview.buildView({
                baseTextLines: base,
                newTextLines: newtxt,
                opcodes: opcodes,
                contextSize: null,
                viewType: this.diffType,
            }).outerHTML;
        },
    },
    mounted() {
        this.diffUsingJS();
    },
};
</script>

<style lang="scss">
#diff-main {
    font-size: 12px;

    .textInput {
        display: block;
        width: 49%;
        float: left;
    }

    pre {
        overflow-x: hidden;
        white-space: pre-wrap;
    }

    textarea {
        width: 100%;
        height: 300px;
    }
    .spacer {
        margin-left: 10px;
    }

    .viewType {
        position: relative;
        margin-bottom: 15px;

        > .label-group {
            position: absolute;
            bottom: 8px;
            right: 0px;
            font-size: 12px;

            > span.ckbox {
                margin-right: 15px;
            }

            > span {
                > i {
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-bottom: -1px;
                }

                padding: 3px 2px;
                text-align: center;
            }
        }
    }

    /deep/ .tab {
        margin-top: 0px;
    }

    table.diff {
        table-layout: fixed;
        border-collapse: collapse;
        white-space: pre-wrap;
        width: 100%;
        border-radius: 5px;

        thead {
            th {
                padding: 0;
            }
        }

        tbody {
            tr {
                &:first-child {
                    > th,
                    > td {
                        border-top-width: 1px;
                        border-top-style: solid;
                    }
                }

                &:last-child {
                    > th,
                    > td {
                        border-bottom-width: 1px;
                        border-bottom-style: solid;
                    }
                }
            }

            th {
                padding: 3px 5px;
                text-align: right;
                vertical-align: top;
                border-left-width: 1px;
                border-left-style: solid;
                border-right-width: 1px;
                border-right-style: solid;
            }

            td {
                padding: 3px 15px;
                vertical-align: top;
                word-break: break-all;

                &:last-child {
                    border-right-width: 1px;
                    border-right-style: solid;
                }
            }
        }
    }

    table.diff:not(.inlinediff) {
        thead {
            th:nth-child(odd) {
                width: 42px;
            }
        }
    }

    table.inlinediff {
        thead {
            th:nth-child(1),
            th:nth-child(2) {
                width: 42px;
            }
        }
    }
}

body.classic {
    $codeDiffLabelFontColor: #616161;
    $codeDiffLabelDeleteBackgroundColor: #ffe0de;
    $codeDiffLabelInsertBackgroundColor: #e3f9eb;

    $codeDiffTableBorderColor: #e2e2e2;
    $codeDiffThBackgroundColor: #fafafa;
    $codeDiffThEqualFontColor: rgba(51, 51, 51, 0.4);
    $codeDiffTdEqualFontColor: rgb(51, 51, 51);

    $codeDiffThDeleteBackgroundColor: #ffb4af;
    $codeDiffTdDeleteBackgroundColor: #ffe0de;
    $codeDiffDeleteBorderColor: #f49892;

    $codeDiffThInsertBackgroundColor: #bfefd5;
    $codeDiffTdInsertBackgroundColor: #e3f9eb;
    $codeDiffInsertBorderColor: #98e0b9;

    $codeDiffThEmptyBackgroundColor: #eaeaea;
    $codeDiffTdEmptyBackgroundColor: #f5f5f5;
    $codeDiffEmptyBorderColor: #dbdbdb;

    @import 'theme.scss';
}

body.dark {
    $codeDiffLabelFontColor: #999;
    $codeDiffLabelDeleteBackgroundColor: #432327;
    $codeDiffLabelInsertBackgroundColor: #1c3930;

    $codeDiffTableBorderColor: #383838;
    $codeDiffThBackgroundColor: #262626;
    $codeDiffThEqualFontColor: rgba(213, 213, 213, 0.4);
    $codeDiffTdEqualFontColor: rgb(213, 213, 213);

    $codeDiffThDeleteBackgroundColor: #e74c3c;
    $codeDiffTdDeleteBackgroundColor: #432327;
    $codeDiffDeleteBorderColor: #ff7d6f;

    $codeDiffThInsertBackgroundColor: #10a579;
    $codeDiffTdInsertBackgroundColor: #1c3930;
    $codeDiffInsertBorderColor: #20c091;

    $codeDiffThEmptyBackgroundColor: #393939;
    $codeDiffTdEmptyBackgroundColor: #272727;
    $codeDiffEmptyBorderColor: #505050;

    @import 'theme.scss';
}
</style>
