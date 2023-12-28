import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store, { State } from '../../app/store'
import { moveTiles } from './gameSlice'
import { createGameThunk, patchGameThunk } from '../../middleware/thunks'

export const BoardComponent = () => {
  const dispatch = useDispatch()
  const token = useSelector((state: State) => state.userState.user?.token)
  const board = useSelector((state: State) => state.gameState.board)
  const wasValidMove = useSelector((state: State) => state.gameState.wasValidMove)
  const moves = useSelector((state: State) => state.gameState.moves)
  const score = useSelector((state: State) => state.gameState.score)
  const completed = useSelector((state: State) => state.gameState.completed)

  const [clickedTiles, setClickedTiles] = useState<{ row: number, col: number }[]>([])

  const handleTileClick = (row: number, col: number) => {
    const newClickedTiles = [...clickedTiles]
    const tilePosition = { row, col }

    if (isTileClicked(tilePosition)) {
      const index = newClickedTiles.findIndex((pos) => pos.row === row && pos.col === col)

      newClickedTiles.splice(index, 1)

    } else {
      newClickedTiles.push(tilePosition)

      if (newClickedTiles.length === 2) {
        setTimeout(() => {
          dispatch(moveTiles({ board, first: newClickedTiles[0], second: newClickedTiles[1] }))
          newClickedTiles.splice(0, 2)
          store.dispatch(patchGameThunk())
        }, 200)
      }
    }

    setClickedTiles(newClickedTiles)
  }

  const isTileClicked = (position: { row: number, col: number }) => {
    return clickedTiles.some((pos) => pos.row === position.row && pos.col === position.col)

  }

  return (
    <div>
      <table>
        <tbody>
          {completed ?
            (
              <div>
                <p className='Button' style={{ backgroundColor: 'green', textAlign: 'center' }}>
                  Congratulations, you won!</p>
              </div>
            ) :
            board.tiles?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((tile, colIndex) => (
                  <td
                    key={rowIndex + '' + colIndex}
                    className='Tile'
                    style={{
                      backgroundColor: isTileClicked({ row: rowIndex, col: colIndex })
                        ? 'yellow'
                        : '#d0f1f7',
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
        board.tiles ? null : <button onClick={() => store.dispatch(createGameThunk(token))}>New Game</button>
      }
      {
        moves > 0 && !wasValidMove ?
          (<p className='Button' style={{ backgroundColor: 'red', textAlign: 'center' }}>Oops, invalid move!</p>)
          : null
      }
      {
        board.tiles ? (
          <div className='Row'>
            <p style={{ margin: 15 }}>Moves: {moves}</p>
            <p>Score: {score}</p>
          </div>
        ) : null
      }
    </div>
  )
} 
