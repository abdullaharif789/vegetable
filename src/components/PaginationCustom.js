import React from "react";
import { Pagination } from "react-admin";
const CustomPagination = (props) => (
  <Pagination
    rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 300, 400, 500]}
    {...props}
  />
);
export default CustomPagination;
