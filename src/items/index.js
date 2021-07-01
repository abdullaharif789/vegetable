import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  SimpleList,
  EmailField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  ImageInput,
  ImageField,
  Show,
  SimpleShowLayout,
  required,
} from "react-admin";
import KitchenIcon from "@material-ui/icons/Kitchen";
const ItemTitle = ({ record }) => {
  return <span>Item {record ? ` - ${record.name}` : ""}</span>;
};
export const ItemList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="added" />
        <ImageField
          source="image"
          className="img-round img-50"
          title="Item image"
        />
      </Datagrid>
    </List>
  );
};
export const ItemEdit = (props) => {
  return (
    <Edit {...props} title={<ItemTitle />}>
      <SimpleForm>
        <TextInput source="name" fullWidth validate={[required()]} />
        <ImageField source="image" className="img-round" />
      </SimpleForm>
    </Edit>
  );
};
export const ItemCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput
          source="name"
          fullWidth
          placeholder="Potato"
          autoFocus
          variant="outlined"
        />
        <ImageInput source="image" accept="image/*">
          <ImageField source="image" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};
export const ItemShow = (props) => (
  <Show {...props} title={<ItemTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ImageField source="image" className="img-round" alt="item image" />
    </SimpleShowLayout>
  </Show>
);
export default {
  list: ItemList,
  create: ItemCreate,
  show: ItemShow,
  edit: ItemEdit,
  name: "items",
  icon: KitchenIcon,
};
