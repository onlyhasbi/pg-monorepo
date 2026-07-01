import * as React from "react";
import {
  createLink,
  type NavigateOptions,
  useNavigate,
} from "@tanstack/react-router";

const BaseAnchor = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>((props, ref) => {
  // biome-ignore lint/a11y/useAnchorContent: standard anchor tag
  return <a ref={ref} {...props} />;
});

// We use createLink from TanStack Router wrapping a base anchor component.
// This prevents wrapping the Link component inside another Link component,
// which causes active classes to be calculated and rendered twice during SSR.
const CreatedLink = createLink(BaseAnchor);

/**
 * AppLink is a wrapper around the standard Link component that defaults
 * the 'from' prop to '/' (root). This ensures that all navigations resolve
 * from the absolute root and prevents 'Could not find match for from' warnings
 * during route transitions.
 *
 * We force 'from="/"' to ensure absolute character for all links.
 */
export const AppLink: typeof CreatedLink = (props) => {
  return <CreatedLink from="/" {...props} />;
};

/**
 * useAppNavigate is a custom hook that wraps useNavigate and ensures
 * that all navigations default to 'from: "/"'.
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return (options: NavigateOptions) => {
    return navigate({ from: "/", ...options });
  };
}
