import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'
import useStyles from './styles'

function Navbar({ totalItems }) {
    const classes = useStyles()
    const location = useLocation()
    return (
        <div>
            <AppBar position='fixed' className={classes.appBar} color='inherit'>
                <Toolbar>
                    <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
                        <img src={logo} alt="Shop-app" height="70px" className={classes.image} />
                    </Typography>
                    <div className={classes.grow} />

                    {/* cart icon will appear only if we are on products page, if we go to the cart cart icon will disapear */}
                    {location.pathname === '/' && (
                        <div className={classes.button}>
                            {/* This way of linking is possible with material UI */}
                            <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                                <Badge badgeContent={totalItems} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div> 
                    )}
                    
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar