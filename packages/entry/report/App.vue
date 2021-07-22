<template>
    <div class="report-view">
        <div class="report-main">
            <div class="report-title">
                <span>{{ subject }}</span>
                <btn
                    normal
                    class="btn-print"
                    :items="buttons"
                    @click="onClickPrintBtn"
                />
            </div>
            <section class="report-editor" ref="editor">
                <slot name="markup" />
            </section>
        </div>

        <slot name="style-line" />
        <slot name="style-bar" />
        <slot name="style-pie" />
    </div>
</template>

<script>
import $ from '@library/jquery';
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import graph, { drawGrid } from '@entry/template/edit/graph/main';

export default {
    components: {
        Btn,
    },
    props: {
        subject: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            buttons: [{ iconType: ICON_TYPE.print }],
        };
    },
    methods: {
        onClickPrintBtn() {
            let $frame = this.createPrintIframe();
            $frame
                .contents()
                .find('body')
                .html($(this.$refs.editor).html());

            setTimeout(() => {
                $frame[0].contentWindow.focus();
                $frame[0].contentWindow.print();
                $frame.remove();
                $frame = null;
            }, 250);
        },
        createPrintIframe() {
            let $frame = $(
                '<iframe name="reportPrintFrame"' +
                    'width="0" height="0" frameborder="0" src="about:blank" style="visibility:hidden">' +
                    '</iframe>'
            );
            $frame.appendTo($('body'));

            let $head = $frame.contents().find('head');

            // Inherit styles from document
            $('style, link[rel=stylesheet]', document).each(function() {
                // Use dedicated styles
                // var css = document.createElement('link');
                // css.href = options.print.stylesheetUrl;
                // css.rel = 'stylesheet';
                // css.type = 'text/css';
                // $head.append(css);
                $head.append($(this).clone());
            });

            return $frame;
        },
        setJuiChartMetadata(type) {
            graph.define(`editor.jui.chart.metadata.json.${type}`, [], () =>
                JSON.parse(this.$slots[`style-${type}`][0].children[0].text)
            );
        },
    },
    mounted() {
        const builder = graph.include('editor.jui.chart.builder');

        this.setJuiChartMetadata('line');
        this.setJuiChartMetadata('bar');
        this.setJuiChartMetadata('pie');

        $(this.$refs.editor)
            .find('.jui-metadata')
            .each((i, el) => {
                (function(root) {
                    builder(root, { tag: 'code' }).renderDataURI(null);
                })(el);
            });

        $(this.$refs.editor)
            .find('.grid-metadata')
            .each((i, el) => {
                (function(root) {
                    drawGrid(
                        $(root)
                            .find('code')
                            .text()
                    ).renderDataURI(root);
                })(el);
            });
    },
};
</script>

<style lang="scss" scoped>
.report-view {
    width: 810px;
    height: 100%;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
    border: 1px solid #d1d1d1;
    float: none;
    margin: 14px auto;

    > textarea {
        display: none;
    }

    > .report-main {
        > .report-title {
            float: none !important;
            margin: 0 auto !important;
            color: #d5d5d5;
            border-radius: 5px 5px 0 0;
            height: 48px;
            background-color: #303030;
            background-image: linear-gradient(to bottom, #424242, #141414);
            background-repeat: repeat-x;

            > span {
                line-height: 48px;
                font-size: 16px;
                font-weight: bold;
                padding-left: 20px;
                color: #d5d5d5;
            }

            > .btn-print {
                margin-top: 6px;
                margin-right: 12px;
                float: right;
                cursor: pointer;
                background: #fff;
            }
        }

        > .report-editor {
            padding: 30px;
            box-sizing: border-box;
            background: #ffffff;
            border-radius: 0 0 5px 5px;
            width: 100%;
            margin: 0 auto;
            color: #333;
        }
    }
}
</style>
