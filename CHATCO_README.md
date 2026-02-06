# Chatco - Trumpai ir aiškiai

Production-ready SaaS starter template for an AI chat platform in Lithuanian.

## Overview

Chatco is a modern, feminine, cozy AI chat platform designed for Lithuanian users who want short, clear answers. The website features a complete authentication system, subscription management, admin dashboard, and chat interface.

## Features

### User Features
- **Chat Interface**: Real-time chat with message history
- **Authentication**: Email/password signup and login
- **Free Trial**: 14-day trial period for new users
- **Subscription Management**: View subscription status and manage plans
- **Profile Management**: Update username and account information

### Admin Features
- **Content Management**: Edit all website content without coding
- **User Management**: View all users and their subscription status
- **Pricing Plans**: View and manage pricing plans
- **Contact Submissions**: View messages from contact form

### Pages
1. **Home (/)**: Chat interface with message history
2. **About (/apie)**: Information about Chatco (editable by admin)
3. **Contact (/kontaktai)**: Contact form and information (editable by admin)
4. **Pricing (/planai)**: Subscription plans
5. **Auth (/prisijungti)**: Login and signup forms
6. **Profile (/profilis)**: User account management
7. **Admin (/admin)**: Admin dashboard for content and user management
8. **Privacy Policy (/privatumo-politika)**: Privacy policy
9. **Terms (/naudojimo-salygos)**: Terms of service

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: TailwindCSS with custom color palette
- **UI Components**: shadcn/ui (Radix UI)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Language**: Lithuanian (all UI text)

## Color Palette

- Soft Pink: `#F7C6D9`
- Soft Turquoise: `#6EDBD5`
- Peach: `#FFD6B8`
- White backgrounds with rounded corners and soft shadows

## Database Schema

### Tables Created:
1. **profiles**: User profiles with role, trial dates, subscription status
2. **chat_messages**: Chat history for each user
3. **content_sections**: Editable content sections for the website
4. **pricing_plans**: Subscription plan details
5. **subscriptions**: User subscription information
6. **contact_submissions**: Messages from contact form

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have full access to all data

## Getting Started

### Prerequisites
The Supabase database is already configured and connected.

### Admin Account Setup

To create an admin account:
1. Sign up normally through `/prisijungti`
2. Connect to your Supabase database
3. Run this SQL to make your account an admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Building for Production

```bash
npm run build
```

## Content Management

Admins can edit the following content sections through the admin dashboard:

- Homepage slogan and description
- About page content (title, description, benefits)
- Contact page information (email, phone, address)
- Pricing plans (name, price, features)

## Authentication Flow

1. **Signup**: Users create an account with email/password
2. **Trial**: Automatically receive 14-day free trial
3. **Login**: Authenticate with email/password
4. **Profile**: Manage account and view subscription status
5. **Logout**: Sign out from the profile page

## Subscription System

### Default Plans:
1. **Free Trial**: 14 days, all basic features
2. **Basic Plan**: €9.99/month, unlimited chats
3. **Professional Plan**: €19.99/month, advanced features

### Status Types:
- `trial`: Active 14-day trial period
- `active`: Paid subscription active
- `inactive`: Trial expired, no active subscription

## Chat Functionality

The chat interface includes:
- Message input with send button
- Message history for logged-in users
- Typing indicators and loading states
- User and assistant message bubbles with distinct styling
- Automatic message persistence to database

**Note**: The current implementation uses a demo response. Connect your own AI API by modifying the `handleSendMessage` function in `app/page.tsx`.

## Stripe Integration (Not Implemented)

To add Stripe payments:
1. Get your Stripe API keys
2. Add them to environment variables
3. Implement Stripe Checkout in the pricing page
4. Handle webhooks for subscription updates

See Stripe documentation: https://stripe.com/docs

## Admin Dashboard

Access: `/admin` (requires admin role)

Features:
- **Content Tab**: Edit all website content sections
- **Users Tab**: View all users, their roles, and subscription status
- **Pricing Tab**: View pricing plans and their details

## Important Notes

1. **Language**: All UI text is in Lithuanian
2. **Design**: Feminine, cozy, trustworthy aesthetic
3. **Mobile First**: Fully responsive design
4. **Security**: RLS policies ensure data protection
5. **Trial Period**: Automatically applied on signup

## Next Steps

1. **Connect AI API**: Replace demo responses with real AI integration
2. **Stripe Integration**: Add payment processing
3. **Email Notifications**: Add email confirmations and notifications
4. **Analytics**: Add tracking for user behavior
5. **SEO**: Optimize metadata and add sitemap

## Support

For questions or issues, contact: info@chatco.lt

---

Built with care for the Lithuanian community.
