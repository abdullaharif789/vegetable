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
  ReferenceField,
  SelectInput,
  ReferenceInput,
  required,
  useNotify,
  useRefresh,
  useRedirect,
  NumberInput,
} from "react-admin";
import { InputAdornment } from "@material-ui/core";
const InventoryTitle = ({ record }) => {
  //return <span>Inventory {record ? ` - ${record.name}` : ""}</span>;
  return <span>Inventory</span>;
};
const InventoryList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <ReferenceField source="item_id" reference="items">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="buying_price" label="Buying Price(£)" />
        <TextField source="selling_price" label="Selling Price(£)" />
        <TextField source="unit" label="Units" />
        <TextField source="date" />
      </Datagrid>
    </List>
  );
};
const InventoryEdit = (props) => {
  return (
    <Edit {...props} title={<InventoryTitle />}>
      <SimpleForm>
        <TextInput source="name" fullWidth />
        <ImageField source="image" className="img-round" />
      </SimpleForm>
    </Edit>
  );
};
const InventoryCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    alert("onSuccess");
    // notify(`Inventory Saved.`);
    // redirect("/products");
    // refresh();
  };
  return (
    <Create
      {...props}
      onSuccess={onSuccess}
      onFailure={() => {
        alert("onFailure");
      }}
    >
      <SimpleForm>
        <ReferenceInput
          source="item_id"
          reference="items"
          fullWidth
          validate={[required()]}
          variant="outlined"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput
          source="buying_price"
          fullWidth
          placeholder="100"
          validate={[required()]}
          label="Buying Price"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
        <NumberInput
          source="selling_price"
          fullWidth
          placeholder="150"
          validate={[required()]}
          label="Selling Price"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />
        <NumberInput
          source="unit"
          fullWidth
          placeholder="150"
          label="Units"
          variant="outlined"
          validate={[required()]}
        />
      </SimpleForm>
    </Create>
  );
};
const InventoryShow = (props) => (
  <Show {...props} title={<InventoryTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="item_id" reference="items">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="buying_price" label="Buying Price(£)" />
      <TextField source="selling_price" label="Selling Price(£)" />
      <TextField source="units" />
      <TextField source="date" />
    </SimpleShowLayout>
  </Show>
);
export default {
  list: InventoryList,
  create: InventoryCreate,
  show: InventoryShow,
  edit: InventoryEdit,
  options: {
    label: "Inventory",
  },
  name: "inventories",
};
