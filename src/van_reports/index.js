import * as React from "react";
import { List, DateInput, Filter, SelectInput, Link } from "react-admin";
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
import { app } from "../contants";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
const ReportFilter = (props) => (
  <Filter {...props}>
    <DateInput
      source="created_at"
      alwaysOn
      variant="outlined"
      label="Select Date"
    />
    <SelectInput
      alwaysOn
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
    />
  </Filter>
);
const neutralData = (data) => {
  let group = data.reduce((r, a) => {
    r[a.van] = [
      ...(r[a.van] || []),
      a.cart.map((item) => ({
        item_id: item.item_id,
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        title: item.title,
      })),
    ];
    return r;
  }, {});
  group = Object.keys(group)
    .sort()
    .reduce((obj, key) => {
      obj[key] = group[key];
      return obj;
    }, {});
  Object.keys(group).map((key) => {
    let carts = group[key];
    let newCarts = [];
    carts.map((cart) => {
      cart.map((item) => {
        newCarts.push(item);
      });
    });
    group[key] = newCarts;
  });
  Object.keys(group).map((key) => {
    let result = [];
    group[key].reduce(function (res, value) {
      if (!res[value.inventory_id]) {
        res[value.inventory_id] = {
          inventory_id: value.inventory_id,
          quantity: 0,
          item_id: value.item_id,
          title: value.title,
        };
        result.push(res[value.inventory_id]);
      }
      res[value.inventory_id].quantity += value.quantity;
      return res;
    }, {});
    group[key] = result;
    return result;
  });
  return group;
};
const Report = (props) => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    let tempData = neutralData(
      Object.keys(props.data)
        .map((item) => props.data[item])
        .filter((item) => item.status == "Progress")
        .sort((a, b) => b.id - a.id)
    );
    setData(tempData);
  }, [props]);

  const classes = {
    root: { margin: "auto", border: "none" },
    spacer: { height: 20 },
    invoices: { margin: "10px 0" },
  };
  if (Object.keys(props.data).length == 0)
    return (
      <p
        style={{
          margin: 5,
        }}
      >
        Sorry, no records found!
      </p>
    );
  return (
    <>
      <div style={classes.invoices}>
        {data &&
          Object.keys(data).map((key) => {
            return (
              <div
                style={{
                  marginBottom: 10,
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    marginLeft: 14,
                    color: app.colorOne,
                  }}
                >
                  {key}
                </h4>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Item</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data[key].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{
                            width: "50%",
                          }}
                        >
                          <Link
                            to={`/items/${item.item_id}/show`}
                            target="_blank"
                          >
                            {item.title}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            width: "50%",
                          }}
                        >
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
      </div>
    </>
  );
};
export class ReportList extends React.PureComponent {
  render() {
    return (
      <div>
        <List
          pagination={false}
          {...this.props}
          bulkActionButtons={false}
          filters={<ReportFilter />}
          sort={{ field: "id", order: "desc" }}
        >
          <Report />
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
  name: "van_reports",
  icon: LocalShippingIcon,
  options: { label: "Van Reportings" },
};
