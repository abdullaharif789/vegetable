import * as React from "react";
import { List, Filter, DateInput, SelectInput } from "react-admin";
import ProductionQuantityLimitsIcon from "@material-ui/icons/PlusOne";

import { app } from "../contants";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import Print from "@material-ui/icons/Print";
import DataTable from "react-data-table-component";

const OrderFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
      alwaysOn
    />
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
  </Filter>
);
// const getBoxesOutput = (output) => {
//   return (
//     <>
//       <strong>{output[app.boxTypes[0]] ? output[app.boxTypes[0]] : 0} </strong>
//       {app.boxTypes[0]}
//       {", "}
//       <strong>{output[app.boxTypes[1]] ? output[app.boxTypes[1]] : 0} </strong>
//       {app.boxTypes[1]}
//       {", "}
//       <strong>{output[app.boxTypes[2]] ? output[app.boxTypes[2]] : 0} </strong>
//       {app.boxTypes[2]}
//     </>
//   );
// };
const getBoxesString = (output) => {
  var str = "";
  str += `${output[app.boxTypes[0]] ? output[app.boxTypes[0]] : 0} ${
    app.boxTypes[0]
  }${", "}`;
  str += `${output[app.boxTypes[1]] ? output[app.boxTypes[1]] : 0} ${
    app.boxTypes[1]
  }${", "}`;
  str += `${output[app.boxTypes[2]] ? output[app.boxTypes[2]] : 0} ${
    app.boxTypes[2]
  }`;
  return str;
};
class PrintItemWiseDetails extends React.Component {
  render() {
    var totalData = {
      [app.boxTypes[0]]: 0,
      [app.boxTypes[1]]: 0,
      [app.boxTypes[2]]: 0,
    };
    const newCart = [];
    Object.keys(this.props.allCart).map((key, index) => {
      //get Total
      if (this.props.allCart[key][app.boxTypes[0]]) {
        totalData[app.boxTypes[0]] += this.props.allCart[key][app.boxTypes[0]];
      }
      if (this.props.allCart[key][app.boxTypes[1]]) {
        totalData[app.boxTypes[1]] += this.props.allCart[key][app.boxTypes[1]];
      }
      if (this.props.allCart[key][app.boxTypes[2]]) {
        totalData[app.boxTypes[2]] += this.props.allCart[key][app.boxTypes[2]];
      }
      newCart.push({
        id: index,
        item: key,
        total: getBoxesString(this.props.allCart[key]),
        van: this.props.allCart[key]["van"],
      });
    });
    return (
      <DataTable
        columns={[
          {
            name: "Item",
            selector: (row) => row.item,
            sortable: true,
          },
          // {
          //   name: "Van",
          //   selector: (row) => row.van,
          //   sortable: true,
          // },
          {
            name: "Total",
            selector: (row) => row.total,
          },
        ]}
        data={newCart}
        pagination
        paginationComponentOptions={{
          selectAllRowsItem: true,
          selectAllRowsItemText: "All Items",
        }}
      />
    );
    // return (
    //   this.props.data.length > 0 && (
    //     <div
    //       style={{
    //         padding: "0px 10px",
    //       }}
    //     >
    //       <Table size="small">
    //         <TableHead>
    //           <TableRow>
    //             <TableCell>Item</TableCell>
    //             <TableCell>Van</TableCell>
    //             <TableCell align="right">Total</TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {Object.keys(this.props.allCart).map((key) => {
    //             return (
    //               <>
    //                 <TableRow>
    //                   <TableCell
    //                     style={{
    //                       color: "#f5881f",
    //                     }}
    //                   >
    //                     {key}
    //                   </TableCell>
    //                   <TableCell
    //                     style={{
    //                       color: "#f5881f",
    //                     }}
    //                   >
    //                     {this.props.allCart[key]["van"]}
    //                   </TableCell>
    //                   <TableCell align="right">
    //                     {getBoxesOutput(this.props.allCart[key])}
    //                   </TableCell>
    //                 </TableRow>
    //               </>
    //             );
    //           })}
    //           <TableRow>
    //             <TableCell align="right"></TableCell>
    //             <TableCell align="right"></TableCell>
    //             <TableCell align="right">
    //               <strong>{getBoxesOutput(totalData)}</strong>
    //             </TableCell>
    //           </TableRow>
    //         </TableBody>
    //       </Table>
    //     </div>
    //   )
    // );
  }
}

const OrderListRows = (props) => {
  const data = Object.keys(props.data).map((item) => props.data[item]);
  var allCart = {};
  const cartArray = [];
  data.forEach((order) => {
    order.cart.forEach((cartItem) => {
      cartArray.push({ ...cartItem, van: order.van });
      const key = cartItem.name;
      if (!allCart[key]) allCart[key] = [];
      allCart[key].push({
        type: cartItem.type,
        quantity: cartItem.quantity,
        van: order.van,
      });
    });
  });
  Object.keys(allCart).map((key) => {
    let tempData = {};
    allCart[key].map((item) => {
      const newKey = item.type;
      if (tempData[newKey])
        tempData[newKey] = tempData[newKey] + parseFloat(item.quantity);
      else tempData[newKey] = parseFloat(item.quantity);
      tempData["van"] = item.van;
    });
    allCart[key] = tempData;
  });

  allCart = Object.keys(allCart)
    .sort()
    .reduce((obj, key) => {
      obj[key] = allCart[key];
      return obj;
    }, {});

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
export const OrderList = (props) => {
  return (
    <List pagination={false} {...props} filters={<OrderFilter />}>
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
