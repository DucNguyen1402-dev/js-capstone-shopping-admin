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
  
  constructor(id, name, price, screen, backCamera, frontCamera, image, desc, type, stock, status) {
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
  }
}



