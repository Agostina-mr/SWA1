import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import store, { State } from '../../app/store'
import { Generator, Board} from '../../models/board'
import { initializeBoard } from './gameSlice'

export const BoardComponent = () => {
    store.dispatch(initializeBoard())

    const tiles = useSelector((state : State) => state.gameState.board.tiles)

    return (
      <table>
        <tbody>
          { tiles.map((row, x) =>
              <tr key={x} >{ row.map((tile, y) => {
                if (tile)
                  return <td style={{height: 100, width: 100, fontSize:50}} key = {x + '' + y} > {tile} </td>
                else
                    return <td key = {x + '' + y}> </td>
              })
              }</tr>
          )}
        </tbody>
      </table>
    )
  }

