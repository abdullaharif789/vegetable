import * as React from "react";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import CardWithIcon from "./CardWithIcon";
import { stringify } from "query-string";
const NewOrders = ({ value }) => {
  const filter = { filter: JSON.stringify({ status: "Progress" }) };
  return (
    <CardWithIcon
      to={`/orders?${stringify(filter)}`}
      icon={ShoppingCartIcon}
      title={"New Orders"}
      subtitle={value}
    />
  );
};

export default NewOrders;
