/**
 * Represents a product (specifically a smartphone) in the inventory.
 * Used for managing product details across the store's dashboard and catalog.
 */
export class ProductModel {
  /**
   * @param {string} name - Product name (e.g., "iPhone 15 Pro").
   * @param {number|string} price - Selling price.
   * @param {string} screen - Display specifications.
   * @param {string} backCam - Rear camera specifications.
   * @param {string} frontCam - Front camera specifications.
   * @param {string} img - URL or path to the product image.
   * @param {string} desc - Short description of the product.
   * @param {string} type - Category or brand (e.g., "iPhone", "Samsung", "Pixel").
   */

  static REGEX = {
    ID: /^[a-zA-Z][a-zA-Z0-9]*$/,
  };

  constructor(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    desc,
    type,
    stock,
    status,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.image = image;
    this.desc = desc;
    this.type = type;
    this.stock = stock;
    this.status = status;
    this.nameLower = name.toLowerCase();
  }

  /**
   * Contains validation logic for each product property.
   * Each validator returns true if the data is invalid and false if valid.
   * @type {Object.<string, function(): boolean>}
   */
  get validators() {
    return {
      name: () => !this.name || this.name.trim().length < 2,

      price: () => isNaN(this.price) || this.price < 0 || this.price === null & this.status !== "comingSoon",

      screen: () => !this.screen || this.screen.trim() === "",

      backCamera: () => !this.backCamera || this.backCamera.trim() === "",

      frontCamera: () => !this.frontCamera || this.frontCamera.trim() === "",
      desc: () => !this.desc || this.desc.trim().length < 10,

      type: () => !this.type || this.type === "Select brand",

      stock: () =>
        isNaN(this.stock) || this.stock < 0 || !Number.isInteger(this.stock),
    };
  }

  /**
   * Checks if a specific data field is invalid.
   * Useful for binding CSS error classes to specific input fields or table cells.
   * @param {string} fieldName - The property name to validate (e.g., 'id', 'name', 'price').
   * @returns {boolean} Returns true if the field is invalid.
   */
  isFieldInvalid(fieldName) {
    const validator = this.validators[fieldName];
    return validator ? validator() : false;
  }

  /**
   * Evaluates the overall validity of the product object.
   * @returns {boolean} Returns true if at least one field is invalid.
   */
  get isInvalid() {
    return Object.keys(this.validators).some((field) =>
      this.isFieldInvalid(field),
    );
  }
}
