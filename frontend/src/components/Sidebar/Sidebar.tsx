import React, { useState } from 'react';
import './Sidebar.css';
import logoImage from '../../assets/logo_branco.png';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Funcionario } from '../../models/Funcionario'; // 1. Importar o modelo
import { NivelPermissao } from '../../models/enums'; // 2. Importar o enum

// 3. Definir a interface de props que o componente espera
interface SidebarProps {
    currentUser: Funcionario | null;
}

// 4. Usar a interface de props (React.FC<SidebarProps>) e receber a prop { currentUser }
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
                    
                    {/* 5. Usar o enum NivelPermissao para a verificação */}
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
                    {/* 6. Adicionar uma secção para mostrar quem está logado */}
                    {currentUser && (
                        <div className="user-info">
                            <strong>{currentUser.nome}</strong>
                            <small>{currentUser.email}</small>
                        </div>
                    )}
                    <div className="menu-item">Sair</div> {/* TODO: Implementar Logout */}
                </div>
            </div>
        </>
    );
};

export default Sidebar;