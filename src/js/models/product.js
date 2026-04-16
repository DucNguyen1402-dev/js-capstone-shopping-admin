/**
 * Represents a product (specifically a smartphone) in the inventory.
 * Used for managing product details across the store's dashboard and catalog.
 */
export class Product {
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
  
  constructor(name, price, screen, backCam, frontCam, img, desc, type) {
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCam = backCam;
    this.frontCam = frontCam;
    this.img = img;
    this.desc = desc;
    this.type = type; // iPhone, Samsung, Pixel, v.v.
  }
}