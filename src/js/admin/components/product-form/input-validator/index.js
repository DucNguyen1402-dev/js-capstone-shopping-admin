import { runNameValidation } from "./name.js";
import { runPriceValidation } from "./price.js";
import { runImageValidation } from "./image.js";
import {runScreenValidation} from "./screen.js";
import {runBackCameraValidation} from "./back-camera.js";
import {runFrontCameraValidation} from "./front-camera.js";
import {runDescriptionValidation} from "./description.js";
import {runTypeValidation} from "./type.js";
import { runStockValidation } from "./stock.js";
import {runStatusValidation} from "./status.js";


export const inputValidators = {
  name: runNameValidation,
  price: runPriceValidation,
  image: runImageValidation,
  screen: runScreenValidation,
  backCamera: runBackCameraValidation,
  frontCamera: runFrontCameraValidation,
  desc: runDescriptionValidation,
  stock: runStockValidation,
  type: runTypeValidation,
  status: runStatusValidation,
};
