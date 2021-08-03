import * as React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Button from "@material-ui/core/Button";
import { Title } from "react-admin";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import { useNotify, useAuthProvider } from "react-admin";
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField as MaterialTextField,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { app, passwordValidator } from "../contants";
import axios from "axios";

const Password = () => {
  const notify = useNotify();
  const authProvider = useAuthProvider();
  const error = (string, type = "error") => {
    notify(string, type);
  };
  const [values, setValues] = React.useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const changePassword = () => {
    authProvider.getIdentity().then(async (user) => {
      // console.log(user.user_id);
      if (values.password == "" || values.confirmPassword == "") {
        error("Please fill all fields.");
        return;
      }
      if (passwordValidator(values.password, "New ")) {
        error(passwordValidator(values.password, "New "));
        return;
      }
      if (passwordValidator(values.confirmPassword, "Confirm New ")) {
        error(passwordValidator(values.confirmPassword, "Confirm New "));
        return;
      }
      const url = app.api + "change_password";
      await axios
        .post(url, { ...values, id: user.user_id })
        .then((data) => {
          error("Password changed successfully.", "success");
          setValues({
            password: "",
            confirmPassword: "",
            showPassword: false,
          });
        })
        .catch((er) => {
          error("Internal server error.");
        });
      return;
    });
  };
  return (
    <Card
      style={{
        marginTop: 20,
      }}
    >
      <Title title={"Manage Password"} />
      <CardContent>
        <FormControl>
          <Grid container>
            <Grid item xs={12}>
              <MaterialTextField
                autoFocus
                label="New Password"
                variant="outlined"
                size="small"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                required
                onChange={handleChange("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{
                  marginBottom: 20,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <MaterialTextField
                label="Confirm New Password"
                variant="outlined"
                size="small"
                type={values.showPassword ? "text" : "password"}
                value={values.confirmPassword}
                required
                onChange={handleChange("confirmPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{
                  marginBottom: 20,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<LockIcon />}
                variant="contained"
                color="primary"
                onClick={changePassword}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default Password;
