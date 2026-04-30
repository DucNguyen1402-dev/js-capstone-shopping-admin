import { initFormBtnEvents } from "./form-btn/index.js";
import { initFormInputEvents } from "./form-input/index.js";

export function initProductFormEvents(contextBtn, contextInput) {
  initFormBtnEvents(contextBtn);
  initFormInputEvents(contextInput);
}
