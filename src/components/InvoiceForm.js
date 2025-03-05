import React, { useState, useRef } from 'react';
import ModalComponent from './ModalComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HikeMedia from "../logo2.jpeg";
import OctaAds from "../logo.gif";
import OctSign from "../SignOct.jpeg";
import HikeOct from "../SignHike.jpeg";
import { toWords } from "number-to-words";

const companyDetails = {
    OctaAds: {
        name: "OctaAds Media Pvt. Ltd.",
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
        },
        img: OctaAds,
        sign: OctSign,
        disclaimer:''
    },
    HikeMedia: {
        name: "Hike Media LLC.",
        address: "Shared Desk, Shams Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE",
        bank: {
            name: "WIO BANK P.J.S.C.",
            accountHolder: "Hike Media LLC",
            accountNo: "9422833590",
            iban: "AE560860000009422833590",
            swift: "WIOBAEAD",
            bankAddress: "Sharjah Media City Free Zone, Sharjah, UAE"
        },
        img: HikeMedia,
        sign: HikeOct,
        disclaimer:'We declare that this inovice shows the actual price of the goods described and that all particulars are true and corrent.'
    }
};
// const uploadImage = async (imageData) => {
// Ideally, this should upload to Firebase/AWS S3 and return the hosted URL.
// For testing, we use a placeholder method.
// return new Promise((resolve) => {
//     setTimeout(() => {
// resolve(imageData); // Replace with actual image URL from storage.
//         }, 2000);
//     });
// };
const Invoice = () => {
    const [selectedCompany, setSelectedCompany] = useState("OctaAds");
    const [modalOpen, setModalOpen] = useState(false);
    const [signatureDate, setSignatureDate] = useState(null);
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

    // const calculateTaxAmount = () => {
    //     return (calculateSubtotal() * invoiceData.taxRate) / 100;
    // };




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
    const calculateTax = (total, tax) => {
        return (parseFloat(total) * parseFloat(tax)) / 100;
    };
    const calculateTaxAmount = () => {
        const subtotal = calculateSubtotal();
        let totalTax = 0;

        if (invoiceData.gstTax) {
            totalTax += calculateTax(subtotal, invoiceData.gstTax);
        }
        if (invoiceData.igstTax) {
            totalTax += calculateTax(subtotal, invoiceData.igstTax);
        }
        if (invoiceData.cgstTax) {
            totalTax += calculateTax(subtotal, invoiceData.cgstTax);
        }

        return totalTax;
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
    const handleSign = () => {
        const now = new Date();
        const formattedDate = now.toISOString().replace("T", " ").slice(0, -5); // Format as "YYYY-MM-DD HH:MM:SS"
        const timeZoneOffset = now.getTimezoneOffset();
        const hoursOffset = Math.abs(Math.floor(timeZoneOffset / 60));
        const minutesOffset = Math.abs(timeZoneOffset % 60);
        const sign = timeZoneOffset > 0 ? "-" : "+";

        const formattedTimeZone = `${sign}${String(hoursOffset).padStart(2, "0")}'${String(minutesOffset).padStart(2, "0")}'`;

        setSignatureDate(`${formattedDate} ${formattedTimeZone}`);
    };
    console.log(invoiceData)
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
                <button onClick={handleSign}>Sign</button>


            </div>

            {/* Modal Component */}
            <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

            <div ref={invoiceRef} className="invoice-container" >
                <div className="invoice-background" style={{ backgroundImage: `url(${company.img})` }}></div>
                <div className="invoice-content">
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
                        <div className='header-logo'>
                            <img src={company.img} />
                        </div>
                    </header>

                    <section className="bill-to">
                        <div>
                            <h3>Bill To:</h3>
                            <p>{invoiceData.customerName}</p>
                            <p>{invoiceData.address1}</p>
                            <p>{invoiceData.address2}</p>
                            <p>{invoiceData.phone}</p>
                            <p className="invoice-date">GSTIN: {invoiceData.clientGST}</p>

                        </div>
                        <div>
                            <table className='invoice_table'>
                                <tr>
                                    <td>Invoice No:</td>
                                    <td>{invoiceData.invoiceNo}</td>
                                </tr>
                              
                                
                                <tr>
                                    <td>    Invoice Date: </td>
                                    <td>{invoiceData.invoiceDate}</td>
                                </tr>
                                
                                <tr>
                                    <td>Due Date:</td>
                                    <td>{invoiceData.dueDate}</td>
                                </tr>
                            </table>
                      
                        </div>
                    </section>

                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>S. No</th>
                                <th>Description</th>
                                <th>Payout</th>
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
                                    <td>998361</td>
                                    <td> {item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="total_div">
                        <div>

                            <p>{`Amount In Words: ${toWords(roundedTotal.toFixed(2)).replace(/^\w/, (c) => c.toUpperCase())} only`}</p>
                            <div className='notes_div'>
                                <h4>Notes !</h4>
                                <p>Thank you for your business!</p>

                            </div>
                        </div>
                        <div className="total_divs">
                            <span className="subtotal_spn">
                                <p>Taxable Amt:</p>
                                <p>{invoiceData.currency} {calculateSubtotal().toFixed(2)}</p>
                            </span>
                            <div className="invoice-summary">
                                {
                                    invoiceData.gstTax &&
                                    <>
                                        <span>
                                            <p>SGST ({invoiceData.gstTax}%):  </p>
                                            <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.gstTax).toFixed(2)}</p>
                                        </span>

                                    </>
                                }
                                {
                                    invoiceData.igstTax &&
                                    <>
                                        <span>
                                            <p>IGST ({invoiceData.igstTax}%): </p>
                                            <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.igstTax).toFixed(2)}</p>


                                        </span>

                                    </>
                                }
                                {
                                    invoiceData.cgstTax &&
                                    <>
                                        <span>
                                            <p>CGST ({invoiceData.cgstTax}%): </p>
                                            <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.cgstTax).toFixed(2)}</p>



                                        </span>

                                    </>
                                }

                                <span>
                                    <p>Tax Amount : </p>
                                    <p>{invoiceData.currency} {calculateTaxAmount().toFixed(2)}</p>
                                </span>
                                <span>
                                    <p>Round Off: </p>
                                    <p> {invoiceData.currency} {roundOff.toFixed(2)}</p>
                                </span>
                                <span className="total_val">
                                    <p>Total Amount: </p>
                                    <p>{invoiceData.currency} {roundedTotal.toFixed(2)}</p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <footer className="payment-info">
                        {/* <h4>Payment Options</h4> */}
                        <h4>Company Bank Details</h4>
                        <p>Bank: {company.bank.name}</p>
                        <p>Account Name: {company.bank.accountHolder}</p>
                        <p>Account Number: {company.bank.accountNo}</p>
                        {company.bank.ifsc && <p>IFSC: {company.bank.ifsc}</p>}
                        <p>Swift: {company.bank.swift}</p>
                        <p>Bank Address: {company.bank.bankAddress}</p>
                    </footer>

                    <div className='discliamer'>
                        <div className='info_div'>
                            <div className='inner_info'>
                            {
                                company.disclaimer.length>0?
                                <>
                            <h4>Disclaimer</h4>

                                <p>{company.disclaimer}</p>
                                </>:
                            <>
                            <h4>Disclaimer</h4>
                            <p>Tax May Be Deducted At Source (TDS) @ 2% Under Section 194C Of The Income Tax Act, 1961.Tax Should Not Be Deducted On The GST Component Charged On The Invoice.</p>
                            <ul>
                                <li>Advertisement Campaign Billing As Per Validation.</li>
                                <li> All Campaigns Will Be Paused In Case Of Pending Invoices.</li>
                                <li> If The Payment Is Not Received Within 2months, 1% Interest Penalty Will Be Charged On The Invoice Amount.</li>
                                <li>This Invoice Is Digitally Sign+A27:J30ned.</li>
                            </ul>
                            </>
}
                        </div>
                        </div>
                        <div className='sign_div'>
                            <p>For {company.name}</p>
                            <div className='digital_sign'>
                                <div className='bg_image'></div>
                                <h3>ABDULLA KHAN</h3>
                                <p>Digitally signed by ABDULLA KHAN</p>
                                <p>Date: {signatureDate || "Click 'Sign' to generate timestamp"}</p>
                            </div>
                            {/* <img className='sign-logo' src={company.sign} /> */}
                            <p>Authorised Signatory</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Invoice;
