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
  Show,
  Create,
  SimpleShowLayout,
  useNotify,
  useRefresh,
  useRedirect,
  required,
  ImageField,
} from "react-admin";
import PersonIcon from "@material-ui/icons/Person";
import { useMediaQuery } from "@material-ui/core";
const PartyTitle = ({ record }) => {
  return <span>Parties {record ? ` - ${record.name}` : ""}</span>;
};
const PartyList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  return (
    <List {...props}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `${record.email}`}
        />
      ) : (
        <Datagrid rowClick="show">
          <ImageField
            source="avatar"
            className="img-round img-50"
            title="Party image"
            label="Avatar"
          />
          <TextField source="name" />
          <EmailField source="email" />
          <TextField source="business_name" />
          <TextField source="address" />
          <TextField source="contact_number" />
        </Datagrid>
      )}
    </List>
  );
};
const PartyEdit = (props) => {
  return (
    <Edit {...props} title={<PartyTitle />}>
      <SimpleForm>
        <TextInput source="name" fullWidth />
        <TextInput source="email" fullWidth disabled />
      </SimpleForm>
    </Edit>
  );
};
const PartyShow = (props) => (
  <Show {...props} title={<PartyTitle />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="business_name" />
      <TextField source="address" />
      <TextField source="contact_number" />
    </SimpleShowLayout>
  </Show>
);
const PartyCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Party addedd successfully.`);
    redirect("/parties");
    refresh();
  };
  return (
    <Create {...props} onSuccess={onSuccess}>
      <SimpleForm>
        <TextInput
          source="name"
          fullWidth
          variant="outlined"
          validate={required()}
          value="Abdullah"
        />
        <TextInput
          source="email"
          fullWidth
          variant="outlined"
          validate={required()}
          type="email"
        />
        <TextInput
          label="Business Name"
          source="business_name"
          fullWidth
          variant="outlined"
          validate={required()}
        />
        <TextInput
          source="address"
          fullWidth
          variant="outlined"
          validate={required()}
          multiline
          rows={2}
        />
        <TextInput
          label="Contact Number"
          source="contact_number"
          fullWidth
          variant="outlined"
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
export default {
  list: PartyList,
  show: PartyShow,
  create: PartyCreate,
  // edit: PartyEdit,
  icon: PersonIcon,
  name: "parties",
};
