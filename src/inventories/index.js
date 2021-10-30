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
  RadioButtonGroupInput,
  Filter,
  useDataProvider,
  EditButton,
  DateField,
  DateInput,
  BooleanField,
  Toolbar,
  SaveButton,
  AutocompleteInput,
} from "react-admin";
import {
  InputAdornment,
  TextField as MaterialTextField,
} from "@material-ui/core";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import { app } from "../contants";
import { ListAlt } from "@material-ui/icons";
import CustomPagination from "../components/PaginationCustom";
const InventoryTitle = ({ record }) => {
  //return <span>Inventory {record ? ` - ${record.name}` : ""}</span>;
  return <span>Inventory</span>;
};
const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Inventory" />
  </Toolbar>
);
const InventoryFilter = (props) => (
  <Filter {...props}>
    <DateInput
      source="created_at"
      label="Select Date"
      variant="outlined"
      alwaysOn
    />
    <ReferenceInput
      source="item_id"
      reference="items"
      alwaysOn
      variant="outlined"
      perPage={10000000}
      filterToQuery={(searchText) => ({ name: searchText })}
    >
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
const InventoryList = (props) => {
  return (
    <List
      {...props}
      filters={<InventoryFilter />}
      bulkActionButtons={false}
      sort={{ field: "id", order: "desc" }}
      pagination={<CustomPagination />}
    >
      <Datagrid rowClick="edit">
        <ReferenceField source="item_id" reference="items">
          <TextField source="name" />
        </ReferenceField>
        <TextField
          source="buying_price"
          label={`Buying Price(${app.currencySymbol})`}
        />
        <TextField
          source="selling_price"
          label={`Selling Price(${app.currencySymbol})`}
        />
        <TextField source="unit" label="Total Units" />
        <TextField source="remaining_unit" label="Remaining Units" />
        <BooleanField source="tax_available" label="20% VAT" sortable={false} />
        <BooleanField source="active" label="Price on App" sortable={false} />
        <TextField source="date" label="Added" />
      </Datagrid>
    </List>
  );
};

const InventoryEdit = (props) => {
  const [choices, setChoices] = React.useState([]);
  const [newIndex, setNewIndex] = React.useState(0);
  const dataProvider = useDataProvider();

  const loadSellingPrice = (item_id) => {
    dataProvider
      .getListSimple("inventories", { item_id })
      .then(({ data }) => {
        const newChoices = data.map((item, index) => ({
          id: parseFloat(item.selling_price),
          name: `€ ${item.selling_price} - ${item.date}`,
          value: parseFloat(item.selling_price),
        }));
        setChoices(newChoices);
        setNewIndex(newChoices.length);
      })
      .catch((error) => {});
  };
  const addSellingPrice = (newSellingPrice) => {
    var temp = [...choices];
    temp[newIndex] = {
      id: newSellingPrice,
      name: `€ ${newSellingPrice ? newSellingPrice : 0} - Today`,
      value: newSellingPrice,
    };
    setChoices(temp);
  };
  React.useEffect(() => {
    dataProvider
      .getOne("inventories", { id: props.id })
      .then(({ data }) => {
        loadSellingPrice(data.item_id);
      })
      .catch((error) => {});
  }, []);
  return (
    <Edit {...props} undoable={false}>
      <SimpleForm toolbar={<UserEditToolbar />}>
        <ReferenceInput
          source="item_id"
          reference="items"
          fullWidth
          validate={[required()]}
          variant="outlined"
          onChange={(event) => loadSellingPrice(event.target.value)}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
        <NumberInput
          source="buying_price"
          InputProps={{
            inputProps: {
              max: 100,
              min: 10,
            },
          }}
          fullWidth
          placeholder="100"
          validate={[required()]}
          label="Buying Price"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {app.currencySymbol}
              </InputAdornment>
            ),
          }}
        />
        <MaterialTextField
          fullWidth
          placeholder="150"
          label="Selling Price"
          variant="outlined"
          size="small"
          type="number"
          required
          onChange={(event) => addSellingPrice(parseFloat(event.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {app.currencySymbol}
              </InputAdornment>
            ),
          }}
          style={{
            marginBottom: 20,
          }}
        />
        {choices.length > 0 && (
          <RadioButtonGroupInput
            label="Today's Selling Price"
            source="selling_price"
            choices={choices}
            validate={[required()]}
            row={false}
          />
        )}
      </SimpleForm>
    </Edit>
  );
};
const InventoryCreate = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const [choices, setChoices] = React.useState([]);
  const [newIndex, setNewIndex] = React.useState(0);
  const dataProvider = useDataProvider();
  const onSuccess = () => {
    notify(`Inventory addedd successfully.`);
    redirect("/inventories");
    refresh();
  };
  const loadSellingPrice = (item_id) => {
    dataProvider
      .getListSimple("inventories", { item_id })
      .then(({ data }) => {
        const newChoices = data.map((item, index) => ({
          id: parseFloat(item.selling_price),
          name: `€ ${item.selling_price} - ${item.date}`,
          value: parseFloat(item.selling_price),
        }));
        setChoices(newChoices);
        setNewIndex(newChoices.length);
      })
      .catch((error) => {});
  };
  const addSellingPrice = (newSellingPrice) => {
    var temp = [...choices];
    temp[newIndex] = {
      id: newSellingPrice,
      name: `€ ${newSellingPrice ? newSellingPrice : 0} - Today`,
      value: newSellingPrice,
    };
    setChoices(temp);
  };
  return (
    <Create {...props} onSuccess={onSuccess}>
      <SimpleForm>
        <ReferenceInput
          source="item_id"
          reference="items"
          fullWidth
          validate={[required()]}
          variant="outlined"
          onChange={(event) => loadSellingPrice(event)}
          perPage={10000000}
          filterToQuery={(searchText) => ({ name: searchText })}
        >
          <AutocompleteInput optionText="name" />
        </ReferenceInput>
        <NumberInput
          source="buying_price"
          fullWidth
          placeholder="100"
          validate={[required()]}
          label="Buying Price"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {app.currencySymbol}
              </InputAdornment>
            ),
          }}
        />
        <MaterialTextField
          fullWidth
          placeholder="150"
          label="Selling Price"
          variant="outlined"
          size="small"
          type="number"
          required
          onChange={(event) => addSellingPrice(parseFloat(event.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {app.currencySymbol}
              </InputAdornment>
            ),
          }}
          style={{
            marginBottom: 20,
          }}
        />
        <NumberInput
          source="unit"
          fullWidth
          placeholder="150"
          label="Units"
          variant="outlined"
          validate={[required()]}
          InputProps={{
            startAdornment: <InputAdornment position="start">=</InputAdornment>,
          }}
        />
        {choices.length > 0 && (
          <RadioButtonGroupInput
            label="Today's Selling Price"
            source="selling_price"
            choices={choices}
            validate={[required()]}
            row={false}
          />
        )}
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
      <TextField
        source="buying_price"
        label={`Buying Price(${app.currencySymbol})`}
      />
      <TextField
        source="selling_price"
        label={`Selling Price(${app.currencySymbol})`}
      />
      <TextField source="unit" />
      <DateField source="date" showTime />
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
  icon: ListAlt,
};
