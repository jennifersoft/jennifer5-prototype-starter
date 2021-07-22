import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.headers.common["Accept"] = "application/json; charset=utf-8";

export default axios;