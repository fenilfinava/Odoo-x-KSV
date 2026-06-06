# VendorBridge - Procurement & Vendor Management ERP

VendorBridge is a comprehensive Procurement & Vendor Management ERP system designed to digitize and streamline procurement operations for organizations. The platform centralizes vendor management, RFQ (Request for Quotation) creation, quotation comparison, multi-level approvals, and invoice generation—eliminating manual inefficiencies and enabling real-time procurement tracking.

## 🚀 Live Demo
**URL:** [https://odoo-x-ksv-two.vercel.app](https://odoo-x-ksv-two.vercel.app)

## Features

*   **Role-Based Access Control:** Admin, Procurement Officer, Manager / Approver, and Vendor roles.
*   **Dashboard & Analytics:** Real-time metrics on total spend, active vendors, pending approvals, and overdue invoices.
*   **Vendor Management:** Register, track, and manage vendors, complete with categorization and GST details.
*   **RFQ Management:** Create detailed RFQs and send them to selected vendors.
*   **Quotation Submission & Comparison:** Vendors submit quotations. Procurement officers can compare them side-by-side.
*   **Approval Workflow:** Multi-level approval process with remarks and status tracking.
*   **Purchase Orders & Invoices:** Auto-generate POs and invoices, export them to PDF format.
*   **Activity Logs:** Keep track of system activities, alerts, and audit trails.

## Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React icons, jsPDF for PDF generation.
*   **Backend:** Express.js, SQLite (via `sqlite3`), standard RESTful API architecture.

## Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fenilfinava/Odoo-x-KSV.git
    cd Odoo-x-KSV
    ```

2.  **Start the Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend will start on `http://localhost:5001`.

3.  **Start the Frontend:**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend will start on `http://localhost:3000`.


## License
MIT License
