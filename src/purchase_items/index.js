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

class PrintItemWiseDetails extends React.Component {
  normalize(output) {
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
  }
  render() {
    const newCart = app.sort(
      this.props.allCart.map((item, index) => ({
        ...item,
        id: index,
        total: this.normalize(item.total),
      })),
      "name"
    );
    return (
      <div>
        <div
          style={{
            display: "flex",
            padding: "15px 10px",
            border: "1px solid #555",
            borderRadius: 4,
            marginBottom: 10,
            marginLeft: 11,
          }}
        >
          <div
            style={{
              flex: 0.5,
            }}
          >
            <strong>Date : </strong>
            {new Date().toLocaleDateString()}
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <strong>Driver Name : </strong>
            <div
              style={{
                textDecoration: "underline",
                display: "inline-block",
                width: "60%",
                borderBottom: "2px dotted #000",
              }}
            ></div>
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <strong>Signature : </strong>
            <div
              style={{
                textDecoration: "underline",
                display: "inline-block",
                width: "60%",
                borderBottom: "2px dotted #000",
              }}
            ></div>
          </div>
        </div>
        <DataTable
          columns={[
            {
              name: "Item",
              selector: (row) => row.name,
              sortable: true,
            },
            {
              name: "Van",
              selector: (row) => row.van,
              sortable: true,
            },
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
      </div>
    );
  }
}

const OrderListRows = (props) => {
  const data = Object.keys(props.data).map((item) => props.data[item]);
  const rawData = [];
  const newData = [];
  data.forEach((order) => {
    order.cart.forEach((item) => {
      rawData.push({
        name: item.name,
        type: item.type,
        quantity: parseFloat(item.quantity),
        van: order.van,
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
        name: element.name,
        van: element.van,
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
            allCart={finalOutput}
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
