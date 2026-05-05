/**
 * Transforms a raw product object into a data model suitable for form inputs.
 * * @param {Object} p - The raw product object from the data source.
 * @param {string} p.id - The product identifier.
 * @param {number} p.price - The price of the product.
 * @param {string} p.image - The image URL/path.
 * @param {string} p.screen - Screen specifications.
 * @param {string} p.backCamera - Rear camera specifications.
 * @param {string} p.frontCamera - Front camera specifications.
 * @param {string} p.desc - Product description.
 * @param {string} p.type - Product category/type.
 * @param {number} p.stock - Inventory count.
 * @returns {Object} The formatted model for the form.
 */
export function productToFormModel(p) {
  return {
    name: p.name,
    price: p.price,
    image: p.image,
    screen: p.screen,
    backCamera: p.backCamera,
    frontCamera: p.frontCamera,
    desc: p.desc,
    type: p.type.toLowerCase(),
    stock: p.stock,
    status: p.status,
  };
}
