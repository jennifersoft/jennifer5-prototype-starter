import { i18n } from '@common/utility';

export const TEMPLATE_ROW = `<tr>
                    <td>
                        <! if(dir == "profiles") { !>
                        ${i18n.get('ui.label.profile')}
                        <! } else { !>
                        ${i18n.get('ui.label.mustget')}
                        <! } !>
                    </td>
                    <td><!= name !></td>
                    <td><!= timestamp !></td>
                    <td align="right"><!= Math.round(length / 1024).toLocaleForAries() !></td>
                </tr>`;
