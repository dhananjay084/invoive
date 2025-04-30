import React, { useState, useEffect } from "react";
import axios from "axios";

const data = [
  {
    name: 'HW WELLNESS SOLUTIONS PVT LTD',
    address1: ' S.No 254, Tirumalla Industry Estate',
    address2: 'Phase 2 road, Hinjawadi , Pune, Maharashtra',
    pincode: '411057',
    panNo: 'AADCH3292H',
    gst: '27AADCH3292H1ZI'
  },
  {
    name: 'WOGGLES DISTRIBUTION PRIVATE LIMITED',
    address1: 'C/O CHANDERSH BHOLA, SHAYAM LAL',
    address2: 'EKALINGPURA CHORAHA, MANVAKHEDA,Udaipur, Udaipur, Rajasthan',
    pincode: '313001',
    panNo: 'AADCW4321J',
    gst: '08AADCW4321J1ZA'
  },
  {
    name: 'INMARK EXPORTS PRIVATE LIMITED',
    address1: 'E-33, 34, 35, 36, INDUSTRIAL AREA GNEPIP SITE-5',
    address2: 'KASNA GREATER NOIDA, GREATER NOIDA,Gautambuddha Nagar,Uttar Pradesh',
    pincode: '201308',
    panNo: 'AAACI2271G',
    gst: '09AAACI2271G1ZR'
  },
  {
    name: 'RENEE COSMETICS PRIVATE LIMITED',
    address1: 'Office No. 4, OM Complex, C.G. Road,',
    address2: 'SWASTIK SOCIETY, AHMEDABAD,Gujarat, India ',
    pincode: '380009',
    panNo: 'AAJCR8656B',
    gst: '24AAJCR8656B1ZA'
  },
  {
    name: 'Zed Lifestyle Pvt Ltd - Gujarat',
    address1: 'Reg. Office - 711, Shapath V, S.G. Road,',
    address2: 'Prahlad Nagar, Ahmedabad,Gujarat ',
    pincode: '380015',
    panNo: 'AAACZ9479M',
    gst: '24AAACZ9479M1ZH'
  },
  {
    name: 'TITAN COMPANY LIMITED',
    address1: 'NO.193, INTEGRITY, Veerasandra',
    address2: 'Electronics City P.O, Off Hosur,Bangalore, Bengaluru (Bangalore) Urban,Karnataka',
    pincode: '560100',
    panNo: 'AAACT5131A',
    gst: '29AAACT5131A1ZT'
  },
  {
    name: 'Chameleon Ads',
    address1: 'NO.193, INTEGRITY, Veerasandra',
    address2: 'Spain',
    pincode: '',
    panNo: '',
    gst: ''
  },
  {
    name: 'FNP E Retail Private Limited',
    address1: 'Ground Floor & First Floor, Plot No. 75P',
    address2: 'Vatika Tower, Sector 44, Gurugram,Haryana',
    pincode: '122001',
    panNo: 'AAECF4247K',
    gst: '06AAECF4247K1ZJ'
  },
  {
  name: 'GUVI GEEK NETWORK PRIVATE LIMITED',
  address1: 'Third floor, Module No. D3-09',
  address2: 'IITM Research Park, D Block, Kanagam,Taramani Road, Chennai,Tamil Nadu',
  pincode: '600113',
  panNo: 'AAFCG7941Q',
  gst: '33AAFCG7941Q1Z1'
},
{
  name: 'Salty E-Commerce Private Limited',
  address1: 'C-29, FIRST FLOOR, PAMPOSH ENCLAVE',
  address2: 'Greater Kailash 1, New Delhi, South Delhi,Delhi',
  pincode: '110048',
  panNo: 'ABICS8098N',
  gst: '07ABICS8098N1ZB'
},
{
  name: 'WINSTON ELECTRONICS PRIVATE LIMITED',
  address1: 'House No 742 Sector 14,',
  address2: 'House No 742 Sector 14,  Faridabad,Haryana',
  pincode: '121007',
  panNo: 'AADCW0104F',
  gst: '06AADCW0104F1ZY'
}

];

