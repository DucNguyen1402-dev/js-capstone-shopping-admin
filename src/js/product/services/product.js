import { ProductModel } from "../models/product.js";
import { productState } from "../store/productStore.js";
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

async function fetchProductList() {
  try {
    const { data } = await axios.get(URL);

    productState.list = data.map(toProductModel);

    return productState;
  } catch (error) {
    console.error("Failed to fetch product list:", error);
  }
}

fetchProductList();
