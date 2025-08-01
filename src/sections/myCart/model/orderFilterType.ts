export enum OrderFilter {
  DAY = "DAY",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export const OrderFilterTypesDisplay: Record<OrderFilter, string> = {
  [OrderFilter.DAY]: "Day",
  [OrderFilter.MONTH]: "Month",
  [OrderFilter.YEAR]: "Year",
};
