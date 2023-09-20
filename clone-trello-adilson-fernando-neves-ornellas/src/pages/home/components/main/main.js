import React, { useState } from "react";
import "./main.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const colunasIniciais = [
  {
    id: "1",
    nome: "A fazer",
    itens: [
      { id: "1", conteudo: "Planejamento de projeto" },
      { id: "2", conteudo: "Reunião inicial" },
    ],
  },
  {
    id: "2",
    nome: "Em andamento",
    itens: [
    ],
  },
  {
    id: "3",
    nome: "Concluido",
    itens: [
    ],
  },
];

function Main() {
  const [colunas, setColunas] = useState(colunasIniciais);

  const onDragEnd = (result) => {
   
    const idColunaOrigem = colunas.findIndex(
      (coluna) => coluna.id === result.source.droppableId
    );
    const IdColunaDestino = colunas.findIndex(
      (coluna) => coluna.id === result.destination.droppableId
    );

    if (idColunaOrigem === IdColunaDestino) {
      // Reordenando dentro da mesma coluna
      const coluna = colunas[idColunaOrigem];
      const items = Array.from(coluna.itens);
      const [reordenandoArray] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordenandoArray);

      const novasColunas = [...colunas];
      novasColunas[idColunaOrigem].itens = items;
      setColunas(novasColunas);
    } else {
      // Movendo entre colunas
      const colunaOrigem = colunas[idColunaOrigem];
      const colunaDestino = colunas[IdColunaDestino];

      const ItensColunaOrigem = Array.from(colunaOrigem.itens);
      const itensColunaDestino = Array.from(colunaDestino.itens);

      const [ItemArrastado] = ItensColunaOrigem.splice(result.source.index, 1);
      itensColunaDestino.splice(result.destination.index, 0, ItemArrastado);

      const novasColunas = [...colunas];
      novasColunas[idColunaOrigem].itens = ItensColunaOrigem;
      novasColunas[IdColunaDestino].itens = itensColunaDestino;

      setColunas(novasColunas);
    }
  };

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
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
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