const ModalComponent = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    invoiceNo: '',
    customerName: "",
    address1: "",
    address2: "",
    address3:'',
    phone: "",
    invoiceDate: "",
    dueDate: "",
    clientGST: "",
    items: [],
    gstTax: "",
    igstTax: '',
    cgstTax: '',
    currency: "USD",
    panNo: ""
  });

  const [newItem, setNewItem] = useState({
    description: "",
    validatorPayout: "",
    hsnSac: "",
    amount: "",
    validationNo: "" // Add this field
});

  const [editingIndex, setEditingIndex] = useState(null); // Add this line for edit functionality

  const [currencies, setCurrencies] = useState({});

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // First try the primary API
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        const currencyData = response.data.rates;
        
        // Comprehensive currency symbols map
        const currencySymbols = {
          USD: "$",      // US Dollar
          EUR: "€",      // Euro
          GBP: "£",      // British Pound
          INR: "₹",      // Indian Rupee
          JPY: "¥",      // Japanese Yen
          AUD: "A$",     // Australian Dollar
          CAD: "C$",     // Canadian Dollar
          CHF: "CHF",    // Swiss Franc
          CNY: "¥",      // Chinese Yuan
          SEK: "kr",     // Swedish Krona
          NZD: "NZ$",    // New Zealand Dollar
          SGD: "S$",     // Singapore Dollar
          HKD: "HK$",    // Hong Kong Dollar
          KRW: "₩",      // South Korean Won
          MXN: "MX$",    // Mexican Peso
          BRL: "R$",     // Brazilian Real
          RUB: "₽",      // Russian Ruble
          ZAR: "R",      // South African Rand
          AED: "د.إ",    // UAE Dirham
          SAR: "﷼",      // Saudi Riyal
          TRY: "₺",      // Turkish Lira
          IDR: "Rp",     // Indonesian Rupiah
          MYR: "RM",     // Malaysian Ringgit
          THB: "฿",      // Thai Baht
          PHP: "₱",      // Philippine Peso
          PLN: "zł",     // Polish Zloty
          DKK: "kr",     // Danish Krone
          NOK: "kr",     // Norwegian Krone
          ILS: "₪",      // Israeli Shekel
          CZK: "Kč",     // Czech Koruna
          HUF: "Ft",     // Hungarian Forint
          RON: "lei",    // Romanian Leu
          BGN: "лв",     // Bulgarian Lev
          HRK: "kn",     // Croatian Kuna
          ISK: "kr",     // Icelandic Króna
          // Add more currencies as needed
        };
  
        // Filter to only include currencies that exist in the API response
        const availableCurrencies = {};
        for (const [code, symbol] of Object.entries(currencySymbols)) {
          if (currencyData[code]) {
            availableCurrencies[code] = symbol;
          }
        }
  
        setCurrencies(availableCurrencies);
      } catch (error) {
        console.error("Error fetching currency data:", error);
        
        // Fallback to a static list if API fails
        const fallbackCurrencies = {
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
          NZD: "NZ$",
          SGD: "S$",
          HKD: "HK$",
          KRW: "₩",
          MXN: "MX$",
          BRL: "R$"
        };
        setCurrencies(fallbackCurrencies);
      }
    };
  
    fetchCurrencies();
  }, []);

  const handleCustomerSelect = (e) => {
    const selectedCustomerName = e.target.value;
    const selectedCustomer = data.find(customer => customer.name === selectedCustomerName);
    
    if (selectedCustomer) {
      setFormData({
        ...formData,
        customerName: selectedCustomer.name,
        address1: selectedCustomer.address1,
        address2: selectedCustomer.address2,
        address3: "",
        phone: selectedCustomer.pincode,
        clientGST: selectedCustomer.gst,
        panNo: selectedCustomer.panNo
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
};

  // const addItem = () => {
  //   if (!newItem.description || !newItem.validatorPayout || !newItem.amount) {
  //     alert("Please fill all item fields before adding.");
  //     return;
  //   }

  //   setFormData({
  //     ...formData,
  //     items: [...formData.items, { ...newItem, amount: parseFloat(newItem.amount) }],
  //   });

  //   setNewItem({ description: "", validatorPayout: "", hsnSac: "", amount: "" });
  // };

  const total = formData.items.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  const currencySymbol = currencies[formData.currency] || formData.currency;

  // const handleSubmit = () => {
  //   onSubmit({ ...formData, total, currency: currencies[formData.currency] || formData.currency });
  //   onClose();
  // };
  const handleSubmit = () => {
    onSubmit({ 
      ...formData, 
      total,
      currency: formData.currency, // This will be the currency code (e.g., "USD")
      currencySymbol: currencies[formData.currency] || formData.currency // This will be the symbol (e.g., "$")
    });
    onClose();
  };
  const addItem = () => {
    if (!newItem.description || !newItem.validatorPayout || !newItem.amount) {
      alert("Please fill all required item fields before adding.");
      return;
    }
    const itemToAdd = {
      description: newItem.description,
      validatorPayout: newItem.validatorPayout,
      hsnSac: newItem.hsnSac || "998361", // Use default value if empty
      amount: parseFloat(newItem.amount),
      validationNo: newItem.validationNo || ''
    };
    if (editingIndex !== null) {
      // Update existing item
      const updatedItems = [...formData.items];
      updatedItems[editingIndex] = itemToAdd;
      setFormData({
        ...formData,
        items: updatedItems,
      });
      setEditingIndex(null);
    } else {
      // Add new item
      setFormData({
        ...formData,
        items: [...formData.items, itemToAdd],
      });
    }
    setNewItem({ 
      description: "", 
      validatorPayout: "", 
      hsnSac: "", 
      amount: "",
      validationNo: "" 
    });
  };

  const editItem = (index) => {
    const itemToEdit = formData.items[index];
    setNewItem({
      description: itemToEdit.description,
      validatorPayout: itemToEdit.validatorPayout,
      hsnSac: itemToEdit.hsnSac || "",
      amount: itemToEdit.amount.toString(),
      validationNo: itemToEdit.validationNo || ""
    });
    setEditingIndex(index);
  };

  const deleteItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems,
    });
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewItem({ description: "", validatorPayout: "", hsnSac: "", amount: "" });
    }
  };

  if (!isOpen) return null;

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
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <select 
    value={formData.invoicePrefix || "OAM25-26GMO"} 
    onChange={(e) => {
      const prefix = e.target.value;
      const suffix = formData.invoiceNo.replace(/^(OAM25-26GMO|HM_25\/26_)/, '');
      setFormData({ 
        ...formData, 
        invoicePrefix: prefix,
        invoiceNo: `${prefix}${suffix}`
      });
    }}
    style={{ width: "150px" }}
  >
    <option value="OAM25-26GMO">OAM25-26GMO</option>
    <option value="HM_25/26_">HM_25/26_</option>
  </select>
  <input
    type="text"
    name="invoiceNoSuffix"
    value={formData.invoiceNo.replace(/^(OAM25-26GMO|HM_25\/26_)/, '')}
    onChange={(e) => {
      const suffix = e.target.value.replace(/\D/g, ''); // only allow numbers
      const prefix = formData.invoicePrefix || "OAM25-26GMO";
      setFormData({ 
        ...formData, 
        invoiceNo: `${prefix}${suffix}` 
      });
    }}
    placeholder="01"
    style={{ flex: 1 }}
  />
