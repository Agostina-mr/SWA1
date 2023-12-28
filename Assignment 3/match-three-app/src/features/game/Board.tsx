import React, { useEffect, useState } from 'react' 
import { useSelector, useDispatch } from 'react-redux' 
import { State } from '../../app/store' 
import { initializeBoard, moveTiles } from './gameSlice' 
import { delay } from '@reduxjs/toolkit/dist/utils'

export const BoardComponent = () => {
  const dispatch = useDispatch() 

  const board = useSelector((state: State) => state.gameState.board) 
  const wasValidMove = useSelector((state: State) => state.gameState.wasValidMove)
  const moves = useSelector((state: State) => state.gameState.moves)
  const score = useSelector((state: State) => state.gameState.score)

  const [clickedTiles, setClickedTiles] = useState<{ row: number,  col: number }[]>([]) 

  const handleTileClick = (row: number, col: number) => {
    const newClickedTiles = [...clickedTiles] 
    const tilePosition = { row, col } 

    if ( isTileClicked(tilePosition)) {
      const index = newClickedTiles.findIndex((pos) => pos.row === row && pos.col === col) 

      newClickedTiles.splice(index, 1) 

    } else {
      newClickedTiles.push(tilePosition) 

      if (newClickedTiles.length === 2) {
      setTimeout(() => {
        dispatch(moveTiles({ board, first: newClickedTiles[0], second: newClickedTiles[1] }))
        newClickedTiles.splice(0, 2)
      }
      , 200)
      }
    }

    setClickedTiles(newClickedTiles) 
  } 

  const isTileClicked = (position: { row: number,  col: number }) => {
    return clickedTiles.some((pos) => pos.row === position.row && pos.col === position.col) 

  } 

  return (
    <div>
      <table>
        <tbody>
          { board.tiles?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((tile, colIndex) => (
                <td
                  key={rowIndex + '' + colIndex}
                  className='Tile'
                  style={{
                    backgroundColor: isTileClicked({ row: rowIndex, col: colIndex })
                      ? 'yellow'
                      :  '#d0f1f7',
                  }}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                >
                  {tile}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {
            board.tiles ? null :  <button onClick={() => dispatch(initializeBoard())}>New Game</button>
      }
      {
        moves > 0 && !wasValidMove ? 
        ( <p className='Button' style={{backgroundColor:'red', textAlign:'center'}}>Opps, invalid move!</p> )
        : null
      }
      {
        board.tiles ? (
        <div className='Row'>
        <p style={{margin:15}}>Moves: {moves}</p>
        <p>Score: {score}</p>
        </div>
        ) : null
      }
    </div>
  ) 
} 
