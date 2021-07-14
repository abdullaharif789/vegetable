import * as React from "react";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import CardWithIcon from "./CardWithIcon";

const NewOrders = ({ value }) => {
  return (
    <CardWithIcon
      to="/orders"
      icon={ShoppingCartIcon}
      title={"New Orders"}
      subtitle={value}
    />
  );
};

export default NewOrders;
