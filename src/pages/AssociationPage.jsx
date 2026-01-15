import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function AssociationPage() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [associations, setAssociations] = useState([]); // This would ideally come from an endpoint like /associations
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, suppliersData, associationsData] = await Promise.all([
                api.getProducts(),
                api.getSuppliers(),
                api.getAssociations().catch(() => []) // Fallback if endpoint doesn't exist yet
            ]);
            setProducts(productsData);
            setSuppliers(suppliersData);
            setAssociations(associationsData);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        }
    };

    const handleAssociate = async () => {
        if (!selectedProduct || !selectedSupplier) {
            setMessage('Selecione um produto e um fornecedor.');
            return;
        }
        try {
            await api.associate(selectedProduct, selectedSupplier);
            setMessage('Associação realizada com sucesso!');
            loadData(); // Refresh list
        } catch (err) {
            setMessage('Erro ao realizar associação.');
            console.error(err);
        }
    };

    const handleDisassociate = async (productId, supplierId) => {
        if (window.confirm('Remover associação?')) {
            try {
                await api.disassociate(productId, supplierId);
                setMessage('Associação removida.');
                loadData();
            } catch (err) {
                setMessage('Erro ao remover associação.');
                console.error(err);
            }
        }
    };

    return (
        <div className="page-container">
            <h1>Associação Produto / Fornecedor</h1>

            {message && <div style={{ marginBottom: '15px', fontWeight: 'bold', color: message.includes('Erro') ? 'red' : 'green' }}>{message}</div>}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div style={{ flex: 1 }}>
                    <label>Produto:</label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    >
                        <option value="">Selecione um Produto</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label>Fornecedor:</label>
                    <select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    >
                        <option value="">Selecione um Fornecedor</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleAssociate} style={{ height: '42px' }}>Associar</button>
            </div>

            <h3>Associações Existentes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Fornecedor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {associations.length > 0 ? (
                        associations.map((assoc, index) => (
                            <tr key={index}>
                                {/* Adjust field names based on actual backend response structure */}
                                <td>{assoc.productName || assoc.product?.nome || 'ID: ' + assoc.productId}</td>
                                <td>{assoc.supplierName || assoc.supplier?.nome || 'ID: ' + assoc.supplierId}</td>
                                <td>
                                    <button
                                        onClick={() => handleDisassociate(assoc.productId, assoc.supplierId)}
                                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma associação encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AssociationPage;
