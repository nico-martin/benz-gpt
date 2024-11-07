import React from "react";

import icons, { IconName } from "./icons.ts";
import cn from "@utils/classnames.ts";

const SVG = ({
  icon,
  className = "",
  ...props
}: {
  icon: IconName;
  className?: string;
  [key: string]: any;
}) => {
  const LoadedIcon = React.useMemo(
    () => (icon in icons ? icons[icon] : null),
    [icon],
  );

  return LoadedIcon ? (
    <figure className={cn(className)} {...props}>
      <LoadedIcon />
    </figure>
  ) : null;
};

export default SVG;
