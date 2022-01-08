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
      <strong>{record.business_name}</strong>
      <br />
      {record.address}
      <br />
      {record.contact_number}
    </Typography>
  ) : null;
export class InvoiceShow extends React.PureComponent {
  render() {
    this.classes = {
      root: { margin: "auto", border: "none" },
      spacer: { height: 20 },
      invoices: { margin: "10px 0" },
      margin0: { margin: 0 },
      margin1: { margin: 0, marginTop: 5 },
    };
    if (!this.props.record) return null;

    return (
      <Card style={this.classes.root}>
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <img
                src={logo}
                style={{
                  width: 100,
                }}
                alt="logo"
              />
              <h4 style={this.classes.margin0}>Everyday Fresh Food Ltd.</h4>
              <p style={this.classes.margin0}>
                Unit 25 Chalwyn Industrial Estate
              </p>
              <p style={this.classes.margin0}>Parkstone, Poole</p>
              <p style={this.classes.margin0}>BH12 4PE</p>
              <p style={this.classes.margin0}>
                <strong>Tel : 01202 801167</strong>
              </p>
              <h4 style={this.classes.margin1}>Banking Information</h4>
              <p style={this.classes.margin0}>
                Cheque payable to <strong>Everyday Fresh Food Ltd.</strong>
              </p>
              {this.props.record.bank_visible == 1 && (
                <>
                  <p style={this.classes.margin1}>
                    <strong>Account Name:</strong> Everyday fresh Food
                  </p>
                  <p style={this.classes.margin0}>
                    <strong>Account:</strong> 30106852
                  </p>
                  <p style={this.classes.margin0}>
                    <strong>Sort Code:</strong> 40-18-00
                  </p>
                  <p style={this.classes.margin0}>
                    <strong>Bank Name:</strong> HSBC
                  </p>
                </>
              )}
            </div>
            <div>
              <img
                src={logo}
                style={{
                  width: 100,
                  opacity: 0,
                }}
                alt="logo"
              />
              <h4
                style={{
                  margin: 0,
                }}
              >
                Invoice# {this.props.record.id}
              </h4>
              <CustomerField record={this.props.record.party} />
            </div>
          </div>
          <div style={this.classes.spacer}>&nbsp;</div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom align="center">
                Date
              </Typography>
              <Typography gutterBottom align="center">
                {this.props.record.created_at}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h4>
                <i> Thank you for your business with us.</i>
              </h4>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default InvoiceShow;
