import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItemLink, usePermissions } from "react-admin";
import SubMenu from "./SubMenu";

import parties from "../parties";
import items from "../items";
import categories from "../categories";
import inventories from "../inventories";
import orders from "../orders";
import manual_orders from "../manual_orders";
import purchase_orders from "../purchase_orders";
import purchase_items from "../purchase_items";
import order_reports from "../order_reports";
import purchase_order_reports from "../purchase_order_reports";
import van_reports from "../van_reports";
import daily_invoice_reports from "../daily_invoice_reports";
import invoices from "../invoices";
import purchase_invoices from "../purchase_invoices";
import transactions from "../transactions";

import { DashboardSharp } from "@material-ui/icons";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { app } from "../contants";
const Menu = ({ dense = true }) => {
  const { permissions } = usePermissions();
  const [state, setState] = useState({
    orders: true,
    products: true,
    reportings: true,
    payments: true,
    invoices: true,
  });
  const classes = useStyles();

  const handleToggle = (menu) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };
  return (
    <div className={classes.root}>
      {" "}
      <MenuItemLink
        to={`/`}
        primaryText={"Dashboard"}
        leftIcon={<DashboardSharp />}
        dense={dense}
      />
      <MenuItemLink
        to={`/parties`}
        primaryText={"Parties"}
        leftIcon={<parties.icon />}
        dense={dense}
      />
      <SubMenu
        handleToggle={() => handleToggle("products")}
        isOpen={state.products}
        name="Stocks"
        icon={<items.icon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/categories`}
          primaryText={"Categories"}
          leftIcon={<categories.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/items`}
          primaryText={"Items"}
          leftIcon={<items.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/inventories`}
          primaryText={"Inventories"}
          leftIcon={<inventories.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("orders")}
        isOpen={state.orders}
        name="Orders"
        icon={<orders.icon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/orders`}
          primaryText={"App Orders"}
          leftIcon={<orders.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/manual_orders`}
          primaryText={"Manual Orders"}
          leftIcon={<manual_orders.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/purchase_orders`}
          primaryText={"Purchase Orders"}
          leftIcon={<purchase_orders.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/purchase_items`}
          primaryText={"Purchase Items"}
          leftIcon={<purchase_items.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("reportings")}
        isOpen={state.reportings}
        name="Reportings"
        icon={<order_reports.icon />}
        dense={dense}
      >
        {permissions === app.superAdminRole && (
          <MenuItemLink
            to={`/purchase_order_reports`}
            primaryText={"Puchase Order Reportings"}
            leftIcon={<purchase_order_reports.icon />}
            dense={dense}
          />
        )}
        <MenuItemLink
          to={`daily_invoice_reports`}
          primaryText={"Daily Invoice Reportings"}
          leftIcon={<daily_invoice_reports.icon />}
          dense={dense}
        />
        {permissions === app.superAdminRole && (
          <MenuItemLink
            to={`/order_reports`}
            primaryText={"Order Reportings"}
            leftIcon={<order_reports.icon />}
            dense={dense}
          />
        )}
        <MenuItemLink
          to={`/van_reports`}
          primaryText={"Van Reportings"}
          leftIcon={<van_reports.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("invoices")}
        isOpen={state.invoices}
        name="Invoices"
        icon={<ReceiptIcon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/purchase_invoices`}
          primaryText={"Purchase Invoices"}
          leftIcon={<purchase_invoices.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={`/invoices`}
          primaryText={"Order Invoices"}
          leftIcon={<invoices.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle("payments")}
        isOpen={state.payments}
        name="Payments"
        icon={<transactions.icon />}
        dense={dense}
      >
        <MenuItemLink
          to={`/transactions`}
          primaryText={"Party Transactions"}
          leftIcon={<transactions.icon />}
          dense={dense}
        />
      </SubMenu>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
}));

export default Menu;
