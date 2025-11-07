export const transformProductData = (product, fieldMap) => {
  const transformed = {};
  for (const internalKey in fieldMap) {
    const externalKey = fieldMap[internalKey];
    transformed[internalKey] = product[externalKey];
  }
  return transformed;
};

export const transformProductList = (products, fieldMap) => {
  return products.map((product) => transformProductData(product, fieldMap));
};
