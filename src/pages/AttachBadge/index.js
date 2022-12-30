import { Badge } from "antd";
import React from "react";

const AttachBadge = (props) => {
    if (!props.showBadge) {
      return props.children;
    }
  
    return (
      <Badge.Ribbon text="Business" color="blue">
        {props.children}
      </Badge.Ribbon>
    )
  };

  export default AttachBadge