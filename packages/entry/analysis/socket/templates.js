import { i18n } from '@common/utility';

export const TEMPLATE_ROW_SOCKET_DETAIL = `
<tr>
    <td><!= (parseInt(row.index) + 1).toLocaleForAries() !></td>
    <td><!= timestamp !></td>
    <td><!= localport !></td>
    <td><!= host !></td>
    <td><!= port !></td>
    <td>
        <span class="<!= mode !> badge"><!= mode !></span>
    </td>
    <td><!= bytes.toLocaleForAries() !></td>
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
</tr>
`;

export const TEMPLATE_ROW_SOCKET = `
<tr style="cursor: pointer;">
    <td><!= row.seq.toLocaleForAries() !></td>
    <td><!= (isRemoteFilter) ? (isLocalFilter) ? localport : "-" : localport !></td>
    <td><!= host !></td>
    <td><!= (isLocalFilter) ? (isRemoteFilter) ? port : "-" : port !></td>
    <td class="badge-cell">
        <div><!= children.length.toLocaleForAries() !>(<!= socketCount !>)</div>
        <div class="badge-group">
            <! if(succeeded > 0) { !>
            <span class="badge done">${i18n.get(
                'ui.button.done'
            )}&nbsp;<!= succeeded.toLocaleForAries() !></span>
            <! } !>
            <! if(receiving > 0) { !>
            <span class="badge waiting">${i18n.get(
                'ui.label.wait'
            )}&nbsp;<!= receiving.toLocaleForAries() !></span>
            <! } !>
        </div>
    </td>
</tr>`;
