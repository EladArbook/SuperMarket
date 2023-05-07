interface Customer {
    first_name: string;
    last_name: string;
    email: string;
    id: number;
    pass: string;
    city: string;
    street: string;
    role: string | null;
}

export default Customer;