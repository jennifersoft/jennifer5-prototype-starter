const storeKey = 'template/modal';

export const BaseDataImage = {
    // template store 객체를 가져와서 바로 할당할까 했는데, 아무래도 하위 컴포넌트에서 상위 컴포넌트의 store 객체를 사용하는것이 좋은것 같지 않음.
    // 번거롭지만 edit.jsp에서 직접 바인딩하는게 좋을듯
    props: {
        domainGroupTitle: {
            type: String,
            required: false,
            default: '',
        },
        buildDay: {
            type: String,
            required: false,
            default: '1',
        },
        buildTime: {
            type: String,
            required: false,
            default: '0,0,24',
        },
    },
    data() {
        return {
            i18n: {},
            width: 800,
            height: 600,
        };
    },
    methods: {
        beforeCancel() {
            return true;
        },
        beforeSubmit() {
            return true;
        },
        onClickHomeBtn(id) {
            this.$emit('show-layer', id);
        },
        onClickCancelBtn() {
            if (this.beforeCancel()) {
                this.$emit('hide-layer');
            }
        },
        onClickSubmitBtn() {
            if (this.beforeSubmit()) {
                const output = this.$store.state[storeKey];

                // TODO: 공통 유효성 검사 로직은 여기에 추가한다.
                if (
                    ['table', 'line', 'bar', 'pie'].includes(output.type) ==
                    false
                ) {
                    console.error(
                        'Invalid DataImage type (Eg. table, line, bar, pie)'
                    );
                }

                this.$emit('submit-layer', output);
            }
        },
        isNew() {
            const output = this.$store.state[storeKey];
            return typeof output.type === 'undefined';
        },
        alert(message) {
            this.$emit('alert', message);
        },
    },
};

export const BaseChart = {
    mixins: [BaseDataImage],
    methods: {
        onClickOpenTheme() {
            const template = this.$store.state['template'];
            const output = this.$store.state[storeKey];
            const chartType = this.getChartType(output);
            const popup = window.open(
                '/popup/themeTool',
                'themeTool',
                'width=1280,height=800'
            );

            const form = document.getElementById('chartStyleForm');
            form.method = 'POST';
            form.action = '/popup/themeTool';
            form.target = 'themeTool';
            form.codeType.value = chartType;

            // 차트 테마 설정 데이터가 있으면 교체해주기 (없으면 최초 로드시 설정된 스타일 데이터)
            form[`${chartType}Json`].value = JSON.stringify(
                typeof output.theme != 'undefined'
                    ? output.theme
                    : template.chartStyles[chartType]
            );
            form.submit();

            // 차트 테마 팝업에서 저장 버튼을 클릭했을 때!
            popup.window.addEventListener('message', e => {
                if (e.data.type == 'themeTool') {
                    this.$store.commit(`${storeKey}/setDataImage`, {
                        theme: e.data.themes[e.data.brush],
                    });
                }
            });
        },
        getChartType(output) {
            if (typeof output.type !== 'undefined') return output.type;
            else {
                if (output.id.startsWith('Line')) return 'line';
                else if (output.id.startsWith('Bar')) return 'bar';
                else if (output.id.startsWith('Pie')) return 'pie';
            }
        },
    },
    computed: {
        backMenu() {
            if (this.isNew()) return 'ChartChoice';
            return '';
        },
    },
    created() {
        if (this.isNew()) {
            this.$store.commit(`${storeKey}/setDataImage`, {
                title: '',
                checkManualDomain: false,
                checkManualDay: false,
                buildTimeValue: this.buildDay,
                runTimeValue: this.buildTime,
            });
        }
    },
};

export const BaseTable = {
    mixins: [BaseDataImage],
    computed: {
        backMenu() {
            if (this.isNew()) return 'TableChoice';
            return '';
        },
    },
    created() {
        if (this.isNew()) {
            this.$store.commit(`${storeKey}/setDataImage`, {
                maxRow: 40,
                checkManualDomain: false,
                checkManualDay: false,
                buildTimeValue: this.buildDay,
                runTimeValue: this.buildTime,
            });
        }
    },
};
