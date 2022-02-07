import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateInput,
  Filter,
  Loading,
  AutocompleteInput,
  ReferenceInput,
  SelectInput,
  Show,
  ShowButton,
  NumberField,
} from "react-admin";
import ReactToPrint from "react-to-print";
import FormLabel from "@material-ui/core/FormLabel";
import Receipt from "@material-ui/icons/Receipt";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { app } from "../contants";
import { useNotify, useRefresh, useRedirect, Link, Title } from "react-admin";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomDelete from "../components/CustomDelete";
import CustomPagination from "../components/PaginationCustom";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@material-ui/core";
import dataProvider from "../providers/dataProvider";
import { TextField as MaterialTextField } from "@material-ui/core";
import axios from "axios";

const OrderFilter = (props) => (
  <Filter {...props}>
    <DateInput source="current_date" alwaysOn variant="outlined" />
  </Filter>
);

// const InvoiceList = (props) => {
//   return (
//     <List
//       {...props}
//       bulkActionButtons={false}
//       filters={<OrderFilter />}
//       pagination={<CustomPagination />}
//       sort={{ field: "id", order: "desc" }}
//       hasCreate={false}
//       empty={false}
//       filterDefaultValues={{ current_date: Date() }}
//     >
//       <Datagrid>
//         <ShowButton />
//       </Datagrid>
//     </List>
//   );
// };
const OrderListRows = (props) => {
  const notify = useNotify();
  const data = Object.keys(props.data).map((item) => props.data[item]);
  const [costs, setCosts] = React.useState({});
  const rawData = [];
  const newData = [];
  data.forEach((order) => {
    order.cart.forEach((item) => {
      rawData.push({
        id: item.item_id,
        name: item.name,
        type: item.type,
        quantity: parseFloat(item.quantity),
      });
    });
  });
  for (let index = 0; index < rawData.length; index++) {
    const element = {
      ...rawData[index],
      quantity: parseFloat(rawData[index].quantity),
    };
    let againElement = app.filter(newData, element);
    if (againElement.length === 0) {
      newData.push(element);
    } else if (againElement.length === 1) {
      againElement = againElement[0];
      againElement.quantity =
        parseFloat(againElement.quantity) + parseFloat(element.quantity);
    }
  }
  const finalOutput = [];
  for (let index = 0; index < newData.length; index++) {
    const element = newData[index];
    let againElement = app.filter(finalOutput, element, false);
    if (againElement.length === 0) {
      finalOutput.push({
        item_id: element.id,
        name: element.name,
        total: {
          [element["type"]]: `${element.quantity}`,
        },
      });
    } else {
      againElement = againElement[0];
      againElement.total = {
        ...againElement.total,
        [element["type"]]: `${element.quantity}`,
      };
    }
  }
  finalOutput.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  const changeCost = (value, item_id, type) => {
    var tempCosts = { ...costs };
    tempCosts[item_id] = {
      cost_price: parseFloat(value),
      item_type: type,
      item_id,
    };
    setCosts(tempCosts);
  };
  const submitCost = async (item_id, item_type, name) => {
    // const cost_price = costs[item_id];
    // if (!cost_price) {
    //   notify(`Please enter cost for '${name}'`, "error");
    // } else {
    // const data = {
    //   item_id,
    //   item_type,
    //   cost_price,
    // };
    await axios
      .post(
        `${app.api}purchase_order_costing`,
        Object.values(costs).map((item) => ({
          ...item,
          price: 0,
          created_at: new Date(),
        }))
      )
      .then((res) => {
        notify(`All given costs are updated.`, "success");
      })
      .catch((err) => {
        console.log(err);
        notify(`Error occured!`, "error");
      });
    // }
  };
  if (finalOutput.length == 0) {
    return <div style={{ padding: 10 }}>No data to show...</div>;
  } else
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "10px 35px 10px 0px",
          }}
        >
          <Button
            onClick={submitCost}
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
          >
            Update All Costs
          </Button>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="center" style={{ width: "20%" }}>
                Cost Price({app.currencySymbol})
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalOutput.map((item, i) =>
              Object.keys(item.total).map((type, j) => (
                <TableRow key={`${i}_${j}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{item.total[type]}</TableCell>
                  <TableCell align="center">
                    <MaterialTextField
                      placeholder="0.00"
                      variant="outlined"
                      size="small"
                      type="number"
                      inputProps={{ style: { textAlign: "center" } }}
                      onChange={(event) => {
                        changeCost(event.target.value, item.item_id, type);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </>
    );
};
export const OrderList = (props) => {
  return (
    <List
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      pagination={false}
      hasCreate={false}
      empty={false}
      filterDefaultValues={{ current_date: Date() }}
    >
      <OrderListRows />
    </List>
  );
};

export default {
  list: OrderList,
  name: "purchase_order_costing",
  icon: Receipt,
};
