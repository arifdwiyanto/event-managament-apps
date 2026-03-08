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
  items: {
    ticketName: string;
    eventName?: string;
    qty: number;
    price: number;
    subTotal: number;
  }[];
  promoData?: {
    code: string;
    amount: number;
  };
}

export const generateInvoiceHtml = (data: InvoiceTemplateData): string => {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
        <span style="font-weight: bold; display: block; margin-bottom: 2px; color: #333;">${item.ticketName}</span>
        ${item.eventName ? `<span style="font-size: 11px; color: #555; display: block; margin-bottom: 4px;">${item.eventName}</span>` : ''}
        <span style="color: #666; font-size: 12px;">Rp ${item.price.toLocaleString("id-ID")} x ${item.qty}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: bold; vertical-align: top; color: #333;">
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
      <title>Order Number ${data.invoice}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-top: 4px solid #ee2b8c;
          padding: 40px;
          box-sizing: border-box;
          width: 100%;
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
        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .item-table th {
          text-align: left;
          padding: 12px;
          background: #f9f9f9;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
          color: #888;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
          clear: both;
        }

        @media only screen and (max-width: 600px) {
          body {
            padding: 10px !important;
          }
          .container {
            padding: 20px !important;
          }
          .stack-column {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            box-sizing: border-box;
          }
          .stack-column.right {
            margin-top: 12px !important;
          }
          .info-table td {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
          }
          .info-table td.right {
            margin-top: 20px !important;
          }
          .totals-table {
            width: 100% !important;
          }
          .item-table th, .item-table td {
            padding: 10px 8px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px; border-bottom: 2px dashed #e0e0e0; padding-bottom: 20px;">
          <tr>
            <td class="stack-column" align="left" valign="middle">
              <h1 style="margin: 0; font-size: 1.1rem; color: #111; text-transform: uppercase;">Order Number</h1>
              <p style="color: #ee2b8c; font-weight: bold; margin: 4px 0;">${data.invoice}</p>
            </td>
            <td class="stack-column right" align="right" valign="middle">
              <div class="status-badge">${data.status}</div>
            </td>
          </tr>
        </table>

        <!-- Info Row -->
        <table class="info-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
          <tr>
            <td width="50%" align="left" valign="top">
              <p style="font-size: 12px; color: #888; text-transform: uppercase; margin: 0 0 4px 0; font-weight: bold;">Billed To</p>
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #333;">${data.customerName}</p>
            </td>
            <td class="right" width="50%" align="right" valign="top">
              <p style="font-size: 12px; color: #888; text-transform: uppercase; margin: 0 0 4px 0; font-weight: bold;">Transaction Date</p>
              <p style="margin: 0; font-size: 14px; font-weight: normal; color: #333;">${new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(data.transactionDate)).replace(",", "")} WIB</p>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table class="item-table">
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

        <!-- Totals Table -->
        <table class="totals-table" width="60%" align="right" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; margin-bottom: 30px;">
          <tr>
            <td align="left" style="padding: 8px 0; color: #555;">Payment Method</td>
            <td align="right" style="padding: 8px 0; font-weight: bold; text-transform: uppercase; font-size: 12px; color: #333;">${data.paymentMethod.replace(/_/g, " ")}</td>
          </tr>
          <tr>
            <td align="left" style="padding: 8px 0; color: #555;">Original Total</td>
            <td align="right" style="padding: 8px 0; color: #333;">Rp ${data.totalOriginalPrice.toLocaleString("id-ID")}</td>
          </tr>
          ${data.promoData
      ? `<tr>
              <td align="left" style="padding: 8px 0; color: #00e5ff;">Promo Applied (${data.promoData.code})</td>
              <td align="right" style="padding: 8px 0; color: #00e5ff;">- Rp ${data.promoData.amount.toLocaleString("id-ID")}</td>
            </tr>`
      : ""
    }
          ${data.pointsUsed > 0
      ? `<tr>
              <td align="left" style="padding: 8px 0; color: #ee2b8c;">Points Used</td>
              <td align="right" style="padding: 8px 0; color: #ee2b8c;">- Rp ${data.pointsUsed.toLocaleString("id-ID")}</td>
            </tr>`
      : ""
    }
          <tr>
            <td align="left" style="padding: 12px 0 0 0; font-size: 16px; font-weight: bold; color: #8b5cf6; border-top: 2px solid #333; margin-top: 12px;">Grand Total</td>
            <td align="right" style="padding: 12px 0 0 0; font-size: 16px; font-weight: bold; color: #8b5cf6; border-top: 2px solid #333; margin-top: 12px;">Rp ${data.totalFinalPrice.toLocaleString("id-ID")}</td>
          </tr>
        </table>
        
        <!-- Clear float for the right aligned totals table -->
        <div style="clear: both;"></div>

        <div class="footer">
          <p style="margin: 4px 0;">Thank you for your purchase!</p>
          <p style="margin: 4px 0;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
