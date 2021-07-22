import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import dayjsPluginUTC from "dayjs-plugin-utc"

dayjs.extend(isoWeek)
dayjs.extend(dayjsPluginUTC)

export default dayjs;