import Vue from 'vue';
import $ from '@library/jquery';
import { i18n, getByteLength } from '@common/utility';
import graph, { drawGrid } from '@entry/template/edit/graph/main';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import TableOfContents from '@entry/template/edit/component/TableOfContents';
import TopBar from './component/TopBar';
import { createReportEditor } from '@entry/template/edit/editor/main';
import '@layout/base.js';
import './index.scss';

new Vue({
    el: '#main',
    components: {
        TopBar,
        TableOfContents,
        AlertWindow,
        ConfirmWindow,
    },
    data: {
        editorCode: '',
        editorWidth: 810,
        editorHeight: 768,
        editorLeft: 16,
        editableTitle: false,
        contentsActivity: true,
        alertMessage: '',
        confirmMessage: '',
    },
    computed: {
        editorStyle() {
            return {
                width: `${this.editorWidth}px`,
                'margin-left': `${this.editorLeft}px`,
                opacity: 1,
            };
        },
    },
    methods: {
        onClickPrintPreview() {
            let $frame = this.createPrintIframe();
            $frame
                .contents()
                .find('body')
                .html(this.$editor.summernote('code'));

            setTimeout(() => {
                $frame[0].contentWindow.focus();
                $frame[0].contentWindow.print();
                $frame.remove();
                $frame = null;
            }, 250);
        },
        onClickSaveDocument(dirKey, docKey) {
            const data = this.$editor.summernote('code');
            const params = {
                title: this.$refs.title.innerText,
                data: data,
                key: docKey,
                directoryKey: dirKey,
            };

            if (params.title == '') {
                this.alertMessage = i18n.get('M0089');
                return;
            }

            if (getByteLength(params.title) > 40) {
                // 제목 바이트 체크
                this.alertMessage = i18n.get('M0508');
                return;
            }

            $.post('/report/document/save', params, () => {
                this.alertMessage = i18n.get('M0594');
            });
        },
        showDeleteDocumentConfirm() {
            this.confirmMessage = i18n.get('M0011');
        },
        applyDeleteDocumentConfirm(dirKey, docKey) {
            if (docKey === '') {
                location.href = '/report/document/list';
            } else {
                $.post('/report/document/delete', `keys=${docKey}`, function() {
                    location.href = `/report/document/list?directoryKey=${dirKey}`;
                });
            }
        },
        renderChartsInEditor() {
            const lineStyles = JSON.parse(this.$refs.lineJson.value);
            const barStyles = JSON.parse(this.$refs.barJson.value);
            const pieStyles = JSON.parse(this.$refs.pieJson.value);
            const builder = graph.include('editor.jui.chart.builder');

            $(this.$el)
                .find('.jui-metadata')
                .each((i, el) => {
                    (function(root) {
                        graph.define(
                            'editor.jui.chart.metadata.json.line',
                            [],
                            () => lineStyles
                        );
                        graph.define(
                            'editor.jui.chart.metadata.json.bar',
                            [],
                            () => barStyles
                        );
                        graph.define(
                            'editor.jui.chart.metadata.json.pie',
                            [],
                            () => pieStyles
                        );
                        builder(root, { tag: 'code' }).renderDataURI(null);
                    })(el);
                });
        },
        renderGridsInEditor() {
            $(this.$el)
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
        syncTableOfContents() {
            this.editorCode = this.$editor.summernote('code');
        },
        searchTableOfContents(args) {
            const $editor = this.$editor
                .next()
                .find('.note-editable')
                .scrollTop(0);

            $editor.find('h1, h2, h3, h4').each((i, elem) => {
                if (args.type == elem.tagName && args.text == elem.innerText) {
                    $editor.scrollTop($(elem).position().top);
                }
            });
        },
        showEditableReportTitle() {
            this.editableTitle = !this.editableTitle;
            this.selectElementContents(this.$refs.title, this.editableTitle);
        },
        editingReportTitle(e) {
            if (e.code == 'Enter') {
                this.editableTitle = false;
                this.selectElementContents(
                    this.$refs.title,
                    this.editableTitle
                );
                return false;
            }
        },
        selectElementContents(el, isEdit) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel.removeAllRanges();
            if (isEdit) sel.addRange(range);
        },
        createPrintIframe() {
            let $frame = $(
                '<iframe name="summernotePrintFrame"' +
                    'width="0" height="0" frameborder="0" src="about:blank" style="visibility:hidden">' +
                    '</iframe>'
            );
            $frame.appendTo(this.$editor.parent());

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
        resizeScreenSize() {
            this.resizeEditorLeft();
            this.editorHeight = window.innerHeight - 136;
            this.$editor
                .next()
                .find('.note-editable')
                .height(this.editorHeight - 80);
        },
        resizeEditorLeft() {
            const distLeft = this.contentsActivity ? 165 : 0;
            this.editorLeft =
                window.innerWidth / 2 - this.editorWidth / 2 - distLeft;
        },
        toggleTableOfContents() {
            this.contentsActivity = !this.contentsActivity;
            this.resizeEditorLeft();
        },
    },
    mounted() {
        this.$editor = createReportEditor();
        this.$editor.summernote('code', this.$refs.markup.value);

        this.renderChartsInEditor();
        this.renderGridsInEditor();
        this.syncTableOfContents();
        this.resizeScreenSize();

        // 브라우저 윈도우 리사이징시 처리
        $(window).on('resize', () => {
            this.resizeScreenSize();
        });
    },
});
