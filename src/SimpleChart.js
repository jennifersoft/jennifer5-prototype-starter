import {scaleLinear} from "d3-scale";

export default {
    props: {
        width: {
            type: Number,
            required: false,
            default: 300
        },
        height: {
            type: Number,
            required: false,
            default: 100
        },
        r: {
            type: Number,
            required: false,
            default: 5
        },
        color: {
            type: String,
            required: false,
            default: 'red'
        },
        domain: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        }
    },
    computed: {
        xValues() {
            const tick = this.width / this.data.length;
            return this.data.map((value, i) => {
                return (i * tick) + (tick / 2);
            });
        },
        yValues() {
            const func = scaleLinear()
                .domain(this.domain)
                .range([this.height, 0])
            return this.data.map(value => func(value));
        }
    },
    render() {
        return (
            <svg width={this.width} height={this.height} style="background: #dcdcdc;">
                {[...Array(this.data.length)].map((x, i) =>
                    <circle cx={this.xValues[i]} cy={this.yValues[i]} r={this.r} fill={this.color} />
                )}
            </svg>
        );
    }
}