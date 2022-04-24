import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  ImageField,
  Show,
  SimpleShowLayout,
  required,
  ShowGuesser,
  useNotify,
  useRefresh,
  useRedirect,
  SelectInput,
  Toolbar,
  SaveButton,
  EditButton,
  Filter,
  DateInput,
  NumberInput,
  DeleteButton,
  ShowButton,
} from "react-admin";
import ExpenseIcon from "@material-ui/icons/DonutSmall";
import { app } from "../contants";

const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Expense" />
  </Toolbar>
);
const ExpenseFilter = (props) => (
  <Filter {...props}>
    <DateInput source="date" variant="outlined" fullWidth alwaysOn />
    <SelectInput
      choices={app.expenses.map((item) => ({ id: item, name: item }))}
      source="type"
      label="Expenese Type"
      variant="outlined"
      alwaysOn
    />
  </Filter>
);
export const ExpenseList = (props) => {
  return (
    <List {...props} bulkActionButtons={false} filters={<ExpenseFilter />}>
      <Datagrid rowClick="show">
        <TextField source="type" />
        <TextField source="amount" />
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
        <SelectInput
          validate={[required()]}
          fullWidth
          choices={app.expenses.map((item) => ({ id: item, name: item }))}
          source="type"
          label="Expense Type"
          variant="outlined"
        />
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
        />
      </SimpleForm>
    </Edit>
  );
};
export const ExpenseCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Expense addedd successfully.`);
    redirect("/expenses");
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
        <SelectInput
          validate={[required()]}
          fullWidth
          choices={app.expenses.map((item) => ({ id: item, name: item }))}
          source="type"
          label="Expense Type"
          variant="outlined"
        />
        <DateInput
          source="date"
          variant="outlined"
          fullWidth
          validate={[required()]}
        />
        <NumberInput
          source="amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Amount(${app.currencySymbol})`}
        />
      </SimpleForm>
    </Create>
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
