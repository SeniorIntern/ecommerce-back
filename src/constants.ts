const DB_NAME = 'ecommerce';
const PRODUCT_MAX_SUBIMAGES = 4;
const OrderStatusEnum = {
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED'
};
const AvailableOrderStatuses = Object.values(OrderStatusEnum);
const PaymentProviderEnum = {
  UNKNOWN: 'UNKNOWN',
  RAZORPAY: 'RAZORPAY',
  PAYPAL: 'PAYPAL'
};
const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

export {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  DB_NAME,
  OrderStatusEnum,
  PRODUCT_MAX_SUBIMAGES,
  PaymentProviderEnum
};
