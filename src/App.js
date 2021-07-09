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
    </Admin>
  );
}
