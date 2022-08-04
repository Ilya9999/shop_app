import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';

function Review({ checkoutToken }) {
    return (
        <>
            <Typography variant='h6' gutterBottom>Order summary</Typography>
            <List disablePadding>
                {checkoutToken.live.line_items.map((prod) => (
                    <ListItem style={{ padding: '10px 0' }} key={prod.name}>
                        <ListItemText primary={prod.name} secondary={`Quantity: ${prod.quantity}`} />
                        <Typography variant="body2">{prod.line_total.formatted_with_symbol}</Typography>
                    </ListItem>
                ))}
                <ListItem style={{ padding: '10px 0' }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                        {checkoutToken.live.subtotal.formatted_with_symbol}
                    </Typography>
                </ListItem>
            </List>
        </>
    )
}

export default Review