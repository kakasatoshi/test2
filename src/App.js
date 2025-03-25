import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceForm from "./components/InvoiceForm";
import "./App.css";
const App = () => {
  return (
    <div>
      <InvoiceForm />
    </div>
  );
};

export default App;
