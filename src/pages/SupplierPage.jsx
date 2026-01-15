import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function SupplierPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        contato: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            setLoading(true);
            const data = await api.getSuppliers();
            setSuppliers(data);
        } catch (err) {
            setError('Erro ao carregar fornecedores.');
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
                await api.updateSupplier(editingId, formData);
            } else {
                await api.createSupplier(formData);
            }
            setFormData({ nome: '', cnpj: '', endereco: '', contato: '' });
            setEditingId(null);
            loadSuppliers();
        } catch (err) {
            setError('Erro ao salvar fornecedor.');
            console.error(err);
        }
    };

    const handleEdit = (supplier) => {
        setFormData({
            nome: supplier.nome || '',
            cnpj: supplier.cnpj || '',
            endereco: supplier.endereco || '',
            contato: supplier.contato || ''
        });
        setEditingId(supplier.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
            try {
                await api.deleteSupplier(id);
                loadSuppliers();
            } catch (err) {
                setError('Erro ao excluir fornecedor.');
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ nome: '', cnpj: '', endereco: '', contato: '' });
        setEditingId(null);
    };

    return (
        <div className="page-container">
            <h1>Gerenciamento de Fornecedores</h1>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <h3>{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome do Fornecedor"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="cnpj"
                    placeholder="CNPJ"
                    value={formData.cnpj}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="contato"
                    placeholder="Contato (Email/Telefone)"
                    value={formData.contato}
                    onChange={handleChange}
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
                            <th>CNPJ</th>
                            <th>Endereço</th>
                            <th>Contato</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.nome}</td>
                                    <td>{supplier.cnpj}</td>
                                    <td>{supplier.endereco}</td>
                                    <td>{supplier.contato}</td>
                                    <td>
                                        <button onClick={() => handleEdit(supplier)} style={{ marginRight: '5px', backgroundColor: '#ffc107' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(supplier.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum fornecedor cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SupplierPage;
