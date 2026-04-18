export function setProductFormToVisible(productForm, visible = true){
      productForm.classList.toggle("hidden", !visible);
}


export function setProductFormSubmitBtnToHidden(submitBtn, toHidden = true) {
  submitBtn.classList.toggle("hidden", toHidden);
}

export function setProductFormUpdateBtnToHidden(updateBtn, toHidden = true) {
  updateBtn.classList.toggle("hidden", toHidden);
}



export function setProductFormStateForUpdate({
  productForm,
  submitBtn,
  updateBtn,
  title,
}) {
  setProductFormToVisible(productForm, true);
  setProductFormSubmitBtnToHidden(submitBtn, true);
  setProductFormUpdateBtnToHidden(updateBtn, false);
  title.textContent = "Update Product";
}
