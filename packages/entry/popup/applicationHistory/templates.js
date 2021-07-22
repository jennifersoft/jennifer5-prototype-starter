import { i18n } from '@common/utility';

export const TEMPLATE_ROW_RESOURCE = `<tr style="cursor: pointer;">
    <td><!= timestamp !></td>
    <td><!= deployType !></td>
    <td align="center"><span class="resource-label <!= deployStatus.toLowerCase() !>"><!= deployStatus !></span></td>
    <td title="<!= resourceName !>"><!= resourceName !></td>
    <td align="center"><! if (checkReadResourceContents) { !><span class="code-diff-btn">${i18n.get(
        'ui.label.viewPopup'
    )}</span><! } !></td>
</tr>`;
export const TEMPLATE_EXPAND_RESOURCE = `<div style="padding: 10px;">
    <! if(showCodeDiffBtn) { !>
        <div class="row" style="text-align: right;">
            <span class="code-diff-btn">
                ${i18n.get('ui.label.compareCode')}
            </span>
        </div>
    <! } !>
    <pre id="code" style="overflow: hidden;"><!= contents !></pre>
</div>`;

export const TEMPLATE_ROW_DEPLOY = `
<tr style="cursor: pointer;">
    <td><!= timestamp !></td>
    <td><!= instanceName !></td>
    <td title="<!= fileName !>"><!= fileName !></td>
    <td align="right"><!= fileSize.toLocaleForAries() !></td>
</tr>`;
export const COLUMNS_DEPLOY = [
    {
        name: i18n.get('ui.label.changeTime'),
        key: 'collectTime',
        sort: true,
    },
    {
        name: i18n.get('ui.label.target'),
        key: 'instanceName',
        sort: true,
    },
    {
        name: i18n.get('ui.label.deployFile'),
        key: 'fileName',
        width: 400,
        sort: true,
    },
    {
        name: i18n.get('ui.label.size'),
        key: 'fileSize',
        sort: true,
    },
];
