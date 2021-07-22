import Dexie from 'dexie'

//아직은 전역으로 설정된 설정은 없음. 필요하다면 여기에 코드를 추가.

/**
 * DB별 선언, export을 이곳에서 한다.
 * index에 추가되는 컬럼이 있다면 버젼을 올려서 내용을 추가한다.
 * https://dexie.org/docs/Tutorial/Design#database-versioning
 * 주의 : .stores()에 들어가는 key들은 index 항목들이다. 조회조건에 포함되지 않는다면
 *       .stores()에 포함시키지 않아야 한다.
 *
 * @type {Dexie}
 */

export const userdefinedDashboardDB = new Dexie('UserdefinedDashboard')
userdefinedDashboardDB.version(1).stores({
    thumbnails: '++id,dashboardKey,theme',
})
