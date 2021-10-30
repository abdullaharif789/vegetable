import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
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
  RadioButtonGroupInput,
  Toolbar,
  SaveButton,
  EditButton,
  NumberInput,
  BooleanField,
  Filter,
} from "react-admin";
import Button from "@material-ui/core/Button";

import PersonIcon from "@material-ui/icons/Person";

import ReactToPrint from "react-to-print";
import Print from "@material-ui/icons/Print";
import CustomPagination from "../components/PaginationCustom";

const PartyTitle = ({ record }) => {
  return <span>Parties {record ? ` - ${record.name}` : ""}</span>;
};
const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Party" />
  </Toolbar>
);
const PartyFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Search Paty Name"
      source="name"
      alwaysOn
      variant="outlined"
      fullWidth
    />
  </Filter>
);
class PartyListPrint extends React.Component {
  render() {
    return (
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
        <BooleanField source="active_boolean" label="Active Party" />
        <EditButton label="" />
      </Datagrid>
    );
  }
}

const PartyList = (props) => {
  var tableRef;
  return (
    <>
      <div
        style={{
          marginRight: 10,
        }}
      >
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  float: "right",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Print fontSize="inherit" />}
                >
                  Print
                </Button>
              </div>
            );
          }}
          pageStyle={"padding:20px"}
          content={() => tableRef}
        />
        <PartyListPrint ref={(el) => (tableRef = el)} {...props} />
      </div>
    </>
  );
};
const PartyListParent = (props) => {
  return (
    <List
      filters={<PartyFilter />}
      {...props}
      bulkActionButtons={false}
      sort={{ field: "id", order: "desc" }}
      pagination={<CustomPagination />}
    >
      <PartyList {...props} />
    </List>
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
const PartyEdit = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const onSuccess = () => {
    notify(`Party updated successfully.`);
    redirect("/parties");
    refresh();
  };
  return (
    <Edit
      {...props}
      title={<PartyTitle />}
      onFailure={(data) => {
        notify(data.body, "error");
        refresh();
      }}
      undoable={false}
      // onSuccess={(data) => {
      //   console.log("Success", data);
      //   redirect("/parties");
      //   refresh();
      // }}
    >
      <SimpleForm toolbar={<UserEditToolbar />}>
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
        <RadioButtonGroupInput
          source="active"
          label="Active Party"
          choices={[
            { id: "yes", name: "Yes" },
            { id: "no", name: "No" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};
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
  list: PartyListParent,
  show: PartyShow,
  create: PartyCreate,
  edit: PartyEdit,
  icon: PersonIcon,
  name: "parties",
};
