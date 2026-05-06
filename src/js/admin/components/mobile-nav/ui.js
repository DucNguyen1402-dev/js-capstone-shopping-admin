/**
 * Updates the visibility of the mobile navigation elements based on the open state.
 * * @param {boolean} isOpen - The current state of the dropdown (true if open, false if closed).
 * @param {Object} elements - The DOM elements to be toggled.
 * @param {HTMLElement} elements.dropDownMenu - The container for the navigation links.
 * @param {HTMLElement} elements.dropDownOpen - The hamburger icon/button to open the menu.
 * @param {HTMLElement} elements.dropDownClose - The 'X' icon/button to close the menu.
 */
export function setDropdownMenuState(
  isOpen,
  { dropDownMenu, dropDownOpen, dropDownClose },
) {
  dropDownMenu.classList.toggle("hidden", !isOpen);
  dropDownOpen.classList.toggle("hidden", isOpen);
  dropDownClose.classList.toggle("hidden", !isOpen);
}
