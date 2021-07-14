import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ArrayField,
  NumberField,
  DateField,
  Edit,
  SimpleForm,
  RadioButtonGroupInput,
  Filter,
  TextInput,
  DateInput,
  SelectInput,
} from "react-admin";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { app } from "../contants";
const OrderFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Order#"
      source="order_code"
      alwaysOn
      variant="outlined"
      fullWidth
    />
    <DateInput source="created_at" label="Date" variant="outlined" />
    <SelectInput
      choices={[
        {
          id: "Initiated",
          name: "Initiated",
        },
        {
          id: "Progress",
          name: "Progress",
        },
        {
          id: "Delivered",
          name: "Delivered",
        },
        {
          id: "Completed",
          name: "Completed",
        },
      ]}
      source="status"
      label="Status"
      variant="outlined"
    />
  </Filter>
);
export const OrderList = (props) => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <Datagrid rowClick="edit">
        <TextField
          source="order_code"
          label="Order#"
          style={{
            fontWeight: "bold",
          }}
        />
        <ReferenceField source="party_id" reference="parties">
          <TextField source="business_name" />
        </ReferenceField>
        <TextField source="total_items" label="Items" />
        <TextField source="total_quantity" label="Quantity" />
        <TextField
          source="total"
          label={`Total Amount(${app.currencySymbol})`}
        />
        <TextField source="status" />
        <DateField source="created_at" showTime />
      </Datagrid>
    </List>
  );
};
export const OrderEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextField
        source="order_code"
        label="Order#"
        style={{
          fontWeight: "bold",
        }}
      />
      <DateField source="created_at" showTime label="Date" />
      <ReferenceField source="party_id" reference="parties">
        <TextField source="business_name" />
      </ReferenceField>
      {/* <TextField
        source="status"
        style={{
          fontWeight: "bold",
        }}
      /> */}
      <RadioButtonGroupInput
        fullWidth
        variant="outlined"
        source="status"
        // required
        choices={[
          {
            id: "Initiated",
            name: "Initiated",
          },
          {
            id: "Progress",
            name: "Progress",
          },
          {
            id: "Delivered",
            name: "Delivered",
          },
          {
            id: "Completed",
            name: "Completed",
          },
        ]}
      />
      <ArrayField source="cart" fullWidth>
        <Datagrid>
          <ReferenceField source="item_id" reference="items">
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="quantity" />
          <NumberField source="price" label={`Price(${app.currencySymbol})`} />
          <NumberField source="total" label={`Total(${app.currencySymbol})`} />
        </Datagrid>
      </ArrayField>
      <TextField
        fullWidth
        source="total"
        style={{
          fontWeight: "bold",
          float: "right",
          paddingRight: 16,
        }}
      />
    </SimpleForm>
  </Edit>
);

export default {
  list: OrderList,
  name: "orders",
  icon: ShoppingCartIcon,
  edit: OrderEdit,
};
