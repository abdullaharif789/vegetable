import React, { Component } from "react";
import {
  Link,
  Loading,
  Title,
  useNotify,
  useRefresh,
  useRedirect,
} from "react-admin";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { app } from "../contants";
import { makeStyles } from "@material-ui/core/styles";
import { AddShoppingCart, PlusOne, RemoveCircle } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import dataProvider from "../providers/dataProvider";
import axios from "axios";
import {
  InputAdornment,
  TextField as MaterialTextField,
} from "@material-ui/core";
const classes = {
  root: { margin: "auto", border: "none" },
  spacer: { height: 20 },
  invoices: { margin: "10px 0" },
};
const getUpdatedTotal = (cart) => {
  let tempItems = [...cart];
  const totalSum = tempItems.reduce(
    (a, b) => a + b["price"] * b["quantity"],
    0
  );
  const totalTax = tempItems.reduce((a, b) => a + b["tax"] * b["quantity"], 0);
  let temp = {
    cart: tempItems.map((item) => ({
      price: parseFloat(item.price).toFixed(2),
      buying_price: item.buying_price,
      tax: parseFloat(item.tax),
      quantity: item.quantity,
      total: (parseFloat(item.price) * item.quantity).toFixed(2),
      item_id: item.item_id,
      inventory_id: item.inventory_id,
      title: item.title,
      inventory_id: item.inventory_id,
      max: item.max,
    })),
    total: parseFloat(totalSum) + parseFloat(totalTax),
    sub_total: parseFloat(totalSum),
    total_tax: parseFloat(totalTax),
  };
  return temp;
};
const Cart = ({ data, submitOrder, setData, del }) => {
  var totalWithOutTax = 0;
  if (data.cart.length == 0) return <p>There is no item in cart.</p>;
  const handleRemoveCartItem = (id) => {
    let newData = { ...data };
    newData.cart = newData.cart.filter((item) => item.inventory_id != id);
    newData = { ...newData, ...getUpdatedTotal(newData.cart) };
    setData(newData);
  };
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {del && (
            <TableCell
              style={{
                width: 10,
              }}
            ></TableCell>
          )}
          <TableCell>Item</TableCell>
          <TableCell align="right">Quantity</TableCell>
          <TableCell align="right">Unit Price({app.currencySymbol})</TableCell>
          <TableCell align="right">20% VAT({app.currencySymbol})</TableCell>
          <TableCell align="right">Total({app.currencySymbol})</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.cart.map((item, index) => {
          let total = parseFloat(item.price) * item.quantity;
          totalWithOutTax += total;
          total += item.quantity * item.tax;
          return (
            <TableRow key={index}>
              {del && (
                <TableCell>
                  <RemoveCircle
                    onClick={() => handleRemoveCartItem(item.inventory_id)}
                    color="error"
                  />
                </TableCell>
              )}
              <TableCell>
                <Link to={`/items/${item.item_id}/show`} target="_blank">
                  {item.title}
                </Link>
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{item.tax * item.quantity}</TableCell>
              <TableCell align="right">
                <strong>{total.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell align="right" colSpan={del ? 5 : 4}>
            <strong>{data.total_tax.toFixed(2)}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{data.sub_total.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={del ? 5 : 4}>
            <strong>Total({app.currencySymbol})</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{data.total.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={6}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={submitOrder}
            >
              Update Order
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
const useStyles = makeStyles({
  root: {
    marginTop: "1em",
  },

  headings: {
    margin: "10px 6px",
  },
  form: {
    width: "100%",
  },

  textInput: {
    marginTop: 8,
  },
  label: {
    color: "rgba(0,0,0,0.6)",
    fontSize: 12,
    margin: "5px 0px",
  },
});

const OrderEdit = (props) => {
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [data, setData] = React.useState({
    cart: [],
    total_tax: 0,
    sub_total: 0,
    total: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [order, setOrder] = React.useState();
  const [inventories, setInventories] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [sellPrice, setSellPrice] = React.useState(0);
  const [inventory, setInventory] = React.useState([]);
  const [status, setStatus] = React.useState("Completed");
  const [van, setVan] = React.useState(app.vans[0]);
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: singleOrder } = await dataProvider.getOne("orders", {
          id: props.id,
        });
        setOrder(singleOrder);
        setVan(singleOrder.van);
        setData({
          ...data,
          cart: singleOrder.cart,
          ...getUpdatedTotal(singleOrder.cart),
        });
        setStatus(singleOrder.status);
        var inventories = (
          await dataProvider.getListSimple("inventories", {
            available: true,
          })
        ).data;
        inventories = inventories
          .map((item) => ({
            id: item.id,
            title: item.title,
            price: parseFloat(item.selling_price).toFixed(2),
            buying_price: parseFloat(item.buying_price).toFixed(2),
            tax: item.tax,
            quantity: 0,
            item_id: item.item_id,
            max: item.remaining_unit,
            date: item.date.split(",")[0],
          }))
          .sort((a, b) => b.id - a.id);
        setInventories(inventories);
        setInventory(inventories[0].id);
        setSellPrice(inventories[0].price);
      } catch (error) {
        notify(`Sorry, order not found.`, "error");
        redirect("/orders");
        refresh();
      }

      setLoading(false);
    };
    loadData();
  }, []);
  const addItemInCart = () => {
    if (quantity == "" || parseFloat(quantity) <= 0) {
      notify(`Sorry, please select and valid quantity.`, "error");
      setQuantity("");
      return;
    }
    if (!Number.isInteger(quantity / 0.5)) {
      notify(`Sorry, please select quantity of multiple 0.5.`, "error");
      return;
    }
    let completeInventory = [
      ...inventories.filter((item) => item.id == inventory),
    ][0];
    var items = [...data.cart];
    var clash = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].inventory_id == inventory) {
        if (items[i].quantity + 1 > completeInventory.max) {
          notify(
            `Sorry, stock limit reached. Maximum stock is ${completeInventory.max} units.`,
            "error"
          );
          return;
        } else items[i].quantity += parseFloat(quantity);
        clash = true;
        completeInventory = items[i];
        break;
      }
    }
    if (!clash) completeInventory.quantity = parseFloat(quantity);
    completeInventory.inventory_id = inventory;
    if (completeInventory.max == 0) {
      notify(`Sorry, item is out of stock.`, "error");
      return;
    } else if (completeInventory.quantity > completeInventory.max) {
      notify(
        `Sorry, stock limit reached. Maximum stock is ${completeInventory.max} units.`,
        "error"
      );
      return;
    }
    if (!clash) items.push(completeInventory);
    /**
     * Change sell price accordingly to given price
     */
    let tempItems = [...items];
    try {
      tempItems[tempItems.findIndex((item) => item.id == inventory)].price =
        sellPrice;
    } catch (error) {}
    const totalSum = tempItems.reduce(
      (a, b) => a + b["price"] * b["quantity"],
      0
    );
    const totalTax = tempItems.reduce(
      (a, b) => a + b["tax"] * b["quantity"],
      0
    );
    let temp = {
      party_id: order.party_id,
      cart: tempItems.map((item) => ({
        price: parseFloat(item.price).toFixed(2),
        buying_price: item.buying_price,
        tax: parseFloat(item.tax),
        quantity: item.quantity,
        total: (parseFloat(item.price) * item.quantity).toFixed(2),
        item_id: item.item_id,
        inventory_id: item.inventory_id,
        title: item.title,
        inventory_id: item.inventory_id,
        max: item.max,
      })),
      total: parseFloat(totalSum) + parseFloat(totalTax),
      sub_total: parseFloat(totalSum),
      total_tax: parseFloat(totalTax),
    };
    setData(temp);
    setQuantity("1");
  };
  const submitOrder = async () => {
    let updatedData = {
      status,
      van,
      cart: data.cart,
      total: data.total,
      total_tax: data.total_tax,
    };
    await dataProvider.update("orders", {
      id: props.id,
      data: updatedData,
    });
    redirect("/orders");
    refresh();
  };
  if (loading) return <Loading loadingPrimary="" loadingSecondary="" />;
  else if (order)
    return (
      <>
        <Card className={classes.root}>
          <Title title="View Order" />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <label className={classes.label}>Order#</label>
                <br />
                <span> {order.order_code}</span>
              </Grid>
              <Grid item xs={12}>
                <label className={classes.label}>Order Date & Time : </label>
                <br />
                <span> {order.created_at}</span>
              </Grid>
              <Grid item xs={12}>
                <label className={classes.label}>Party</label>
                <br />
                <span>
                  <Link to={`/parties/${order.party_id}/show`} target="_blank">
                    {order.party_business_name}
                  </Link>
                </span>
              </Grid>
              <Grid item xs={12} md={6}>
                <label className={classes.label}>Status</label>
                <br />
                {order.status == "Progress" ||
                order.status == "Canceled" ||
                order.status == "Completed" ? (
                  <FormControl className={classes.form} size="small">
                    <Select
                      required
                      value={status}
                      onChange={(event) => {
                        setStatus(event.target.value);
                      }}
                      displayEmpty
                      fullWidth
                      variant="outlined"
                      placeholder="Party"
                    >
                      {app.status.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <span>{order.status}</span>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <label className={classes.label}>Van</label>
                <br />
                {order.status == "Progress" ||
                order.status == "Canceled" ||
                order.status == "Completed" ? (
                  <FormControl className={classes.form} size="small">
                    <Select
                      required
                      value={van}
                      onChange={(event) => {
                        setVan(event.target.value);
                      }}
                      displayEmpty
                      fullWidth
                      variant="outlined"
                      placeholder="Party"
                    >
                      {app.vans.map((i, j) => (
                        <MenuItem key={j} value={i}>
                          {i}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <span>{order.van}</span>
                )}
              </Grid>
              {(order.status == "Progress" ||
                order.status == "Canceled" ||
                order.status == "Completed") && (
                <Grid item xs={12}>
                  <FormControl className={classes.form} size="small">
                    <h4 className={classes.headings}>Add Item</h4>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Select
                          required
                          value={inventory}
                          onChange={(event) => {
                            setInventory(event.target.value);
                            setSellPrice(
                              inventories.filter(
                                (item) => item.id == event.target.value
                              )[0].price
                            );
                          }}
                          displayEmpty
                          fullWidth
                          variant="outlined"
                          placeholder="Party"
                        >
                          {inventories.map((inventory, index) => (
                            <MenuItem key={index} value={inventory.id}>
                              {`${inventory.title} - ${app.currencySymbol} ${inventory.price}, ${inventory.date}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <MaterialTextField
                          fullWidth
                          placeholder="150"
                          label="Quantity"
                          variant="outlined"
                          size="small"
                          type="number"
                          required
                          value={quantity}
                          onChange={(event) => setQuantity(event.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                =
                              </InputAdornment>
                            ),
                          }}
                          style={{
                            marginBottom: 20,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <MaterialTextField
                          fullWidth
                          placeholder="350"
                          label="Selling Price"
                          variant="outlined"
                          size="small"
                          type="number"
                          required
                          value={sellPrice}
                          onChange={(event) => setSellPrice(event.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {app.currencySymbol}
                              </InputAdornment>
                            ),
                          }}
                          style={{
                            marginBottom: 20,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Button
                          startIcon={<SaveIcon />}
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={addItemInCart}
                        >
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <h4 className={classes.headings}>Cart</h4>
                <Cart
                  data={data}
                  submitOrder={submitOrder}
                  setData={setData}
                  del={
                    order.status == "Progress" || order.status == "Canceled"
                      ? true
                      : false
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </>
    );
  else return "";
};

export default OrderEdit;
