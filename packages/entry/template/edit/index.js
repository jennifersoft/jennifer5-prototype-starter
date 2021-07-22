import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import $ from '@library/jquery';
import { getDayjs, ariesuser } from '@common/base';
import { i18n, isJSONString, createUniqueId } from '@common/utility';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { loadResources } from '@service/oidConfig';
import { loadStandardMetrics } from '@service/metrics';
import { createTemplateEditor, createImageMarkup } from './editor/main';
import graph, { drawGrid } from './graph/main';
import { store, components } from './vue';
import { mutations as mutations_modal } from './store/mutations.modal';
import '@layout/base';
import './index.scss';

const domain = createNamespacedHelpers('domain');
const {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('template');

let isModified = false,
    prevId = null;

window.vue = new Vue({
    el: '#main',
    store,
    components,
    provide: {
        theme: ariesuser.theme,
        language: ariesuser.language,
    },
    computed: {
        ...domain.mapState({
            docDomainList: state => state.domainList,
        }),
        ...mapState({
            docState: state => state,
            docKey: state => state.key,
            docCode: state => state.data,
            docImages: state => state.charts,
            docDomains: state => state.domains,
            docDomainGroupTitle: state => state.domainGroupTitle,
            docDomainGroupIndex: state => state.domainGroupIndex,
            docBuildDay: state => state.buildDay,
            docBuildTime: state => state.buildTime,
            docChartStyles: state => state.chartStyles,
        }),
        ...mapGetters({
            docToJSONString: 'toJSONString',
        }),
        editorStyle() {
            return {
                position: 'relative',
                'background-color':
                    ariesuser.theme === 'classic' ? '#f9f9f9' : '#272727',
                width: `${this.editorWidth}px`,
                padding: `16px ${this.editorLeft}px`,
            };
        },
    },
    data: {
        editorWidth: 810,
        editorHeight: 768,
        editorLeft: 16,
        activeTableOfContents: true,
        selectDataImage: {},

        layerTarget: '', // 공백이면 비활성화
        buildLoading: false,
        saveLoading: false,
        directoryList: [],
        alertMessage: '',
        reportPageUrl: '', // 최근 저장된 보고서 링크

        // TODO: 서버에서 가져오는 데이터들 계속 추가될 가능성이 있음.
        resourceList: [],
        partitionList: [],
        metricsMap: {}, // 템플릿에서는 두 종류의 Metrics를 사용함
        sumMetricsMap: {},
    },
    methods: {
        ...domain.mapMutations({
            docSelectDomainWithoutCache: 'selectDomainWithoutCache',
        }),
        ...mapMutations({
            docLoadDocument: 'loadDocument',
            docLoadDefaultChartStyles: 'loadDefaultChartStyles',
            docUpdateEditorCode: 'updateEditorCode',
            docSaveDataImage: 'saveDataImage',
        }),
        ...mapActions({
            docSaveDocument: 'saveDocument',
        }),
        initializeSettings() {
            // TODO: 툴바 버튼 그룹 커스텀 버튼 추가 설정
            $(this.$el)
                .find('.note-btn')
                .on('click', e => {
                    if ($(e.currentTarget).find('.icon-table').length == 1) {
                        this.selectDataImage = {};
                        this.onShowLayer('TableChoice');
                    } else if (
                        $(e.currentTarget).find('.icon-chart').length == 1
                    ) {
                        this.selectDataImage = {};
                        this.onShowLayer('ChartChoice');
                    }
                })
                .hover(
                    e => {
                        if (
                            $(e.currentTarget).find('.icon-table').length == 1
                        ) {
                            this.createEditorTooltip(
                                i18n.get('ui.label.table'),
                                e.target
                            );
                        } else if (
                            $(e.currentTarget).find('.icon-chart').length == 1
                        ) {
                            this.createEditorTooltip(
                                i18n.get('ui.label.chart'),
                                e.target
                            );
                        }
                    },
                    e => {
                        $('.note-tooltip.custom').remove();
                    }
                );

            // TODO: 이미지 팝오버 커스텀 버튼 추가 설정
            $('.note-image-popover')
                .find('.note-remove')
                .append(
                    $('<button />')
                        .attr({
                            type: 'button',
                            class: 'note-btn',
                        })
                        .on('click', () => {
                            if (this.selectDataImage.hasOwnProperty('id')) {
                                this.onShowLayer(this.selectDataImage.id);
                            } else {
                                this.onAlertMessage(i18n.get('M0575'));
                            }
                        })
                        .hover(
                            e => {
                                this.createEditorTooltip(
                                    i18n.get('ui.label.lookupZone'),
                                    e.target
                                );
                            },
                            e => {
                                $('.note-tooltip.custom').remove();
                            }
                        )
                        .append("<i class='icon-edit'></i>")
                );

            // TODO: 이미지 추가 모달에서 링크로 추가하기 제거
            $(this.$el)
                .find('.note-group-image-url')
                .hide();

            // 브라우저 윈도우 리사이징시 처리
            $(window).on('resize', this.resizeScreenSize);

            // 변경사항 있을 경우, 경고창 띄우기
            $(window).on('beforeunload', function(e) {
                if (isModified) return false;
                return;
            });
        },
        createEditorTooltip(text, target) {
            const $tooltip = $('<div />');

            $tooltip
                .attr({
                    class: 'note-tooltip bottom in custom',
                })
                .html(
                    `<div class='note-tooltip-arrow'></div><div class='note-tooltip-content'>${text}</div>`
                );

            $('body').append($tooltip);

            $tooltip.css({
                left: `${$(target).offset().left -
                    $tooltip.width() / 2 +
                    18}px`,
                top: `${$(target)
                    .parent()
                    .offset().top +
                    $(target)
                        .parent()
                        .height()}px`,
            });
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
            const distLeft = this.activeTableOfContents ? 200 : 36;
            this.editorLeft =
                window.innerWidth / 2 - this.editorWidth / 2 - distLeft;
        },
        toggleTableOfContents() {
            this.activeTableOfContents = !this.activeTableOfContents;
            this.resizeEditorLeft();
        },

        syncTableOfContents() {
            this.docUpdateEditorCode(this.$editor.summernote('code'));
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
        toggleTemplateSetting() {
            let list = this.docDomainList.filter(
                node => node.treeIndex == this.docDomainGroupIndex
            );

            if (list.length == 0)
                list = this.docDomainList.filter(
                    node => node.label == this.docDomainGroupTitle
                );
            if (list.length > 0)
                this.docSelectDomainWithoutCache(list[0].treeIndex);

            this.onShowLayer('TemplateSetting');
        },
        changeClassName(uniqueId, className) {
            $('.chart-type').each((i, elem) => {
                if (elem.id == uniqueId) {
                    elem.className = className;
                }
            });
        },
        saveDataImage(output, sample, type) {
            const builder = graph.include('editor.jui.chart.builder');

            // TODO: 차트/테이블 이미지가 두개씩 생기는 버그가 있었는데, 수정했기 때문에 차후에 단일 엘리먼트 선택 로직으로 변경하자.
            $('.chart-type').each((i, elem) => {
                if (elem.id == output.uniqueId) {
                    elem.className = 'chart-type';

                    if (type == 'chart') {
                        // 차트 테마 툴로 수정한 데이터가 있을 경우
                        graph.redefine(
                            `editor.jui.chart.metadata.json.${output.type}`,
                            [],
                            () => {
                                if (typeof output.theme != 'undefined')
                                    return output.theme;
                                else return this.docChartStyles[output.type];
                            }
                        );

                        const $div = $('<div />')
                            .hide()
                            .append($('<textarea>' + sample + '</textarea>'));
                        $('body').append($div);

                        elem.src = builder($div[0]).toDataURI();
                        $div.remove();
                    } else if (type == 'table') {
                        elem.src = drawGrid(sample).toDataURI();
                    } else {
                        elem.src = sample;
                    }

                    output.sample = elem.src;
                    output.timestamp = getDayjs().valueOf();

                    this.selectDataImage = output; // 저장 후에 포커스 유지한 상태로 다시 수정시 변경사항이 반영되지 않는 버그 수정
                    this.docSaveDataImage(output);

                    isModified = true; // 차트/테이블 컴포넌트 변경시 상태값 갱신
                }
            });
        },
        registerStoreModule(id) {
            // 차트/테이블 수정이 아니라면 빈 객체거나 id만 가지고 있음
            if (Object.keys(this.selectDataImage).length < 3)
                this.selectDataImage = { id: id };

            store.unregisterModule('template/modal');
            store.registerModule('template/modal', {
                namespaced: true,
                preserveState: false,
                // template/charts에서 선택된 객체를 deep copy해서 모달창으로 넘긴다.
                // 모달창에서 적용 버튼을 눌러야만 template/charts에 갱신한다.
                state: JSON.parse(JSON.stringify(this.selectDataImage)),
                mutations: mutations_modal,
            });

            prevId = this.selectDataImage.id;
        },

        goToReportPage() {
            location.href = this.reportPageUrl;
        },

        onSelectDataImage(id) {
            // 에디터에서 이미지 선택시, 일반인지 차트/테이블인지 구분하기 위함
            this.selectDataImage = this.docImages.hasOwnProperty(id)
                ? this.docImages[id]
                : {};
        },

        onShowLayer(id) {
            this.registerStoreModule(id);

            setTimeout(() => {
                this.$editor.summernote('saveRange');
                this.layerTarget = id;
            }, 100);
        },
        onHideLayer() {
            this.$editor.summernote('restoreRange');
            this.layerTarget = '';
        },
        onSubmitLayer(output) {
            this.onHideLayer();

            if (!output.uniqueId) {
                output.uniqueId = createUniqueId();

                const $img = $('<img />').attr({
                    id: output.uniqueId,
                    class: 'chart-type loading',
                    onmousedown: `vue.onSelectDataImage('${output.uniqueId}')`,
                });

                this.$editor.summernote('insertNode', $img[0]);
            } else {
                this.changeClassName(output.uniqueId, 'chart-type loading');
            }

            $.ajax({
                url: '/template/document/makeSampleImage',
                type: 'POST',
                timeout: 10000,
                data: JSON.stringify({
                    template: this.docState,
                    location: location.protocol + '//' + location.host,
                    chart: output,
                }),
                contentType: 'application/json; charset=utf-8',
                success: sample => {
                    const isJson = isJSONString(sample);
                    let type = 'legacy';

                    if (isJson) {
                        const jsonData = JSON.parse(sample);
                        type = jsonData.hasOwnProperty('head')
                            ? 'table'
                            : 'chart';
                    }

                    this.saveDataImage(output, sample, type);
                },
                error: (xhr, status, err) => {
                    this.changeClassName(
                        output.uniqueId,
                        `chart-type ${
                            status == 'timeout' ? 'timeout' : 'error'
                        }`
                    );

                    this.selectDataImage = output; // 저장 후에 포커스 유지한 상태로 다시 수정시 변경사항이 반영되지 않는 버그 수정
                    this.docSaveDataImage(output);
                },
            });
        },

        onClickSaveTemplate() {
            const code = this.$editor.summernote('code');

            // 편집화면에서 나갈 때, 저장할 때는 경고없이 가능하게 처리
            $(window).off('beforeunload');

            this.saveLoading = true;
            this.docSaveDocument(code).then(jsonStr => {
                $.ajax({
                    url: '/template/document/save',
                    type: 'POST',
                    data: jsonStr,
                    contentType: 'application/json; charset=utf-8',
                    success: docKey => {
                        if (this.docKey !== docKey) {
                            setTimeout(() => {
                                location.href = `/report/template/edit?key=${docKey}`;
                            }, 1000);
                        }
                        this.saveLoading = false;
                    },
                    error: () => {
                        this.saveLoading = false;
                        // TODO: 에러 처리가 필요하면 여기에 구현할 것
                    },
                });
            });
        },
        onClickBuildTemplate() {
            if (this.buildLoading) {
                this.onAlertMessage(i18n.get('M0220'));
                return;
            }

            if (isModified) {
                isModified = false;
                this.onClickSaveTemplate();
            }

            this.onShowLayer('ManualBuild');
        },
        onClickTemplateListLink() {
            location.href = '/report/template/list';
        },

        onUpdateResourceList() {
            loadResources(
                this.docDomains,
                Date.now() - ClientUtilities.ONE_DAY,
                Date.now()
            ).then(res => {
                this.resourceList = res[0].concat(res[1]);
            });
        },
        onUpdateMetricsMap() {
            loadStandardMetrics().then(res => {
                this.metricsMap = {
                    domain: res[0],
                    instance: res[1],
                    business: res[2],
                };
            });

            loadStandardMetrics('sum').then(res => {
                this.sumMetricsMap = {
                    domain: res[0],
                    instance: res[1],
                    business: res[2],
                };
            });
        },
        onUpdatePartitionList(payload) {
            if (!payload) {
                this.partitionList = [];
            } else {
                $.ajax({
                    method: 'GET',
                    data: {
                        domainId: payload.domainId,
                        instanceId: payload.instanceId,
                        startTime: Date.now() - ClientUtilities.ONE_DAY,
                        endTime: Date.now(),
                    },
                    url: '/agentDisk/partitionList',
                    success: list => {
                        this.partitionList = list;
                    },
                });
            }
        },
        onUpdateDirectoryList() {
            $.ajax({
                method: 'GET',
                url: '/report/directory/list',
                success: res => {
                    this.directoryList = this.directoryList.concat(res);
                },
            });
        },
        onLoadTemplate(json) {
            let markup = json.data;

            for (const key in json.charts) {
                markup = markup.replace(
                    `#${key}#`,
                    createImageMarkup(json.charts[key])
                );
            }

            this.$editor.summernote('code', markup);
            this.docUpdateEditorCode(markup);
        },

        onBuildTemplate(data) {
            this.buildLoading = true;

            $.ajax({
                method: 'POST',
                url: '/template/build/start',
                data: data,
                success: res => {
                    const json = JSON.parse(res);
                    this.reportPageUrl = `/report/document/edit?key=${json.reportKey}`;
                    this.buildLoading = false;
                },
                error: () => (this.buildLoading = false),
            });
        },

        onAlertMessage(message) {
            this.alertMessage = message;
        },
    },
    mounted() {
        let jsonStr = this.$refs.document.value;
        let markup = this.$refs.markup.value;
        let docCode = '';
        let docImages = {};

        if (jsonStr !== '{}') {
            this.docLoadDocument({
                json: JSON.parse(jsonStr),
                markup: markup,
            });
            this.onUpdateResourceList();
            this.onUpdateMetricsMap();
            this.onUpdateDirectoryList();

            // 관련 데이터 로드 후외 캐싱하기
            docCode = this.docCode;
            docImages = this.docImages;
        } else {
            this.toggleTemplateSetting();
        }

        this.docLoadDefaultChartStyles({
            line: JSON.parse(this.$refs.lineJson.value),
            pie: JSON.parse(this.$refs.pieJson.value),
            bar: JSON.parse(this.$refs.barJson.value),
        });

        this.$editor = createTemplateEditor(docCode, docImages, () => {
            isModified = true;
        });

        this.resizeScreenSize();
        this.initializeSettings();
    },
});
