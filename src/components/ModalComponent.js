import React, { useState } from "react";

const ModalComponent = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    address1: "",
    address2: "",
    phone: "",
    invoiceDate: "",
    dueDate: "",
    clientGST: "",
    items: [],
    taxRate: "", // Tax Rate Field Only
  });

  const [newItem, setNewItem] = useState({
    description: "",
    validatorPayout: "",
    hsnSac: "",
    amount: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!newItem.description || !newItem.validatorPayout || !newItem.hsnSac || !newItem.amount) {
      alert("Please fill all item fields before adding.");
      return;
    }

    setFormData({
      ...formData,
      items: [...formData.items, { ...newItem, amount: parseFloat(newItem.amount) }],
    });

    setNewItem({ description: "", validatorPayout: "", hsnSac: "", amount: "" });
  };

  // Calculate total (sum of item amounts)
  const total = formData.items.reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const handleSubmit = () => {
    onSubmit({ ...formData, total });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Invoice Details</h2>

        <label>Customer Name:</label>
        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />

        <label>Address Line 1:</label>
        <input type="text" name="address1" value={formData.address1} onChange={handleChange} />

        <label>Address Line 2:</label>
        <input type="text" name="address2" value={formData.address2} onChange={handleChange} />

        <label>Phone:</label>
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

        <label>HSN/SAC:</label>
        <input type="text" name="hsnSac" value={newItem.hsnSac} onChange={handleItemChange} />

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
                  <th>HSN/SAC</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.validatorPayout}</td>
                    <td>{item.hsnSac}</td>
                    <td>₹ {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Invoice Summary */}
        <h3>Invoice Summary</h3>
        <div>
          <label>Tax Rate (%):</label>
          <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} />
          <p><strong>Total: ₹ {total.toFixed(2)}</strong></p>
        </div>

        <button type="button" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalComponent;