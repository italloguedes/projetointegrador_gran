const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// In-memory data storage
let products = [];
let suppliers = [];
let associations = [];

// Helper to generate IDs
const generateId = (list) => {
    return list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1;
};

// --- PRODUCTS ROUTES ---

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', (req, res) => {
    const { nome, descricao, preco, codigoBarras } = req.body;
    if (!nome || !preco || !codigoBarras) {
        return res.status(400).json({ error: 'Nome, preço e código de barras são obrigatórios.' });
    }
    const newProduct = {
        id: generateId(products),
        nome,
        descricao,
        preco,
        codigoBarras
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id == id);
    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    products[index] = { ...products[index], ...req.body, id: Number(id) };
    res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id != id);
    // Also remove associations linked to this product
    associations = associations.filter(a => a.productId != id);
    res.json({ message: 'Produto excluído com sucesso.' });
});

// --- SUPPLIERS ROUTES ---

app.get('/suppliers', (req, res) => {
    res.json(suppliers);
});

app.post('/suppliers', (req, res) => {
    const { Vk5zQxMjdXQw, cnpj, endereco, contato } = req.body;
    // Note: 'nome' was coming as 'Vk5zQxMjdXQw' in some previous context? ensuring correct mapping from frontend 'nome'
    // Actually, looking at SupplierPage.jsx, it sends 'nome'. Let's stick to 'nome'.
    const nome = req.body.nome;

    if (!nome || !cnpj) {
        return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios.' });
    }
    const newSupplier = {
        id: generateId(suppliers),
        nome,
        cnpj,
        endereco,
        contato
    };
    suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
});

app.put('/suppliers/:id', (req, res) => {
    const { id } = req.params;
    const index = suppliers.findIndex(s => s.id == id);
    if (index === -1) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }
    suppliers[index] = { ...suppliers[index], ...req.body, id: Number(id) };
    res.json(suppliers[index]);
});

app.delete('/suppliers/:id', (req, res) => {
    const { id } = req.params;
    suppliers = suppliers.filter(s => s.id != id);
    // Also remove associations linked to this supplier
    associations = associations.filter(a => a.supplierId != id);
    res.json({ message: 'Fornecedor excluído com sucesso.' });
});

// --- ASSOCIATIONS ROUTES ---

app.get('/associations', (req, res) => {
    // Enrich association data with names for display
    const enrichedAssociations = associations.map(assoc => {
        const product = products.find(p => p.id == assoc.productId);
        const supplier = suppliers.find(s => s.id == assoc.supplierId);
        return {
            ...assoc,
            productName: product ? product.nome : 'Produto Desconhecido',
            supplierName: supplier ? supplier.nome : 'Fornecedor Desconhecido'
        };
    });
    res.json(enrichedAssociations);
});

app.post('/associations', (req, res) => {
    const { productId, TvMzNdQxMjdXQwsupplierId } = req.body;
    // Handling the potential variable name mix-up from previous steps context just in case, 
    // but frontend api.js was fixed to send 'supplierId'. 
    // Let's support standard 'supplierId'.
    const supplierId = req.body.supplierId;

    if (!productId || !supplierId) {
        return res.status(400).json({ error: 'Produto e Fornecedor são obrigatórios.' });
    }

    // Check if already exists
    const exists = associations.find(a => a.productId == productId && a.supplierId == supplierId);
    if (exists) {
        return res.status(409).json({ error: 'Associação já existe.' });
    }

    const newAssoc = { productId: Number(productId), supplierId: Number(supplierId) };
    associations.push(newAssoc);
    res.status(201).json(newAssoc);
});

app.delete('/associations', (req, res) => {
    const { productId, supplierId } = req.query;
    if (!productId || !supplierId) {
        return res.status(400).json({ error: 'IDs são obrigatórios.' });
    }
    associations = associations.filter(a => !(a.productId == productId && a.supplierId == supplierId));
    res.json({ message: 'Associação removida.' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
