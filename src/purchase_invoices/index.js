import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateInput,
  Filter,
  Loading,
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import ReactToPrint from "react-to-print";
import Receipt from "@material-ui/icons/Receipt";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { app } from "../contants";
import InvoiceShow from "./InvoiceShow";
import { useNotify, useRefresh, useRedirect, Link, Title } from "react-admin";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import {
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
export class InvoicePrint extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
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
          content={() => this.componentRef}
        />
        <InvoiceShow ref={(el) => (this.componentRef = el)} {...this.props} />
      </div>
    );
  }
}
const InvoiceList = (props) => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
      hasCreate={false}
    >
      <Datagrid rowClick="expand" expand={<InvoicePrint />}>
        <TextField
          source="id"
          label="Invoice#"
          style={{
            fontWeight: "bold",
          }}
        />
        <ReferenceField
          source="party_id"
          reference="parties"
          label="Party"
          sortable={false}
        >
          <TextField source="business_name" />
        </ReferenceField>
        <TextField
          sortable={false}
          source="total"
          label={`Total Amount(${app.currencySymbol})`}
        />
        <TextField source="created_at" label="Date" />
        <TextField source="status" />
      </Datagrid>
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
  var t1 = getTotalCount(data, 0);
  var t2 = getTotalCount(data, 1);
  var t3 = getTotalCount(data, 2);
  const updatePrice = (value, key, index) => {
    var newData = { ...data };
    newData.cart[index][key] = value;
    const total = newData.cart.reduce(
      (a, b) => a + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    newData.total = total;
    setData(newData);
  };
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="right">Type</TableCell>
          <TableCell align="right">Quantity</TableCell>
          <TableCell align="center" style={{ width: "20%" }}>
            Cost Price({app.currencySymbol})
          </TableCell>
          <TableCell align="center" style={{ width: "20%" }}>
            Sell Price({app.currencySymbol})
          </TableCell>
          <TableCell align="right">Total({app.currencySymbol})</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.cart.map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <Link to={`/items/${item.item_id}/show`} target="_blank">
                  {item.name}
                </Link>
              </TableCell>

              <TableCell align="right">{item.type}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="center">
                <MaterialTextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={item.cost_price}
                  inputProps={{ style: { textAlign: "center" } }}
                  onChange={(event) => {
                    updatePrice(event.target.value, "cost_price", index);
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <MaterialTextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={item.price}
                  inputProps={{ style: { textAlign: "center" } }}
                  onChange={(event) => {
                    updatePrice(event.target.value, "price", index);
                  }}
                />
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
              {add ? "Add" : "Update"} Purchase Invoice
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
  const [loading, setLoading] = React.useState(false);
  const [purchase_order, setPurchase_order] = React.useState([]);
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const browserUrl = window.location.href.split("/");
      const purchase_order_id = browserUrl[browserUrl.length - 1];
      const url = `${app.api}revised_purchase_orders?purchase_order_id=${purchase_order_id}`;
      await axios
        .get(url)
        .then((result) => {
          const out = result.data[0];
          if (out) setPurchase_order(out);
          else setPurchase_order([]);
          if (out) {
            setData({
              ...data,
              cart: out.cart,
              total: out.total,
              purchase_order_id: out.id,
            });
          }
        })
        .catch(() => {
          setPurchase_order([]);
        });
      setLoading(false);
    };
    loadData();
  }, []);
  const submitOrder = async () => {
    var temp = { ...data };
    const zeroFound = temp.cart.filter(
      (item) => parseFloat(item.cost_price) == 0 || parseFloat(item.price) == 0
    );
    if (zeroFound.length != 0) {
      notify(`Please provide all cost and sell prices.`, "error");
      return;
    }
    temp.cart = temp.cart.map((item) => ({
      ...item,
      total: parseFloat(
        parseFloat(item.price) * parseFloat(item.quantity)
      ).toFixed(2),
      price: parseFloat(item.price).toFixed(2),
      cost_price: parseFloat(item.cost_price).toFixed(2),
    }));
    temp.van_id = purchase_order.van;
    temp.party_id = purchase_order.party.id;
    temp.bank = value;
    setLoading(true);
    const url = app.api + "purchase_invoices";
    await axios
      .post(url, temp)
      .then((result) => {
        setLoading(false);
        notify(`Purchase invoice added successfully.`);
        redirect("/purchase_invoices");
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
  else if (purchase_order.length == 0)
    return (
      <Card>
        <CardContent>Sorry, Invalid purchase order.</CardContent>
      </Card>
    );
  else
    return (
      <Card className={classes.root}>
        <Title title="Add Purchase Invoice" />
        <CardContent>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Party: </strong>
                  {purchase_order.party.business_name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Van: </strong>
                  {purchase_order.van}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Date: </strong>
                  {purchase_order.created_at}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid item xs={12}>
            <FormControl className={classes.form} size="small">
              <FormLabel component="legend" className={classes.headings}>
                Add Bank Information to Invioce
              </FormLabel>
              <RadioGroup value={value} onChange={handleChange}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid container spacing={2}>
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

export default {
  options: { label: "Purchase Invoices" },
  create: PurchaseOrdersCreate,
  list: InvoiceList,
  name: "purchase_invoices",
  icon: Receipt,
  show: InvoicePrint,
};
