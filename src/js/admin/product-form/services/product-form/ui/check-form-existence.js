export function checkFormExistence({ productFormEl }) {
  const { productFormContainer } = productFormEl;
  return productFormContainer.classList.contains("opacity-100");
}

