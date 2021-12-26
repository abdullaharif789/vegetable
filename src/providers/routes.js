import * as React from "react";
import { Route } from "react-router-dom";
import Password from "../password";
// import PurchaseInvoice from "../purchase_invoices";
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  <Route exact path="/passwords" render={() => <Password />} />,
  // <Route
  //   exact
  //   path="/purchase_invoice/:id"
  //   render={() => <PurchaseInvoice />}
  // />,
];
