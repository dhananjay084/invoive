import React, { useState, useRef } from 'react';
import ModalComponent from './ModalComponent';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const companyDetails = {
    OctaAds: {
        name: "OctaAds Media",
        address: "C/o Siraj Khan, 1st Floor, Loco Bazar, Near Loco Bazar Masjid, Gomoh, Dhanbad, Jharkhand - 828401",
        gst: "20AAECO3028M1ZN",
        CIN: "U73100JH2024PTC022034",
        bank: {
            name: "Axis Bank",
            accountHolder: "OCTAADS MEDIA PRIVATE LIMITED",
            accountNo: "924020022838877",
            ifsc: "UTIB0003792",
            swift: "AXISINBB172",
            bankAddress: "Ground Floor, Near Allahabad Bank, Purana Bazar, Gomoh, Jharkhand 828401"
        }
    },
    HikeMedia: {
        name: "Hike Media",
        address: "Shared Desk, Shams Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE",
        bank: {
            name: "WIO BANK P.J.S.C.",
            accountHolder: "Hike Media LLC",
            accountNo: "9422833590",
            iban: "AE560860000009422833590",
            swift: "WIOBAEAD",
            bankAddress: "Sharjah Media City Free Zone, Sharjah, UAE"
        }
    }
};
const uploadImage = async (imageData) => {
    // Ideally, this should upload to Firebase/AWS S3 and return the hosted URL.
    // For testing, we use a placeholder method.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(imageData); // Replace with actual image URL from storage.
        }, 2000);
    });
};
const Invoice = () => {
    const [selectedCompany, setSelectedCompany] = useState("OctaAds");
    const [modalOpen, setModalOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        customerName: "",
        address1: "",
        address2: "",
        phone: "",
        invoiceDate: "",
        dueDate: "",
        clientGST: "",
        items: [],
        taxRate: 0
    });

    const invoiceRef = useRef(); // Reference for capturing the invoice div

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const handleModalSubmit = (data) => {
        setInvoiceData(data);
        setModalOpen(false);
    };

    const calculateSubtotal = () => {
        return invoiceData.items.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
    };

    const calculateTaxAmount = () => {
        return (calculateSubtotal() * invoiceData.taxRate) / 100;
    };

    const calculateTotalAmount = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = calculateTaxAmount();
        const totalBeforeRounding = subtotal + taxAmount;
        const roundOff = totalBeforeRounding % 1;
        const roundedTotal = roundOff > 0.40 ? Math.ceil(totalBeforeRounding) : Math.floor(totalBeforeRounding);
        return { totalBeforeRounding, roundOff, roundedTotal };
    };

    const { totalBeforeRounding, roundOff, roundedTotal } = calculateTotalAmount();
    const company = companyDetails[selectedCompany];

    // Function to download the invoice as PDF
   const handleDownloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        let pdfHeight = (canvas.height * 210) / canvas.width; // Convert height proportionally

        if (pdfHeight > pageHeight) {
            pdf.internal.pageSize.height = pdfHeight; // Adjust PDF page height dynamically
        }

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pdfHeight);
        pdf.save(`Invoice_${selectedCompany}.pdf`);
    });
};

    

    return (
        <>
            <div className="company-selection">
                <label>Select Company: </label>
                <select value={selectedCompany} onChange={handleCompanyChange}>
                    <option value="OctaAds">OctaAds Media</option>
                    <option value="HikeMedia">Hike Media</option>
                </select>
                <button onClick={() => setModalOpen(true)}>Add Values</button>
                <button onClick={handleDownloadPDF} className="download-btn">Download Invoice</button>

            </div>

            {/* Modal Component */}
            <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

            <div ref={invoiceRef} className="invoice-container">
                <header className="invoice-header">
                    <div className="logo">
                        <h2>{company.name}</h2>
                        <p>{company.address}</p>
                        {company.gst && <p>GST: {company.gst}</p>}
                        {company.CIN && <p>CIN: {company.CIN}</p>}
                    </div>
                    {/* <div className="barcode">
                        <QRCode value="Invoice Details" size={70} />
                    </div> */}
                </header>

                <section className="bill-to">
                    <div>
                        <h3>Bill To:</h3>
                        <p>{invoiceData.customerName}</p>
                        <p>{invoiceData.address1}</p>
                        <p>{invoiceData.address2}</p>
                        <p>{invoiceData.phone}</p>
                    </div>
                    <div>
                        <p className="invoice-date">Invoice Date: {invoiceData.invoiceDate}</p>
                        <p className="invoice-date">Due Date: {invoiceData.dueDate}</p>
                        <p className="invoice-date">Client GST: {invoiceData.clientGST}</p>
                    </div>
                </section>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>S. No</th>
                            <th>Description</th>
                            <th>Validator Payout</th>
                            <th>HSN/SAC</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.description}</td>
                                <td>{item.validatorPayout}</td>
                                <td>{item.hsnSac}</td>
                                <td>₹ {item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="total_div">
                    <div>
                        <p>Thank you for your business!</p>
                    </div>
                    <div className="total_divs">
                        <span className="subtotal_spn">
                            <p>Subtotal:</p>
                            <p>₹ {calculateSubtotal().toFixed(2)}</p>
                        </span>
                        <div className="invoice-summary">
                            <span>
                                <p>Tax Rate (%): </p>
                                <p> {invoiceData.taxRate}</p>
                            </span>
                            <span>
                                <p>Tax Amount ({invoiceData.taxRate}%): </p>
                                <p>₹ {calculateTaxAmount().toFixed(2)}</p>
                            </span>
                            <span>
                                <p>Round Off: </p>
                                <p>₹ {roundOff.toFixed(2)}</p>
                            </span>
                            <span className="total_val">
                                <p>Total Amount: </p>
                                <p>₹ {roundedTotal.toFixed(2)}</p>
                            </span>
                        </div>
                    </div>
                </div>

                <footer className="payment-info">
                    <h4>Payment Options</h4>
                    <h4>Company Bank Details</h4>
                    <p>Bank: {company.bank.name}</p>
                    <p>Account Name: {company.bank.accountHolder}</p>
                    <p>Account Number: {company.bank.accountNo}</p>
                    {company.bank.ifsc && <p>IFSC: {company.bank.ifsc}</p>}
                    <p>Swift: {company.bank.swift}</p>
                    <p>Bank Address: {company.bank.bankAddress}</p>
                </footer>
                <div className='discliamer'>
                    <h4>Disclaimer</h4>
                    <p>Tax May Be Deducted At Source (TDS) @ 2% Under Section 194C Of The Income Tax Act, 1961.Tax Should Not Be Deducted On The GST Component Charged On The Invoice.</p>
                    <ul>
                        <li>Advertisement Campaign Billing As Per Validation.</li>
                        <li> All Campaigns Will Be Paused In Case Of Pending Invoices.</li>
                        <li> If The Payment Is Not Received Within 2months, 1% Interest Penalty Will Be Charged On The Invoice Amount.</li>
                        <li>This Invoice Is Digitally Sign+A27:J30ned.</li>
                    </ul>
                  
                </div>
            </div>

        </>
    );
};

export default Invoice;
