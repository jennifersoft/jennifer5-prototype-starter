import Vue from "vue";
import Btn from "@vuejs/component/button/Btn";
import ListSelector from "@vuejs/component/ListSelector/ListSelector";
import FontStyle from "@entry/popup/themeTool/component/ui/fontStyle";
import "./index.scss";
import { metrics } from "./data";

new Vue({
  el: "#vue-app",
  provide: {
    theme: "classic"
  },
  components: {
    ListSelector,
    Btn,
    FontStyle
  },
  data() {
    return {
      button1: [{ text: "left" }, { text: "right" }],
      button2: [{ text: "left" }, { text: "center" }, { text: "right" }],
      fontSize: 11,
      fontWeight: "bold",
      chartData: [10, 20, 30, 20, 10]
    };
  },
  methods: {
    onChangeFontSize({ value }) {
      this.fontSize = value;
    },
    onChangeFontWeight({ value }) {
      this.fontWeight = value;
    },
    printMetrics(list) {
      console.log(list);
    }
  },
  render() {
    return (
      <div className="contents">
        <div className="item">
          <h3>JENNIFER5 공통 컴포넌트</h3>
          <Btn items={this.button1} /> <Btn items={this.button2} />
          <ListSelector
            list={metrics}
            multiSelect
            titleLabel={"Metrics"}
            onCheck={this.printMetrics}
            style="width: 320px; height: 240px; margin-top: 16px;"
          />
        </div>
        <div className="item">
          <h3>JENNIFER5 화면에서 재정의 된 컴포넌트</h3>
          <font-style
            font-size={this.fontSize}
            font-weight={this.fontWeight}
            on-change-font-size={this.onChangeFontSize}
            on-change-font-weight={this.onChangeFontWeight}
          />
        </div>
      </div>
    );
  }
});
