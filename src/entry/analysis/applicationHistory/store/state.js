import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';

const now = getDayjs();

export default {
    domainId: -1,
    instanceData: [],
    checkedOids: [],

    // 월간 차트 조회시 사용함
    year: now.year(),
    month: now.month() + 1,
    // 월간 차트 액티브 날짜
    day: 1,

    // 배포 목록 조회시 사용함
    startTime: startOfDayjs(now, 'day').valueOf(),
    endTime: startOfDayjs(now, 'day')
        .add(1, 'day')
        .valueOf(),

    // 리소스 목록 조회시 사용함
    collectTime: -1,
    deployKey: '',

    // 상단 차트/테이블, 하단 테이블 데이터
    deployCount: [],
    deployData: [],
    resourceData: [],

    // 리소스 컨텐츠
    contents: '',
    prettyContents: '',
    beforeContents: '',
    useEscaping: false,

    mainHeight: 600,

    fetching: false,
};
