export function setDropdownMenuState(
  isOpen,
  { dropDownMenu, dropDownOpen, dropDownClose },
) {
  dropDownMenu.classList.toggle("hidden", !isOpen);
  dropDownOpen.classList.toggle("hidden", isOpen);
  dropDownClose.classList.toggle("hidden", !isOpen);
}
