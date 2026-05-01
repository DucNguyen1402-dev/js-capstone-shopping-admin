import { initNameInputEvent } from "./name.js";
import { initPriceInputEvent } from "./price.js";
import { initImageInputEvent } from "./image.js";
import {initScreenInputEvent} from "./screen.js";
import {initBackCameraInputEvent} from "./back-camera.js";
import {initFrontCameraInputEvent} from "./front-camera.js";
import {initDescInputEvent} from "./description.js";
import { initStockInputEvent } from "./stock.js";
import { initStatusInputEvent } from "./status.js";
import {initFormResetEvent} from "./form.js";


/**
 * Initializes field-level input and validation events.
 * @description
 * Attaches listeners to individual form controls to manage real-time
 * data binding, formatting, and field-specific logic.
 * @param {Object} productFormInputUI - Mapping of input-specific DOM elements.
 */
export function initFormInputEvents(context) {
  const initializer = [
    initNameInputEvent,
    initPriceInputEvent,
    initImageInputEvent,
    initScreenInputEvent,
    initBackCameraInputEvent,
    initFrontCameraInputEvent,
    initDescInputEvent,
    initStockInputEvent,
    initStatusInputEvent,
    initFormResetEvent
  ];

  initializer.forEach((init) => init(context));
}

