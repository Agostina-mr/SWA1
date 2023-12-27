import React, { useState } from 'react' 
import { useSelector, useDispatch } from 'react-redux' 
import { State } from '../../app/store' 
import { initializeBoard, moveTiles } from './gameSlice' 

export const BoardComponent = () => {
  const dispatch = useDispatch() 
  const board = useSelector((state: State) => state.gameState.board) 
  const wasValidMove = useSelector((state: State) => state.gameState.wasValidMove)
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
        // Dispatch the moveTiles action with the latest board state
        dispatch(moveTiles({ board, first: newClickedTiles[0], second: newClickedTiles[1] })) 
        newClickedTiles.splice(0, 2)
      }
    }

    setClickedTiles(newClickedTiles) 
  } 

  const isTileClicked = (position: { row: number,  col: number }) => {
    return clickedTiles.some((pos) => pos.row === position.row && pos.col === position.col) 
  } 

  return (
    <div>
      <button onClick={() => dispatch(initializeBoard())}>New Game</button>
      <table>
        <tbody>
          { board.tiles?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((tile, colIndex) => (
                <td
                  key={rowIndex + '' + colIndex}
                  style={{
                    height: 100,
                    width: 100,
                    fontSize: 50,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isTileClicked({ row: rowIndex, col: colIndex })
                      ? 'yellow'
                      : 'transparent',
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
        wasValidMove ? <div>Valid Move</div> : <div>Invalid Move!</div>
      }
    </div>
  ) 
} 
