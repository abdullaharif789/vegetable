import * as React from "react";
import { FC } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { app } from "../contants";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  cost: {
    marginRight: "1em",
    color: theme.palette.text.primary,
  },
}));

const PendingOrders = ({ orders = [], customers = {} }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={"New Orders"} />

      <List>
        {orders.length == 0 ? (
          <ListItem>
            <ListItemText primary="No new orders found." />
          </ListItem>
        ) : null}
        {orders.map((record) => {
          var secondaryText;
          if (customers[record.customer_id])
            secondaryText =
              record.cart.length == 1
                ? `by ${`${customers[record.party_id].name} - ${
                    customers[record.party_id].business_name
                  }`} , one item`
                : `by ${`${customers[record.party_id].name} - ${
                    customers[record.party_id].business_name
                  }`} , ${record.cart.length} items`;
          return (
            <ListItem
              key={record.id}
              button
              component={Link}
              to={`/orders/${record.id}`}
            >
              <ListItemAvatar>
                {customers[record.party_id] ? (
                  <Avatar src={`${customers[record.party_id].avatar}`} />
                ) : (
                  <Avatar />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={record.created_at}
                secondary={
                  customers[record.party_id]
                    ? record.cart.length == 1
                      ? `by ${`${customers[record.party_id].name} - ${
                          customers[record.party_id].business_name
                        }`} , one item`
                      : `by ${`${customers[record.party_id].name} - ${
                          customers[record.party_id].business_name
                        }`} , ${record.cart.length} items`
                    : ""
                }
              />
              <ListItemSecondaryAction>
                <span className={classes.cost}>
                  {app.currencySymbol} {record.total}
                </span>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};

export default PendingOrders;
