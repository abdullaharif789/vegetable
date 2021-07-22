import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  Filter,
  ReferenceInput,
  SelectInput,
  ListGuesser,
  ArrayField,
  NumberField,
} from "react-admin";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { app } from "../contants";
const ReportFilter = (props) => (
  <Filter {...props}>
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
    <ReferenceInput
      source="party_id"
      reference="parties"
      alwaysOn
      variant="outlined"
    >
      <SelectInput optionText="business_name" />
    </ReferenceInput>
  </Filter>
);
export class ReportList extends React.PureComponent {
  render() {
    return (
      <div
        style={{
          overflow: "auto",
        }}
      >
        <List
          {...this.props}
          bulkActionButtons={false}
          filters={<ReportFilter />}
          sort={{ field: "id", order: "desc" }}
        >
          <Datagrid>
            <ReferenceField source="id" reference="orders" label="Order#">
              <TextField source="order_code" />
            </ReferenceField>
            <ReferenceField source="party_id" reference="parties">
              <TextField source="business_name" />
            </ReferenceField>
            <ArrayField source="cart" sortable={false}>
              <Datagrid>
                <ReferenceField source="item_id" reference="items">
                  <TextField source="name" />
                </ReferenceField>

                <NumberField
                  source="buying_price"
                  label={`Buying Price(${app.currencySymbol})`}
                />
                <NumberField
                  source="price"
                  label={`Selling Price(${app.currencySymbol})`}
                />
                <NumberField source="quantity" label={`Quantity`} />

                <NumberField
                  source="tax"
                  label={`20% VAT(${app.currencySymbol})`}
                />
                <NumberField
                  style={{
                    fontWeight: "bold",
                  }}
                  source="total"
                  label={`Sub Total(${app.currencySymbol})`}
                />
                <NumberField
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                  source="profit"
                  label={`Profit(${app.currencySymbol})`}
                />
              </Datagrid>
            </ArrayField>
            <NumberField
              style={{
                fontWeight: "bold",
                color: "green",
              }}
              source="total_profit"
              label={`Total Profit(${app.currencySymbol})`}
              sortable={false}
            />
            <NumberField
              style={{
                fontWeight: "bold",
              }}
              source="total_tax"
              label={`Total Tax(${app.currencySymbol})`}
            />
            <NumberField
              style={{
                fontWeight: "bold",
              }}
              source="total"
              label={`Total(${app.currencySymbol})`}
            />
          </Datagrid>
        </List>
      </div>
    );
  }
}
export class ReportPrint extends React.PureComponent {
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
        <ReportList ref={(el) => (this.componentRef = el)} {...this.props} />
      </div>
    );
  }
}
export default {
  list: ReportPrint,
  name: "reports",
  icon: FileCopyIcon,
};
