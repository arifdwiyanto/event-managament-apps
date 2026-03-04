import { format } from "date-fns";

export interface InvoiceTemplateData {
  invoice: string;
  transactionDate: Date;
  status: string;
  paymentMethod: string;
  totalOriginalPrice: number;
  pointsUsed: number;
  totalFinalPrice: number;
  customerName: string;
  eventName: string;
  items: {
    ticketName: string;
    qty: number;
    price: number;
    subTotal: number;
  }[];
}

export const generateInvoiceHtml = (data: InvoiceTemplateData): string => {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
        <span style="font-weight: bold;">${item.ticketName}</span><br>
        <span style="color: #666; font-size: 12px;">Rp ${item.price.toLocaleString("id-ID")} x ${item.qty}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold;">
        Rp ${item.subTotal.toLocaleString("id-ID")}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${data.invoice}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-top: 4px solid #ee2b8c;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 2px dashed #e0e0e0;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #111;
          text-transform: uppercase;
        }
        .invoice-details p {
          margin: 4px 0;
          color: #555;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          text-align: left;
          padding: 12px;
          background: #f9f9f9;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
          color: #888;
        }
        .totals {
          width: 50%;
          margin-left: auto;
          font-size: 14px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          color: #8b5cf6;
          border-top: 2px solid #333;
          padding-top: 12px;
          margin-top: 12px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #00e5ff;
          color: #000;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>Invoice</h1>
            <p style="color: #ee2b8c; font-weight: bold; margin: 4px 0;">${data.invoice}</p>
          </div>
          <div style="text-align: right;">
            <div class="status-badge">${data.status}</div>
          </div>
        </div>

        <div style="margin-bottom: 40px; display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div>
            <p style="font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 4px; font-weight: bold;">Billed To</p>
            <p style="margin: 0; font-weight: bold;">${data.customerName}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 4px; font-weight: bold;">Transaction Date</p>
            <p style="margin: 0;">${format(new Date(data.transactionDate), "dd MMM yyyy HH:mm")}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 8px; font-weight: bold;">Event</p>
          <p style="margin: 0; font-weight: bold; font-size: 16px;">${data.eventName}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Payment Method</span>
            <span style="font-weight: bold; text-transform: uppercase; font-size: 12px;">${data.paymentMethod.replace(/_/g, " ")}</span>
          </div>
          <div class="totals-row">
            <span>Original Total</span>
            <span>Rp ${data.totalOriginalPrice.toLocaleString("id-ID")}</span>
          </div>
          ${
            data.pointsUsed > 0
              ? `
          <div class="totals-row" style="color: #ee2b8c;">
            <span>Points Used</span>
            <span>- Rp ${data.pointsUsed.toLocaleString("id-ID")}</span>
          </div>
          `
              : ""
          }
          <div class="totals-row grand-total">
            <span>Grand Total</span>
            <span>Rp ${data.totalFinalPrice.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
