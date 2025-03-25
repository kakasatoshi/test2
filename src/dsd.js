import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = "http://simsoft.com.vn:8085/DeTestSo6/api";

const InvoiceForm = () => {
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [customerInfo, setCustomerInfo] = useState({});
    const [itemInfo, setItemInfo] = useState({});

    useEffect(() => {
        fetchCustomers();
        fetchItems();
    }, []);

    const fetchCustomers = async () => {
        const response = await axios.get(`${baseURL}/TblCustomerLists`);
        setCustomers(response.data);
    };

    const fetchItems = async () => {
        const response = await axios.get(`${baseURL}/TblItemLists`);
        setItems(response.data);
    };

    const fetchCustomerInfo = async (customerId) => {
        const response = await axios.get(`${baseURL}/TblCustomerLists/${customerId}`);
        setCustomerInfo(response.data);
    };

    const fetchItemInfo = async (itemId) => {
        const response = await axios.get(`${baseURL}/TblItemLists/${itemId}`);
        setItemInfo(response.data);
    };

    const calculateTotal = () => {
        const total = quantity * unitPrice;
        setTotalAmount(total);
    };

    const submitInvoice = async () => {
        const invoiceData = {
            customerId: selectedCustomer,
            itemId: selectedItem,
            quantity,
            unitPrice,
            totalAmount,
            divSubId: "Số Điện Thoại Của Bạn" // Gán số điện thoại của bạn
        };

        try {
            const response = await axios.post(`${baseURL}/TblOrderDetails`, invoiceData);
            alert("Hóa đơn đã được ghi thành công!");
            // Reset form hoặc thực hiện các hành động khác
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    return (
        <div>
            <h1>Nhập Hóa Đơn Bán Hàng</h1>
            <form onSubmit={(e) => { e.preventDefault(); submitInvoice(); }}>
                <label>Mã Khách Hàng:</label>
                <select value={selectedCustomer} onChange={(e) => {
                    setSelectedCustomer(e.target.value);
                    fetchCustomerInfo(e.target.value);
                }}>
                    <option value="">Chọn Khách Hàng</option>
                    {customers.map(customer => (
                        <option key={customer.customerId} value={customer.customerId}>
                            {customer.customerName}
                        </option>
                    ))}
                </select>
                {customerInfo.customerName && (
                    <div>
                        <p>Tên: {customerInfo.customerName}</p>
                        <p>Địa Chỉ: {customerInfo.address}</p>
                    </div>
                )}

                <label>Mã Hàng:</label>
                <select value={selectedItem} onChange={(e) => {
                    setSelectedItem(e.target.value);
                    fetchItemInfo(e.target.value);
                }}>
                    <option value="">Chọn Hàng Hóa</option>
                    {items.map(item => (
                        <option key={item.itemId} value={item.itemId}>
                            {item.itemName}
                        </option>
                    ))}
                </select>
                {itemInfo.itemName && (
                    <div>
                        <p>Tên Hàng: {itemInfo.itemName}</p>
                        <p>Đơn Vị: {itemInfo.invUnitOfMeasr}</p>
                    </div>
                )}

                <label>Số Lượng:</label>
                <input type="number" value={quantity} onChange={(e) => {
                    setQuantity(e.target.value);
                    calculateTotal();
                }} />

                <label>Đơn Giá:</label>
                <input type="number" value={unitPrice} onChange={(e) => {
                    setUnitPrice(e.target.value);
                    calculateTotal();
                }} />

                <label>Thành Tiền:</label>
                <input type="number" value={totalAmount} readOnly />

                <button type="submit">Ghi Hóa Đơn</button>
            </form>
        </div>
    );
};

export default InvoiceForm;