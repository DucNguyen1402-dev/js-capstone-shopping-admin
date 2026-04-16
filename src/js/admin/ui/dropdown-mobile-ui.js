import { getDropdownButtonDOM } from "../dom.js";

export function initDropdownMobileButton() {
  const { dropDownOpen, dropDownClose, dropDownMenu } = getDropdownButtonDOM();

  let isOpen = false;

  const render = () => {
    dropDownMenu.classList.toggle("hidden", !isOpen);
    dropDownOpen.classList.toggle("hidden", isOpen);
    dropDownClose.classList.toggle("hidden", !isOpen);
  };

  const toggle = () => {
    isOpen = !isOpen;
    render();
  };

  [dropDownOpen, dropDownClose].forEach((btn) => {
    btn.addEventListener("click", toggle);
  });

  render();
}

