const API_BASE_URL = 'http://localhost:8080'; // Defaulting to localhost as discussed

export const api = {
  // Product endpoints
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },
  createProduct: async (product) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  },
  updateProduct: async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  },
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Supplier endpoints
  getSuppliers: async () => {
    const response = await fetch(`${API_BASE_URL}/suppliers`);
    return response.json();
  },
  createSupplier: async (supplier) => {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    });
    return response.json();
  },
  updateSupplier: async (id, supplier) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    });
    return response.json();
  },
  deleteSupplier: async (id) => {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Association endpoints
  associate: async (productId, supplierId) => {
    const response = await fetch(`${API_BASE_URL}/associations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, supplierId }),
    });
    return response.json();
  },
  disassociate: async (productId, supplierId) => {
    // Assuming endpoint allows query params or body for delete
    const response = await fetch(`${API_BASE_URL}/associations?productId=${productId}&supplierId=${supplierId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
  getAssociations: async () => {
    const response = await fetch(`${API_BASE_URL}/associations`);
    return response.json();
  }
};
