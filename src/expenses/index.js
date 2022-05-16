import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  ImageField,
  Show,
  SimpleShowLayout,
  required,
  ShowGuesser,
  useNotify,
  useRefresh,
  useRedirect,
  Toolbar,
  SaveButton,
  EditButton,
  Filter,
  DateInput,
  NumberInput,
  DeleteButton,
  ShowButton,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  useDataProvider,
  Loading,
} from "react-admin";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpenseIcon from "@material-ui/icons/DonutSmall";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";
import {
  FormControl,
  FormHelperText,
  TextField as MTextField,
  Card,
} from "@material-ui/core";
import { app } from "../contants";
import axios from "axios";

const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Expense" />
  </Toolbar>
);
const ExpenseFilter = (props) => (
  <Filter {...props}>
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
    <ReferenceInput
      source="expense_type"
      reference="expense_types"
      alwaysOn
      variant="outlined"
      perPage={10000000}
      fullWidth
      filterToQuery={(searchText) => ({ name: searchText })}
    >
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
export const ExpenseList = (props) => {
  return (
    <List {...props} bulkActionButtons={false} filters={<ExpenseFilter />}>
      <Datagrid rowClick="show">
        <ReferenceField
          source="expense_type.id"
          reference="expense_types"
          label={"Expense Type"}
        >
          <TextField source="name" />
        </ReferenceField>
        <TextField source="amount" label={`Amount(${app.currencySymbol})`} />
        <TextField source="extra" label={"E.Name"} emptyText="--" />
        <TextField source="date" />
        <TextField source="created_at" label={"Created At"} />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
export const ExpenseEdit = (props) => {
  const refresh = useRefresh();
  const notify = useNotify();
  return (
    <Edit
      {...props}
      undoable={false}
      onFailure={(data) => {
        notify(data.body, "error");
        refresh();
      }}
    >
      <SimpleForm toolbar={<UserEditToolbar />}>
        <ReferenceInput
          source="expense_type_id"
          reference="expense_types"
          fullWidth
          validate={[required()]}
          variant="outlined"
          perPage={10000000}
          filterToQuery={(searchText) => ({ name: searchText })}
        >
          <AutocompleteInput optionText="name" />
        </ReferenceInput>
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
        />
        <TextInput
          source="extra"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Employee Name`}
        />
      </SimpleForm>
    </Edit>
  );
};
export const ExpenseCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const [expenseTypes, setExpenseTypes] = React.useState([]);
  const [listExpenseTypes, setListExpenseTypes] = React.useState([]);
  const [expenseType, setExpenseType] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
  const dataProvider = useDataProvider();
  const processExpenseType = (expenseType, index) => {
    return {
      ...expenseType,
      id: index,
      expense_type_id: expenseType.id,
      amount: expenseType.default_amount,
      extend: expenseType.name == "Wages" ? true : false,
      extra: null,
    };
  };
  const loadData = async () => {
    setLoading(true);
    const { data: expense_types } = await dataProvider.getListSimple(
      "expense_types"
    );
    var updated_expense_types = app
      .sort(expense_types)
      .map((i, index) => processExpenseType(i, index));
    setExpenseTypes(updated_expense_types);
    let temp_updated_expense_types = updated_expense_types.filter(
      (i) => i.name == "Wages"
    );
    setListExpenseTypes(temp_updated_expense_types);
    setExpenseType(temp_updated_expense_types[0]);
    setLoading(false);
  };
  const addExpense = async () => {
    if (!date) {
      notify("Please select date.", "error");
    }
    const tempExpenseTypes = [];
    expenseTypes.forEach((item) => {
      let amount = item.amount.toString();
      let amounts = amount.split("+").map((i) => parseFloat(i));
      amounts.forEach((am) => {
        if (am && am > 0) {
          tempExpenseTypes.push({
            date,
            amount: parseFloat(am),
            expense_type_id: item.expense_type_id,
            extra: item.extra,
          });
        }
      });
    });
    const url = `${app.api}expenses`;
    await axios
      .post(url, {
        expenses: tempExpenseTypes,
      })
      .then(({ data }) => {
        notify("Expenses added successfully.", "success");
        redirect("/expenses");
        refresh();
      })
      .catch((result) => {
        notify("Expenses not added.", "error");
      });
  };
  const changeAmount = (id, amount) => {
    const tempExpenseTypes = [...expenseTypes];
    tempExpenseTypes[id].amount = amount;
    setExpenseTypes(tempExpenseTypes);
  };
  const changeExtra = (id, extra) => {
    const tempExpenseTypes = [...expenseTypes];
    tempExpenseTypes[id].extra = extra;
    setExpenseTypes(tempExpenseTypes);
  };
  React.useEffect(loadData, []);
  if (loading) return <Loading loadingPrimary="" loadingSecondary="" />;
  else if (!expenseTypes.length)
    return (
      <Card
        variant="elevation"
        style={{
          padding: 15,
        }}
      >
        <div>No expense types found. Please add.</div>
      </Card>
    );
  else
    return (
      <Card
        variant="elevation"
        style={{
          padding: 15,
        }}
      >
        <FormControl fullWidth>
          <Grid
            container
            spacing={2}
            style={{
              paddingBottom: 8,
            }}
          >
            <Grid item xs={12} md={9}>
              <Autocomplete
                value={expenseType}
                onChange={(event, value) => {
                  if (value) {
                    setExpenseType(value);
                  }
                }}
                options={listExpenseTypes}
                getOptionLabel={(e_type) => `${e_type.name}`}
                renderInput={(params) => (
                  <MTextField
                    {...params}
                    label=""
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <FormHelperText>Add extra Expense Type</FormHelperText>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  var tempExpenseType = {
                    ...expenseType,
                    id: expenseTypes.length,
                  };
                  setExpenseTypes(
                    app
                      .sort([...expenseTypes, tempExpenseType])
                      .map((i, j) => ({
                        ...i,
                        id: j,
                      }))
                  );
                }}
              >
                Add Expense Type
              </Button>
            </Grid>
          </Grid>

          <div style={{ marginBottom: 10 }}>
            <MTextField
              value={date}
              variant="outlined"
              size="small"
              fullWidth
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
            <FormHelperText>
              Enter Date, enter any date to record expense.
            </FormHelperText>
          </div>
          <Grid
            container
            spacing={2}
            style={{
              padding: 8,
            }}
          >
            {expenseTypes.map((expense_type) => (
              <div style={{ marginBottom: 10 }} key={expense_type.id}>
                <Grid item xs={12} md={12}>
                  <MTextField
                    style={{ padding: 2 }}
                    label={`${expense_type.name}(${app.currencySymbol})`}
                    variant="outlined"
                    size="small"
                    value={expense_type.amount}
                    onChange={(e) => {
                      changeAmount(expense_type.id, e.target.value);
                    }}
                  />
                </Grid>
                {expense_type.extend && (
                  <MTextField
                    style={{ padding: 2 }}
                    label="Employee Name"
                    variant="outlined"
                    size="small"
                    value={expense_type.extra}
                    onChange={(e) => {
                      changeExtra(expense_type.id, e.target.value);
                    }}
                  />
                )}
              </div>
            ))}
          </Grid>
          <div>
            <Button
              style={{ marginTop: 10 }}
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={addExpense}
            >
              Add Expense
            </Button>
          </div>
        </FormControl>
      </Card>
    );
};
export const ExpenseShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ImageField source="image" className="img-round" alt="item image" />
    </SimpleShowLayout>
  </Show>
);
export default {
  create: ExpenseCreate,
  list: ExpenseList,
  edit: ExpenseEdit,
  name: "expenses",
  icon: ExpenseIcon,
  show: ShowGuesser,
};
