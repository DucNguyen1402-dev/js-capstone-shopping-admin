import { initFormBtnEvents } from "./form-btn/index.js";
import { initFormInputEvents } from "./form-input/index.js";
import {initWarningConsentCheckboxEvent} from "./warning-consent-checkbox/init.js";

export function initProductFormEvents(contextBtn, contextInput) {
  initFormBtnEvents(contextBtn);
  initFormInputEvents(contextInput);
  initWarningConsentCheckboxEvent(contextInput);
}