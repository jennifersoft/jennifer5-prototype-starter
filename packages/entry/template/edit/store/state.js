export const state = {
    // 문서 고유 식별 키
    key: '',
    // 이름이 마음에 들지 않지만 에디터에 추가되는 마크업 코드
    data: '',
    // 차트/테이블 설정 데이터
    charts: [],

    // 차트 기본 스타일 (서버에서 분기되서 저장됨)
    chartStyles: {
        line: {},
        bar: {},
        pie: {},
    },

    lang: 'ko',
    // @Deprecated 이제 사용하지 않음
    label: '#7bbae7',

    title: '',
    buildDay: '1',
    buildTime: '0,0,24',

    domains: [],
    domainGroupIndex: '',
    domainGroupTitle: '',
};
