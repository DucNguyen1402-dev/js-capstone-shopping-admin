import {productFormUI} from "../../dom.js";




function handleUpdateBtnOnClick(dispatch){
    dispatch({
        type: "UPDATE"
    });
}

export function initUpdateBtnEvents(dispatch){
    const {updateBtn} = productFormUI;
    updateBtn.addEventListener("click", ()=>{
        handleUpdateBtnOnClick(dispatch);
    })
}