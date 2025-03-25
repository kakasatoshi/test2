import React from "react";
// import "./listBox.css";

const ListBox = ({ data, onSelect }) => {
  console.log(data, "listbox data");
  return (
    <select multiple size={4} onChange={(e) => onSelect(e.target.value)}>
      {data.map((customer) => (
        <option key={customer.customerId} value={customer.customerId}>
         
          {customer.customerName}
        </option>
      ))}
    </select>
  );
};

export default ListBox;
