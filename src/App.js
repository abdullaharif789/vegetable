// in src/App.js
import * as React from "react";
import { Admin, Resource } from "react-admin";

import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";
import layout from "./layout";
import dashboard from "./dashboard";
import items from "./items";
import inventories from "./inventories";
import parties from "./parties";
export default function App() {
  return (
    <Admin
      layout={layout}
      dashboard={dashboard}
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource {...parties} />
      <Resource {...items} />
      <Resource {...inventories} />
    </Admin>
  );
}
