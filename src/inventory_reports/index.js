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
  BooleanField,
  Link,
} from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import DescriptionIcon from "@material-ui/icons/Description";
import { app } from "../contants";
const InventoryFilter = (props) => (
  <Filter {...props}>
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
    <ReferenceInput
      source="item_id"
      reference="items"
      alwaysOn
      variant="outlined"
    >
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
const InventoryTable = (props) => {
  const classes = {
    root: { margin: "auto", border: "none" },
    spacer: { height: 20 },
    invoices: { margin: "10px 0" },
  };
  const data = Object.keys(props.data)
    .map((item) => props.data[item])
    .sort((a, b) => b.id - a.id);
  var totalEarnings = 0;
  var stockPrices = 0;
  var totalRevenue = 0;
  var totalTax = 0;
  return (
    <div style={classes.invoices}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Buying Price({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Total Units
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Stock Price({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Sold Units
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Sold Price({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              20% VAT({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Revenue({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Total Revenue({app.currencySymbol})
            </TableCell>
            <TableCell style={classes.rightAlignedCell} align="right">
              Earnings({app.currencySymbol})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => {
            let stockPrice = item.unit * item.buying_price;
            let revenue =
              (item.unit - item.remaining_unit) * item.selling_price;
            let earning = revenue - stockPrice;
            let tax = item.tax * (item.unit - item.remaining_unit);
            totalEarnings += earning;
            stockPrices += stockPrice;
            totalRevenue += revenue;
            totalTax += tax;
            return (
              <TableRow key={index}>
                <TableCell>
                  <Link to={`/items/${item.item_id}/show`} target="_blank">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  {parseFloat(item.buying_price).toFixed(2)}
                </TableCell>
                <TableCell align="right">{item.unit}</TableCell>
                <TableCell align="right">
                  {parseFloat(stockPrice).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {item.unit - item.remaining_unit}
                </TableCell>
                <TableCell align="right">{item.selling_price}</TableCell>
                <TableCell align="right">
                  {parseFloat(tax).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(revenue).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {parseFloat(revenue + tax).toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    color: earning >= 0 ? "green" : "red",
                  }}
                >
                  {parseFloat(earning).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={3} align="right">
              <strong>Total Stock Price({app.currencySymbol})</strong>
            </TableCell>
            <TableCell colSpan={1} align="right">
              <strong>{stockPrices.toFixed(2)}</strong>
            </TableCell>
            <TableCell colSpan={2} align="right">
              <strong>Total ({app.currencySymbol})</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{totalTax.toFixed(2)}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{totalRevenue.toFixed(2)}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{(totalRevenue + totalTax).toFixed(2)}</strong>
            </TableCell>
            <TableCell
              colSpan={1}
              align="right"
              style={{
                color: totalEarnings >= 0 ? "green" : "red",
              }}
            >
              <strong>{totalEarnings.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
export class ReportList extends React.PureComponent {
  render() {
    return (
      <List
        {...this.props}
        filters={<InventoryFilter />}
        bulkActionButtons={false}
        sort={{ field: "id", order: "desc" }}
      >
        <InventoryTable {...this.props} />
      </List>
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
  name: "inventory_reports",
  icon: DescriptionIcon,
  options: { label: "Inventory Reportings" },
};
