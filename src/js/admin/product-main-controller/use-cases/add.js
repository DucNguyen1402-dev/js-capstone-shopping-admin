import {addProduct} from "../../index.js";

export async function performAddProduct(data){
    await addProduct(data);
}