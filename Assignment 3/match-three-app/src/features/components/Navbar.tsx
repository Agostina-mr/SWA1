import * as React from 'react';
import { useSelector } from 'react-redux'
import { State } from '../../app/store'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { logoutThunk } from '../../middleware/thunks'
import store from '../../app/store'
import { useNavigate } from 'react-router-dom'


export const Navbar = () => {
    const token = useSelector((state: State) => state.userState.user?.token)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const navigate = useNavigate()

    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const logoutAndClose = () => {
        setAnchorEl(null)
        store.dispatch(logoutThunk())
        navigate('/')
    }

    const openProfileAndClose = () => {
        setAnchorEl(null)
        navigate('profile')
    }

    const gamesAndClose = () => {
        setAnchorEl(null)
        navigate('/')
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <div style={{ flexGrow: 1 }}>
                </div>
                {token && (
                    <div style={{ flexDirection: 'row' }}>

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Typography variant="h6" component="div" sx={{ marginRight: 5 }}>
                                Account
                            </Typography>
                            <AccountCircle sx={{ marginRight: 10 }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={openProfileAndClose}>Profile</MenuItem>
                            <MenuItem onClick={logoutAndClose}>Logout</MenuItem>
                            <MenuItem onClick={gamesAndClose}>Games</MenuItem>

                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}