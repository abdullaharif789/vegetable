// in src/App.js
import * as React from "react";
import { Admin, Resource } from "react-admin";

import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";

import LoginPage from "./utilities/LoginPage";

import layout from "./layout";
import dashboard from "./dashboard";
import items from "./items";
import inventories from "./inventories";
import parties from "./parties";
import categories from "./categories";
import orders from "./orders";
import invoices from "./invoices";
import reports from "./reports";

export default function App() {
  return (
    <Admin
      layout={layout}
      dashboard={dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
    >
      <Resource {...parties} />
      <Resource {...categories} />
      <Resource {...items} />
      <Resource {...inventories} />
      <Resource {...orders} />
      <Resource {...invoices} />
      <Resource {...reports} />
    </Admin>
  );
}
