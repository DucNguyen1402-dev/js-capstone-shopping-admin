import { dropDownElementUI } from "./dom.js";
import {setDropdownMenuState} from "./ui.js";



export function bindDropdownMobileButtonEvent() {
  const { dropDownOpen, dropDownClose } = dropDownElementUI;

  let isOpen = false;

  const handleToggle = () => {
    isOpen = !isOpen;
    setDropdownMenuState(isOpen, dropDownElementUI);
  };

  [dropDownOpen, dropDownClose].forEach((btn) => {
    btn.addEventListener("click", handleToggle);
  });
}