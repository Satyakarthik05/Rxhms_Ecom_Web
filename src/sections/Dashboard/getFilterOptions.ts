import { OrderFilter } from "../myCart/model/orderFilterType";

export const getFilterOptions = (
  registeredOn: string
): { label: string; key: string; value: number }[] => {
  const options = [
    { label: "Last 30 Days", key: OrderFilter.DAY, value: 30 },
    { label: "Last 3 Months", key: OrderFilter.MONTH, value: 3 },
  ];

  if (!registeredOn) return options;

  const startYear = new Date(registeredOn).getFullYear(); 
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= startYear; year--) {
    options.push({ label: `${year}`, key: OrderFilter.YEAR, value: year });
  }

  return options;
};
