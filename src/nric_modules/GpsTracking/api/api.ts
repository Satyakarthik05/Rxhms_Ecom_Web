import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.3:8080/api',
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data ||
        'Request failed';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'));
    } else {
      return Promise.reject(new Error('Request setup error'));
    }
  }
);

// ===== Customer Endpoints =====
export const register = (data: any) => API.post('/customer/register', data);
export const login = (data: any) => API.post('/customer/login', data);
export const updateCustomerLocation = (id: number, coords: any) =>
  API.put(`/customer/location/${id}`, coords);
export const updateCustomerAddress = (id: number, data: any) =>
  API.put(`/customer/address/${id}`, data);
export const fetchShopsForCustomer = (customerId: number) =>
  API.get(`/customer/shops/${customerId}`);
export const getCustomerLocation = (customerId: number) =>
  API.get(`/customer/location/${customerId}`);

// ===== Orders Endpoints =====
export const getCustomerOrders = (customerId: number, shopId: number) =>
  API.get(`/orders/customer/${customerId}?shopId=${shopId}`);

export const createOrder = (orderData: any) => API.post('/orders', orderData);

export const getOrderDetails = (orderId: number) =>
  API.get(`/orders/${orderId}`);

// ===== Items Endpoints =====
export const getAllItems = () => API.get('/items');