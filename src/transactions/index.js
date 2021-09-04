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
} from "react-admin";

import { app } from "../contants";

import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const TransactionFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      alwaysOn
      choices={app.payments.map((item) => ({ id: item, name: item }))}
      source="paid"
      label="Amount"
      variant="outlined"
    />
    <ReferenceInput
      source="party_id"
      reference="parties"
      fullWidth
      alwaysOn
      variant="outlined"
      perPage={10000000}
    >
      <SelectInput optionText="business_name" />
    </ReferenceInput>
    <DateInput source="date" label="Date" variant="outlined" alwaysOn />
  </Filter>
);

export const TransactionList = (props) => {
  return (
    <List
      filters={<TransactionFilter />}
      {...props}
      bulkActionButtons={false}
      sort={{ field: "id", order: "desc" }}
    >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ReferenceField source="party_id" reference="parties">
          <TextField source="business_name" />
        </ReferenceField>
        <NumberField source="amount" label={`Amount(${app.currencySymbol})`} />
        <TextField source="paid" label="Amount Paid" />
        <DateField source="date" />
      </Datagrid>
    </List>
  );
};
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
        <ReferenceInput
          source="party_id"
          reference="parties"
          fullWidth
          validate={[required()]}
          variant="outlined"
        >
          <SelectInput optionText="business_name" />
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
        >
          <SelectInput optionText="business_name" />
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
export default {
  list: TransactionList,
  name: "transactions",
  icon: AttachMoneyIcon,
  create: TransactionCreate,
  options: { label: "Party Transactions" },
  edit: TransactionUpdate,
};
