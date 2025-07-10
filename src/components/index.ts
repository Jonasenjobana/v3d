import { defineCustomElement } from "vue";
import CustomComponent from "./CustomComponent.vue";
const test = defineCustomElement(CustomComponent);
export function register() {
  customElements.define("custom-component", test);
}
