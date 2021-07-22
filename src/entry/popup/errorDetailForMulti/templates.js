import { i18n } from '@common/utility';

export const TEMPLATE_ROW = `<tr>
    <td><!= timestamp !> </td>
    <td><!= domainName !> </td>
    <td><!= name !> </td>
    <td><!= errorTypeName !> </td>
    <td>
        <! if(detailMessage) { !>
            <span class="link more">${i18n.get('ui.label.moreMessage')}</span>
        <! } !>
        <!= detail !>
        </td>
    <td align="right">
        <! if(value > -1) {!>
        <!= value.toLocaleForAries() !>
        <! } !>
    </td>
    <td align="center">
        <! if(relevantTxId != "0") { !>
        <span class="link transaction">${i18n.get('ui.label.show')}</span>
        <! } !>
    </td>
</tr>`;
