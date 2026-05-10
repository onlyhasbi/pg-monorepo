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
 * AppLink is a type-safe wrapper around the standard Link component.
 * Uses createLink for proper generics and autocomplete.
 * All paths should be absolute (e.g., to="/register") to avoid ambiguity.
 */
export const AppLink: typeof CreatedLink = (props) => {
  return <CreatedLink {...props} />;
};

/**
 * useAppNavigate wraps useNavigate for consistent navigation patterns.
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return (options: NavigateOptions) => {
    return navigate(options);
  };
}
