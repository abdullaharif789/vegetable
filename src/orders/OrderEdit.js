import React, { Component } from "react";
import {
  Datagrid,
  TextField,
  ReferenceField,
  ArrayField,
  NumberField,
  DateField,
  Edit,
  SimpleForm,
  SelectInput,
  Toolbar,
  SaveButton,
  Link,
} from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { app } from "../contants";
import axios from "axios";
const OrderTitle = ({ record }) => {
  return <span>Order {record ? ` - ${record.order_code}` : ""}</span>;
};
const UserEditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton {...props} label="Update Order" />
  </Toolbar>
);
const classes = {
  root: { margin: "auto", border: "none" },
  spacer: { height: 20 },
  invoices: { margin: "10px 0" },
};
const Cart = (props) => {
  var totalWithOutTax = 0;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell style={classes.rightAlignedCell} align="right">
            Quantity
          </TableCell>
          <TableCell style={classes.rightAlignedCell} align="right">
            Unit Price({app.currencySymbol})
          </TableCell>
          <TableCell style={classes.rightAlignedCell} align="right">
            20% VAT({app.currencySymbol})
          </TableCell>
          <TableCell style={classes.rightAlignedCell} align="right">
            Total({app.currencySymbol})
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.record.cart.map((item, index) => {
          totalWithOutTax += parseFloat(item.total);
          return (
            <TableRow key={index}>
              <TableCell>
                <Link to={`/items/${item.item_id}/show`} target="_blank">
                  {item.title}
                </Link>
              </TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{item.tax}</TableCell>
              <TableCell align="right">
                <strong>{item.total}</strong>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            <strong>{props.record.total_tax}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{totalWithOutTax.toFixed(2)}</strong>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="right" colSpan={4}>
            <strong>Total({app.currencySymbol})</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{props.record.total}</strong>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
class OrderEdit extends Component {
  constructor() {
    super();
    this.state = {
      choices: [],
    };
  }
  async loadOrders() {
    await axios.get(app.api + `orders/${this.props.id}`).then((result) => {
      const status = result.data.status;
      const choices = [
        {
          id: "Progress",
          name: "Progress",
          disabled: status == "Completed" ? true : false,
        },
        {
          id: "Completed",
          name: "Completed",
        },
      ];
      this.setState({ choices });
    });
  }
  componentDidMount() {
    this.loadOrders();
  }
  render() {
    return (
      <>
        <Edit {...this.props} title={<OrderTitle />} undoable={false}>
          <SimpleForm toolbar={<UserEditToolbar />}>
            <TextField
              source="order_code"
              label="Order#"
              style={{
                fontWeight: "bold",
              }}
            />
            <DateField source="created_at" showTime label="Order Date & Time" />
            <ReferenceField source="party_id" reference="parties">
              <TextField source="business_name" />
            </ReferenceField>
            <SelectInput
              // fullWidth
              variant="outlined"
              source="status"
              // required
              choices={this.state.choices}
            />
            <Cart />
          </SimpleForm>
        </Edit>
      </>
    );
  }
}

export default OrderEdit;
// const data = {
//   id: 19,
//   party_id: "1",
//   cart: [
//     {
//       price: "60.00",
//       buying_price: "45.00",
//       tax: "24.00",
//       quantity: 2,
//       total: "120.00",
//       image: "https://via.placeholder.com/800/000000/FFF?text=Tomato",
//       item_id: "3",
//       inventory_id: 3,
//       title: "Tomato",
//     },
//     {
//       price: "120.00",
//       buying_price: "100.00",
//       tax: "48.00",
//       quantity: 2,
//       total: "240.00",
//       image: "https://via.placeholder.com/800/000000/FFF?text=Potato",
//       item_id: "1",
//       inventory_id: 2,
//       title: "Potato",
//     },
//     {
//       price: "650.00",
//       buying_price: "300.00",
//       tax: "260.00",
//       quantity: 2,
//       total: "1300.00",
//       image: "https://via.placeholder.com/800/000000/FFF?text=Cucumber",
//       item_id: "2",
//       inventory_id: 22,
//       title: "Cucumber",
//     },
//   ],
//   total_items: 3,
//   total: "1992.00",
//   total_tax: "332.00",
//   total_quantity: 6,
//   status: "Completed",
//   order_code: "60F2AACCB3B83",
//   created_at: "2021-07-17T10:02:52.000000Z",
// };
