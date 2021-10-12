import * as React from "react";
import { List, Filter, DateInput, Pagination } from "react-admin";
import ProductionQuantityLimitsIcon from "@material-ui/icons/PlusOne";

import { app } from "../contants";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import Print from "@material-ui/icons/Print";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const OrderFilter = (props) => (
  <Filter {...props}>
    {/* <ReferenceInput
      source="party_id"
      reference="parties"
      alwaysOn
      variant="outlined"
      perPage={10000000}
      filterToQuery={(searchText) => ({ business_name: searchText })}
    >
      <AutocompleteInput optionText="business_name" />
    </ReferenceInput>
    <SelectInput
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
      alwaysOn
    /> */}
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
  </Filter>
);
const getBoxesOutput = (output) => {
  return (
    <>
      <strong>{output[app.boxTypes[0]] ? output[app.boxTypes[0]] : 0} </strong>
      {app.boxTypes[0]}
      {", "}
      <strong>{output[app.boxTypes[1]] ? output[app.boxTypes[1]] : 0} </strong>
      {app.boxTypes[1]}
      {", "}
      <strong>{output[app.boxTypes[2]] ? output[app.boxTypes[2]] : 0} </strong>
      {app.boxTypes[2]}
    </>
  );
};

class PrintItemWiseDetails extends React.Component {
  render() {
    var totalData = {
      [app.boxTypes[0]]: 0,
      [app.boxTypes[1]]: 0,
      [app.boxTypes[2]]: 0,
    };
    return (
      this.props.data.length > 0 && (
        <div
          style={{
            padding: "0px 10px",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(this.props.allCart).map((key) => {
                //get Total
                if (this.props.allCart[key][app.boxTypes[0]]) {
                  totalData[app.boxTypes[0]] +=
                    this.props.allCart[key][app.boxTypes[0]];
                }
                if (this.props.allCart[key][app.boxTypes[1]]) {
                  totalData[app.boxTypes[1]] +=
                    this.props.allCart[key][app.boxTypes[1]];
                }
                if (this.props.allCart[key][app.boxTypes[2]]) {
                  totalData[app.boxTypes[2]] +=
                    this.props.allCart[key][app.boxTypes[2]];
                }
                return (
                  <>
                    <TableRow>
                      <TableCell
                        style={{
                          color: "#f5881f",
                        }}
                      >
                        {key}
                      </TableCell>
                      <TableCell align="right">
                        {getBoxesOutput(this.props.allCart[key])}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
              <TableRow>
                <TableCell align="right"></TableCell>
                <TableCell align="right">
                  <strong>{getBoxesOutput(totalData)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )
    );
  }
}

const OrderListRows = (props) => {
  const data = Object.keys(props.data).map((item) => props.data[item]);
  var allCart = {};

  data.forEach((order) => {
    order.cart.forEach((cartItem) => {
      const key = cartItem.name;
      if (!allCart[key]) allCart[key] = [];
      allCart[key].push({
        type: cartItem.type,
        quantity: cartItem.quantity,
      });
    });
  });
  Object.keys(allCart).map((key) => {
    var tempData = {};
    allCart[key].map((item) => {
      const newKey = item.type;
      if (tempData[newKey])
        tempData[newKey] = tempData[newKey] + parseInt(item.quantity);
      else tempData[newKey] = parseInt(item.quantity);
    });
    allCart[key] = tempData;
  });
  allCart = Object.keys(allCart)
    .sort()
    .reduce((obj, key) => {
      obj[key] = allCart[key];
      return obj;
    }, {});
  console.log(allCart);
  var summaryRef;
  return (
    <>
      {data.length > 0 && (
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
            pageStyle={"padding:20px"}
            content={() => summaryRef}
          />
          <PrintItemWiseDetails
            ref={(el) => (summaryRef = el)}
            data={data}
            allCart={allCart}
          />
        </div>
      )}
    </>
  );
};
const OrderPagination = (props) => (
  <Pagination rowsPerPageOptions={[5, 10, 25, 50, 100]} {...props} />
);
export const OrderList = (props) => {
  return (
    <List
      pagination={<OrderPagination />}
      {...props}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <OrderListRows />
    </List>
  );
};

export default {
  list: OrderList,
  name: "purchase_items",
  icon: ProductionQuantityLimitsIcon,
  options: { label: "Purchase Items" },
};
