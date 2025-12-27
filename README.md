# 🏥 CareCircle - Caregiver Booking Platform

CareCircle is a modern, responsive web application designed to connect users with professional caregiving services. Whether you need elderly care, baby care, or specialized nursing, CareCircle provides a seamless experience for finding and booking trusted caregivers.

## 🚀 Live Demo
[View CareCircle Live]() *(Link to be added)*

---

## ✨ Key Features

- **🔐 Secure Authentication**: Multi-method login including email/password and Google OAuth integration via NextAuth.js.
- **📅 Service Booking**: Interactive booking system where users can select services and manage their appointments.
- **🛠️ Admin Dashboard**: Dedicated interface for administrators to manage bookings and add new services.
- **📱 Responsive UI**: Fully optimized for mobile, tablet, and desktop devices with modern UI/UX principles.
- **🔔 Real-time Feedback**: Engaging user feedback using `react-hot-toast` and `SweetAlert2`.
- **🏗️ Dynamic Services**: Easily browse and view detailed information for various care categories.
- **📧 Email Notifications**: Automated confirmations and notifications for bookings.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utilities**: `bcryptjs`, `nodemailer`, `dotenv`
- **Feedback**: `react-hot-toast`, `SweetAlert2`

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB account (Atlas or local instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanvir81/-Care.Circle.git
   cd carecircle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Google Authentication (Optional)
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret

   # Email Configuration
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_app_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

- `/src/app`: Next.js App Router folders and pages.
- `/src/components`: Reusable UI components (Navbar, Footer, ClientHome, etc.).
- `/src/lib`: Shared utilities and database configurations.
- `/public`: Static assets like images and logos.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
