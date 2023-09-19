// From https://frontendmasters.com/courses/advanced-redux/
export type RequireOnly<T, P extends keyof T> = Pick<T, P> &
  Partial<Omit<T, P>>;
