import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InvoiceForm.css";
// import checkBox from "./checkBox";

const baseURL = "http://simsoft.com.vn:8085/DeTestSo6/api";
const generateInvoiceNumber = () => {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 chữ số ngẫu nhiên
  return `INV-${datePart}-${randomPart}`;
};

const InvoiceForm = () => {
  const [show, setShow] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoice, setInvoice] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toISOString().split("T")[0],
    customerCode: "DAMI",
    customerName: "CÔNG TY TNHH PHẦN MỀM DA MI",
    address: "1331/57 Lê Đức Thọ, P. 14, Q. Gò Vấp, TP. Hồ Chí Minh",
    items: [
      {
        itemId: "MIGOI",
        itemName: "Mì gói",
        invUnitOfMeasr: "Gói",
        quantity: 4,
        price: 10000,
        total: 40000,
      },
      {
        itemId: "DAUAN",
        itemName: "Dầu ăn",
        invUnitOfMeasr: "Chai",
        quantity: 1,
        price: 35000,
        total: 35000,
      },
      {
        itemId: "MUOI",
        itemName: "Muối",
        invUnitOfMeasr: "Bịch",
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
    fetchInvoice();
  }, []);

  useEffect(() => {
    setTotalAmount(quantity * unitPrice);
  }, [quantity, unitPrice]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/DeTestSo6/api/TblCustomerLists");
      // console.log(response.data, "CustomerLists");
      setCustomers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await axios.get("/DeTestSo6/api/TblOrderDetails");
      console.log(response.data, "Hóa Đơn");
      setInvoiceItems(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy Hóa Đơn:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("/DeTestSo6/api/TblItemLists");
      // console.log(response.data, "ItemLists");
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
    setShowItem(!showItem);
    console.log(selectedItem, "selectedItem");
    if (itemId) {
      try {
        const response = await axios.get(
          `/DeTestSo6/api/TblItemLists/${itemId}`
        );
        setItemInfo(response.data);
        console.log(response.data, "itemInfo1");

        console.log(itemInfo, "itemInfo2");
        const newItem = {
          itemId: response.data.itemId,
          itemName: response.data.itemName,
          invUnitOfMeasr: response.data.invUnitOfMeasr,
          quantity: parseInt(quantity, 10),
          price: parseFloat(unitPrice),
          total: parseFloat(totalAmount),
        };
        const newItems = [...invoice.items];
        newItems[parseInt(selectedItem)] = newItem;
        setInvoice({
          ...invoice,
          items: newItems,
        });

        console.log(
          invoice.items[parseInt(selectedItem)],
          invoice.items,
          "itemInfo"
        );
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
      orderDate: invoice.date || new Date().toISOString(),
      orderNo: invoice.invoiceNumber || `INV-${Date.now()}`,
      customerId: selectedCustomer || "default-customer",
      totalAmount:
        isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0
          ? 1
          : parseFloat(totalAmount),
      divSubId: "0977650410",
      itemId: "test", // ⚠️ Đảm bảo có ItemId
    };
    console.log("Dữ liệu gửi lên:", invoiceData); // Kiểm tra dữ liệu trước khi gửi

    try {
      const response = await axios.post(
        "/DeTestSo6/api/TblOrderDetails",
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Phản hồi từ server:", response.data);
      alert("Hóa đơn đã được ghi thành công!");
    } catch (error) {
      console.error("Lỗi khi ghi hóa đơn:", error);
      if (error.response) {
        console.error("Chi tiết lỗi từ server:", error.response.data);
        alert(`Lỗi: ${JSON.stringify(error.response.data.errors)}`);
      }
    }
  };

  const handleAddItem = () => {
    const newItem = {
      itemId: itemInfo.itemId,
      itemName: itemInfo.itemName,
      invUnitOfMeasr: itemInfo.unit,
      quantity: parseInt(quantity, 10),
      price: parseFloat(unitPrice),
      total: parseFloat(totalAmount),
    };

    const newItems = [...invoice.items, newItem];
    setInvoice({
      ...invoice,
      items: newItems,
      totalQuantity: invoice.totalQuantity + 1,
      totalPrice: invoice.totalPrice + totalAmount,
    });
    setQuantity(1);
    setSelectedItem("");
    setUnitPrice(0);
    setTotalAmount(0);
    setShowItem(false);
  };

  const updateItemQuantity = (index, newQuantity) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].quantity = parseInt(newQuantity, 10) || 1;
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].price;

    setInvoice({
      ...invoice,
      items: updatedItems,
      totalQuantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.total, 0),
    });
  };

  const updateItemPrice = (index, newPrice) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].price = parseInt(newPrice, 10) || 1000;
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].price;

    setInvoice({
      ...invoice,
      items: updatedItems,
      totalQuantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.total, 0),
    });
  };

  const updateItemTotal = (index, newTotal) => {
    const updatedItems = [...invoice.items];
    updatedItems[index].total = parseInt(newTotal, 10) || 0;
    updatedItems[index].price =
      updatedItems[index].total / updatedItems[index].quantity || 0;

    setInvoice({
      ...invoice,
      items: updatedItems,
      totalQuantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: updatedItems.reduce((sum, item) => sum + item.total, 0),
    });
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
        <div className="flex items-center mb-2 relative">
          <span className="w-1/6">Khách hàng:</span>
          {/* <checkBox /> */}
          <input
            type="text"
            value={customerInfo.customerId || invoice.customerCode}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="border border-gray-400 p-1 w-1/6"
            onClick={() => setShow(!show)}
          />{" "}
          {/* <button
            className="border border-gray-400 mb-2 br-1 p-1"
            onClick={() => setShow(!show)}
          >
            {"▼"}
          </button> */}
          {show && (
            <select
              className="border border-gray-400 p-1 absolute top-0 left-100"
              multiple
              size={5}
              onChange={(e) => handleCustomerChange(e.target.value)}
            >
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  <div className="customer">
                    <span>
                      <div className="inline-block border border-black">
                        <div className="border border-black p-2 w-1/3 mr-4 mb-[30px]">
                          {customer.customerId} {"-                -"}
                        </div>
                        <div className="border border-black p-2 w-2/3 ml-4">
                          {customer.customerName}
                        </div>
                      </div>
                      {/* {"   "}
                      {customer.customerId}
                      {"--"} {customer.customerName} */}
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
          />
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-400 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 1/6">
              Mã hàng{" "}
              <button
                className="border border-gray-400 mb-2 br-1 p-1"
                onClick={() => handleAddItem()}
              >
                {"+"}
              </button>
            </th>
            <th className="border border-gray-400 p-2 w-1/4">Tên hàng</th>
            <th className="border border-gray-400 p-2 w-1/6">ĐVT</th>
            <th className="border border-gray-400 p-2 w-1/12">Số lượng</th>
            <th className="border border-gray-400 p-2 w-1/6">Đơn giá</th>
            <th className="border border-gray-400 p-2 w-1/6">Thành tiền</th>
          </tr>
        </thead>
        <tbody className="relative ">
          {invoice.items.map((item, index1) => (
            <tr key={index1} className="border border-gray-400 p-2 w-1/6">
              <td className="border border-gray-400 p-2">
                <input
                  type="text"
                  value={item.itemId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="border-none outline-none mb-0"
                  onClick={() => {
                    setShowItem(!showItem);
                    setSelectedItem(index1);
                  }}
                />
              </td>
              {showItem && (
                <select
                  className="border border-gray-400 p-1 absolute top-0 left-100 w-1/2"
                  multiple
                  size={5}
                  onChange={(e) => {
                    handleItemChange(e.target.value);
                  }}
                >
                  {items.map((item, index) => (
                    <option key={index} value={item.itemId}>
                      {item.itemId} - {item.itemName}
                    </option>
                  ))}
                </select>
              )}
              <td className="border border-gray-400 p-2">{item.itemName}</td>
              <td className="border border-gray-400 p-2">
                {item.invUnitOfMeasr}
              </td>
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateItemQuantity(index1, e.target.value)}
                  className="w-full text-center border-none outline-none"
                />
              </td>
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  value={item.price}
                  min="1000"
                  step="1000"
                  onChange={(e) => updateItemPrice(index1, e.target.value)}
                  className="w-full text-center border-none outline-none"
                />
              </td>
              <td className="border border-gray-400 p-2">
                <input
                  type="number"
                  value={item.total}
                  min="0"
                  step="1000"
                  onChange={(e) => updateItemTotal(index1, e.target.value)}
                  className="w-full text-center border-none outline-none"
                />
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
