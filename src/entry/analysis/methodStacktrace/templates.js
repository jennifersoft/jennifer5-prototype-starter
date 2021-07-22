import { i18n } from '@common/utility';

export const TEMPLATE_ROW = `
<tr>
    <td><input class="inline-checkbox" type="checkbox" name="ck_rows" value="<!= key !>"/></td>
    <td align="right"><!= key.toLocaleForAries() !></td>
    <td><!= timestamp !></td>
    <td><!= name !></td>
    <td><!= classLoader !></td>
    <td id="but_<!= row.index !>" align="center">
    <! if(stack != "" && newStack == "0") { !>
        <div class="show-stack round-btn">${i18n.get('ui.label.show')}</div>
    <! } else if(stack == "" && newStack == "1") { !>
        <div class="wait-stack round-btn">${i18n.get('ui.label.wait')}</div>
    <! } else { !>
        <div class="receive-stack round-btn">${i18n.get(
            'ui.label.receiveStack'
        )}</div>
    <! } !>
    </td>
    <input id="stack_<!= row.index !>" type="hidden" value="<!= stack !>" />
</tr>`;
