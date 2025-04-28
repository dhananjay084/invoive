import React, { useState, useRef,useEffect } from 'react';
import ModalComponent from './ModalComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HikeMedia from "../logo2.jpeg";
import OctaAds from "../logo.png";
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
    const [bgLoaded, setBgLoaded] = useState(false);
    const currencyWords = {
        USD: "dollars",
        EUR: "euros",
        GBP: "pounds",
        INR: "rupees",
        JPY: "yen",
        AUD: "australian dollars",
        CAD: "canadian dollars",
        CHF: "swiss francs",
        CNY: "yuan",
        SEK: "swedish kronor",
        NZD: "new zealand dollars",
        SGD: "singapore dollars",
        HKD: "hong kong dollars",
        KRW: "won",
        MXN: "mexican pesos",
        BRL: "brazilian reais",
        RUB: "rubles",
        ZAR: "rands",
        AED: "dirhams",
        SAR: "riyals",
        TRY: "turkish lira",
        IDR: "rupiah",
        MYR: "malaysian ringgit",
        THB: "baht",
        PHP: "philippine pesos",
        PLN: "zloty",
        DKK: "danish kroner",
        NOK: "norwegian kroner",
        ILS: "shekels",
        CZK: "czech koruna",
        HUF: "forints",
        RON: "lei",
        BGN: "leva",
        HRK: "kuna",
        ISK: "icelandic kronur",
        
        // Special cases for singular/plural forms
        // (Some currencies don't change in plural form)
        JPY: "yen",          // Same in singular and plural
        CNY: "yuan",         // Same in singular and plural
        KRW: "won",          // Same in singular and plural
        THB: "baht",         // Same in singular and plural
        IDR: "rupiah",       // Same in singular and plural
        TRY: "turkish lira", // Same in singular and plural
        
        // Add more as needed
      };
      
      const getCurrencyWord = (currencyCode) => {
        return currencyWords[currencyCode] || currencyCode;
      };
    useEffect(() => {
        const img = new Image();
        img.src = company.img;
        img.onload = () => setBgLoaded(true);
    }, [selectedCompany]);
    const invoiceRef = useRef(); // Reference for capturing the invoice div

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    // const handleModalSubmit = (data) => {
    //     console.log(data)
    //     setInvoiceData(data);
    //     setModalOpen(false);

    // };
    const handleModalSubmit = (data) => {
        setInvoiceData({
          ...data,
          currency: data.currency, // This will be the code (e.g., "USD")
          currencySymbol: data.currencySymbol // This will be the symbol (e.g., "$")
        });
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
    // const handleDownloadPDF = () => {
    //     const input = invoiceRef.current;
    //     html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF("p", "mm", "a4");

    //         const imgWidth = 210; // A4 width in mm
    //         const pageHeight = 297; // A4 height in mm
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    //         let pdfHeight = (canvas.height * 210) / canvas.width; // Convert height proportionally

    //         if (pdfHeight > pageHeight) {
    //             pdf.internal.pageSize.height = pdfHeight; // Adjust PDF page height dynamically
    //         }

    //         pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pdfHeight);
    //         pdf.save(`Invoice_${selectedCompany}.pdf`);
    //     });
    // };
    const handleDownloadPDF = async() => {
        await Promise.all(
            Array.from(document.images).map(img => 
                img.complete ? Promise.resolve() : new Promise(resolve => {
                    img.onload = img.onerror = resolve;
                })
            )
        );
        const input = invoiceRef.current;
    
    // Hide UI elements that shouldn't appear in PDF
    const buttons = document.querySelectorAll('.company-selection');
    buttons.forEach(btn => btn.style.visibility = 'hidden');
    
    // Store original styles
    const originalStyles = {
        width: input.style.width,
        height: input.style.height,
        overflow: input.style.overflow
    };
    
    // Set dimensions that will fit on A4
    input.style.width = '210mm';
    input.style.height = 'auto'; // Let content determine height
    input.style.overflow = 'visible';
    
    html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
    }).then((canvas) => {
        // Restore original styles
        input.style.width = originalStyles.width;
        input.style.height = originalStyles.height;
        input.style.overflow = originalStyles.overflow;
        buttons.forEach(btn => btn.style.visibility = 'visible');
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Calculate scaling factor to fit on one page
        const pageHeight = 297; // A4 height in mm
        const scaleFactor = imgHeight > pageHeight ? pageHeight / imgHeight : 1;
        
        // Add image scaled to fit one page
        pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            0, 
            imgWidth * scaleFactor, 
            imgHeight * scaleFactor
        );
        
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
    
        // Convert to IST using Intl.DateTimeFormat
        const formatter = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23' // Ensures 24-hour format
        });
    
        // Format date correctly
        const parts = formatter.formatToParts(now);
        const day = parts.find(p => p.type === 'day').value;
        const month = parts.find(p => p.type === 'month').value;
        const year = parts.find(p => p.type === 'year').value;
        const hours = parts.find(p => p.type === 'hour').value;
        const minutes = parts.find(p => p.type === 'minute').value;
    
        const formattedDate = `${day}-${month}-${year}, ${hours}:${minutes} IST`;
    
        setSignatureDate(formattedDate);
    };
    
    
    
    console.log(invoiceData)
    const numberToIndianWords = (num) => {
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 
                      'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 
                     'eighty', 'ninety'];
        
        if (num === 0) return 'zero';
        
        let result = '';
        const crore = Math.floor(num / 10000000);
        num %= 10000000;
        
        const lakh = Math.floor(num / 100000);
        num %= 100000;
        
        const thousand = Math.floor(num / 1000);
        num %= 1000;
        
        const hundred = Math.floor(num / 100);
        num %= 100;
        
        const ten = Math.floor(num / 10);
        const one = num % 10;
        
        if (crore > 0) {
            result += numberToIndianWords(crore) + ' crore ';
        }
        if (lakh > 0) {
            result += numberToIndianWords(lakh) + ' lakh ';
        }
        if (thousand > 0) {
            result += numberToIndianWords(thousand) + ' thousand ';
        }
        if (hundred > 0) {
            result += ones[hundred] + ' hundred ';
        }
        
        if (num > 0) {
            if (result !== '') result += 'and ';
            
            if (num < 10) {
                result += ones[num];
            } else if (num < 20) {
                result += teens[num - 10];
            } else {
                result += tens[ten];
                if (one > 0) {
                    result += ' ' + ones[one];
                }
            }
        }
        
        return result.trim();
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
                <button onClick={handleSign}>Sign</button>


            </div>

            {/* Modal Component */}
            <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />

            <div ref={invoiceRef} className="invoice-container" >
                <div className="invoice-background"  style={{ 
        backgroundImage: bgLoaded ? `url(${company.img})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }}></div>
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
                            {/* <p>{invoiceData.phone}</p> */}
                            <div className="summary-row">
      <p style={{paddingRight:'5px'}}>Pincode:</p>
      <p>{invoiceData.phone} </p>
    </div>
    <div className="summary-row">
      <p style={{paddingRight:'5px'}}>Pan No:</p>
      <p>{invoiceData.panNo}</p>
    </div>
    <div className="summary-row">
      <p style={{paddingRight:'5px'}} >GSTIN:</p>
      <p>{invoiceData.clientGST} </p>
    </div>
                            {/* <p className="invoice-date">Pan No: {invoiceData.panNo}</p>

                            <p className="invoice-date">GSTIN: {invoiceData.clientGST}</p> */}

                            
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

                            {/* <p>{`Amount In Words: ${toWords(roundedTotal.toFixed(2)).replace(/^\w/, (c) => c.toUpperCase())} only`}</p> */}
                            <div className='notes_div'>
                            {/* <p>{`Amount In Words: ${numberToIndianWords(Math.floor(roundedTotal)).replace(/^\w/, c => c.toUpperCase())} rupees only`}</p> */}
                                <p>{`Amount In Words: ${numberToIndianWords(Math.floor(roundedTotal)).replace(/^\w/, c => c.toUpperCase())} ${getCurrencyWord(invoiceData.currency)} only`}</p>
                                <p>Thank you for your business!</p>
                          
                            </div>
                        </div>
                        <div className="total_divs">
  

  <div className="invoice-summary-table">
  <div className="summary-row">
    <p>Taxable Amt:</p>
    <p>{invoiceData.currency} {calculateSubtotal().toFixed(2)}</p>
  </div>
    {invoiceData.gstTax && (
      <div className="summary-row">
        <p>SGST ({invoiceData.gstTax}%):</p>
        <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.gstTax).toFixed(2)}</p>
      </div>
    )}

    {invoiceData.igstTax && (
      <div className="summary-row">
        <p>IGST ({invoiceData.igstTax}%):</p>
        <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.igstTax).toFixed(2)}</p>
      </div>
    )}

    {invoiceData.cgstTax && (
      <div className="summary-row">
        <p>CGST ({invoiceData.cgstTax}%):</p>
        <p>{invoiceData.currency} {calculateTax(calculateSubtotal(), invoiceData.cgstTax).toFixed(2)}</p>
      </div>
    )}

    <div className="summary-row">
      <p>Tax Amount:</p>
      <p>{invoiceData.currency} {calculateTaxAmount().toFixed(2)}</p>
    </div>

    <div className="summary-row">
      <p>Round Off:</p>
      <p>{invoiceData.currency} {roundOff.toFixed(2)}</p>
    </div>

    <div className="summary-row total_val">
      <p><strong>Total Amount:</strong></p>
      <p><strong>{invoiceData.currency} {roundedTotal.toFixed(2)}</strong></p>
    </div>
  </div>
</div>

                    </div>

                    <footer className="payment-info">
                        {/* <h4>Payment Options</h4> */}
                        <h4>Company Bank Details</h4>
                        <div className="summary-row">
    <p style={{paddingRight:'5px'}}>Bank Name:</p>
    <p>{company.bank.name}</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>Account Name:</p>
    <p>{company.bank.accountHolder}</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>Account Number:</p>
    <p>{company.bank.accountNo}</p>
  </div>
  {company.bank.ifsc &&
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>IFSC:</p>

     <p>{company.bank.ifsc}</p>
  </div>
}
<div className="summary-row">
    <p style={{paddingRight:'5px'}}>Swift:</p>

     <p>{company.bank.swift}</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>Bank Address:</p>

     <p>{company.bank.bankAddress}</p>
  </div>
  
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
                            <div className="invoice-summary-table">
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>1</p>
    <p>Advertisement Campaign Billing As Per Validation.</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>2</p>
    <p>All Campaigns Will Be Paused In Case Of Pending Invoices.</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>3</p>
    <p>If The Payment Is Not Received Within 2months, 1% Interest Penalty Will Be Charged On The Invoice Amount.</p>
  </div>
  <div className="summary-row">
    <p style={{paddingRight:'5px'}}>4</p>
    <p>This Invoice Is Digitally Sign+A27:J30ned.</p>
  </div>
  </div>
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
