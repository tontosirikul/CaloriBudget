// Created by Tanhapon Tosirikul 2781155t
export const formatDecimal = (value: number): string => {
  return value % 1 !== 0 ? value.toFixed(2) : value.toString();
};
