export const fieldUtils = {
  numberFields: new Set(["price", "stock"]),

  isNumberField(key) {
    return this.numberFields.has(key);
  },
};