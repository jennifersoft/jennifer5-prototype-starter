import $ from '@library/jquery';
import { ariesuser } from '@common/base';
import 'summernote/dist/summernote-lite';
import 'summernote/lang/summernote-ko-KR';
import 'summernote/lang/summernote-ja-JP';
import 'summernote/lang/summernote-zh-CN';
import { tableButton } from './button/table';
import { chartButton } from './button/chart';

const LOCALES = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };

// 서머노트 메시지 변경하기
$.summernote.lang['ko-KR'].color.cpSelect = '색상 만들기';
$.summernote.lang['en-US'].color.cpSelect = 'Create color';
$.summernote.lang['ja-JP'].color.cpSelect = '色を作る';
$.summernote.lang['zh-CN'].color.cpSelect = '创造颜色';

export function createReportEditor() {
    return $('#summernote').summernote({
        lang: LOCALES[ariesuser.language],
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
        ],
        focus: true,
        disableResizeEditor: false,
    });
}

export function createTemplateEditor(markup, charts, callback) {
    const $editor = $('#summernote').summernote({
        lang: LOCALES[ariesuser.language],
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['jennifer', ['jenniferTable', 'jenniferChart']],
        ],
        focus: true,
        buttons: {
            jenniferTable: tableButton,
            jenniferChart: chartButton,
        },
        callbacks: {
            onKeydown: function(e) {
                if (typeof callback == 'function') callback(e);
            },
            onImageUpload: function(files) {
                for (let i = 0; i < files.length; i++) {
                    (function(img) {
                        const reader = new FileReader();
                        reader.readAsDataURL(img);

                        reader.onload = function() {
                            const $img = $('<img />');

                            $img.attr({
                                src: reader.result,
                                onmousedown: 'vue.onSelectDataImage()',
                            });

                            $editor.summernote('insertNode', $img[0]);
                        };
                    })(files[i]);
                }
            },
        },
        disableResizeEditor: true,
    });

    for (const key in charts) {
        // TODO: 레거시 템플릿에서 차트를 감싼 div 스타일이 문제. 차후에 제거할 것!!!
        markup = markup.replace('position: relative; user-select: none;', '');
        markup = markup.replace(`#${key}#`, createImageMarkup(charts[key]));
    }

    // 키로 저장된 차트/테이블를 이미지로 변환해서 에디터에 추가한다.
    $editor.summernote('code', markup);

    return $editor;
}

export function createImageMarkup(chart) {
    const $img = $('<img />');

    $img.attr({
        id: chart.uniqueId,
        class: 'chart-type',
        style: chart.style || '',
        src: getImagePath(chart.type, chart.sample),
        onmousedown: `vue.onSelectDataImage('${chart.uniqueId}')`,
    });

    return $img[0].outerHTML;
}

function getImagePath(type, sample) {
    if (sample && sample.length > 0) {
        return sample;
    } else {
        return '/image/template/' + type + 'chart_sample.png';
    }
}
