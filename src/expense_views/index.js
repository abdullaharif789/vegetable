import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Filter,
  DateInput,
  ShowButton,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  DeleteButton,
} from "react-admin";
import ExpenseIcon from "@material-ui/icons/GraphicEq";
const ExpenseFilter = (props) => (
  <Filter {...props}>
    <DateInput source="date" variant="outlined" fullWidth alwaysOn />
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
        <TextField source="amount" />
        <TextField source="date" />
        <TextField source="created_at" label={"Created At"} />
      </Datagrid>
    </List>
  );
};

export default {
  list: ExpenseList,
  name: "expense_views",
  icon: ExpenseIcon,
};
