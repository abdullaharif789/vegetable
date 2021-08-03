import * as React from "react";
import { forwardRef } from "react";
import { AppBar, UserMenu, MenuItemLink, useTranslate } from "react-admin";
import Typography from "@material-ui/core/Typography";
import LockIcon from "@material-ui/icons/Lock";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./logo.png";
const useStyles = makeStyles({
  title: {
    flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  spacer: {
    flex: 1,
  },
});

const ManagePassword = forwardRef((props, ref) => {
  return (
    <MenuItemLink
      style={{
        paddingLeft: 10,
      }}
      ref={ref}
      to="/passwords"
      primaryText={"Manage Password"}
      leftIcon={<LockIcon />}
      onClick={props.onClick}
      sidebarIsOpen
    />
  );
});

const CustomUserMenu = (props) => (
  <UserMenu {...props}>{<ManagePassword />}</UserMenu>
);

const CustomAppBar = (props) => {
  const classes = useStyles();
  return (
    <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      ></Typography>
      <img
        src={logo}
        style={{
          width: 55,
        }}
      />
      <span className={classes.spacer} />
    </AppBar>
  );
};

export default CustomAppBar;
