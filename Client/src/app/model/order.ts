interface Order {
    customer_id: number;
    cart_id: number;
    summary: number;
    city: string;
    street: string;
    delivery_date: string;
    order_date: string;
    payment: string;
}

export default Order;