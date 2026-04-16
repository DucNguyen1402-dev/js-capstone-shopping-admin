import { ProductModel } from "../models/product.js";
import { productState } from "../store/product.js";
const URL = "https://69ca67a6ba5984c44bf31972.mockapi.io/api/v1/phone";

const toProductModel = (item) =>
  new ProductModel(
    item.id,
    item.name,
    item.price,
    item.screen,
    item.backCamera,
    item.frontCamera,
    item.img,
    item.desc,
    item.type,
    item.stock,
    item.status,
  );

export async function fetchProducts() {
  try {
    const { data } = await axios.get(URL);

    productState.list = data.map(toProductModel);
    return productState.list;
    
  } catch (error) {
    console.error("Failed to fetch product list:", error);
  }
}


