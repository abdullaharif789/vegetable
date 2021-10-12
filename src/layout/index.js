import * as React from "react";
import { Layout, Sidebar } from "react-admin";
import { app } from "../contants";
import AppBar from "./AppBar";
import Menu from "./Menu";

const CustomSidebar = (props) => <Sidebar {...props} />;
export default (props) => {
  const theme = {
    palette: {
      primary: {
        main: app.colorOne,
      },
      secondary: {
        main: app.colorOne,
        light: app.colorTwo,
        dark: "#001064",
        contrastText: "#fff",
      },
      background: {
        default: "#fcfcfe",
      },
      type: "light",
    },
    shape: {
      borderRadius: 8,
    },
    overrides: {
      RaMenuItemLink: {
        root: {
          // borderLeft: "5px solid #fff",
        },
        active: {
          // borderLeft: `5px solid ${app.colorOne}`,
        },
      },
      MuiPaper: {
        elevation1: {
          boxShadow: "none",
        },
        root: {
          border: "1px solid #e0e0e3",
          backgroundClip: "padding-box",
        },
      },
      MuiButton: {
        contained: {
          backgroundColor: "#fff",
          color: app.colorOne,
          boxShadow: "none",
        },
      },
      MuiButtonBase: {
        root: {
          "&:hover:active::after": {
            content: '""',
            display: "block",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "currentColor",
            opacity: 0.3,
            borderRadius: "inherit",
          },
        },
      },
      MuiAppBar: {
        colorSecondary: {
          color: "#808080",
          backgroundColor: "#fff",
        },
      },
      MuiLinearProgress: {
        colorPrimary: {
          backgroundColor: "#f5f5f5",
        },
        barColorPrimary: {
          backgroundColor: "#d7d7d7",
        },
      },
      MuiDrawer: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          marginRight: 10,
          borderBottom: `10px solid ${app.colorOne}`,
          paddingRight: 10,
        },
      },
      MuiFilledInput: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
      MuiSnackbarContent: {
        root: {
          border: "none",
        },
      },
    },
    props: {
      MuiButtonBase: {
        //disableRipple: true,
      },
    },
  };

  return (
    <Layout
      {...props}
      appBar={AppBar}
      sidebar={CustomSidebar}
      theme={theme}
      menu={Menu}
    />
  );
};
