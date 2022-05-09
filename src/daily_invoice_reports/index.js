import * as React from "react";
import "./style.css";
import { List, DateInput, Filter, SelectInput } from "react-admin";
import Receipt from "@material-ui/icons/Receipt";
import { app } from "../contants";
import ReactToPrint from "react-to-print";
import Print from "@material-ui/icons/Print";
import Button from "@material-ui/core/Button";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
const OrderFilter = (props) => (
  <Filter {...props}>
    <SelectInput
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
      alwaysOn
    />
    <DateInput source="current_date" alwaysOn variant="outlined" />
  </Filter>
);

const Content = (props) => {
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    var daily_reports = {};
    const data = Object.keys(props.data)
      .map((item) => props.data[item])
      .sort((a, b) => b.id - a.id);
    data.forEach((item) => {
      daily_reports[item.party.business_name] = {
        total_amount: parseFloat(item.total).toFixed(2),
        transactions_total: parseFloat(item.transactions_total).toFixed(2),
        name: item.party.business_name,
        transactions: item.transactions,
      };
    });
    daily_reports = Object.keys(daily_reports)
      .sort()
      .reduce((obj, key) => {
        obj[key] = daily_reports[key];
        return obj;
      }, {});
    setData(daily_reports);
  }, [props.data]);
  if (Object.keys(data).length === 0)
    return <div style={{ padding: 10 }}>Loading...</div>;
  else
    return (
      <div style={{ padding: 10 }}>
        <div
          style={{
            display: "flex",
            padding: "15px 10px",
            border: "1px solid #555",
            borderRadius: 4,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <strong>Date : </strong>
            {moment().format("DD-MMM-YYYY")}
          </div>
          <div
            style={{
              flex: 1,
              flexDirection: "row",
              display: "flex",
            }}
          >
            <div
              style={{
                flex: 0.4,
                textAlign: "right",
              }}
            >
              <strong>Driver Name : </strong>
            </div>
            <div
              style={{
                flex: 1,

                borderBottom: "2px dotted #555",
              }}
            ></div>
          </div>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "35%", fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell
                style={{ width: "15%", fontWeight: "bold" }}
                align="center"
              >
                Total Amount({app.currencySymbol})
              </TableCell>
              <TableCell
                style={{ width: "25%", fontWeight: "bold" }}
                align="center"
              >
                Received Amount({app.currencySymbol})
              </TableCell>
              <TableCell
                style={{ width: "35%", fontWeight: "bold" }}
                align="center"
              >
                Missing Items
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(data).map((key, index) => {
              return (
                <>
                  <TableRow
                    style={{
                      border: "1px solid #000",
                      borderRadius: 4,
                    }}
                  >
                    <TableCell>
                      <strong>{data[key].name}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{data[key].transactions_total}</strong>
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ border: "1px solid #ccc" }}
                    ></TableCell>
                    <TableCell
                      style={{ border: "1px solid #ccc" }}
                      align="center"
                    ></TableCell>
                  </TableRow>
                  {data[key].transactions.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        style={{ paddingLeft: 0, paddingRight: 6 }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <strong>Date</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>
                                  Unpaid Transaction Amount({app.currencySymbol}
                                  )
                                </strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data[key].transactions.map((transaction) => (
                              <TableRow>
                                <TableCell>
                                  {moment(transaction.date).format(
                                    "DD/MM/YYYY"
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  <strong>
                                    {parseFloat(transaction.amount).toFixed(2)}
                                  </strong>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
};
export class DailyInvoicesParent extends React.PureComponent {
  render() {
    return <Content {...this.props} />;
  }
}
const DailyInvoices = (props) => {
  var tableRef;

  if (Object.keys(props.data).length == 0) {
    return (
      <div
        style={{
          padding: 10,
        }}
      >
        No records found.
      </div>
    );
  } else
    return (
      <div>
        <ReactToPrint
          trigger={() => {
            return (
              <div
                style={{
                  margin: 10,
                  display: "inline-block",
                }}
              >
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Print fontSize="inherit" />}
                  >
                    Print
                  </Button>
                </div>
              </div>
            );
          }}
          pageStyle={"padding:20px"}
          content={() => tableRef}
        />
        <DailyInvoicesParent ref={(el) => (tableRef = el)} {...props} />
      </div>
    );
};
const InvoiceList = (props) => {
  return (
    <List
      // filterDefaultValues={{ current_date: Date(), van: app.vans[0] }}
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      pagination={false}
      sort={{ field: "id", order: "desc" }}
      hasCreate={false}
      perPage={1000000}
      empty={false}
    >
      <DailyInvoices />
    </List>
  );
};
export default {
  name: "daily_invoice_reports",
  list: InvoiceList,
  icon: Receipt,
};
