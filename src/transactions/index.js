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
  Pagination,
} from "react-admin";
import { cloneElement } from "react";
import IconEvent from "@material-ui/icons/Event";
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
    <DateInput source="date" label="Date" variant="outlined" alwaysOn />
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
      if (props.filterValues.party_id) {
        let tempData = Object.keys(data).map((item) => data[item]);
        let sum = 0;
        tempData.forEach((tran) => {
          if (tran.paid == "Unpaid") sum += parseFloat(tran.amount);
        });
        setRevenue(sum.toFixed(2));
      } else {
        await axios
          .get(app.api + "transactions?totalUnpaid=1")
          .then((result) => setRevenue(result.data.toFixed(2)));
      }
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
const ListResult = (props) => {
  return (
    <>
      {props.print && <Logo />}
      <Total {...props} />
      <Datagrid>
        <ReferenceField source="party_id" reference="parties">
          <TextField source="business_name" />
        </ReferenceField>
        <TextField source="paid" label="Amount Status" />
        <DateField source="date" />
        <NumberField source="amount" label={`Amount(${app.currencySymbol})`} />
        {!props.print && <ShowButton />}
        {!props.print && <EditButton />}
        {!props.print && <CustomDeleteWrapper />}
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

  return (
    <Edit
      {...props}
      onFailure={(data) => {
        notify(data.body, "error");
        refresh();
      }}
      undoable={false}
    >
      <SimpleForm toolbar={<UserEditToolbar />}>
        {/* <ReferenceInput
          source="party_id"
          reference="parties"
          fullWidth
          validate={[required()]}
          variant="outlined"
          // filterToQuery={(searchText) => ({ business_name: searchText })}
        >
          <AutocompleteInput optionText="business_name" />
        </ReferenceInput> */}
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
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
            <p style={classes.margin0}>
              Unite 5E Jaguar Point Manning Heath Road
            </p>
            <p style={classes.margin0}>Poole</p>
            <p style={classes.margin0}>Bh12 4NQ</p>
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
