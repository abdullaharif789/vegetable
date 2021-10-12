import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  EditButton,
  ListGuesser,
} from "react-admin";
import ReactToPrint from "react-to-print";
import PagesIcon from "@material-ui/icons/Pages";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import { app } from "../contants";
import InvoiceShow from "./InvoiceShow";
const OrderFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Order#"
      source="order_code"
      alwaysOn
      variant="outlined"
      fullWidth
    />
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
  </Filter>
);
export class InvoicePrint extends React.PureComponent {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 10,
                  marginBottom: 10,
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
          content={() => this.componentRef}
        />
        <InvoiceShow ref={(el) => (this.componentRef = el)} {...this.props} />
      </div>
    );
  }
}
export const InvoiceList = (props) => {
  return (
    <List
      pagination={false}
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <Datagrid rowClick="expand" expand={<InvoicePrint />}>
        <TextField
          source="id"
          label="Invoice#"
          style={{
            fontWeight: "bold",
          }}
        />
        <TextField source="order.order_code" />
        <ReferenceField
          source="order.party_id"
          reference="parties"
          label="Party"
          sortable={false}
        >
          <TextField source="business_name" />
        </ReferenceField>
        <TextField source="order.total_items" label="Items" sortable={false} />
        <TextField
          source="order.total_quantity"
          label="Quantity"
          sortable={false}
        />
        <TextField
          sortable={false}
          source="order.total"
          label={`Total Amount(${app.currencySymbol})`}
        />
        <TextField source="created_at" label="Date" />
      </Datagrid>
    </List>
  );
};

export default {
  list: InvoiceList,
  name: "invoices",
  icon: PagesIcon,
  show: InvoicePrint,
};
