import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import ActionDelete from "@material-ui/icons/Delete";
import classnames from "classnames";
import { translate, crudDelete, startUndoable } from "ra-core";
import IconCancel from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Button } from "react-admin";

const styles = (theme) => ({
  deleteButton: {
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.error.main, 0.12),
      // Reset on mouse devices
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
});

class CustomDeleteButton extends Component {
  state = {
    showDialog: false,
  };

  handleClick = () => {
    this.setState({ showDialog: true });
  };

  handleCloseClick = () => {
    this.setState({ showDialog: false });
  };

  handleDelete = (event) => {
    event.preventDefault();
    this.setState({ showDialog: false });
    const { dispatchCrudDelete, startUndoable, resource, record, undoable } =
      this.props;
    if (undoable) {
      startUndoable(dispatchCrudDelete(resource, record.id, record));
    } else {
      dispatchCrudDelete(resource, record.id, record);
    }
  };

  render() {
    const { showDialog } = this.state;
    const { label = "ra.action.delete", classes = {}, className } = this.props;
    return (
      <Fragment>
        <Button
          onClick={this.handleClick}
          label={label}
          className={classnames(
            "ra-delete-button",
            classes.deleteButton,
            className
          )}
          key="button"
        >
          <ActionDelete />
        </Button>
        <Dialog
          fullWidth
          open={showDialog}
          onClose={this.handleCloseClick}
          aria-label="Are you sure?"
        >
          <form action="/" method="POST" onSubmit={this.handleDelete}>
            <DialogTitle>Delete Purcahse Order</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure You want to delete purcahse order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                label="ra.action.delete"
                className={classnames(
                  "ra-delete-button",
                  classes.deleteButton,
                  className
                )}
                key="button"
              >
                <ActionDelete />
              </Button>
              <Button label="ra.action.cancel" onClick={this.handleCloseClick}>
                <IconCancel />
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Fragment>
    );
  }
}

CustomDeleteButton.propTypes = {
  basepath: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  dispatchCrudDelete: PropTypes.func.isRequired,
  label: PropTypes.string,
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
  ]),
  resource: PropTypes.string,
  startUndoable: PropTypes.func,
  translate: PropTypes.func,
  undoable: PropTypes.bool,
  onSuccess: PropTypes.func,
};

CustomDeleteButton.defaultProps = {
  redirect: "list",
  undoable: true,
};

export default compose(
  connect(null, { startUndoable, dispatchCrudDelete: crudDelete }),
  translate,
  withStyles(styles)
)(CustomDeleteButton);
