const express = require('express');
const cors = require('cors');
const { getAll, addRow, updateRow, deleteRow } = require('./services/sheets');

const app = express();
app.use(cors());
app.use(express.json());

// Header definitions
const PRODUCT_HEADERS = ['id', 'nome', 'descricao', 'preco', 'codigoBarras'];
const SUPPLIER_HEADERS = ['id', 'nome', 'cnpj', 'endereco', 'contato'];
const ASSOCIATION_HEADERS = ['id', 'productId', 'supplierId'];

// --- PRODUCTS ROUTES ---

app.get('/api/products', async (req, res) => {
    try {
        const products = await getAll('products', PRODUCT_HEADERS);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { nome, descricao, preco, codigoBarras } = req.body;
        if (!nome || !preco || !codigoBarras) {
            return res.status(400).json({ error: 'Nome, preço e código de barras são obrigatórios.' });
        }
        const newProduct = { nome, descricao, preco, codigoBarras };
        const saved = await addRow('products', PRODUCT_HEADERS, newProduct);
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateRow('products', PRODUCT_HEADERS, id, req.body);
        if (!updated) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteRow('products', PRODUCT_HEADERS, id);

        // Remove associations (naive implementation: fetch all, delete matching)
        // ideally we filter directly, but sheets api doesn't support complex queries efficiently without loading
        const assocs = await getAll('associations', ASSOCIATION_HEADERS);
        for (const assoc of assocs) {
            if (assoc.productId == id) {
                await deleteRow('associations', ASSOCIATION_HEADERS, assoc.id);
            }
        }
        res.json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

// --- SUPPLIERS ROUTES ---

app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await getAll('suppliers', SUPPLIER_HEADERS);
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar fornecedores' });
    }
});

app.post('/api/suppliers', async (req, res) => {
    try {
        const { nome, cnpj, endereco, contato } = req.body;
        if (!nome || !cnpj) {
            return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios.' });
        }
        const newSupplier = { nome, cnpj, endereco, contato };
        const saved = await addRow('suppliers', SUPPLIER_HEADERS, newSupplier);
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar fornecedor' });
    }
});

app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateRow('suppliers', SUPPLIER_HEADERS, id, req.body);
        if (!updated) return res.status(404).json({ error: 'Fornecedor não encontrado.' });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
    }
});

app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteRow('suppliers', SUPPLIER_HEADERS, id);

        // Remove associations
        const assocs = await getAll('associations', ASSOCIATION_HEADERS);
        for (const assoc of assocs) {
            if (assoc.supplierId == id) {
                await deleteRow('associations', ASSOCIATION_HEADERS, assoc.id);
            }
        }
        res.json({ message: 'Fornecedor excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir fornecedor' });
    }
});

// --- ASSOCIATIONS ROUTES ---

app.get('/api/associations', async (req, res) => {
    try {
        const associations = await getAll('associations', ASSOCIATION_HEADERS);
        const products = await getAll('products', PRODUCT_HEADERS);
        const suppliers = await getAll('suppliers', SUPPLIER_HEADERS);

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar associações' });
    }
});

app.post('/api/associations', async (req, res) => {
    try {
        const { productId, supplierId } = req.body;
        if (!productId || !supplierId) {
            return res.status(400).json({ error: 'Produto e Fornecedor são obrigatórios.' });
        }

        const associations = await getAll('associations', ASSOCIATION_HEADERS);
        const exists = associations.find(a => a.productId == productId && a.supplierId == supplierId);
        if (exists) {
            return res.status(409).json({ error: 'Associação já existe.' });
        }

        const newAssoc = { productId: String(productId), supplierId: String(supplierId) };
        const saved = await addRow('associations', ASSOCIATION_HEADERS, newAssoc);
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar associação' });
    }
});

app.delete('/api/associations', async (req, res) => {
    try {
        const { productId, supplierId } = req.query;
        if (!productId || !supplierId) {
            return res.status(400).json({ error: 'IDs são obrigatórios.' });
        }

        const associations = await getAll('associations', ASSOCIATION_HEADERS);
        const toDelete = associations.find(a => a.productId == productId && a.supplierId == supplierId);

        if (toDelete) {
            await deleteRow('associations', ASSOCIATION_HEADERS, toDelete.id);
            res.json({ message: 'Associação removida.' });
        } else {
            res.status(404).json({ error: 'Associação não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover associação' });
    }
});

// Fallback for root path of the function
app.get('/api', (req, res) => {
    res.send('API Backend is running properly with Google Sheets!');
});

module.exports = app;
