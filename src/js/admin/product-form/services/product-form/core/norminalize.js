export function normalizeFormDataTypes(data, {fieldUtils}) {
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = fieldUtils.isNumberField(key) ? Number(data[key]) : data[key];
    return acc;
  }, {});
}
