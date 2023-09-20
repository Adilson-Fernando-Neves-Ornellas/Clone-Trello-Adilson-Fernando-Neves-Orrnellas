import React, { useState ,useEffect } from "react";
import "./main.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import imgAddIten from "../../assets/imgAddIten.png"
import buttoneditar from '../../assets/buttoneditar.svg'

const colunasIniciais = [
  {
    id: "111",
    nome: "A fazer",
    itens: [
      { id: "11", conteudo: "Planejamento de projeto" },
      { id: "22", conteudo: "Reunião inicial" },
    ],
  },
  {
    id: "222",
    nome: "Em andamento",
    itens: [],
  },
  {
    id: "333",
    nome: "Concluído",
    itens: [],
  },
];

function Main() {
  localStorage.setItem('colunas', JSON.stringify(colunasIniciais));
  const dataLocalStorage = JSON.parse(localStorage.getItem('colunas') || '[]');
  const [colunas, setColunas] = useState(dataLocalStorage);

  useEffect(() => {
    localStorage.setItem('colunas', JSON.stringify(colunas));
  }, [colunas]);
  
  const [novoIten, setNovoIten] = useState("");
  const [novaColuna, setNovaColuna] = useState();
  const [idEditado, setIdEditado] = useState('');
  const [conteudoEditado, setConteudoEditado] = useState(''); 
  
  const onDragEnd = (result) => {
    const idColunaOrigem = result.source.droppableId;
    const idColunaDestino = result.destination.droppableId;

    if (idColunaOrigem === idColunaDestino) {
      const coluna = colunas.find((coluna) => coluna.id === idColunaOrigem);
      const items = Array.from(coluna.itens);
      const [reordenandoArray] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordenandoArray);

      const novasColunas = [...colunas];
      const colunaIndex = novasColunas.findIndex(
        (coluna) => coluna.id === idColunaOrigem
      );
      novasColunas[colunaIndex].itens = items;
      setColunas(novasColunas);
    } else {
      const colunaOrigem = colunas.find((coluna) => coluna.id === idColunaOrigem);
      const colunaDestino = colunas.find((coluna) => coluna.id === idColunaDestino);

      const itensColunaOrigem = Array.from(colunaOrigem.itens);
      const itensColunaDestino = Array.from(colunaDestino.itens);

      const [itemArrastado] = itensColunaOrigem.splice(result.source.index, 1);
      itensColunaDestino.splice(result.destination.index, 0, itemArrastado);

      const novasColunas = [...colunas];
      const colunaOrigemIndex = novasColunas.findIndex(
        (coluna) => coluna.id === idColunaOrigem
      );
      const colunaDestinoIndex = novasColunas.findIndex(
        (coluna) => coluna.id === idColunaDestino
      );

      novasColunas[colunaOrigemIndex].itens = itensColunaOrigem;
      novasColunas[colunaDestinoIndex].itens = itensColunaDestino;

      setColunas(novasColunas);
    }
  };

  function AdicionarNovoItemLista(event, colunaId) {
    event.preventDefault();

    const colunaAlvo = colunas.find((coluna) => coluna.id === colunaId);

    if (colunaAlvo) {
      const novoItem = {
        id: (colunaAlvo.itens.length + 1).toString(),
        conteudo: novoIten,
      };

      const novasColunas = [...colunas];
      const colunaAlvoIndex = novasColunas.findIndex(
        (coluna) => coluna.id === colunaId
      );
      novasColunas[colunaAlvoIndex].itens.push(novoItem);

      setColunas(novasColunas);

      setNovoIten("");
    }
  }
  function AdicionarNovaColuna(event) {
    event.preventDefault();

    if (novaColuna.trim() !== "") {
      const novaColunaId = colunas.length+1;

      const novaColunaObj = {
        id: novaColunaId.toString(),
        nome: novaColuna.toString(), 
        itens: [],
      };

      setColunas([...colunas, novaColunaObj]);

      setNovaColuna("");
    }
  }
  function editarItem(id) {
    let itemEditado
    for (const coluna of colunas) {
      for (const item of coluna.itens) {
        if (item.id === id) {
          itemEditado = item;
          break; 
        }
      }
      if (itemEditado) {
        break;
      }
    }
  
    if (itemEditado) {
      setConteudoEditado(itemEditado.conteudo);
      console.log(setConteudoEditado)
      setIdEditado(id);
    } else {
      setIdEditado('');
      setConteudoEditado('');
    }
  }
  function salvarEdicao(id) {
    setColunas((colunas) => {
      return colunas.map((coluna) => {
        const novosItens = coluna.itens.map((item) => {
          if (item.id === id) {
            return { ...item, conteudo: conteudoEditado }; 
          }
          return item;
        });
        return { ...coluna, itens: novosItens };
      });
    });
  
    setIdEditado("");
    setConteudoEditado("");
  }  

  return (
    <div className="conteiner">
      <h1 className="tituloconteiner">Meu quadro Trello</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="conteinerCards">
          {colunas.map((coluna) => (
            <Droppable key={coluna.id} droppableId={coluna.id}>
              {(provided) => (
                <div ref={provided.innerRef} className="card">
                  <h1 className="tituloCard">{coluna.nome}</h1>
                  {coluna.itens.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="conteudocard"
                        >
                          <h1 className="tituloconteudo">{item.conteudo}</h1>
                          {item.id === idEditado ? (
                          <form className='formEditar' onSubmit={() => salvarEdicao(item.id)}>
                            <input
                              className='imputedit'
                              type="text"
                              value={conteudoEditado}
                              onChange={event => setConteudoEditado(event.target.value)}
                              />
                            <button className='buttonsalvaredit' onClick={() => salvarEdicao(item.id)} type='submit'>Salvar</button>
                          </form>
                        ) : (
                          <>
                            <button className='buttoneditarisublist' onClick={() => editarItem(item.id)}>
                              <img className='imgbuttoneditar' src={buttoneditar} alt="Editar Item Sub Lista" />
                            </button>
                          </>
                        )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <form
                    onSubmit={(event) => AdicionarNovoItemLista(event, coluna.id)}
                    className="formItenColuna"
                  >
                    <input
                      className="imputItenColuna"
                      value={novoIten}
                      type="text"
                      placeholder="+ Adicionar um Cartão"
                      onChange={(event) => setNovoIten(event.target.value)}
                    />
                    <button className="buttonAdd" type="submit">
                    <img className='ImgAdd' src={imgAddIten} alt="Adicionar Item" />
                    </button>
                  </form>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <form
           onSubmit={(event) => AdicionarNovaColuna(event)}
          className="formColuna"
          >
          <input
            className="imputColuna"
            value={novaColuna}
            type="text"
            placeholder="+ Adicionar outra lista"
            onChange={(event) => setNovaColuna(event.target.value)}
          />
        </form>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Main;
