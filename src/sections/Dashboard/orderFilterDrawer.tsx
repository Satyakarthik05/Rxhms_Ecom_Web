import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Customer } from "../register/model/customer";
import { GetCustomerDetailsUri } from "./profileService/profileService";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { OrderStatus, OrderStatusDisplay } from "../myCart/model/orderStatus";
import { getFilterOptions } from "./getFilterOptions";

interface OrderFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: any) => void;
  onClear: () => void;
}

const OrderFilterDrawer: React.FC<OrderFilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
}) => {
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const { data: customerData } = useFetchByQuery<Customer>(
    GetCustomerDetailsUri,
    { username }
  );

  const [selectedType, setSelectedType] = useState<OrderStatus | null>(null);
 
  const [filterOptions, setFilterOptions] = useState<
    { label: string; key: string; value: any }[]
  >([]);
  const [selectedDateOption, setSelectedDateOption] = useState<string | null>("DAY:30");

const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>("Last 30 Days");


useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (customerData) {
      const registeredOn = customerData.registeredOn;
      console.log("Customer registeredOn:", registeredOn);

      if (registeredOn) {
        const options = getFilterOptions(registeredOn);
        setFilterOptions(options);
      }
    }
  }, [customerData]);

  console.log("Customer Data:", customerData);


  useEffect(() => {
  if (isOpen) {
    setSelectedDateOption("DAY:30"); // or null if you want empty
    setSelectedType(null);
  }
}, [isOpen]);


  

  const handleApplyFilters = () => {
    let filterType = null;
    let filterValue = null;

    if (selectedDateOption === null) {
      [filterType, filterValue] = [null, null];
    } else {
      [filterType, filterValue] = selectedDateOption.split(":");
    }

    const filterParams: Record<string, any> = {
      status: selectedType,
      filterType: filterType,
      filterValue: Number(filterValue),
        selectedDateLabel: selectedDateLabel,

    };

    console.log("@@@filterParams", filterParams);
    onApply(filterParams);
    onClose();
  };

  console.log("@@@ onChange", selectedDateOption);

  const handleClearFilters = () => {
    setSelectedType(null);
    setSelectedDateOption(null);
     onClear();
      onClose();
  };

  const isApplyFilter = !selectedType && !selectedDateOption;

  return (
    <Drawer
      title={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold" fontSize="1rem">
            FILTERS
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      }
      placement="right"
      open={isOpen}
      onClose={onClose}
      width={400}
      closable={false}
      bodyStyle={{ padding: 0 }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.info.main,
          padding: "8px 12px",
        }}
      >
        <Typography fontWeight={600} fontSize="0.9rem">
          Filter by Order Type
        </Typography>
      </Box>

      <FormControl component="fieldset" fullWidth sx={{ px: 2, pt: 1 }}>
        <RadioGroup
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as OrderStatus)}
        >
          {Object.values(OrderStatus).map((status) => (
            <FormControlLabel
              key={status}
              value={status}
              control={
                <Radio
                          checked={selectedType === status}
                           onClick={() =>
            setSelectedType((prev) => (prev === status ? null : status))
          }

                  sx={{
                    color: "#1a2e22",
                    "&.Mui-checked": { color: "#1a2e22" },
                  }}
                />
              }
              label={OrderStatusDisplay[status]}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                py: 1,
                m: 0,
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.info.main,
          padding: "8px 12px",
        }}
      >
        <Typography fontWeight={600} fontSize="0.9rem">
          Filter by Order Date
        </Typography>
      </Box>

      <FormControl component="fieldset" fullWidth sx={{ px: 2, pt: 1 }}>
        <RadioGroup
          value={selectedDateOption || ''}
         onChange={(e) => {
    const selected = e.target.value;
    setSelectedDateOption(selected);

    const selectedOption = filterOptions.find(
      (option) => `${option.key}:${option.value}` === selected
    );
    setSelectedDateLabel(selectedOption?.label || null);
  }}
        >
          {filterOptions.map((option) => (
            <FormControlLabel
              key={`${option.key}:${option.value}`}
              value={`${option.key}:${option.value}`}
              control={
                <Radio
                  sx={{
                    color: "#1a2e22",
                    "&.Mui-checked": { color: "#1a2e22" },
                  }}
                />
              }
              label={option.label}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                py: 1,
                m: 0,
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Box textAlign="center" mt={2}>
        <Button
          onClick={handleClearFilters}
          size="small"
          sx={{ color: "#1a2e22", textDecoration: "underline" }}
        >
          Clear Filters
        </Button>
      </Box>

      <Box display="flex" gap={1} mt={3} px={2} mb={2}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#1a2e22",
            color: "#1a2e22",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          disabled={isApplyFilter}
          fullWidth
          sx={{
            borderColor: (theme) => theme.palette.success.main,
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#15371f",
              color: "#fff",
              borderColor: (theme) => theme.palette.success.main,
            },
          }}
        >
          Apply
        </Button>
      </Box>
    </Drawer>
  );
};

export default OrderFilterDrawer;
