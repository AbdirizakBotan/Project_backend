# Admin Forgot Password Fix Guide

## The Problem
The admin forgot password functionality is not working because existing admin accounts don't have email fields.

## Solution Steps:

### 1. Check Current Admin Accounts
Run this command to see existing admin accounts:
```bash
cd backend
node scripts/checkAdmins.js
```

### 2. Add Email to Existing Admins
Run the migration script to add email to existing admin accounts:
```bash
cd backend
node scripts/migrateAdminEmail.js
```

### 3. Create New Admin with Email (Optional)
If you want to create a new admin account with email:
```bash
cd backend
node scripts/createAdmin.js
```

### 4. Test the Admin Forgot Password
1. Go to `/admin-login`
2. Click "Forgot Password?"
3. Enter the admin email (e.g., `admin1@business.com`)
4. Check if the email is sent

## Admin Account Details:
- **Username**: `group`
- **Password**: `admin123`
- **Email**: `admin1@business.com` (after migration)

## If You Want to Use Your Own Email:
1. Update the admin email in the database
2. Make sure your email is configured in the `.env` file
3. Test the forgot password functionality

## Alternative: Manual Database Update
If the scripts don't work, you can manually update the admin in MongoDB:
```javascript
// In MongoDB shell or Compass
use Business
db.admins.updateOne(
  { username: "group" },
  { 
    $set: { 
      email: "your-email@gmail.com",
      resetToken: null,
      resetTokenExpiry: null
    }
  }
)
```

## Test the Complete Flow:
1. Admin login with username: `group`, password: `admin123`
2. Click "Forgot Password?" on admin login
3. Enter email: `admin1@business.com`
4. Check email for reset link
5. Click link to reset password
6. Set new password
7. Login with new password 