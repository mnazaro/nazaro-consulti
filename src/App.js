import React from 'react';
import './App.css';

import Empresas from './components/Empresas';
import Setores from './components/Setores';
import Relatorios from './components/Relatorios';

import logo from './assets/consulti_logo.svg';
import empresas from './assets/empresas.svg';
import setores from './assets/setores.svg';
import relatorios from './assets/relatorios.svg';




function App() {
  const [content, setContent] = React.useState('');

  function handleToggleContent(event) {
    setContent(event.target.innerText);
  }

  return (
    <div className="container">
      <div className="sidebar">
        <img src={logo} alt="Logo Consulti" />
        <div className="sidebar-menu">
          <h1>Menu</h1>
          <div className="menu-item">
            <img src={empresas} alt="Empresas"/>
            <button onClick={handleToggleContent}>Empresas</button>
          </div>
          <div className="menu-item">
            <img src={setores} alt="Setores" />
            <button onClick={handleToggleContent}>Setores</button>
          </div>
          <div className="menu-item">
            <img src={relatorios} alt="Relatorios" />
            <button onClick={handleToggleContent}>Relatorios</button>
          </div>
        </div>
      </div>
      <div className='content'>
        {content === 'Empresas' && <Empresas />}
        {content === 'Setores' && <Setores />}
        {content === 'Relatorios' && <Relatorios />}
      </div>
    </div>
  );
}

export default App;
