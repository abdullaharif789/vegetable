import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Filter,
  TextInput,
  DateInput,
  SelectInput,
} from "react-admin";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { app } from "../contants";
import OrderEdit from "./OrderEdit";

const OrderFilter = (props) => (
  <Filter {...props}>
    <TextInput
      label="Order#"
      source="order_code"
      alwaysOn
      variant="outlined"
      fullWidth
    />
    <SelectInput
      alwaysOn
      choices={app.status.map((item) => ({ id: item, name: item }))}
      source="status"
      label="Status"
      variant="outlined"
    />
    <SelectInput
      alwaysOn
      choices={app.vans.map((item) => ({ id: item, name: item }))}
      source="van"
      label="Van"
      variant="outlined"
    />
    <DateInput source="created_at" label="Date" variant="outlined" alwaysOn />
  </Filter>
);
export const OrderList = (props) => {
  return (
    <List
      pagination={false}
      {...props}
      bulkActionButtons={false}
      filters={<OrderFilter />}
      sort={{ field: "id", order: "desc" }}
    >
      <Datagrid rowClick="edit">
        <TextField
          source="order_code"
          label="Order#"
          style={{
            fontWeight: "bold",
          }}
        />
        <ReferenceField source="party_id" reference="parties">
          <TextField source="business_name" />
        </ReferenceField>
        <TextField source="total_items" label="Items" sortable={false} />
        <TextField source="total_quantity" label="Quantity" sortable={false} />
        <TextField
          source="total"
          label={`Total Amount(${app.currencySymbol})`}
        />
        <TextField source="status" />
        <TextField source="order_from" label="Order From" />
        <TextField source="van" />
        <TextField source="created_at" label="Date" />
      </Datagrid>
    </List>
  );
};

// export class OrderPrint extends React.PureComponent {
//   render() {
//     return (
//       <div>
//         <ReactToPrint
//           trigger={() => {
//             return (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   marginTop: 10,
//                 }}
//               >
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<Print fontSize="inherit" />}
//                 >
//                   Print
//                 </Button>
//               </div>
//             );
//           }}
//           content={() => this.componentRef}
//         />
//         <OrderEdit ref={(el) => (this.componentRef = el)} {...this.props} />
//       </div>
//     );
//   }
// }
export default {
  list: OrderList,
  name: "orders",
  icon: ShoppingCartIcon,
  edit: OrderEdit,
  options: { label: "App Orders" },
};