</div>

        <label>Customer Name:</label>
<input
  list="customerOptions"
  name="customerName"
  value={formData.customerName}
  onChange={(e) => {
    handleChange(e); // Handle the change normally
    // Also update other fields if the typed value matches a customer
    const selectedCustomer = data.find(customer => 
      customer.name.toLowerCase() === e.target.value.toLowerCase()
    );
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        address1: selectedCustomer.address1,
        address2: selectedCustomer.address2,
        phone: selectedCustomer.pincode,
        clientGST: selectedCustomer.gst,
        panNo: selectedCustomer.panNo
      }));
    }
  }}
  placeholder="Select or type a customer name"
/>
<datalist id="customerOptions">
  {data.map((customer, index) => (
    <option key={index} value={customer.name} />
  ))}
</datalist>

        <label>Address Line 1:</label>
        <input 
          type="text" 
          name="address1" 
          value={formData.address1} 
          onChange={handleChange} 
        />

        <label>Address Line 2:</label>
        <input 
          type="text" 
          name="address2" 
          value={formData.address2} 
          onChange={handleChange} 
        />
 <label>Address Line 3:</label>
        <input 
          type="text" 
          name="address3" 
          value={formData.address3} 
          onChange={handleChange} 
          placeholder="Optional additional address information"
        />
        <label>PIN Code:</label>
        <input 
          type="text" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />

        <label>PAN No:</label>
        <input 
          type="text" 
          name="panNo" 
          value={formData.panNo} 
          onChange={handleChange} 
        />

        <label>GST No:</label>
        <input 
          type="text" 
          name="clientGST" 
          value={formData.clientGST} 
          onChange={handleChange} 
        />

        <label>Invoice Date:</label>
        <input 
          type="date" 
          name="invoiceDate" 
          value={formData.invoiceDate} 
          onChange={handleChange} 
        />

        <label>Due Date:</label>
        <input 
          type="date" 
          name="dueDate" 
          value={formData.dueDate} 
          onChange={handleChange} 
        />

        <h3>Add Invoice Items</h3>
        <label>Description:</label>
        <input 
          type="text" 
          name="description" 
          value={newItem.description} 
          onChange={handleItemChange} 
        />
<label>HSN/SAC Code:</label>
<input 
  type="text" 
  name="hsnSac" 
  value={newItem.hsnSac} 
  onChange={handleItemChange} 
  placeholder="Enter HSN/SAC code"
/>
        <label>Validator Payout:</label>
        <input 
          type="text" 
          name="validatorPayout" 
          value={newItem.validatorPayout} 
          onChange={handleItemChange} 
        />
<label>Validation No (optional):</label>
<input 
    type="text" 
    name="validationNo" 
    value={newItem.validationNo} 
    onChange={handleItemChange} 
    placeholder="Optional validation number"
/>
        <label>Amount:</label>
        <input 
          type="number" 
          name="amount" 
          value={newItem.amount} 
          onChange={handleItemChange} 
        />

<button type="button" onClick={addItem}>
    {editingIndex !== null ? "Update Item" : "Add Item"}
  </button>
  {editingIndex !== null && (
    <button 
      type="button" 
      onClick={() => {
        setEditingIndex(null);
        setNewItem({ description: "", validatorPayout: "", hsnSac: "", amount: "" });
      }}
      style={{ marginLeft: "10px" }}
    >
      Cancel Edit
    </button>
  )}

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
            <th>Actions</th> {/* Add this column */}
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.validatorPayout}</td>
              <td>{currencySymbol} {item.amount.toFixed(2)}</td>
              <td>
                <button onClick={() => editItem(index)}>Edit</button>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )}


        {/* Invoice Summary */}
        <h3>Invoice Summary</h3>
        <div>
          <label>S.G.S.T. (%):</label>
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