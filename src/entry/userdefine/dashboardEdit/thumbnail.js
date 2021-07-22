import html2canvas from 'html2canvas'
import { ThemeHandler } from '@module/chart/config/ThemeHandler'
import { userdefinedDashboardDB } from '@library/dexie'
import { ariesuser } from '@common/base'

/**
 * thumbnail 저장, 읽기 를 위해 indexedDB(with Dexie)를 사용함.
 * @param element
 * @param paramKey
 * @returns {Promise<void>}
 */
export const saveThumbnail = async (element, paramKey) => {
    try {
        const thumbnailWidth = 193
        const scale = thumbnailWidth / element.offsetWidth
        const canvas = await html2canvas(element, {
            scale: scale,
            backgroundColor: ThemeHandler.getCanvasStyle()
                .export_background_color,
        })
        const dataURL = canvas.toDataURL('image/png')

        await userdefinedDashboardDB.thumbnails.put({
            dashboardKey: paramKey,
            theme: ariesuser.theme,
            dataURL: dataURL,
        })
    } catch (e) {
        console.error('can not save thumbnail', e)
    }
}

export const readAllThumbnail = async () => {
    const thumbnailsFromDB = await userdefinedDashboardDB.thumbnails
        .where('theme')
        .equals(ariesuser.theme)
        .toArray()

    return thumbnailsFromDB.reduce((resultThumbnails, thumbnail) => {
        resultThumbnails[thumbnail.dashboardKey] = thumbnail
        return resultThumbnails
    }, {})
}
export const readThumbnail = async paramKey => {
    const allThumbnail = readAllThumbnail()
    return allThumbnail?.paramKey
}
