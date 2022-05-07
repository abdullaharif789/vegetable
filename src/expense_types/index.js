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
import ExpenseIcon from "@material-ui/icons/FontDownload";
import { app } from "../contants";

const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Expense" />
  </Toolbar>
);
export const ExpenseList = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="default_amount" label={"Default Amount"} />
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
        <TextInput
          source="name"
          fullWidth
          validate={[required()]}
          variant="outlined"
        />
        <NumberInput
          source="default_amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Default Amount(${app.currencySymbol})`}
          defaultValue={"0"}
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
    redirect("/expense_types");
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
        <TextInput
          source="name"
          fullWidth
          validate={[required()]}
          variant="outlined"
        />
        <NumberInput
          source="default_amount"
          variant="outlined"
          fullWidth
          validate={[required()]}
          label={`Default Amount(${app.currencySymbol})`}
          defaultValue={"0"}
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
  name: "expense_types",
  icon: ExpenseIcon,
  show: ShowGuesser,
};
