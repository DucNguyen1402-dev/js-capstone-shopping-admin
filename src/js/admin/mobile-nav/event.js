import { dropDownElementUI } from "./dom.js";
import { setDropdownMenuState } from "./ui.js";

/**
 * Initializes click event listeners for the mobile navigation toggle buttons.
 * * @description
 * Manages the open/closed state of the mobile dropdown menu. It binds a
 * toggle handler to both the "open" (hamburger) and "close" (X) buttons,
 * updating the UI state whenever they are clicked.
 * * @function
 */
export function initDropdownMobileButtonEvent() {
  const { dropDownOpen, dropDownClose } = dropDownElementUI;

  /** @type {boolean} Internal state to track if the menu is expanded. */
  let isOpen = false;

  /**
   * Toggles the menu state and updates the UI accordingly.
   */
  const handleToggle = () => {
    isOpen = !isOpen;
    setDropdownMenuState(isOpen, dropDownElementUI);
  };

  [dropDownOpen, dropDownClose].forEach((btn) => {
    btn.addEventListener("click", handleToggle);
  });
}
