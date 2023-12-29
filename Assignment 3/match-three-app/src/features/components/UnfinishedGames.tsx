import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import store, { State } from '../../app/store'
import { getGamesThunk, getGameThunk } from '../../middleware/thunks'
import { ListItem, List } from '@mui/material'

export const UnfinishedGames = () => {
    const userId = useSelector((state: State) => state.userState.user?.id)
    const game = useSelector((state: State) => state.gameState.game)
    const previousGames = useSelector((state: State) => state.gameState.previousGames)
    const unfinished = previousGames?.filter((game) => !game.completed && game.user === userId)

    useEffect(() => {
        if (!previousGames && !game) {
            store.dispatch(getGamesThunk())
        }
    })

    return (
        game ? null : (
            <div className='Centre'>
                <div style={{}}>
                    <h1> Unfinished Games </h1>
                    <List sx={{
                        width: '100%',
                        maxWidth: 400,
                        bgcolor: 'background.paper'
                    }}>
                        {
                            unfinished?.length > 0 ? unfinished.map((game) => (
                                <ListItem key={game.id}
                                    sx={{ justifyContent: 'space-around', marginBottom: 3, backgroundColor: '#d0f1f7' }}
                                    onClick={() => store.dispatch(getGameThunk(game.id))}>
                                    <p> Score: {game.score} </p>
                                    <p> Moves: {game.moves} </p>
                                </ListItem>
                            )) : <p> No unfinished games </p>
                        }
                    </List>
                </div>
            </div>)
    )
}