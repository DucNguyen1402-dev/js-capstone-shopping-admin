import {runStockValidation} from "./stock.js";
import {runNameValidation} from "./name.js";
import {runPriceValidation} from "./price.js";
export const inputValidators = {
    name: runNameValidation,
    price: runPriceValidation,
    stock: runStockValidation,

}