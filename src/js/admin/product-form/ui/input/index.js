import {nameUIHandler} from "./name.js";
import {priceUIHandler} from "./price.js";
import {imageUIHandler} from "./image.js";
import {screenUIHandler} from "./screen.js";
import {backCameraUIHandler} from "./back-camera.js";
import {frontCameraUIHandler} from "./front-camera.js";
import {descUIHandler} from "./description.js";
import {typeUIHandler} from "./type.js";
import {stockUIHandler} from "./stock.js";
import {statusUIHandler} from "./status.js";

export const inputUIHandler = {
    nameUIHandler,
    priceUIHandler,
    stockUIHandler,
    screenUIHandler,
    backCameraUIHandler,
    frontCameraUIHandler,
    statusUIHandler,
    typeUIHandler,
    descUIHandler,
    imageUIHandler
}



export const inputUIHandlerMapping = {
    name: nameUIHandler,
    price: priceUIHandler,
    stock: stockUIHandler,
    screen: screenUIHandler,
    backCamera: backCameraUIHandler,
    frontCamera: frontCameraUIHandler,
    status: statusUIHandler,
    type: typeUIHandler,
    desc: descUIHandler,
    image: imageUIHandler
}

