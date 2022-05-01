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
  Show,
  ShowButton,
  NumberField,
  usePermissions,
} from "react-admin";
import { useReactToPrint } from "react-to-print";
import FormLabel from "@material-ui/core/FormLabel";
import Receipt from "@material-ui/icons/Receipt";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import MailIcon from "@material-ui/icons/Mail";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { app } from "../contants";
import InvoiceShow from "./InvoiceShow";
import { useNotify, useRefresh, useRedirect, Link, Title } from "react-admin";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomDelete from "../components/CustomDelete";
import CustomPagination from "../components/PaginationCustom";
import { TextField as MTextField, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@material-ui/core";
import dataProvider from "../providers/dataProvider";
import { TextField as MaterialTextField } from "@material-ui/core";
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
const InvoicePrintWrapper = (props) => {
  const componentRef = React.useRef();
  const notify = useNotify();
  const [email, setEmail] = React.useState(app.defaultEmail);
  const [loading, setLoding] = React.useState(false);
  const sendEmail = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    print: async (printIframe) => {
      // Validate Email
      // if (!app.validateEmail(email)) {
      if (!true) {
        notify("Please enter a valid email address", "warning");
        return;
      }
      setLoding(true);
      // Generate Invoice HTML and send Email
      const document = printIframe.contentDocument;
      if (document) {
        const toBeRemovedAndReplaced = [
          {
            removed:
              '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;display=swap">',
            replace: "",
          },
          {
            removed:
              '<div class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2">',
            replace:
              '<div style="width:100%" class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2">',
          },
          {
            removed: 'style="width: 100%;"',
            replace: 'style="width: 100%;margin-top:20px"',
          },
        ];
        var invoice_message =
          document.getElementsByTagName("html")[0].innerHTML;

        for (let i = 0; i < toBeRemovedAndReplaced.length; i++) {
          const element = toBeRemovedAndReplaced[i];
          invoice_message = invoice_message.replace(
            element.removed,
            element.replace
          );
        }

        const url = app.api + "send_email";
        await axios
          .post(url, {
            invoice_message,
            email,
          })
          .then((response) => {
            notify(response.data, "info");
          })
          .catch((response) => {
            notify(response.data, "error");
          });
      }
      setLoding(false);
    },
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <MTextField
        style={{
          margin: 10,
          width: "40%",
        }}
        variant="outlined"
        margin="dense"
        label="Enter Email"
        size="small"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Button
        style={{
          margin: 10,
          marginTop: 12,
        }}
        variant="outlined"
        color="primary"
        startIcon={<MailIcon fontSize="inherit" />}
        onClick={sendEmail}
      >
        Email Invoice{" "}
        {loading && <CircularProgress size={20} style={{ marginLeft: 6 }} />}
      </Button>
      <Button
        style={{
          marginTop: 4,
        }}
        variant="contained"
        color="primary"
        startIcon={<Print fontSize="inherit" />}
        onClick={handlePrint}
      >
        Print
      </Button>
      <InvoiceShow ref={componentRef} {...props} />
    </>
  );
};
const InvoiceShowParent = (props) => {
  return (
    <Show {...props}>
      <InvoicePrintWrapper {...props} />
    </Show>
  );
};
const CustomDeleteWrapper = ({ record }) => {
  return (
    <CustomDelete
      dispatchCrudDelete={false}
      startUndoable={false}
      resource={"purchase_invoices"}
      record={record}
      undoable={false}
    />
  );
};
const InvoiceList = (props) => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      pagination={<CustomPagination />}
      sort={{ field: "id", order: "desc" }}
      hasCreate={false}
    >
      <Datagrid>
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
        <NumberField
          sortable={false}
          source="total_without_discount"
          label={`Amount(${app.currencySymbol})`}
        />
        <NumberField
          sortable={false}
          source="discount_amount"
          label={`Discount(${app.currencySymbol})`}
        />
        <NumberField
          sortable={false}
          source="total"
          label={`Total Amount(${app.currencySymbol})`}
          style={{
            fontWeight: "bold",
            textAlign: "right",
          }}
        />
        <TextField source="van" sortable={false} />
        <TextField source="created_at" label="Date" />
        <TextField source="status" sortable={false} />
        <ShowButton />
        <CustomDeleteWrapper />
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
  const { permissions } = usePermissions();
  if (data.cart.length === 0) return <p>There is no item in cart.</p>;
  var t1 = getTotalCount(data, 0);
  var t2 = getTotalCount(data, 1);
  var t3 = getTotalCount(data, 2);
  const updatePrice = (value, key, index) => {
    var newData = { ...data };
    newData.cart[index][key] = value;
    const total = newData.cart.reduce(
      (a, b) =>
        parseFloat(a) + parseFloat(b["price"]) * parseFloat(b["quantity"]),
      0
    );
    newData.total = parseFloat(total);
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
                {permissions == app.superAdminRole ? (
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
                ) : (
                  item.cost_price
                )}
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
  const [discount, setDiscount] = React.useState(app.discounts[0]);
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
              total: parseFloat(out.total),
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
    temp.cart = temp.cart.map((item) => ({
      ...item,
      total: parseFloat(parseFloat(item.price) * parseFloat(item.quantity)),
      price: parseFloat(item.price).toFixed(2),
      cost_price: parseFloat(item.cost_price).toFixed(2),
    }));
    temp.total = temp.cart
      .map((item) => parseFloat(item.total))
      .reduce((partialSum, a) => partialSum + a, 0);
    temp.van_id = purchase_order.van;
    temp.party_id = purchase_order.party.id;
    temp.bank = value;
    temp.discount = discount.value;
    temp.total = Math.round(temp.total * 100) / 100;
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Discount
                </FormLabel>
                <Select
                  required
                  value={discount.value}
                  onChange={(event) => {
                    setDiscount({
                      value: event.target.value,
                      label: event.target.value * 100 + "%",
                    });
                  }}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                  placeholder="Discount"
                >
                  {app.discounts.map((discount, index) => (
                    <MenuItem key={index} value={discount.value}>
                      {discount.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.form} size="small">
                <FormLabel component="legend" className={classes.headings}>
                  Add Bank Information to Invioce
                </FormLabel>
                <RadioGroup value={value} onChange={handleChange} row>
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
const Test = () => {
  return <div>Test</div>;
};
export default {
  options: { label: "Purchase Invoices" },
  create: PurchaseOrdersCreate,
  list: InvoiceList,
  name: "purchase_invoices",
  icon: Receipt,
  show: InvoiceShowParent,
};
