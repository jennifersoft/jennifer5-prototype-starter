import { i18n } from '@common/utility';

export const TEMPLATE_ROW = `
<! if(eventLevelName == "FATAL") { !>
    <tr style="font-weight: bold;">
        <td><i class="status-badge fatal"></i>
<! } else if(eventLevelName == "WARNING") { !>
    <tr >
        <td><i class="status-badge warning"></i>
<! } else { !>
    <tr>
        <td><i class="status-badge normal"></i>
<! } !>
        <!= eventLevelName !></td>
        <td><!=timestamp !></td>
        <td><!=name !> </td>
        <td><!=errorTypeName !><! if(mxidName != "") { !>(<!= mxidNameMsg !>)<! } !></td>
        <td>
            <! if(detailMessage) { !>
                <span class="link more">${i18n.get(
                    'ui.label.moreMessage'
                )}</span>
            <! } !>
            <! if(typeof(customMessage) == "string") { !>
                <!= customMessage !>
            <! } !>
            <!= messageFormatted !>
        </td>
        <td align="right"><! if(value != -1) { !><!= value.toLocaleForAries() !><! } !></td>
        <td align="center">
            <! if(relevantTxId != "0") { !>
                <span class="link transaction">${i18n.get(
                    'ui.label.show'
                )}</span>
            <! } !>
        </td>
    </tr>`;
