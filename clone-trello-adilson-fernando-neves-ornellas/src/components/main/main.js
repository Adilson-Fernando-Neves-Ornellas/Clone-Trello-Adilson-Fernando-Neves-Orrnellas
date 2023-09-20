import React, { useState } from "react";
import "./main.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import imgAddIten from "../../assets/imgAddIten.png"

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
  const [colunas, setColunas] = useState(colunasIniciais);
  const [novoIten, setNovoIten] = useState("");

  const onDragEnd = (result) => {
    const idColunaOrigem = result.source.droppableId;
    const idColunaDestino = result.destination.droppableId;

    if (idColunaOrigem === idColunaDestino) {
      // Reordenando dentro da mesma coluna
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
      // Movendo entre colunas
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

      // Limpe o valor do input após adicionar o item
      setNovoIten("");
    }
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <form
                    onSubmit={(event) => AdicionarNovoItemLista(event, coluna.id)}
                    className="formColuna"
                  >
                    <input
                      className="imputColuna"
                      value={novoIten}
                      type="text"
                      placeholder="+ Adicionar um Cartão"
                      onChange={(event) => setNovoIten(event.target.value)}
                    />
                    <button className="buttonAddItenColuna" type="submit">
                    <img className='ImgAddItenColuna' src={imgAddIten} alt="Adicionar Item" />
                    </button>
                  </form>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Main;
