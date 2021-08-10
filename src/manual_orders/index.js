import * as React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  Filter,
  TextInput,
  DateInput,
  SelectInput,
  useNotify,
  useRefresh,
  useRedirect,
  Link,
  Loading,
  Title,
} from "react-admin";
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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import FormLabel from "@material-ui/core/FormLabel";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import dataProvider from "../providers/dataProvider";
import {
  InputAdornment,
  TextField as MaterialTextField,
} from "@material-ui/core";
import moment from "moment";
import axios from "axios";
const OrderFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Order#"
      source="order_code"
      alwaysOn
      variant="outlined"
      fullWidth
    />
    <SelectInput
      alwaysOn
      choices={[
        {
          id: "Progress",
          name: "Progress",
        },

        {
          id: "Completed",
          name: "Completed",
        },
      ]}
      source="status"
      label="Status"
      variant="outlined"
    />
    <DateInput source="created_at" label="Date" variant="outlined" alwaysOn />
  </Filter>
);

export const OrderList = (props) => {
  return (
    <List
      pagination={false}
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <Datagrid rowClick={(id) => `/orders/${id}`}>
        <TextField
          source="order_code"
          label="Order#"
          style={{
            fontWeight: "bold",
          }}
        />
        <ReferenceField source="party_id" reference="parties">
          <TextField source="business_name" />
        </ReferenceField>
        <TextField source="total_items" label="Items" sortable={false} />
        <TextField source="total_quantity" label="Quantity" sortable={false} />
        <TextField
          source="total"
          label={`Total Amount(${app.currencySymbol})`}
        />
        <TextField source="status" />
        <TextField source="order_from" label="Order From" />
        <TextField source="created_at" label="Date" />
      </Datagrid>
    </List>
  );
};

const Cart = ({ data, submitOrder, setData }) => {
  var totalWithOutTax = 0;
  if (data.cart.length == 0) return <p>There is no item in cart.</p>;
  const handleRemoveCartItem = (id) => {
    let newData = { ...data };
    newData.cart = newData.cart.filter((item) => item.inventory_id != id);
    setData(newData);
  };
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              width: 10,
            }}
          ></TableCell>
          <TableCell>Item</TableCell>
          <TableCell align="right">Quantity</TableCell>
          <TableCell align="right">Unit Price({app.currencySymbol})</TableCell>
          <TableCell align="right">20% VAT({app.currencySymbol})</TableCell>
          <TableCell align="right">Total({app.currencySymbol})</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.cart.map((item, index) => {
          console.log(item);
          let total = parseFloat(item.price) * item.quantity;
          totalWithOutTax += total;
          total += item.quantity * item.tax;
          return (
            <TableRow key={index}>
              <TableCell>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => handleRemoveCartItem(item.inventory_id)}
                >
                  <RemoveCircle color="error" />
                </IconButton>
              </TableCell>
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
          <TableCell></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            <strong>{data.total_tax.toFixed(2)}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{data.sub_total.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={5}>
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
              Add Order
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
});
export const ItemCreate = (props) => {
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
  const [parties, setParties] = React.useState([]);
  const [inventories, setInventories] = React.useState([]);
  const [party, setParty] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [sellPrice, setSellPrice] = React.useState(0);
  const [inventory, setInventory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: parties } = await dataProvider.getListSimple("parties");
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
      setParties(parties);
      setInventory(inventories[0].id);
      setSellPrice(inventories[0].price);
      setParty(parties[0].id);
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
      party_id: party,
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
    let temp = { ...data };
    temp.cart = temp.cart.map((item) => ({
      ...item,
      tax: (item.tax * item.quantity).toFixed(2),
    }));
    temp.manual = 1;
    temp.bank = value;
    setLoading(true);
    const url = app.api + "orders";
    await axios
      .post(url, temp)
      .then(() => {
        setLoading(false);
        notify(`Manual order added successfully.`);
        redirect("/manual_orders");
        refresh();
      })
      .catch((error) => {
        notify(error, "error");
        setLoading(false);
      });
    setLoading(false);
  };
  const [value, setValue] = React.useState("No");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  if (loading) return <Loading loadingPrimary="" loadingSecondary="" />;
  else
    return (
      <Card className={classes.root}>
        <Title title="Add Manual Order" />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl className={classes.form} size="small">
                <h4 className={classes.headings}>Party</h4>
                <FormLabel component="legend" className={classes.headings}>
                  Party
                </FormLabel>
                <Select
                  required
                  value={party}
                  onChange={(event) => {
                    setParty(event.target.value);
                  }}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                  placeholder="Party"
                >
                  {parties.map((party, index) => (
                    <MenuItem key={index} value={party.id}>
                      {party.business_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Add Bank Information to Invioce
                </FormLabel>
                <RadioGroup value={value} onChange={handleChange}>
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Add Item
                </FormLabel>
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
                          <InputAdornment position="start">=</InputAdornment>
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
            <Grid item xs={12}>
              <FormLabel component="legend" className={classes.headings}>
                Cart
              </FormLabel>
              <Cart data={data} submitOrder={submitOrder} setData={setData} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
};
export default {
  list: OrderList,
  name: "manual_orders",
  icon: AddShoppingCart,
  create: ItemCreate,
  options: { label: "Manual Orders" },
};
