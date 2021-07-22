import * as React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-admin";
import logo from "./logo.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { app } from "../contants";

const CustomerField = ({ record }) =>
  record ? (
    <Typography>
      <strong>{record.name}</strong>
      <br />
      {record.business_name}
      <br />
      {record.address}
      <br />
      {record.contact_number}
    </Typography>
  ) : null;
export class InvoiceShow extends React.PureComponent {
  componentDidMount() {
    console.log(this.props.record);
  }
  render() {
    this.classes = {
      root: { margin: "auto", border: "none" },
      spacer: { height: 20 },
      invoices: { margin: "10px 0" },
    };
    if (!this.props.record) return null;

    return (
      <Card style={this.classes.root}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <img
                src={logo}
                style={{
                  width: 100,
                }}
              />
              <Typography variant="h6">
                Invoice# {this.props.record.id}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} container alignContent="flex-end">
              <CustomerField record={this.props.record.party} />
            </Grid>
          </Grid>
          <div style={this.classes.spacer}>&nbsp;</div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom align="center">
                Date
              </Typography>
              <Typography gutterBottom align="center">
                {new Date(this.props.record.created_at).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={5}>
              <Typography variant="h6" gutterBottom align="center">
                Order
              </Typography>
              <Typography gutterBottom align="center">
                {this.props.record.order.order_code}
              </Typography>
            </Grid>
          </Grid>
          <div style={this.classes.invoices}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell
                    style={this.classes.rightAlignedCell}
                    align="right"
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    style={this.classes.rightAlignedCell}
                    align="right"
                  >
                    Unit Price({app.currencySymbol})
                  </TableCell>
                  <TableCell
                    style={this.classes.rightAlignedCell}
                    align="right"
                  >
                    Total({app.currencySymbol})
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.record.order.cart.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={`/items/${item.item_id}/show`} target="_blank">
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.price}</TableCell>
                    <TableCell align="right">
                      <strong>{item.total}</strong>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    <strong>20% VAT({app.currencySymbol})</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{this.props.record.order.total_tax}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    <strong>Total({app.currencySymbol})</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{this.props.record.order.total}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default InvoiceShow;
