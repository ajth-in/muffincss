import { Link as TanStackLink } from "@tanstack/react-router";
import { ComponentProps } from "react";
const Link = (props: ComponentProps<typeof TanStackLink>) => {
  const { children, ...linkProps } = props;
  return <TanStackLink {...linkProps}>{children}</TanStackLink>;
};

export default Link;
