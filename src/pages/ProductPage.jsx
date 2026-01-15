import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        codigoBarras: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            setError('Erro ao carregar produtos. Verifique se o backend está rodando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateProduct(editingId, formData);
            } else {
                await api.createProduct(formData);
            }
            setFormData({ nome: '', descricao: '', preco: '', codigoBarras: '' });
            setEditingId(null);
            loadProducts();
        } catch (err) {
            setError('Erro ao salvar produto.');
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            nome: product.nome || '',
            descricao: product.descricao || '',
            preco: product.preco || '',
            codigoBarras: product.codigoBarras || ''
        });
        setEditingId(product.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await api.deleteProduct(id);
                loadProducts();
            } catch (err) {
                setError('Erro ao excluir produto.');
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ nome: '', descricao: '', preco: '', codigoBarras: '' });
        setEditingId(null);
    };

    return (
        <div className="page-container">
            <h1>Gerenciamento de Produtos</h1>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <h3>{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome do Produto"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="descricao"
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    step="0.01"
                    name="preco"
                    placeholder="Preço (R$)"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="codigoBarras"
                    placeholder="Código de Barras"
                    value={formData.codigoBarras}
                    onChange={handleChange}
                    required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
                    {editingId && (
                        <button type="button" onClick={handleCancel} style={{ backgroundColor: '#ccc' }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Cód. Barras</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.nome}</td>
                                    <td>{product.descricao}</td>
                                    <td>R$ {parseFloat(product.preco).toFixed(2)}</td>
                                    <td>{product.codigoBarras}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductPage;
