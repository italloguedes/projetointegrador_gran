import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Gestão de Produtos</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/produtos">Produtos</Link>
                </li>
                <li>
                    <Link to="/fornecedores">Fornecedores</Link>
                </li>
                <li>
                    <Link to="/associacao">Associação</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
