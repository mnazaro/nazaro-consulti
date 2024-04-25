import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function Relatorios() {
    const [empresas, setEmpresas] = useState([]);
    const [setores, setSetores] = useState([]);
    const [filtroEmpresa, setFiltroEmpresa] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const URL = 'https://case-consulti.onrender.com';

    async function fetchData() {
        await axios.get(URL + '/empresa').then((response) => {
            setEmpresas(response.data);
        }).catch((error) => {
            console.log(error);
        });

        await axios.get(URL + '/setor').then((response) => {
            setSetores(response.data);
        }).catch((error) => {
            console.log(error);
        });
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="relatorios">
            <h1>Relatórios</h1>
            <div className="table-area">
                <div className='header'>
                    <div className='add-button' onClick={ () => [setFiltroEmpresa(true)]} style={{ cursor: 'pointer' }}>
                        <p>Empresas</p>
                    </div>
                    <div className='add-button' onClick={() => [setFiltroEmpresa(false)]} style={{ cursor: 'pointer' }}>
                        <p>Setores</p>
                    </div>
                </div>
                {isLoading && <div>Carregando...</div>}
                {filtroEmpresa ? (
                    <>
                        <h1>Empresas</h1>
                        Existem {empresas.length} empresas cadastradas.
                        <div className='area'>                            
                            {empresas.sort((a, b) => a.razao_social.localeCompare(b.razao_social)).map((empresa) => (
                                <div className="card" key={empresa.id} >
                                    <h3>{empresa.razao_social}</h3>
                                    <p>Setores relacionados: {empresa.setores.length}</p>
                                </div>
                            ))}
                        </div>
                        <div className='footer'>
                        Para mais informações sobre as empresas, acesse a aba Empresas.
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Setores</h1>
                        Existem {setores.length} setores cadastrados.
                        <div className='area'>
                            
                            {setores.sort((a, b) => a.descricao.localeCompare(b.descricao)).map((setor) => (
                                <div className="card" key={setor.id}>
                                    <h3>{setor.descricao}</h3>
                                    <p>Empresas relacionadas: {setor.empresas.length}</p>
                                </div>
                            ))}
                        </div>
                        <div className='footer'>
                        Para mais informações sobre as empresas, acesse a aba Empresas.
                        </div>
                    </>
                
                )}
            </div>
        </div>
    );
}

export default Relatorios;
