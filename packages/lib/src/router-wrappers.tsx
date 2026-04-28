import {
  createLink,
  Link,
  useNavigate,
  type NavigateOptions,
} from "@tanstack/react-router";

// We use createLink from TanStack Router which is the official way to create
// a type-safe wrapper for the Link component while preserving all generics
// and autocomplete features.
const CreatedLink = createLink(Link);

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
