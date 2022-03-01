import * as React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ReferenceInput,
  Filter,
  DateInput,
  SelectInput,
  useNotify,
  useRefresh,
  useRedirect,
  Link,
  Loading,
  Title,
  AutocompleteInput,
  ArrayField,
  SimpleShowLayout,
  NumberField,
  Show,
  DateField,
} from "react-admin";
import EditIcon from "@material-ui/icons/Edit";
import ReceiptIcon from "@material-ui/icons/Receipt";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { app } from "../contants";
import { makeStyles } from "@material-ui/core/styles";
import { RemoveCircle, Money } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { Button as RAButton } from "react-admin";
import CustomDelete from "../components/CustomDelete";
import ReactToPrint from "react-to-print";
import Print from "@material-ui/icons/Print";

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
import axios from "axios";
import CustomPagination from "../components/PaginationCustom";
const OrderFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput
      source="party_id"
      reference="parties"
      alwaysOn
      variant="outlined"
      perPage={10000000}
      filterToQuery={(searchText) => ({ business_name: searchText })}
    >
      <AutocompleteInput optionText="business_name" />
    </ReferenceInput>
    <SelectInput
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
      alwaysOn
    />
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
  </Filter>
);

// const DeleteCustomButton = (props) => {
//   return <DeleteButton {...props} />;
// };
const PrintUpperTableFun = (props) => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setData(
      Object.keys(props.data)
        .map((item) => props.data[item])
        .sort((a, b) => a.sr - b.sr)
    );
  }, [props.data]);
  var total = 0;
  return (
    <Table size="small">
      <TableBody>
        {data.map((order) => {
          total = 0;
          return (
            <>
              <TableRow>
                <TableCell>
                  <div style={{ paddingLeft: 15 }}>
                    <strong>Sr# </strong>
                    {order.sr}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <RAButton
                    onClick={() => {
                      window.open(
                        `#/purchase_invoices/create/${order.id}`,
                        "_blank"
                      );
                    }}
                    key="button"
                    label="generate Invoice"
                  >
                    <ReceiptIcon />
                  </RAButton>
                  <RAButton
                    onClick={() => {
                      window.location = `#/purchase_orders/${order.id}`;
                    }}
                    key="button"
                    label="Edit"
                  >
                    <EditIcon />
                  </RAButton>
                  <CustomDelete
                    dispatchCrudDelete={false}
                    startUndoable={false}
                    resource={"purchase_orders"}
                    record={order}
                    undoable={false}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <div style={{ paddingLeft: 15 }}>
                    <strong>
                      Party Name :{" "}
                      <span style={{ color: "#f5881f" }}>
                        {order.party.business_name}
                      </span>
                    </strong>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <div style={{ paddingLeft: 15 }}>
                    <strong>Date : </strong>
                    {order.created_at}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <div style={{ paddingLeft: 15 }}>
                    <strong>Van : </strong>
                    {order.van}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>
                  <Table
                    size="small"
                    style={{
                      marginBottom: 20,
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name </TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell align="right">
                          Price({app.currencySymbol})
                        </TableCell>
                        <TableCell align="right">
                          Total({app.currencySymbol})
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.cart.map((cart) => {
                        total += parseFloat(cart.total);
                        return (
                          <TableRow>
                            <TableCell style={{ width: "40%" }}>
                              {cart.name}
                            </TableCell>
                            <TableCell style={{ width: "20%" }}>
                              {cart.type}
                            </TableCell>
                            <TableCell style={{ width: "5%" }}>
                              {cart.quantity}
                            </TableCell>
                            <TableCell align="right" style={{ width: "20%" }}>
                              {cart.price}
                            </TableCell>
                            <TableCell align="right" style={{ width: "20%" }}>
                              {cart.total}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell align="right" colSpan={4}>
                          <strong>Total({app.currencySymbol})</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{total.toFixed(2)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </Table>
  );
};
class PrintUpperTable extends React.Component {
  render() {
    return <PrintUpperTableFun {...this.props} />;
  }
}

const OrderListRows = (props) => {
  const [print, setPrint] = React.useState(false);
  var tableRef;
  return (
    <>
      {Object.keys(props.data).length > 0 && (
        <div
          style={{
            marginRight: 10,
          }}
        >
          <ReactToPrint
            onAfterPrint={() => setPrint(false)}
            trigger={() => {
              return (
                <div
                  style={{
                    float: "right",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Print fontSize="inherit" />}
                  >
                    Print
                  </Button>
                </div>
              );
            }}
            onBeforeGetContent={async () => {
              setPrint(true);
              await app.sleep(1);
            }}
            pageStyle={"padding:20px"}
            content={() => tableRef}
          />
          <PrintUpperTable
            ref={(el) => (tableRef = el)}
            print={print}
            {...props}
          />
        </div>
      )}
    </>
  );
};
export const OrderList = (props) => {
  return (
    <List
      pagination={<CustomPagination />}
      {...props}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <OrderListRows />
    </List>
  );
};
const getTotalCount = (data, typeIndex) => {
  return data.cart
    .filter((i) => i.type === app.boxTypes[typeIndex])
    .reduce((a, b) => a + parseFloat(b["quantity"]), 0);
};
const Cart = ({ data, submitOrder, setData, add }) => {
  if (data.cart.length === 0) return <p>There is no item in cart.</p>;
  const handleRemoveCartItem = (id) => {
    var newData = { ...data };
    newData.cart = newData.cart.filter((item) => item.id !== id);
    const total = newData.cart.reduce(
      (a, b) => a + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    newData.total = total;
    setData(newData);
  };
  var t1 = getTotalCount(data, 0);
  var t2 = getTotalCount(data, 1);
  var t3 = getTotalCount(data, 2);
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
          <TableCell align="right">Type</TableCell>
          <TableCell align="right">Quantity</TableCell>
          <TableCell align="right">Price({app.currencySymbol})</TableCell>
          <TableCell align="right">Total({app.currencySymbol})</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.cart.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => handleRemoveCartItem(item.id)}
                >
                  <RemoveCircle color="error" />
                </IconButton>
              </TableCell>
              <TableCell>
                <Link to={`/items/${item.item_id}/show`} target="_blank">
                  {item.name}
                </Link>
              </TableCell>

              <TableCell align="right">{item.type}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">
                {parseFloat(item.price).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <strong>
                  {parseFloat(item.price * parseFloat(item.quantity)).toFixed(
                    2
                  )}
                </strong>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell align="right" colSpan={5}>
            <strong>Total({app.currencySymbol})</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{parseFloat(data.total).toFixed(2)}</strong>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={6}>
            <strong>Total : </strong> <strong>{t1}</strong> {app.boxTypes[0]},{" "}
            <strong>{t2}</strong>, {app.boxTypes[1]}, <strong>{t3}</strong>{" "}
            {app.boxTypes[2]}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={7}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={submitOrder}
            >
              {add ? "Add" : "Update"} Purchase Order
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
const PurchaseOrdersCreate = (props) => {
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [data, setData] = React.useState({
    cart: [],
    total: 0,
  });
  const [parties, setParties] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [party, setParty] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [van, setVan] = React.useState(app.vans[0]);
  const [boxType, setBoxType] = React.useState(app.boxTypes[0]);
  const [item, setItem] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data: parties } = await dataProvider.getListSimple("parties");
      var tempItems = (
        await dataProvider.getListSimple("items", {
          available: true,
        })
      ).data.sort((a, b) => a.name - b.name);

      setItems(tempItems);
      setParties(parties);
      setItem(tempItems[0]);
      setParty(parties[0]);
      setLoading(false);
    };
    loadData();
  }, []);
  const addItemInCart = () => {
    if (quantity === "" || parseInt(quantity) <= 0) {
      if (boxType !== app.boxTypes[2]) {
        notify(`Sorry, please enter any valid integral quantity.`, "error");
        return;
      }
    }
    if (quantity === "" || parseFloat(quantity) % 0.5 !== 0) {
      if (boxType === app.boxTypes[2]) {
        notify(
          `Sorry, please enter any valid float quantity for Loose Items.`,
          "error"
        );
        return;
      }
    }
    if (typeof price == "undefined" || price === "") {
      notify(`Sorry, please enter any valid price.`, "error");
      return;
    }
    var newCart = data.cart;
    // if already in then increment with the new quantity
    var tempItemValidate = newCart.filter(
      (i) => i.item_id === item.id && i.type === boxType
    )[0];
    if (tempItemValidate) {
      tempItemValidate.quantity =
        parseFloat(tempItemValidate.quantity) + parseFloat(quantity);
      tempItemValidate.price = parseFloat(price);
    } else {
      const newId =
        newCart.length === 0 ? 1 : newCart[newCart.length - 1].id + 1;
      newCart.push({
        id: newId,
        item_id: item.id,
        name: item.name,
        type: boxType,
        quantity,
        price,
      });
    }
    const total = newCart.reduce(
      (a, b) => a + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    var temp = {
      party_id: party.id,
      cart: newCart,
      total,
    };
    setData(temp);
    // setQuantity("0.5");
    setPrice(0);
  };
  const submitOrder = async () => {
    var temp = { ...data };
    temp.cart = temp.cart.map((item) => ({
      ...item,
      total: parseFloat(
        parseFloat(item.price) * parseFloat(item.quantity)
      ).toFixed(2),
      price: parseFloat(item.price).toFixed(2),
    }));
    temp.van_id = van;
    console.log(temp);
    setLoading(true);
    const url = app.api + "purchase_orders";
    await axios
      .post(url, temp)
      .then(() => {
        setLoading(false);
        notify(`Purchase order added successfully.`);
        redirect("/purchase_orders");
        refresh();
      })
      .catch((error) => {
        notify(error, "error");
        setLoading(false);
      });
    setLoading(false);
  };

  if (loading) return <Loading loadingPrimary="" loadingSecondary="" />;
  else
    return (
      <Card className={classes.root}>
        <Title title="Add Purchase Order" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Party ( {"1. "}
                  <Link to="/parties/create" target="_blank">
                    Add Party
                  </Link>
                  {" - 2. "}
                  <span
                    style={{
                      color: app.colorOne,
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      const parties = (
                        await dataProvider.getListSimple("parties", {
                          available: true,
                        })
                      ).data;
                      setParties(parties);
                      notify("Parties refetch successfully.", "success");
                    }}
                  >
                    Refetch Parties
                  </span>
                  )
                </FormLabel>
                <Autocomplete
                  value={party}
                  onChange={(event, newValue) => {
                    if (newValue && newValue.id) setParty(newValue);
                  }}
                  options={parties}
                  getOptionLabel={(party) => party.business_name}
                  renderInput={(params) => (
                    <MaterialTextField
                      {...params}
                      label=""
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Van
                </FormLabel>
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
                  {app.vans.map((van, index) => (
                    <MenuItem key={index} value={van}>
                      {van}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.form} size="small">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      value={item}
                      onChange={(event, newValue) => {
                        if (newValue && newValue.id) {
                          setItem(newValue);
                          setQuantity(1);
                        }
                      }}
                      options={items}
                      getOptionLabel={(item) => `${item.name}`}
                      renderInput={(params) => (
                        <MaterialTextField
                          {...params}
                          label=""
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl className={classes.form} size="small">
                      <Select
                        required
                        value={boxType}
                        onChange={(event) => {
                          setBoxType(event.target.value);
                          setQuantity(1);
                        }}
                        displayEmpty
                        fullWidth
                        variant="outlined"
                        placeholder="Box Type"
                      >
                        {app.boxTypes.map((box, index) => (
                          <MenuItem key={index} value={box}>
                            {box}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                      onChange={(event) => {
                        if (boxType === app.boxTypes[2]) {
                          setQuantity(parseFloat(event.target.value));
                        } else {
                          setQuantity(parseInt(event.target.value));
                        }
                      }}
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
                      placeholder="120.85"
                      label="Unit Price"
                      variant="outlined"
                      size="small"
                      type="number"
                      required
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
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
              <Cart
                data={data}
                submitOrder={submitOrder}
                setData={setData}
                add
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
};
const PurchaseOrdersEdit = (props) => {
  const classes = useStyles();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [data, setData] = React.useState({
    cart: [],
  });
  const [parties, setParties] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [party, setParty] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [van, setVan] = React.useState(app.vans[0]);
  const [boxType, setBoxType] = React.useState(app.boxTypes[0]);
  const [item, setItem] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: parties } = await dataProvider.getListSimple("parties");
        var tempItems = (
          await dataProvider.getListSimple("items", {
            available: true,
          })
        ).data.sort((a, b) => a.name - b.name);

        const { data: singleOrder } = await dataProvider.getOne(
          "purchase_orders",
          {
            id: props.id,
          }
        );
        setData({
          cart: singleOrder.cart,
          total: singleOrder.total,
        });
        setVan(singleOrder.van);
        setItems(tempItems);
        setParties(parties);
        setItem(tempItems[0]);
        setParty(singleOrder.party);
      } catch (error) {
        notify(`Sorry, purchase order not found.`, "error");
        redirect("/purchase_orders");
        refresh();
      }

      setLoading(false);
    };
    loadData();
  }, []);
  const addItemInCart = () => {
    console.log(quantity, boxType);
    if (quantity === "" || parseInt(quantity) <= 0) {
      if (boxType !== app.boxTypes[2]) {
        notify(`Sorry, please enter any valid integral quantity.`, "error");
        return;
      }
    }
    if (quantity === "" || parseFloat(quantity) % 0.5 !== 0) {
      if (boxType === app.boxTypes[2]) {
        notify(
          `Sorry, please enter any valid float quantity for Loose Items.`,
          "error"
        );
        return;
      }
    }
    if (price === "" || typeof price == "undefined") {
      notify(`Sorry, please enter any valid price.`, "error");
      return;
    }
    var newCart = data.cart;
    // if already in then increment with the new quantity
    var tempItemValidate = newCart.filter(
      (i) => i.item_id === item.id && i.type === boxType
    )[0];
    if (tempItemValidate) {
      tempItemValidate.quantity =
        parseFloat(tempItemValidate.quantity) + parseFloat(quantity);
      tempItemValidate.price = parseFloat(price);
    } else {
      const newId =
        newCart.length === 0 ? 1 : newCart[newCart.length - 1].id + 1;
      newCart.push({
        id: newId,
        item_id: item.id,
        name: item.name,
        type: boxType,
        quantity,
        price,
      });
    }
    const total = newCart.reduce(
      (a, b) => a + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    var temp = {
      party_id: party.id,
      cart: newCart,
      total,
    };
    setData(temp);
  };
  const submitOrder = async () => {
    var temp = { ...data };
    temp.cart = temp.cart.map((item) => ({
      ...item,
      total: parseFloat(
        parseFloat(item.price) * parseFloat(item.quantity)
      ).toFixed(2),
      price: parseFloat(item.price).toFixed(2),
    }));
    const total = temp.cart.reduce(
      (a, b) => a + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    let updatedData = {
      van_id: van,
      cart: temp.cart,
      party_id: party.id,
      total,
    };
    try {
      await dataProvider.update("purchase_orders", {
        id: props.id,
        data: updatedData,
      });
      redirect("/purchase_orders");
      refresh();
    } catch (error) {
      notify(error.body, "error");
    }
  };

  if (loading) return <Loading loadingPrimary="" loadingSecondary="" />;
  else
    return (
      <Card className={classes.root}>
        <Title title="Update Purchase Order" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Party
                </FormLabel>
                <Autocomplete
                  value={party}
                  onChange={(event, newValue) => {
                    if (newValue && newValue.id) setParty(newValue);
                  }}
                  options={parties}
                  getOptionLabel={(party) => party.business_name}
                  renderInput={(params) => (
                    <MaterialTextField
                      {...params}
                      label=""
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Van
                </FormLabel>
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
                  {app.vans.map((van, index) => (
                    <MenuItem key={index} value={van}>
                      {van}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.form} size="small">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      value={item}
                      onChange={(event, newValue) => {
                        if (newValue && newValue.id) {
                          setItem(newValue);
                          setQuantity(1);
                        }
                      }}
                      options={items}
                      getOptionLabel={(item) => `${item.name}`}
                      renderInput={(params) => (
                        <MaterialTextField
                          {...params}
                          label=""
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl className={classes.form} size="small">
                      <Select
                        required
                        value={boxType}
                        onChange={(event) => {
                          setBoxType(event.target.value);
                          setQuantity(1);
                        }}
                        displayEmpty
                        fullWidth
                        variant="outlined"
                        placeholder="Box Type"
                      >
                        {app.boxTypes.map((box, index) => (
                          <MenuItem key={index} value={box}>
                            {box}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                      onChange={(event) => {
                        if (boxType === app.boxTypes[2]) {
                          setQuantity(parseFloat(event.target.value));
                        } else {
                          setQuantity(parseInt(event.target.value));
                        }
                      }}
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
                      placeholder="120.85"
                      label="Unit Price"
                      variant="outlined"
                      size="small"
                      type="number"
                      required
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
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
export const Purchase_orderShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="party_id" reference="parties">
        <TextField source="business_name" />
      </ReferenceField>
      <ArrayField source="cart">
        <Datagrid>
          <TextField source="id" />
          <ReferenceField source="item_id" reference="items">
            <TextField source="name" />
          </ReferenceField>
          <TextField source="name" />
          <TextField source="type" />
          <NumberField source="quantity" />
          <TextField source="price" />
          <TextField source="total" />
        </Datagrid>
      </ArrayField>
      <TextField source="van" />
      <TextField source="total" />
      <TextField source="created_at" />
    </SimpleShowLayout>
  </Show>
);

export default {
  list: OrderList,
  name: "purchase_orders",
  icon: Money,
  create: PurchaseOrdersCreate,
  edit: PurchaseOrdersEdit,
  options: { label: "Purchase Orders" },
  show: Purchase_orderShow,
};
