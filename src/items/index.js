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
  ReferenceField,
  ReferenceInput,
  SelectInput,
  useNotify,
  useRefresh,
  useRedirect,
  DateField,
  Toolbar,
  SaveButton,
  EditButton,
  BooleanField,
  RadioButtonGroupInput,
  ImageInput,
} from "react-admin";
import KitchenIcon from "@material-ui/icons/Kitchen";
const ItemTitle = ({ record }) => {
  return <span>Item {record ? ` - ${record.name}` : ""}</span>;
};
const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Item" />
  </Toolbar>
);
export const ItemList = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <ImageField
          source="image"
          className="img-round img-50"
          title="Item image"
        />
        <TextField source="name" />
        <ReferenceField source="category_id" reference="categories">
          <TextField source="name" />
        </ReferenceField>
        <DateField source="added" showTime />
        <BooleanField source="tax_boolean" label="20% VAT" />
        <EditButton />
      </Datagrid>
    </List>
  );
};
export const ItemEdit = (props) => {
  const refresh = useRefresh();
  const notify = useNotify();
  return (
    <Edit
      {...props}
      undoable={false}
      title={<ItemTitle />}
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
        <ReferenceInput
          source="category_id"
          reference="categories"
          fullWidth
          validate={[required()]}
          variant="outlined"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <RadioButtonGroupInput
          required
          source="tax"
          label="20% VAT"
          choices={[
            { id: "yes", name: "Yes" },
            { id: "no", name: "No" },
          ]}
        />
        <ImageInput
          source="image"
          accept="image/png, image/jpg, image/jpeg"
          maxSize={5000000}
        >
          <ImageField source="image" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};
export const ItemCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Item added successfully.`);
    redirect("/items");
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
          placeholder="Potato"
          autoFocus
          variant="outlined"
          validate={[required()]}
        />
        <ReferenceInput
          source="category_id"
          reference="categories"
          fullWidth
          validate={[required()]}
          variant="outlined"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <RadioButtonGroupInput
          required
          source="tax"
          label="20% VAT"
          choices={[
            { id: "yes", name: "Yes" },
            { id: "no", name: "No" },
          ]}
        />
        <ImageInput
          source="image"
          accept="image/png, image/jpg, image/jpeg"
          maxSize={5000000}
        >
          <ImageField source="image" />
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
      <ReferenceField source="category_id" reference="categories">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="added" showTime />
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
