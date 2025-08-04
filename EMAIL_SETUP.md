# Email Setup for Password Reset

To enable email sending functionality, you need to configure your Gmail account:

## 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

## 2. Generate App Password
- Go to Google Account settings
- Navigate to Security > 2-Step Verification > App passwords
- Generate a new app password for "Mail"
- Copy the generated password

## 3. Configure Environment Variables
Create a `.env` file in the backend directory with:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-app-password` with the app password you generated

## 4. Install dotenv (if not already installed)
```bash
npm install dotenv
```

## 5. Update server.js
Add this line at the top of server.js:
```javascript
require('dotenv').config();
```

## 6. Update emailService.js
The service will automatically use the environment variables.

## Security Notes:
- Never commit your .env file to version control
- Use app passwords, not your main Gmail password
- The reset token expires after 1 hour for security 