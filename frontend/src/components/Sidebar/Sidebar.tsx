import React, { useState } from 'react';
import './Sidebar.css';
import logoImage from '../../assets/logo_branco.png';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar: React.FC = () => {
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
                    <li>
                        <div className="menu-item">Configurações</div>
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <div className="menu-item">Sair</div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
