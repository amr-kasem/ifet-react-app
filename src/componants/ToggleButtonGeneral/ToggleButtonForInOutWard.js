import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#198754",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "darkorange",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      checked={props.checked} // Pass checked from props
      onChange={props.onChange} // Pass onChange from props
      {...props}
    />
  );
});

const ToggleButtonForInOutWard = ({
  label1 = "Static Load", // Default labels
  label2 = "Cyclic Load",
  defaultChecked,
  disabled = false,
  onToggleChange,
  textColor,
}) => {
  const [switchValue, setSwitchValue] = useState(defaultChecked);

  useEffect(() => {
    setSwitchValue(defaultChecked);
  }, [defaultChecked]);

  const handleSwitchChange = (e) => {
    const newValue = e.target.checked ? label2 : label1;
    setSwitchValue(newValue);
    if (onToggleChange) {
      onToggleChange(newValue); // Trigger the parent function when toggle changes
    }
  };

  return (
    <div className="d-flex">
      <FormControlLabel
        control={
          <IOSSwitch
            checked={switchValue === label2} // Use label2 to determine checked state
            onChange={handleSwitchChange} // Handle switch change
            disabled={disabled} // Disable if needed
          />
        }
        label={switchValue} // Show the current state (either label1 or label2)
        labelPlacement="start"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          color: textColor
        }}
      />
    </div>
  );
};

export default ToggleButtonForInOutWard;
