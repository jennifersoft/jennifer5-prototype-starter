import { i18n } from '@common/utility';

export const TEMPLATE_ROW = `
<tr>
    <td align="right"><!= row.seq.toLocaleForAries() !></td>
    <td><!= timestamp !></td>
    <td align="right"><!= size.toLocaleForAries() !></td>
    <td align="right"><!= dsize.toLocaleForAries() !></td>
    <td><!= nameWithType.split('<').join('&lt;') !></td>
    <td><!= hash !></td>
    <td><!= (!application) ? "Unknown" : application !></td>
    <td id="but_<!= row.index !>" align="center">
    <! if(!!stack && !!!newstack) { !>
        <span class="show-stack round-btn">${i18n.get('ui.label.show')}</span>
    <! } else if(!!newstack) { !>
        <span class="wait-stack round-btn">${i18n.get('ui.label.wait')}</span>
    <! } else { !>
        <span class="receive-stack round-btn">${i18n.get(
            'ui.label.receiveStack'
        )}</span>
    <! } !>
    </td>
</tr>`;
