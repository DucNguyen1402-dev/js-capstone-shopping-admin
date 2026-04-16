import {$, ElementNotFoundError} from "../shared/dom-core.js";

export function getDropdownButtonDOM(){
    return {
        dropDownOpen : $(".js-open-btn"),
        dropDownClose: $(".js-close-btn"),
        dropDownMenu: $(".js-dropdown-mobile")
    };
}

