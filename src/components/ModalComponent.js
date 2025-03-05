import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalComponent = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    invoiceNo: '',
    customerName: "",
    address1: "",
    address2: "",
    phone: "",
    invoiceDate: "",
    dueDate: "",
    clientGST: "",
    items: [],
    gstTax: "",
    igstTax: '',
    cgstTax: '',
    currency: "USD" 
  });

  const [newItem, setNewItem] = useState({
    description: "",
    validatorPayout: "",
    hsnSac: "",
    amount: "",
  });

  const [currencies, setCurrencies] = useState({});

  useEffect(() => {
    // Fetch currency data from ExchangeRate-API
    axios.get('https://open.er-api.com/v6/latest/USD')
      .then(response => {
        const currencyData = response.data.rates;
        const currencySymbols = {
          USD: "$",
          EUR: "€",
          GBP: "£",
          INR: "₹",
          JPY: "¥",
          AUD: "A$",
          CAD: "C$",
          CHF: "CHF",
          CNY: "¥",
          SEK: "kr",
          NZD: "NZ$"
        };
        setCurrencies(currencySymbols);
      })
      .catch(error => {
        console.error("Error fetching currency data:", error);
      });
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!newItem.description || !newItem.validatorPayout || !newItem.amount) {
      alert("Please fill all item fields before adding.");
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...newItem, amount: parseFloat(newItem.amount) }],
    });

    setNewItem({ description: "", validatorPayout: "", hsnSac: "", amount: "" });
  };

  const total = formData.items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  const currencySymbol = currencies[formData.currency] || formData.currency;


  const handleSubmit = () => {
    onSubmit({ ...formData, total, currency: currencies[formData.currency] || formData.currency });
    onClose();
  };
  


  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Invoice Details</h2>

        {/* Currency Dropdown */}
        <label>Currency:</label>
        <select name="currency" value={formData.currency} onChange={handleChange}>
  {Object.entries(currencies || {}).map(([code, symbol]) => (
    <option key={code} value={code}>{code} ({symbol})</option>
  ))}
</select>



        <label>Invoice No:</label>
        <input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />

        <label>Customer Name:</label>
        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />

        <label>Address Line 1:</label>
        <input type="text" name="address1" value={formData.address1} onChange={handleChange} />

        <label>Address Line 2:</label>
        <input type="text" name="address2" value={formData.address2} onChange={handleChange} />

        <label>PIN Code:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

        <label>Invoice Date:</label>
        <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} />

        <label>Due Date:</label>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />

        <label>Client GST:</label>
        <input type="text" name="clientGST" value={formData.clientGST} onChange={handleChange} />

        <h3>Add Invoice Items</h3>
        <label>Description:</label>
        <input type="text" name="description" value={newItem.description} onChange={handleItemChange} />

        <label>Validator Payout:</label>
        <input type="text" name="validatorPayout" value={newItem.validatorPayout} onChange={handleItemChange} />

        <label>Amount:</label>
        <input type="number" name="amount" value={newItem.amount} onChange={handleItemChange} />

        <button type="button" onClick={addItem}>Add Item</button>

        {/* Display Added Items */}
        {formData.items.length > 0 && (
          <>
            <h3>Added Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Validator Payout</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.validatorPayout}</td>
                    <td>{currencySymbol} {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Invoice Summary */}
        <h3>Invoice Summary</h3>
        <div>
          <label>G.S.T. (%):</label>
          <input type="number" name="gstTax" value={formData.gstTax} onChange={handleChange} />
        </div>
        <div>
          <label>I.G.S.T. (%):</label>
          <input type="number" name="igstTax" value={formData.igstTax} onChange={handleChange} />
        </div>
        <div>
          <label>C.G.S.T. (%):</label>
          <input type="number" name="cgstTax" value={formData.cgstTax} onChange={handleChange} />
        </div>
        
        <p><strong>Total: {currencySymbol} {total.toFixed(2)}</strong></p>

        <button type="button" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalComponent;
