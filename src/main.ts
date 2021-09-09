import { createApp } from "vue";
import router from "./router/index";
import store from "./store";
import App from "./App.vue";
import "./index.css";

const app = createApp(App);

app.use(router);
app.use(store);

app.mount("#app");
