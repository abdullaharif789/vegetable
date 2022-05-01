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
  TextInput,
  Link,
  AutocompleteInput,
} from "react-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import dataProvider from "../providers/dataProvider";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { app } from "../contants";
import CardWithIcon from "../dashboard/CardWithIcon";
import CustomPagination from "../components/PaginationCustom";
const ReportFilter = (props) => (
  <Filter {...props}>
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
    <ReferenceInput
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
    />
  </Filter>
);
const Report = (props) => {
  const [data, setData] = React.useState([]);
  const [tabsData, setTabsData] = React.useState({
    totalProfit: 0,
    totalRevenue: 0,
    totalBuying: 0,
    totalTax: 0,
  });
  const [totalExpense, setTotalExpense] = React.useState(0);
  const getTotalExpense = async () => {
    var created_dates = data
      .map((item) => item.created_at)
      .filter(app.uniqueValuesFromArray);
    console.log(created_dates);
    if (created_dates.length > 0) {
      for (let i = 0; i < created_dates.length; i++) {
        const exploded_date = created_dates[i].split("/");
        created_dates[i] =
          exploded_date[2] + "-" + exploded_date[1] + "-" + exploded_date[0];
      }
      const { data: expenses } = await dataProvider.getListSimple("expenses", {
        dates: created_dates.join(","),
      });
      const total = expenses.reduce((a, b) => a + b["amount"], 0);
      setTotalExpense(total);
    } else {
      setTotalExpense(0);
    }
  };
  React.useEffect(getTotalExpense, [tabsData.totalProfit]);
  React.useEffect(() => {
    let tabsOutput = {
      totalProfit: 0,
      totalRevenue: 0,
      totalBuying: 0,
      totalTax: 0,
    };

    let tempData = Object.keys(props.data)
      .map((item) => props.data[item])
      .sort((a, b) => b.id - a.id);
    setData(tempData);
    for (let i = 0; i < tempData.length; i++) {
      tabsOutput.totalRevenue += parseFloat(tempData[i].total);
      tabsOutput.totalTax += parseFloat(tempData[i].total_tax);
      for (let j = 0; j < tempData[i].cart.length; j++) {
        tabsOutput.totalProfit += parseFloat(tempData[i].cart[j].profit);
        tabsOutput.totalBuying +=
          parseFloat(tempData[i].cart[j].cost_price) *
          tempData[i].cart[j].quantity;
      }
      tabsOutput.totalProfit -= parseFloat(tempData[i].discount_amount);
    }
    setTabsData(tabsOutput);
  }, [props]);

  const classes = {
    root: { margin: "auto", border: "none" },
    spacer: { height: 20 },
    invoices: { margin: "10px 0" },
  };
  const styles = {
    flex: { display: "flex" },
    leftCol: { flex: 1, margin: "0.5em" },
  };
  const Tile = ({ title, sub, color }) => {
    return (
      <div style={styles.leftCol}>
        <div style={styles.flex}>
          <CardWithIcon
            to="/orders"
            color={color}
            icon={() => (
              <h1
                style={{
                  padding: 0,
                  margin: 0,
                  marginTop: -10,
                }}
              >
                {app.currencySymbol}
              </h1>
            )}
            title={title}
            subtitle={sub}
          />
        </div>
      </div>
    );
  };
  return (
    <>
      <div style={styles.flex}>
        <Tile title="Total Spent" sub={tabsData.totalBuying.toFixed(2)} />
        <Tile title="Expense" sub={totalExpense.toFixed(2)} color="red" />
        <Tile
          title="Profit"
          sub={tabsData.totalProfit.toFixed(2)}
          color={tabsData.totalProfit <= 0 ? "red" : "green"}
        />
        <Tile
          title="Net Profit"
          sub={(tabsData.totalProfit - totalExpense).toFixed(2)}
          color={tabsData.totalProfit - totalExpense <= 0 ? "red" : "green"}
        />
        <Tile title="Total Revenue" sub={tabsData.totalRevenue.toFixed(2)} />
      </div>
      <div style={classes.invoices}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Party</TableCell>
              <TableCell>Cart</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.created_at}</TableCell>
                    <TableCell
                      style={{
                        width: "10%",
                      }}
                    >
                      <Link to={`/parties/${item.party_id}`} target="_blank">
                        {item.party_business_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">
                              Cost Price({app.currencySymbol})
                            </TableCell>
                            <TableCell align="right">
                              Sell Price({app.currencySymbol})
                            </TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            {/* <TableCell align="right">
                              Sub Total({app.currencySymbol})
                            </TableCell> */}
                            <TableCell align="right">
                              20% VAT({app.currencySymbol})
                            </TableCell>
                            <TableCell align="right">
                              Total({app.currencySymbol})
                            </TableCell>
                            <TableCell align="right">
                              Profit({app.currencySymbol})
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.cart.map((cartItem, cartIndex) => {
                            return (
                              <TableRow key={cartIndex}>
                                <TableCell>
                                  <Link
                                    to={`/items/${cartItem.item_id}`}
                                    target="_blank"
                                  >
                                    {cartItem.name}
                                  </Link>
                                </TableCell>
                                <TableCell>{cartItem.type}</TableCell>
                                <TableCell align="right">
                                  {cartItem.cost_price}
                                </TableCell>
                                <TableCell align="right">
                                  {cartItem.price}
                                </TableCell>
                                <TableCell align="right">
                                  {cartItem.quantity}
                                </TableCell>
                                {/* <TableCell align="right">
                                  <strong>{cartItem.total}</strong>
                                </TableCell> */}
                                <TableCell align="right">
                                  {cartItem.tax}
                                </TableCell>
                                <TableCell align="right">
                                  <strong>
                                    {parseFloat(cartItem.total).toFixed(2)}
                                  </strong>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{
                                    color:
                                      cartItem.profit < 0 ? "red" : "green",
                                  }}
                                >
                                  <strong>{cartItem.profit}</strong>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={5} align="right">
                              <strong>
                                Actual Total({app.currencySymbol})
                              </strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>{item.total_tax}</strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>{item.total_without_discount}</strong>
                            </TableCell>
                            <TableCell
                              colSpan={1}
                              align="right"
                              style={{
                                color: item.profit < 0 ? "red" : "green",
                              }}
                            >
                              <strong>{item.profit}</strong>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={5} align="right">
                              <strong>Discount({app.currencySymbol})</strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>--</strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>{item.discount_amount}</strong>
                            </TableCell>
                            <TableCell
                              colSpan={1}
                              align="right"
                              // style={{
                              //   color: item.total_profit < 0 ? "red" : "green",
                              // }}
                            >
                              <strong>--</strong>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={5} align="right">
                              <strong>Grand Total({app.currencySymbol})</strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>{item.total_tax}</strong>
                            </TableCell>
                            <TableCell colSpan={1} align="right">
                              <strong>{item.total}</strong>
                            </TableCell>
                            <TableCell
                              colSpan={1}
                              align="right"
                              style={{
                                color: item.total_profit < 0 ? "red" : "green",
                              }}
                            >
                              <strong>{item.total_profit}</strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export class ReportList extends React.PureComponent {
  render() {
    return (
      <div>
        <List
          pagination={<CustomPagination />}
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
                  margin: 10,
                  display: "block",
                  textAlign: "right",
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
  name: "purchase_order_reports",
  icon: FileCopyIcon,
  options: { label: "Order Reportings" },
};
