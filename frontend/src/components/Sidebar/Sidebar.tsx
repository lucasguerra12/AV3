import React, { useState } from 'react';
import './Sidebar.css';
import logoImage from '../../assets/logo_branco.png';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Funcionario } from '../../models/Funcionario';
import { NivelPermissao } from '../../models/enums'; // 1. IMPORTAR O ENUM

interface SidebarProps {
    currentUser: Funcionario | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="menu-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logoImage} alt="AeroCode Logo" className="sidebar-logo" />
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                'menu-item' + (isActive ? ' active' : '')
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    
                    {/* 2. CORREÇÃO: Comparar com o ENUM, não com a string */}
                    {currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
                        <li>
                            <NavLink
                                to="/funcionarios"
                                className={({ isActive }) =>
                                    'menu-item' + (isActive ? ' active' : '')
                                }
                            >
                                Funcionários
                            </NavLink>
                        </li>
                    )}
                </ul>

                <div className="sidebar-footer">
                    {currentUser && (
                        <div className="user-info">
                            <strong>{currentUser.nome}</strong>
                            <small>{currentUser.email}</small>
                        </div>
                    )}
                    <div className="menu-item">Sair</div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;