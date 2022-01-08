// /* eslint-disable */
// // in src/App.js
import * as React from "react";
import { Admin, Resource } from "react-admin";
import axios from "axios";

import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";

import LoginPage from "./utilities/LoginPage";
import customRoutes from "./providers/routes";

import layout from "./layout";
import dashboard from "./dashboard";
import items from "./items";
import inventories from "./inventories";
import parties from "./parties";
import categories from "./categories";
import orders from "./orders";
import invoices from "./invoices";
import purchase_invoices from "./purchase_invoices";
import daily_invoice_reports from "./daily_invoice_reports";
import order_reports from "./order_reports";
import purchase_order_reports from "./purchase_order_reports";
// import inventory_reports from "./inventory_reports";
import van_reports from "./van_reports";
import purchase_orders from "./purchase_orders";
import purchase_items from "./purchase_items";
import manual_orders from "./manual_orders";
import transactions from "./transactions";
import { app } from "./contants";

export default function App() {
  React.useEffect(() => {
    const validate = async () => {
      var userToken = null;
      try {
        userToken = JSON.parse(localStorage.getItem("auth"));
        if (userToken) {
          await axios
            .post(app.api + "validate", {
              token: userToken.token_id,
            })
            .then((result) => {
              if (result.data == false) localStorage.removeItem("auth");
            });
        } else {
          localStorage.removeItem("auth");
        }
      } catch (e) {
        localStorage.removeItem("auth");
      }
    };
    validate();
  }, []);
  return (
    <Admin
      layout={layout}
      dashboard={dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      customRoutes={customRoutes}
    >
      {(permissions) => [
        <Resource {...parties} />,
        <Resource {...categories} />,
        <Resource {...items} />,
        <Resource {...inventories} />,
        <Resource {...orders} />,
        <Resource {...manual_orders} />,
        <Resource {...purchase_orders} />,
        <Resource {...purchase_items} />,
        <Resource {...transactions} />,
        <Resource {...invoices} />,
        <Resource {...purchase_invoices} />,
        <Resource {...daily_invoice_reports} />,
        permissions === app.superAdminRole ? (
          <Resource {...order_reports} />
        ) : null,
        permissions === app.superAdminRole ? (
          <Resource {...purchase_order_reports} />
        ) : null,
        <Resource {...van_reports} />,
      ]}
      {/* <Resource {...inventory_reports} /> */}
    </Admin>
  );
}
