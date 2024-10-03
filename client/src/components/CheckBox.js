// checkbox.js
import React from "react";

const Checkbox = (props) => {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        name={props.name}
        checked={props.val}
        onChange={() => {
          props.setValue(!props.val);
        }}
      />
      {props.label}
    </label>
  );
};

export default Checkbox;
