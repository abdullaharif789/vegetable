import * as React from "react";

import CardWithIcon from "./CardWithIcon";
import { app } from "../contants";

const MonthlyRevenue = ({ value }) => {
  return (
    <CardWithIcon
      to="/orders"
      icon={() => (
        <h1
          style={{
            padding: 0,
            margin: 0,
            marginTop: -10,
          }}
        >
          {app.currencySymbol}
        </h1>
      )}
      title={"Monthly Revenue"}
      subtitle={value}
    />
  );
};

export default MonthlyRevenue;
