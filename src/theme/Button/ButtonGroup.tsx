import React from "react";

import styles from "./ButtonGroup.module.css";
import cn from "@utils/classnames";

const ButtonGroup: React.FC<{
  className?: string;
  children?: any;
  align?: "left" | "center" | "right";
}> = ({ className = "", children, align = "left" }) => (
  <div
    className={cn(
      className,
      styles.group,
      align === "right"
        ? styles.alignRight
        : align === "center"
          ? styles.alignCenter
          : styles.alignLeft,
    )}
  >
    {children}
  </div>
);

export default ButtonGroup;
