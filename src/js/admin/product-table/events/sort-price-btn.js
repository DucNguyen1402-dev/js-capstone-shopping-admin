import { productListTableUI } from "../dom.js";






function handleSortPriceOnClick(sortPriceIcon, dispatch){
   sortPriceIcon.classList.toggle("rotate-180");

   
}

export function initSortPriceBtn(dispatch){
    const {sortPriceBtn, sortPriceIcon} = productListTableUI;

    sortPriceBtn.addEventListener("click", ()=>{
        handleSortPriceOnClick(sortPriceIcon, dispatch);
    });

}