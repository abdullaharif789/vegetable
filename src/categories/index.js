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
  DeleteButton,
} from "react-admin";
import CategoryIcon from "@material-ui/icons/Category";
const CategoryTitle = ({ record }) => {
  return <span>Category {record ? ` - ${record.name}` : ""}</span>;
};
export const CategoryList = (props) => {
  return (
    <List {...props} bulkActionButtons={false}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
export const CategoryEdit = (props) => {
  const refresh = useRefresh();
  const notify = useNotify();
  return (
    <Edit
      {...props}
      title={<CategoryTitle />}
      onFailure={(data) => {
        notify(data.body, "error");
        refresh();
      }}
    >
      <SimpleForm>
        <TextInput
          source="name"
          fullWidth
          validate={[required()]}
          variant="outlined"
        />
      </SimpleForm>
    </Edit>
  );
};
export const CategoryCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Catgeory addedd successfully.`);
    redirect("/categories");
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
          placeholder="Fruits"
          autoFocus
          variant="outlined"
        />
      </SimpleForm>
    </Create>
  );
};
export const CategoryShow = (props) => (
  <Show {...props} title={<CategoryTitle />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ImageField source="image" className="img-round" alt="item image" />
    </SimpleShowLayout>
  </Show>
);
export default {
  create: CategoryCreate,
  list: CategoryList,
  edit: CategoryEdit,
  name: "categories",
  icon: CategoryIcon,
  show: ShowGuesser,
};
