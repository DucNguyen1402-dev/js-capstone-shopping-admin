import { productFormUI } from "../../dom.js";

export function initUpdateBtnEvents(dispatch) {
  const { updateBtn } = productFormUI;
  updateBtn.addEventListener("click", () => {
    dispatch({
      type: "UPDATE",
    });
  });
}
