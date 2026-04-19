/**
 * Error thrown when a DOM element is not found via its selector.
 */

export class ElementNotFoundError extends Error {
  /**
   * @param {string} selector - The CSS selector that failed to match.
   */
  constructor(selector) {
    super(`Missing required element: ${selector}`);
    this.name = "ElementNotFoundError";
    this.selector = selector;
  }
}


/**
 * Selects a single DOM element by selector.
 * @param {string} selector - CSS selector string.
 * @returns {HTMLElement} The found element.
 * @throws {ElementNotFoundError} If no element matches the selector.
 */
export function $(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new ElementNotFoundError(selector);
  return el;
}

/**
 * Selects all matching DOM elements by selector.
 * @param {string} selector - CSS selector string.
 * @returns {NodeList} A collection of found elements.
 * @throws {ElementNotFoundError} If the NodeList is empty.
 */
export function $all(selector) {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) {
    throw new ElementNotFoundError(selector);
  }
  return els;
}

/**
 * Creates a new DOM element with optional text content and CSS classes.
 * @param {string} tag - HTML tag name.
 * @param {string} [text=""] - Text content to set.
 * @param {string|string[]} [className] - A single class string or an array of classes.
 * @returns {HTMLElement} The newly created element.
 */
export const $e = (tag, text, cls) => {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (cls) el.classList.add (cls);
  return el;
};