import { ProductModel } from "../models/product.js";
import { productState } from "../store/product-state.js";
const URL = "https://69ca67a6ba5984c44bf31972.mockapi.io/api/v1/phone";

/**
 * Transforms a raw data item from the API into a ProductModel instance.
 * @function toProductModel
 * @param {Object} item - The raw product object from the API.
 * @param {string|number} [item.id] - Product ID.
 * @param {string} [item.name] - Product name.
 * @param {number} [item.price] - Product price.
 * @param {string} [item.screen] - Screen specifications.
 * @param {string} [item.backCamera] - Rear camera specifications.
 * @param {string} [item.frontCamera] - Front camera specifications.
 * @param {string} [item.image] - Product image URL.
 * @param {string} [item.desc] - Product description.
 * @param {string} [item.type] - Product category or type.
 * @param {number} [item.stock] - Inventory count.
 * @param {string} [item.status] - Product availability status.
 * @returns {ProductModel} A new instance of the ProductModel.
 */
const toProductModel = (item) =>
  new ProductModel(
    item?.id,
    item?.name,
    item?.price,
    item?.screen,
    item?.backCamera,
    item?.frontCamera,
    item?.image,
    item?.desc,
    item?.type,
    item?.stock,
    item?.status,
  );

  /**
 * Fetches the product list from the server and updates the local state.
 * @async
 * @function fetchProducts
 * @returns {Promise<void>}
 */
export async function fetchProducts() {
  try {
    const { data } = await axios.get(URL);
    productState.list = data.map(toProductModel);
  } catch (error) {
    console.error("Failed to fetch product list:", error);
  }
}

/**
 * Deletes a product by its ID.
 * @async
 * @function deleteData
 * @param {string|number} id - The unique identifier of the product to delete.
 * @throws {Error} Relays the error if the deletion fails.
 * @returns {Promise<void>}
 */
export async function deleteData(id) {
  try {
    await axios.delete(
      `https://69ca67a6ba5984c44bf31972.mockapi.io/api/v1/phone/${id}`,
    );
  } catch (err) {
    throw err;
  }
}

/**
 * Updates an existing product's information.
 * @async
 * @function updateProduct
 * @param {string|number} id - The unique identifier of the product to update.
 * @param {Object} data - The updated product data.
 * @returns {Promise<void>}
 */
export async function updateProduct(id, data) {
  try {
    await axios.put(
      `https://69ca67a6ba5984c44bf31972.mockapi.io/api/v1/phone/${id}`,
      data,
    );
  } catch (err) {
    console.error("Something went wrong: ", err);
  }
}

/**
 * Adds a new product to the system.
 * @async
 * @function addProduct
 * @param {Object} data - The product data to be added.
 * @throws {Error} Relays the error if the creation fails.
 * @returns {Promise<void>}
 */
export async function addProduct(data) {
  try {
    await axios.post(URL, data);
  } catch (err) {
      throw err;
  }
}
