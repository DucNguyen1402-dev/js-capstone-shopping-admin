export function getFormData({ productFormInputEl, PRODUCT_FIELDS  }) {
  return PRODUCT_FIELDS.reduce((acc, key) => {
    acc[key] = productFormInputEl[key].value;
    return acc;
  }, {});
}
