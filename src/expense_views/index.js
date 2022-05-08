import * as React from "react";
import { useReactToPrint } from "react-to-print";
import {
  List,
  Filter,
  DateInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";
import Button from "@material-ui/core/Button";
import Print from "@material-ui/icons/Print";
import Card from "@material-ui/core/Card";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ExpenseIcon from "@material-ui/icons/BarChart";
import { app } from "../contants";
import moment from "moment";
const ExpenseFilter = (props) => (
  <Filter {...props}>
    <DateInput source="start_date" alwaysOn variant="outlined" />
    <DateInput source="end_date" alwaysOn variant="outlined" />
    <ReferenceInput
      source="expense_type"
      reference="expense_types"
      alwaysOn
      variant="outlined"
      perPage={10000000}
      fullWidth
      filterToQuery={(searchText) => ({ name: searchText })}
    >
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
const process_expense = (expense) => {
  return {
    id: expense.id,
    amount: expense.amount,
    date: expense.date,
    extra: expense.extra,
    expense_type: expense.expense_type.name,
  };
};
const ExpenseListView = (props) => {
  const [expenses, setExpenses] = React.useState([]);
  const [headers, setHeaders] = React.useState([]);
  const [totalAmounts, setTotalAmounts] = React.useState([]);
  React.useEffect(() => {
    const expenses_data = Object.keys(props.data).map(
      (item) => props.data[item]
    );
    if (expenses_data.length > 0) {
      var processed_expenses = {};

      expenses_data.forEach((item) => {
        if (processed_expenses[item.expense_type.name] === undefined) {
          processed_expenses[item.expense_type.name] = [process_expense(item)];
        } else {
          processed_expenses[item.expense_type.name].push(
            process_expense(item)
          );
        }
      });
      const processed_total_amounts = Object.keys(processed_expenses).map((e) =>
        processed_expenses[e].reduce((a, b) => a + b.amount, 0)
      );
      setTotalAmounts(processed_total_amounts);
      const expense_types_keys = Object.keys(processed_expenses);
      setHeaders(expense_types_keys);
      const rows = Math.max.apply(
        null,
        expense_types_keys.map((key) => processed_expenses[key].length)
      );

      expense_types_keys.map((key) => {
        let length = processed_expenses[key].length;
        processed_expenses[key] = processed_expenses[key].concat(
          new Array(Math.abs(length - rows)).fill(null)
        );
      });
      const new_expenses = [];
      for (let i = 0; i < rows; i++) {
        new_expenses.push([]);
      }
      Object.values(processed_expenses).map((e_type) => {
        e_type.map((expense, index) => {
          new_expenses[index].push(expense);
        });
      });
      setExpenses(new_expenses);
    } else {
      setExpenses([]);
      setHeaders([]);
      setTotalAmounts([]);
    }
  }, [props]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  if (expenses.length > 0)
    return (
      <>
        <Button
          style={{
            margin: 10,
            float: "right",
          }}
          variant="contained"
          color="primary"
          startIcon={<Print fontSize="inherit" />}
          onClick={handlePrint}
        >
          Print
        </Button>
        <Table size="small" ref={componentRef}>
          <TableHead>
            <TableRow>
              {headers.map((key, index) => (
                <TableCell key={index}>
                  {key}({app.currencySymbol})
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((row) => (
              <TableRow>
                {row.map((expense, index) => (
                  <TableCell key={index}>
                    {expense && (
                      <div>
                        {expense.amount.toFixed(2)}
                        {expense.extra && ` - ${expense.extra}`}
                        <FormHelperText>{expense.date}</FormHelperText>
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              {totalAmounts.map((amount, index) => (
                <TableCell key={index}>
                  <strong>{amount.toFixed(2)}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  else
    return (
      <Card
        variant="outlined"
        style={{
          padding: 15,
        }}
      >
        Expenses not found.
      </Card>
    );
};
export const ExpenseList = (props) => {
  return (
    <List
      {...props}
      filters={<ExpenseFilter />}
      bulkActionButtons={false}
      pagination={false}
      hasCreate={false}
      perPage={1000000}
      empty={false}
    >
      <ExpenseListView />
    </List>
  );
};

export default {
  list: ExpenseList,
  name: "expense_views",
  icon: ExpenseIcon,
};
