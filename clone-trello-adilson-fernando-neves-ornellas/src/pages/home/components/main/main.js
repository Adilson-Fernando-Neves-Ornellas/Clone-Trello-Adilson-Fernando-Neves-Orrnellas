import React from "react";

import "./main.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const colunasIniciais = [
  {
    id: "1",
    nome: " Coluna 1",
    itens: [
      { id: "1", conteudo: "Conteudo 1" },
      { id: "2", conteudo: "Conteudo 2" },
      { id: "3", conteudo: "Conteudo 3" },
    ],
  },
  {
    id: "2",
    nome: " Coluna 2",
    itens: [
      { id: "4", conteudo: "Conteudo 4" },
      { id: "5", conteudo: "Conteudo 5" },
      { id: "6", conteudo: "Conteudo 6" },
    ],
  },
];

function Main() {
  const colunas = colunasIniciais;

  const onDragEng = (result) => {

    var colunaSelecionado = colunas[1].itens;

    // acha o item selecionado para arrastar
    for(var i = 0; i < colunaSelecionado.length; i++){
        if(colunaSelecionado[i].id === result.draggableId){
            var itemArrastado = colunaSelecionado[i];
        }
    }

    // exclui o item da coluna

    var colunaRefatorada = colunaSelecionado.filter((itens) => itens.id !== result.draggableId)

    // adiciona o item arrastado na coluna

    colunaRefatorada.splice(result.destination.index, 0, itemArrastado)
    
    // mudando no site 
    colunas[1].itens = colunaRefatorada 

  };

  return (
    <div className="conteiner">
        <h1 className="tituloconteiner">Meu quadro Trello</h1>
        <DragDropContext onDragEnd={onDragEng}>
            <div className="conteinerCards">
            {colunas.map((colunas) => (
                <Droppable key={colunas.id} droppableId={colunas.id}>
                {(provided) => (
                    <div ref={provided.innerRef} className="card">
                    <h1 className="tituloCard">{colunas.nome}</h1>
                    {colunas.itens.map((itens, index) => (
                        <Draggable
                        key={itens.id}
                        draggableId={itens.id}
                        index={index}
                        >
                        {(provided) => (
                            <div
                            ref={provided.innerRef}
                            style={{ ...provided.draggableProps.style }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="conteudocard"
                            >
                            <h1 className="tituloconteudo">{itens.conteudo}</h1>
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
