import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../app/store'
import List from '@mui/material/List'
import { Divider, ListItem } from '@mui/material'

export const HighScores = () => {
    const userId = useSelector((state: State) => state.userState.user?.id)
    const game = useSelector((state: State) => state.gameState.game)
    const previousGames = useSelector((state: State) => state.gameState.previousGames)

    return (
        game ? null : (

            <div style={{ justifyItems: 'center' }}>
                <Divider> High Scores </Divider>
                <List sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: 'background.paper'
                }}>
                    {
                        previousGames?.filter((game) => game.completed && game.user !== userId)
                            .sort((a, b) => b.score - a.score).slice(0, 10)
                            .map((game) => (
                                <ListItem key={game.id} style={{ justifyContent: 'space-around', marginBottom: 3 }}>
                                    <p> User: {game.user} </p>
                                    <p> Score: {game.score} </p>
                                </ListItem>
                            ))
                    }
                </List>
            </div>
        )
    )
}