import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InvoiceForm.css";
// import checkBox from "./checkBox";

const baseURL = "http://simsoft.com.vn:8085/DeTestSo6/api";

const InvoiceForm = () => {
  const [show, setShow] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [invoice, setInvoice] = useState({
    invoiceNumber: "001",
    date: new Date().toISOString().split("T")[0],
    customerCode: "DAMI",
    customerName: "CÔNG TY TNHH PHẦN MỀM DA MI",
    address: "1331/57 Lê Đức Thọ, P. 14, Q. Gò Vấp, TP. Hồ Chí Minh",
    items: [
      {
        code: "MIGOI",
        name: "Mì gói",
        unit: "Gói",
        quantity: 4,
        price: 10000,
        total: 40000,
      },
      {
        code: "DAUAN",
        name: "Dầu ăn",
        unit: "Chai",
        quantity: 1,
        price: 35000,
        total: 35000,
      },
      {
        code: "MUOI",
        name: "Muối",
        unit: "Bịch",
        quantity: 2,
        price: 6000,
        total: 12000,
      },
    ],
    totalQuantity: 7,
    totalPrice: 87000,
  });

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/DeTestSo6/api/TblCustomerLists");
      console.log(response.data, "CustomerLists");
      setCustomers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("/DeTestSo6/api/TblItemLists");
      console.log(response.data, "ItemLists");
      setItems(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hàng hóa:", error);
    }
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    if (customerId) {
      try {
        const response = await axios.get(
          `/DeTestSo6/api/TblCustomerLists/${customerId}`
        );
        setCustomerInfo(response.data);
        setShow(!show);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
      }
    } else {
      setCustomerInfo({});
    }
  };

  const handleItemChange = async (itemId) => {
    setSelectedItem(itemId);
    if (itemId) {
      try {
        const response = await axios.get(`${baseURL}/TblItemLists/${itemId}`);
        setItemInfo(response.data);
        setUnitPrice(response.data.unitPrice || 0);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hàng hóa:", error);
      }
    } else {
      setItemInfo({});
      setUnitPrice(0);
    }
  };

  useEffect(() => {
    setTotalAmount(quantity * unitPrice);
  }, [quantity, unitPrice]);

  const submitInvoice = async (e) => {
    e.preventDefault();
    const invoiceData = {
      customerId: selectedCustomer,
      itemId: selectedItem,
      quantity: parseInt(quantity, 10),
      unitPrice: parseFloat(unitPrice),
      totalAmount: parseFloat(totalAmount),
      divSubId: "Số Điện Thoại Của Bạn",
    };

    try {
      await axios.post(`${baseURL}/TblOrderDetails`, invoiceData);
      alert("Hóa đơn đã được ghi thành công!");
    } catch (error) {
      console.error("Lỗi khi ghi hóa đơn:", error);
    }
  };

  return (
    <div className="border border-gray-400 p-4 bg-white w-full max-w-3xl">
      <h1 className="text-center text-lg font-bold mb-4">HÓA ĐƠN BÁN HÀNG</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <span className="w-1/3">Số hóa đơn:</span>
          <input
            type="text"
            value={invoice.invoiceNumber}
            className="border border-gray-400 p-1 w-full"
            readOnly
          />
        </div>
        <div className="flex items-center">
          <span className="w-1/3">Ngày:</span>
          <input
            type="text"
            value={invoice.date}
            className="border border-gray-400 p-1 w-full"
            readOnly
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="w-1/6">Khách hàng:</span>
          {/* <checkBox /> */}
          <input
            type="text"
            value={customerInfo.customerId || invoice.customerCode}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="border border-gray-400 p-1 w-1/4"
          />{" "}
          <button
            className="border border-gray-400 px-2 py-1"
            onClick={() => setShow(!show)}
          >
            {show ? ">" : "<"}
          </button>
          {show && (
            <select
              className="border border-gray-400 p-1 w-1/4 "
              multiple
              size={5}
              onChange={(e) => handleCustomerChange(e.target.value)}
            >
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  <div className="customer">
                    <span>
                      {"   "}
                      {customer.customerId}
                      {"--"} {customer.customerName}
                    </span>
                  </div>
                </option>
              ))}
            </select>
          )}
          {/* {console.log(invoice.customerCode)} */}
          <span className="w-1/2 pl-2">
            {customerInfo.customerName || invoice.customerName}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-1/4">Địa chỉ:</span>
          <input
            type="text"
            value={customerInfo.address || invoice.address}
            className="border border-gray-400 p-1 w-full"
            readOnly
          />
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-400 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Mã hàng</th>
            <th className="border border-gray-400 p-2">Tên hàng</th>
            <th className="border border-gray-400 p-2">ĐVT</th>
            <th className="border border-gray-400 p-2">Số lượng</th>
            <th className="border border-gray-400 p-2">Đơn giá</th>
            <th className="border border-gray-400 p-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-400 p-2">{item.code}</td>
              <td className="border border-gray-400 p-2">{item.name}</td>
              <td className="border border-gray-400 p-2">{item.unit}</td>
              <td className="border border-gray-400 p-2">{item.quantity}</td>
              <td className="border border-gray-400 p-2">
                {item.price.toLocaleString()}
              </td>
              <td className="border border-gray-400 p-2">
                {item.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="border border-gray-400 p-2 text-right">
              Tổng cộng
            </td>
            <td className="border border-gray-400 p-2">
              {invoice.totalQuantity}
            </td>
            <td colSpan="2" className="border border-gray-400 p-2 text-right">
              {invoice.totalPrice.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="flex justify-center space-x-4">
        <button
          className="border border-gray-400 px-4 py-2"
          onClick={submitInvoice}
        >
          Ghi
        </button>
        <button className="border border-gray-400 px-4 py-2">Bỏ qua</button>
        <button className="border border-gray-400 px-4 py-2">Trở về</button>
      </div>
    </div>
  );
};

export default InvoiceForm;
