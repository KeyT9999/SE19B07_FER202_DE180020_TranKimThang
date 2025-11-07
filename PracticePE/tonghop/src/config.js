// config.js

const config = {
  dbUrl: "http://localhost:3001",

  collections: {
    products: "products", // Giữ nguyên tên gốc của dự án
    accounts: "accounts", // Giữ nguyên tên gốc của dự án
  },

  fields: {
    // --- Product fields mapping ---
    productId: "id",
    productTitle: "name",
    productBrand: "category",
    productDescription: "description",
    productImage: "image",
    productPrice: "price",

    // --- Account fields mapping ---
    userId: "id",
    userEmail: "email",
    userPassword: "password",
    userIsActive: "isActive",
  },

  app: {
    ITEMS_PER_PAGE_OPTIONS: [8, 12, 16],
    DEBOUNCE_DELAY: 500,
    SECRET_QUESTIONS: [
      "What was your first pet's name?",
      "What is your mother's maiden name?",
      "What was the name of your elementary school?",
      "In what city were you born?",
    ],
  },

  getField: (fieldName, object) => {
    if (!config.fields[fieldName] || !object) return undefined;
    const key = config.fields[fieldName];
    return object[key];
  },
};

export default config;
