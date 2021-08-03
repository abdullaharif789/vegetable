import * as React from "react";
import { Route } from "react-router-dom";
import Password from "../password";

export default [<Route exact path="/passwords" render={() => <Password />} />];
