import * as React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Icon from "@material-ui/core/Icon";
import logo from "./logo.png";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  Filter,
  DateInput,
  SelectInput,
  useNotify,
  useRefresh,
  useRedirect,
  NumberField,
  Create,
  SimpleForm,
  required,
  RadioButtonGroupInput,
  ReferenceInput,
  NumberInput,
  Edit,
  Toolbar,
  SaveButton,
  AutocompleteInput,
  Show,
  SimpleShowLayout,
  ShowButton,
  EditButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  Link,
} from "react-admin";
import { cloneElement } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import CardWithIcon from "./CardWithIcon";
import ReactToPrint from "react-to-print";
import { app } from "../contants";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import axios from "axios";
import CustomPagination from "../components/PaginationCustom";
import CustomDelete from "../components/CustomDelete";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { stringify } from "query-string";
const TransactionFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      alwaysOn
      choices={app.payments.map((item) => ({ id: item, name: item }))}
      source="paid"
      label="Amount Status"
      variant="outlined"
    />
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
    <NumberInput
      source="purchase_invoice_id"
      variant="outlined"
      fullWidth
      label={`Purchase Invoice#`}
      alwaysOn
    />
    <SelectInput
      choices={app.weeks.map((item) => ({ id: item.value, name: item.label }))}
      source="weeks"
      label="Week"
      variant="outlined"
    />
    <SelectInput
      choices={app.filterAmounts.map((item) => ({
        id: item.value,
        name: item.label,
      }))}
      source="amount"
      label="Amount"
      variant="outlined"
    />
    <DateInput source="date" label="Date" variant="outlined" />
  </Filter>
);
const Total = (props) => {
  const { data } = props;
  const styles = {
    flex: { display: "flex" },
    leftCol: { flex: 1 },
  };
  const [revenue, setRevenue] = React.useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadRevenue = async () => {
    try {
      // if (props.filterValues.party_id) {
      //   let tempData = Object.keys(data).map((item) => data[item]);
      //   console.log(tempData);
      //   let sum = 0;
      //   tempData.forEach((tran) => {
      //     if (tran.paid == "Unpaid") sum += parseFloat(tran.amount);
      //   });
      //   setRevenue(sum.toFixed(2));
      // } else {
      await axios
        .get(app.api + "transactions?totalUnpaid=1")
        .then((result) => setRevenue(result.data.toFixed(2)));
      // }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(loadRevenue, [data]);
  return (
    <div style={styles.flex}>
      <div style={styles.leftCol}>
        <div style={styles.flex}>
          <CardWithIcon
            to="/orders"
            icon={() => (
              <h1
                style={{
                  padding: 0,
                  margin: 0,
                  marginTop: -10,
                }}
              >
                {app.currencySymbol}
              </h1>
            )}
            title={`Total Unpaid Amount(${app.currencySymbol})`}
            subtitle={revenue.toString()}
          />
        </div>
      </div>
    </div>
  );
};
const CustomDeleteWrapper = ({ record }) => {
  return (
    <CustomDelete
      dispatchCrudDelete={false}
      startUndoable={false}
      resource={"transactions"}
      record={record}
      undoable={false}
    />
  );
};
const ShowPartyTransactions = (props) => {
  const [transactions, setTransactions] = React.useState([]);
  const getTransactions = async () => {
    var params = {
      filter: JSON.stringify(props.filterValues),
    };
    params = `party_transactions_id=${props.record.id}&${stringify(params)}`;
    const url = app.api + "transactions?" + params;
    await axios.get(url).then(({ data }) => setTransactions(data));
  };
  React.useEffect(getTransactions, []);
  var totalSum = 0;
  if (transactions.length == 0)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  else
    return (
      <>
        <Table
          size="small"
          style={{
            // backgroundColor: "#f2f2f2",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <TableHead>
            <TableRow>
              <Logo />
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell>Party Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount Status</TableCell>
              <TableCell align="right">Custom Purchase Invoice#</TableCell>
              <TableCell align="right">Amount({app.currencySymbol})</TableCell>
              {!props.allowPrint && (
                <TableCell align="center">Action</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction, index) => {
              totalSum += parseFloat(transaction.amount.replace(/,/g, ""));
              return (
                <TableRow key={index}>
                  <TableCell>{transaction.party_name}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.paid}</TableCell>
                  <TableCell align="right">
                    {transaction.custom_purchase_invoice_id ? (
                      <Link
                        to={`/purchase_invoices/${transaction.custom_purchase_invoice_id}/show`}
                        target="_blank"
                      >
                        {transaction.custom_purchase_invoice_id}
                      </Link>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <strong>{transaction.amount}</strong>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {!props.allowPrint && (
                        <EditButton
                          record={transaction}
                          basePath="transactions"
                        />
                      )}
                      {!props.allowPrint && (
                        <CustomDeleteWrapper record={transaction} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell align="right" colSpan={3}>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong
                  style={{
                    marginRight: 7,
                  }}
                >
                  {totalSum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
};
class TransactionCenter extends React.Component {
  render() {
    return <ShowPartyTransactions {...this.props} />;
  }
}
// class PartyTransactions extends React.PureComponent {
//   render() {
//     return (
//       <div>
//         <ReactToPrint
//           onAfterPrint={() => this.props.setPrint(false)}
//           trigger={() => {
//             return (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   marginTop: 10,
//                   marginBottom: 10,
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<Print fontSize="inherit" />}
//                 >
//                   Print
//                 </Button>
//                 <br />
//               </div>
//             );
//           }}
//           content={() => this.componentRef}
//           onBeforeGetContent={async () => {
//             this.props.setPrint(true);
//             await app.sleep(1);
//           }}
//           pageStyle={"padding:20px"}
//         />

//         <TransactionList
//           ref={(el) => (this.componentRef = el)}
//           {...this.props}
//           print={this.props.print}
//           setPrint={this.props.setPrint}
//         />
//       </div>
//     );
//   }
// }
const TransactionPrintWrapper = (props) => {
  var tableRef;
  const [allowPrint, setAllowPrint] = React.useState(false);
  return (
    <>
      <div
        style={{
          marginRight: 10,
        }}
      >
        <ReactToPrint
          onAfterPrint={() => setAllowPrint(false)}
          onBeforeGetContent={async () => {
            setAllowPrint(true);
            await app.sleep(1);
          }}
          trigger={() => {
            return (
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  float: "right",
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
          pageStyle={"padding:20px"}
          content={() => tableRef}
        />
        <TransactionCenter
          ref={(el) => (tableRef = el)}
          allowPrint={allowPrint}
          {...props}
        />
      </div>
    </>
  );
};
const ListResult = (props) => {
  return (
    <>
      {props.print && <Logo />}
      <Total {...props} />
      <Datagrid
        rowClick="expand"
        expand={<TransactionPrintWrapper {...props} />}
      >
        <TextField
          source="party_name"
          label={`Party`}
          style={{
            fontWeight: "bold",
          }}
        />
        <NumberField
          source="amount"
          label={`Total Amount(${app.currencySymbol})`}
          style={{ fontWeight: "bold" }}
        />
      </Datagrid>
    </>
  );
};
const ListActions = (props) => (
  <TopToolbar>
    {cloneElement(props.filters, { context: "button" })}
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);
class TransactionList extends React.PureComponent {
  render() {
    return (
      <List
        filters={this.props.print ? null : <TransactionFilter />}
        pagination={this.props.print ? null : <CustomPagination />}
        actions={this.props.print ? null : <ListActions />}
        {...this.props}
        bulkActionButtons={false}
        sort={{ field: "date", order: "desc" }}
      >
        <ListResult {...this.props} print={this.props.print} />
      </List>
    );
  }
}

const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Transaction" />
  </Toolbar>
);
const TransactionUpdate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  return (
    <Edit
      {...props}
      onSuccess={(data) => {
        redirect("/transactions");
        refresh();
      }}
      onFailure={(data) => {
        notify(data.body, "error");
        refresh();
      }}
      undoable={false}
    >
      <SimpleForm toolbar={<UserEditToolbar />}>
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
        />
        <NumberInput
          source="custom_purchase_invoice_id"
          variant="outlined"
          fullWidth
          label={`Custom Purchase Invoice#`}
        />
        <RadioButtonGroupInput
          source="paid"
          label="Amount Paid"
          choices={[
            { id: "Paid", name: "Paid" },
            { id: "Unpaid", name: "Unpaid" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};

const TransactionCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Item added successfully.`);
    redirect("/transactions");
    refresh();
  };
  return (
    <Create
      {...props}
      onSuccess={onSuccess}
      onFailure={(data) => {
        notify(data.body, "error");
      }}
    >
      <SimpleForm>
        <ReferenceInput
          source="party_id"
          reference="parties"
          fullWidth
          validate={[required()]}
          variant="outlined"
          perPage={10000000}
          filterToQuery={(searchText) => ({ business_name: searchText })}
        >
          <AutocompleteInput optionText="business_name" />
        </ReferenceInput>
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
        />
        <NumberInput
          source="custom_purchase_invoice_id"
          variant="outlined"
          fullWidth
          label={`Custom Purchase Invoice#`}
        />
        <DateInput
          source="date"
          variant="outlined"
          fullWidth
          validate={[required()]}
        />
        <RadioButtonGroupInput
          source="paid"
          label="Amount Paid"
          choices={[
            { id: "paid", name: "Paid" },
            { id: "unpaid", name: "Unpaid" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};
const Logo = () => {
  const classes = {
    root: { margin: "auto", border: "none" },
    spacer: { height: 20 },
    invoices: { margin: "10px 0" },
    margin0: { margin: 0 },
    margin1: { margin: 0, marginTop: 5 },
  };
  return (
    <Card style={classes.root} variant="outlined">
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <img
              src={logo}
              style={{
                width: 100,
              }}
            />
            <h4 style={classes.margin0}>Everyday Fresh Food Ltd.</h4>
            <p style={classes.margin0}>Unit 25 Chalwyn Industrial Estate</p>
            <p style={classes.margin0}>Parkstone, Poole</p>
            <p style={classes.margin0}>BH12 4PE</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
class TransactionShow extends React.PureComponent {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Logo />
        <Show {...this.props} actions={false}>
          <SimpleShowLayout>
            <ReferenceField source="party_id" reference="parties">
              <TextField source="business_name" />
            </ReferenceField>
            <TextField
              source="amount"
              label={`Amount(${app.currencySymbol})`}
            />
            <TextField source="paid" />
            <DateField source="date" />
          </SimpleShowLayout>
        </Show>
      </div>
    );
  }
}

export class PartySingleTransaction extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  float: "right",
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
        <TransactionShow
          ref={(el) => (this.componentRef = el)}
          {...this.props}
        />
      </div>
    );
  }
}

class PartyTransactions extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactToPrint
          onAfterPrint={() => this.props.setPrint(false)}
          trigger={() => {
            return (
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  float: "right",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Print fontSize="inherit" />}
                >
                  Print
                </Button>
                <br />
              </div>
            );
          }}
          content={() => this.componentRef}
          onBeforeGetContent={async () => {
            this.props.setPrint(true);
            await app.sleep(1);
          }}
          pageStyle={"padding:20px"}
        />

        <TransactionList
          ref={(el) => (this.componentRef = el)}
          {...this.props}
          print={this.props.print}
          setPrint={this.props.setPrint}
        />
      </div>
    );
  }
}
const PartyTransactionsWrapper = (props) => {
  const [print, setPrint] = React.useState(false);
  return <PartyTransactions {...props} print={print} setPrint={setPrint} />;
};
export default {
  list: PartyTransactionsWrapper,
  name: "transactions",
  icon: AttachMoneyIcon,
  create: TransactionCreate,
  options: { label: "Party Transactions" },
  edit: TransactionUpdate,
  show: PartySingleTransaction,
};
