import $ from '@library/jquery';

const STYLES = {
    TABLE:
        'position: relative; table-layout: fixed;border-spacing: 0; margin: 0; border: 0; width: 100%; font-size: 12px; border-bottom: 1px solid rgb(223,220,227);',
    TH:
        'font-weight: 700; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 6px; color: rgb(0,0,0); background: rgb(245,245,245); border-bottom: 1px solid rgb(222,222,222); border: 1px solid rgb(222,222,222); word-break: break-all;',
    TH_TOP: 'border-top: 1px solid rgb(222,222,222) !important;',
    TD:
        'padding: 4px 5px; height: 16px; border-bottom: 1px solid rgb(236,236,236); border: 1px solid rgb(236,236,236); word-break: break-all;',
};

function createHead(data) {
    return data
        .map((tr, i) => {
            const ths = tr
                .map(th => {
                    const style = STYLES.TH + (i == 0 ? STYLES.TH_TOP : '');
                    return `<th style="${style}" colspan="${th.colspan}" rowspan="${th.rowspan}" width="${th.width}">${th.text}</th>`;
                })
                .join('');
            return `<tr>${ths}</tr>`;
        })
        .join('\n');
}

function createBody(data) {
    return data
        .map(tr => {
            const tds = tr
                .map(td => {
                    const style = STYLES.TD;
                    return `<td style="${style}" colspan="${td.colspan}" rowspan="${td.rowspan}">${td.text}</td>`;
                })
                .join('');
            return `<tr>${tds}</tr>`;
        })
        .join('\n');
}

function createTable(metadata) {
    return `<table xmlns='http://www.w3.org/1999/xhtml' style="${
        STYLES.TABLE
    }"><thead>${createHead(metadata.head)}</thead><tbody>${createBody(
        metadata.body
    )}</tbody></table>`;
}

export default function(sample) {
    const metadata = JSON.parse(sample);

    return {
        toDataURI: function() {
            const markup = createTable(metadata);
            return (
                'data:image/svg+xml;base64,' +
                btoa(
                    unescape(
                        encodeURIComponent(
                            `<svg xmlns='http://www.w3.org/2000/svg'><foreignObject width='100%' height='255'>${markup}</foreignObject></svg>`
                        )
                    )
                )
            );
        },
        renderDataURI: function(root) {
            const markup = createTable(metadata);
            const $gridElem = $(markup);
            $(root).after($gridElem);
            $(root).remove();
        },
    };
}
