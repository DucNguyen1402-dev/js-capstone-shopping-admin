const normalizeString = (value) => {
  if (value == null) return "";
  return String(value).trim().toLowerCase();
};
export function diffFields(currentProduct, normalizedData) {
  const changedFields = [];

  for (const key in normalizedData) {
    const oldValue = currentProduct[key];
    const newValue = normalizedData[key];

    const isNumberField = typeof oldValue === "number";

    if (isNumberField) {
      if (oldValue !== newValue) {
        changedFields.push(key);
      }
    } else {
      if (normalizeString(oldValue) !== normalizeString(newValue)) {
        changedFields.push(key);
      }
    }
  }
  return changedFields;
}

export function pickFields(fields, data) {
  const result = {};
  for (const key of fields) {
    if (key in data) {
      result[key] = data[key];
    }
  }
  return result;
}

const NUMBER_FIELDS = ["price", "stock"];

export function normalizeFormDataTypes(data) {
  const result = {};

  for (const key in data) {
    let value = data[key];

    if (NUMBER_FIELDS.includes(key)) {
      result[key] = value === "" ? null : Number(value);
    } else if (typeof value === "string") {
      result[key] = value.trim();
    } else {
      result[key] = value;
    }
  }

  return result;
}


export function getNameProductList(productList){

   const nameList = productList.map(item => item.name);
   return nameList;
}