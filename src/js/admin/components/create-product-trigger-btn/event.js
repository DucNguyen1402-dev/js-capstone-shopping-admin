import {createProductTriggerBtn} from "../dom-factory.js";

/**
 * Initialize click event to open the product creation form.
 * 
 * @param {Function} dispatch - Function to trigger state changes.
 */
export function initCreateProductTriggerBtnEvent(dispatch){
    createProductTriggerBtn.addEventListener("click", ()=>{
        dispatch({
            type: "OPEN_ADD_PRODUCT_FORM"
        });
    })
}