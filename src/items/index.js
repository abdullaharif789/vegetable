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
  Toolbar,
  SaveButton,
  EditButton,
  BooleanField,
  RadioButtonGroupInput,
  ImageInput,
  Filter,
} from "react-admin";
import KitchenIcon from "@material-ui/icons/Kitchen";
import CustomPagination from "../components/PaginationCustom";
const ItemTitle = ({ record }) => {
  return <span>Item {record ? ` - ${record.name}` : ""}</span>;
};
const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Item" />
  </Toolbar>
);
const ItemFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search Item Name"
      source="name"
      alwaysOn
      variant="outlined"
      fullWidth
    />
  </Filter>
);
export const ItemList = (props) => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      // pagination={false}
      filters={<ItemFilter />}
      pagination={<CustomPagination />}
    >
      <Datagrid rowClick="show">
        <ImageField
          source="r_image"
          className="img-round img-50"
          title="Item image"
          label="Image"
        />
        <TextField source="name" />
        <ReferenceField source="category_id" reference="categories">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="added" />
        <BooleanField source="tax_boolean" label="20% VAT" />
        <BooleanField source="visible_boolean" label="Visible On App" />
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
          source="tax"
          label="20% VAT"
          choices={[
            { id: "yes", name: "Yes" },
            { id: "no", name: "No" },
          ]}
        />
        <RadioButtonGroupInput
          source="visible"
          label="Visible on App"
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
          source="tax"
          label="20% VAT"
          choices={[
            { id: "yes", name: "Yes" },
            { id: "no", name: "No" },
          ]}
        />
        <RadioButtonGroupInput
          source="visible"
          label="Visible on App"
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
      <TextField source="added" />
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
