import React from "react";
import "./styles.css";
import axios from "axios"

import add from "../../assets/add_icon.svg";
import search from "../../assets/search.svg";
import deleteIcon from "../../assets/delete_icon.svg";
import edit from "../../assets/edit.svg";
import Modal from "../Modal";

function Empresas() {
  const [data, setData] = React.useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = React.useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [cnpj, setCnpj] = React.useState("");
  const [razao_social, setRazaoSocial] = React.useState("");
  const [nome_fantasia, setNomefantasia] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [setores, setSetores] = React.useState([]);
  const [selectedSetores, setSelectedSetores] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [novaRazaoSocial, setNovaRazaoSocial] = React.useState("");
  const [novoCnpj, setNovoCnpj] = React.useState("");

  const URL = "https://case-consulti.onrender.com";

  async function fetchData() {
    await axios
      .get(URL + "/empresa", {
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .get(URL + "/setor", {
        Headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSetores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleCnpjChange = (event) => {
    let cnpj = event.target.value;
    cnpj = cnpj.replace(/\D/g, "");
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
    if (isEditing) {
      setNovoCnpj(cnpj);
    }
    setCnpj(cnpj);
  };

  const outrasEmpresas = data.filter(
    (empresa) => empresa.id !== selectedEmpresa.id
  );

  const verificaEdicao = () => {
    if (
      outrasEmpresas.some((empresa) => empresa.razao_social === novaRazaoSocial)
    ) {
      alert("Razão Social já existe em outra empresa");
      if (isEditing) {
        return true;
      }
      return;
    }

    if (
      outrasEmpresas.some(
        (empresa) => empresa.cnpj === novoCnpj.replace(/\D/g, "")
      )
    ) {
      console.log(novoCnpj.replace(/\D/g, ""));
      alert("CNPJ já existe em outra empresa");
      if (isEditing) {
        return true;
      }
      return;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //garantir que o array de setores seja um array de números, caso contrário mostra o erro no console e não envia a requisição
    if (selectedSetores.some((setor) => typeof setor !== "number")) {
      console.error("Erro: um ou mais setores não são números");
      return;
    }

    if (isEditing) {
      if (novaRazaoSocial === "" || novoCnpj === "") {
        alert("Preencha todos os campos");
        return;
      }
      if (verificaEdicao()) {
        return;
      }
      axios
        .put(URL + `/empresa/${selectedEmpresa.id}`, {
          Headers: {
            "Content-Type": "application/json",
          },
          razao_social: novaRazaoSocial,
          cnpj: novoCnpj.replace(/\D/g, ""),
          nome_fantasia: nome_fantasia,
          setor_Ids: selectedSetores,
        })
        .then((response) => {
          setModalOpen(false);
          setCnpj("");
          setRazaoSocial("");
          setNovaRazaoSocial("");
          setNovoCnpj("");
          setNomefantasia("");
          setSelectedSetores([]);
          setIsEditing(false);
          fetchData();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (razao_social === "" || cnpj === "") {
        alert("Preencha todos os campos");
        return;
      }
      if (data.some((empresa) => empresa.razao_social === razao_social)) {
        alert("Razão Social já cadastrada!");
        return;
      }
      if (data.some((empresa) => empresa.cnpj === cnpj.replace(/\D/g, ""))) {
        alert("CNPJ já cadastrado!");
        return;
      }
      axios
        .post(URL + "/empresa", {
          Headers: {
            "Content-Type": "application/json",
          },
          razao_social: razao_social,
          cnpj: cnpj.replace(/\D/g, ""),
          nome_fantasia: nome_fantasia,
          setor_Ids: selectedSetores,
        })
        .then((response) => {
          console.log(response.data);
          setModalOpen(false);
          setNovaRazaoSocial("");
          setNovoCnpj("");
          setRazaoSocial("");
          setCnpj("");
          setNomefantasia("");
          setSelectedSetores([]);
          fetchData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleEdit = (empresa) => {
    setNovaRazaoSocial(empresa.razao_social);
    setNovoCnpj(empresa.cnpj);
    setNomefantasia(empresa.nome_fantasia);
    setSelectedSetores(empresa.setores.map((setor) => setor.id));
    setIsEditing(true);
    setEditModalOpen(true);
  };

  const handleDelete = (empresa) => {
    if (
      window.confirm(
        `Deseja realmente excluir a empresa ${empresa.razao_social}?`
      )
    ) {
      axios
        .delete(URL + `/empresa/${empresa.id}`, {
          Headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const filteredEmpresas = data.filter((data) =>
    data.razao_social.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="empresas">
      <h1>Empresas</h1>
      <div className="table-area">
        <div className="header">
          <div
            className="add-button"
            onClick={() => setModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <img src={add} alt="Adicionar" />
            <p>Adicionar Empresa</p>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar Empresa"
              value={searchValue}
              onChange={(e) => [setSearchValue(e.target.value)]}
            />
            <img
              src={search}
              alt="Pesquisar"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (searchValue === "") fetchData();
                else setData(filteredEmpresas);
              }}
            />
            {searchValue && (
              <img
                src={deleteIcon}
                alt="Limpar"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSearchValue("");
                  fetchData();
                }}
              />
            )}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Nome Fantasia</th>
              <th>Setor(es)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="6">Carregando dados do servidor...</td>
              </tr>
            )}
            {data
              .sort((a, b) => a.id - b.id)
              .map((empresa, index) => (
                <tr
                  key={empresa.id}
                  onClick={() => setSelectedEmpresa(empresa)}
                >
                  <td>{index + 1}</td>
                  <td>{empresa.razao_social}</td>
                  <td>
                    {empresa.cnpj.replace(
                      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                      "$1.$2.$3/$4-$5"
                    )}
                  </td>
                  <td>{empresa.nome_fantasia}</td>
                  <td>
                    {empresa.setores
                      ? empresa.setores
                          .map((setor) => setor.descricao)
                          .join(", ")
                      : ""}
                  </td>
                  <td>
                    <img
                      src={edit}
                      alt="Editar"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(empresa)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Deletar"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(empresa)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h1>Adicionar Empresa</h1>

          <form>
            <label htmlFor="razao_social">Razão Social</label>
            <input
              type="text"
              id="razao_social"
              name="razao_social"
              value={razao_social}
              onChange={(e) => setRazaoSocial(e.target.value)}
            />

            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={cnpj}
              maxLength="18"
              onChange={(e) => handleCnpjChange(e)}
            />

            <label htmlFor="nome_fantasia">Nome Fantasia</label>
            <input
              type="text"
              id="nome_fantasia"
              name="nome_fantasia"
              value={nome_fantasia}
              onChange={(e) => setNomefantasia(e.target.value)}
            />

            <label htmlFor="setores">Setores</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "30vw",
              }}
            >
              {setores.map((setor) => (
                <div
                  key={setor.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "15vw",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ width: "2vh", flexWrap: "wrap" }}
                    id={setor.id}
                    value={setor.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSetores([...selectedSetores, setor.id]);
                      } else {
                        setSelectedSetores(
                          selectedSetores.filter((id) => id !== setor.id)
                        );
                      }
                    }}
                  />
                  <label htmlFor={setor.id}>{setor.descricao}</label>
                </div>
              ))}
            </div>
            <button
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setModalOpen(false);
              }}
            >
              Adicionar
            </button>
            <button
              type="submit"
              className="cancelButton"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                setModalOpen(false);
                setRazaoSocial("");
                setCnpj("");
                setNomefantasia("");
                setSelectedSetores([]);
              }}
            >
              Cancelar
            </button>
          </form>
        </Modal>
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <h1>Editar Empresa</h1>

          <form>
            <label htmlFor="razao_social">Razão Social</label>
            <input
              type="text"
              id="razao_social"
              name="razao_social"
              value={novaRazaoSocial}
              onChange={(e) => [setNovaRazaoSocial(e.target.value)]}
            />

            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={novoCnpj.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                "$1.$2.$3/$4-$5"
              )}
              maxLength="18"
              onChange={(e) => handleCnpjChange(e)}
            />

            <label htmlFor="nome_fantasia">Nome Fantasia</label>
            <input
              type="text"
              id="nome_fantasia"
              name="nome_fantasia"
              value={nome_fantasia}
              onChange={(e) => setNomefantasia(e.target.value)}
            />

            <label htmlFor="setores">Setores</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "30vw",
              }}
            >
              {setores.map((setor) => (
                <div
                  key={setor.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "15vw",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ width: "2vh", flexWrap: "wrap" }}
                    id={setor.id}
                    value={setor.id}
                    checked={selectedSetores.includes(setor.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSetores([...selectedSetores, setor.id]);
                      } else {
                        setSelectedSetores(
                          selectedSetores.filter((id) => id !== setor.id)
                        );
                      }
                    }}
                  />
                  <label htmlFor={setor.id}>{setor.descricao}</label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setEditModalOpen(false);
              }}
            >
              Salvar
            </button>
            <button
              type="submit"
              className="cancelButton"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                setEditModalOpen(false);
                setNovaRazaoSocial("");
                setNovoCnpj("");
                setNomefantasia("");
                setSelectedSetores([]);
                setIsEditing(false);
              }}
            >
              Cancelar
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default Empresas;
