# Mailer8 - Birthday Email System

**Never forget a customer's birthday again!** This app automatically sends personalized birthday emails to your customers every day.

## What This App Does For You

🎂 **Sends birthday emails automatically** - The app checks every day for customer birthdays and sends them a nice email  
� **Manages your customer list** - Store customer names, emails, and birthdays in one place  
📧 **Customizable email templates** - Write your own birthday messages with personal touches  
📊 **Shows you what happened** - See which emails were sent successfully and which failed  
⚙️ **Easy to configure** - Set what time emails go out and which template to use  

## Who Can Use This App

There are two types of users:

**🔑 Super Admin** - Can do everything (that's you!)
- Add/remove customers and staff
- Create email templates  
- Change system settings
- View all email reports

**👤 Admin Staff** - Can help manage day-to-day tasks
- Add/edit customers
- Create email templates
- View email reports
- Cannot change settings or add new staff

## How to Login
The app comes with these accounts ready to use:

**🔑 Owner Account (Full Control)**
- Email: `super_admin@mail.local`
- Password: `Admin@123`
- Use this account to set up everything

**👤 Staff Account (Limited Access)**  
- Email: `admin@mail.local`
- Password: `Admin@123`
- Use this for daily customer management

> **Important**: Only the Owner can create new staff accounts. Login as Owner first if you need to add more people.

## What Each Account Can Do

### 🔑 Owner Account
**You can control everything:**
- Add and remove staff members
- Add/edit/delete customers
- Create and edit email templates
- Change when emails are sent (time and timezone)
- Choose which email template to use by default
- See all email activity and reports

### 👤 Staff Account
**Your staff can help with daily tasks:**
- Add/edit/delete customers
- See email activity and reports
- **Cannot**: Add new staff or change system settings

## How to Use the System

### Step 1: Login to Your Account
1. Go to the login page
2. Enter your email and password (see login details above)
3. Click "Login"
4. You're now ready to manage your birthday emails!

### Step 2: Add Your Customers
1. **To add a new customer:**
   - Click "Add Customer" 
   - Fill in their first name, last name, email, and birthday
   - Click "Save"

2. **To find a customer:**
   - Use the search box to type their name
   - Browse through the customer list

3. **To edit a customer:**
   - Click on their name in the list
   - Make your changes
   - Click "Save"

### Step 3: Create Email Templates
1. **To create a new email template:**
   - Click "Create Template"
   - Give it a name (like "Birthday Wishes")
   - Write your email subject (like "Happy Birthday!")
   - Write your email message

2. **Make it personal with these magic words:**
   - Type `{{firstName}}` and it becomes the customer's first name
   - Type `{{lastName}}` and it becomes their last name  
   - Type `{{email}}` and it becomes their email
   - Type `{{dob}}` and it becomes their birthday (like "15 Mar")

**Example:**
- Subject: `Happy Birthday {{firstName}}! 🎂`
- Message: `Hi {{firstName}}, hope your birthday on {{dob}} is amazing!`

### Step 4: Configure Your Settings (Owner Only)
1. **Choose your default email template:**
   - Go to Settings
   - Pick which template to use for all birthday emails

2. **Set when emails go out:**
   - Choose what time of day (like 9:00 AM)
   - Choose your timezone

3. **Set your company name:**
   - This appears as who the email is from

### Step 5: Add Staff Members (Owner Only)
1. **To add a new staff member:**
   - Go to "User Management"
   - Click "Add New User"
   - Fill in their name, email, and create a password
   - Choose "Admin" as their role
   - Click "Create User"

2. **Give them their login details:**
   - Share their email and password
   - They can now help manage customers and templates

## About Email Templates

### Making Emails Personal
You can make your emails personal by using these special codes:

- `{{firstName}}` → Customer's first name (like "John")
- `{{lastName}}` → Customer's last name (like "Smith") 
- `{{email}}` → Their email address
- `{{dob}}` → Their birthday (like "15 Mar")

### Ready-Made Template
The app comes with a birthday template already set up:

**Subject**: `🎉 Happy Birthday {{firstName}}!`

**Body**: 
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #4a90e2; text-align: center;">🎉 Happy Birthday!</h1>
  
  <p style="font-size: 18px;">Dear {{firstName}},</p>
  
  <p>Wishing you a very happy birthday! We hope your special day on {{dob}} is filled with joy, laughter, and wonderful memories.</p>
  
  <p>Thank you for being part of our community.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <p style="font-size: 20px; color: #4a90e2; font-weight: bold;">
      🎂 Enjoy your special day! 🎂
    </p>
  </div>
</div>
```

## How Birthday Emails Work Automatically

### The App Checks for Birthdays Every Day
The system automatically looks for customer birthdays and sends emails. Here's what happens:

1. **Every day at 7:00 AM** - The app checks if any customers have birthdays today
2. **At your chosen time** - The app also checks at whatever time you set in Settings
3. **Sends personalized emails** - Uses your chosen template and fills in each customer's name
4. **Won't send duplicates** - Even if it runs multiple times, customers only get one email per day

### Want to Test Your Email Template?

**Option 1: Change the send time**
1. Go to Settings
2. Change the email time to 2 minutes from now (like if it's 2:00 PM, set it to 2:02 PM)
3. Wait - it will send birthday emails to anyone with today's birthday

**Option 2: Send emails manually**
1. Go to "Email Jobs" 
2. Click "Send Birthday Emails Now"
3. Choose today's date or pick a different date to test

### What You Should Know
- **No duplicate emails** - Customers only get one birthday email per day, even if you test multiple times
- **Only sends to today's birthdays** - The app only sends to customers whose birthday is today (or the date you choose)
- **Automatic personal details** - Names and birthdays are automatically filled in from your customer list

## What You Can Do in the App

### Managing Your Account
- **Login/Logout** - Sign in and out of your account
- **View Profile** - See your account details
- **Create Staff Accounts** - Add new team members (Owner only)

### Managing Customers  
- **Add Customer** - Add new customers with their birthday
- **View All Customers** - See your complete customer list
- **Search Customers** - Find customers by name
- **Edit Customer** - Update customer information
- **Delete Customer** - Remove customers you no longer need

### Managing Email Templates
- **Create Template** - Write new birthday email templates
- **View Templates** - See all your email templates  
- **Edit Template** - Update existing templates
- **Delete Template** - Remove templates you don't use

### System Settings (Owner Only)
- **Choose Default Template** - Pick which template to use automatically
- **Set Email Time** - Choose when birthday emails are sent
- **Set Timezone** - Choose your local timezone
- **Set Company Name** - Choose what name appears on emails

### Email Reports & History
- **Send Emails Manually** - Test your templates or send birthday emails now
- **View Email History** - See which emails were sent and when
- **View Email Statistics** - See success rates and summaries
- **Search Email Logs** - Find specific emails that were sent

### User Management (Owner Only)
- **View All Users** - See all Owner and Staff accounts
- **Deactivate Users** - Temporarily disable staff access
- **Activate Users** - Re-enable staff access

## Setting Up Email Delivery

### Using Gmail to Send Birthday Emails
The app needs a Gmail account to send birthday emails. Here's how to set it up:

1. **Use a Gmail account** (create a new one just for this app if you want)

2. **Turn on 2-step verification:**
   - Go to your Google Account settings
   - Click "Security" 
   - Turn on "2-Step Verification"

3. **Create an App Password:**
   - In Google Account settings, go to "Security"
   - Click "App passwords" 
   - Choose "Mail" and "Other"
   - Copy the 16-character password it gives you

4. **Tell the app your email details:**
   - Email: Your Gmail address
   - Password: The 16-character app password (NOT your regular Gmail password)

This lets the app send emails on your behalf without giving it access to your main Gmail account.

### Tracking Your Email Success

**The app keeps track of everything for you:**
- Which birthday emails were sent successfully
- Which emails failed to send (and why)
- When each email was sent
- How many emails you've sent over time

**To see your email reports:**
1. Go to "Email Reports" in the app
2. Choose how many days back you want to see (like last 7 days)
3. Search for specific customers if needed
4. See success rates and any problems

## What Information the App Stores

**Your User Accounts:**
- Email addresses and passwords for login
- Whether someone is Owner or Staff
- Whether accounts are active or disabled

**Your Customers:**
- First name, last name, email address
- Birthday (month and day)
- Whether they're active customers

**Your Email Templates:**
- Template name and who created it
- Email subject line and message
- Which template is your default

**Your Settings:**
- Which template to use automatically
- What time to send emails
- Your timezone
- Your company name for emails

**Email History:**
- Every email that was sent or failed
- When it happened and why it failed (if it did)
- Complete record of all birthday emails

## If Something Goes Wrong

### Birthday Emails Aren't Sending
**Most likely reasons:**
1. **Wrong Gmail setup** - Make sure you're using an App Password, not your regular Gmail password
2. **Gmail account issues** - Check that 2-step verification is on and App Password is correct
3. **No customers with today's birthday** - The app only sends to customers whose birthday is today

**How to fix it:**
1. Check your Gmail App Password setup (see Email Setup section above)
2. Try sending a test email manually to see the specific error message
3. Make sure you have customers in the system with today's birthday

### Can't Login
**Most likely reasons:**
1. **Wrong email or password** - Double-check the login details above
2. **Account was deactivated** - Ask the Owner to reactivate your account

### App Says "Access Denied"
**Most likely reasons:**
1. **You're using a Staff account** - Only Owner accounts can access Settings and User Management
2. **Your session expired** - Try logging out and logging back in

### Emails Going to Spam
**How to improve delivery:**
1. **Ask recipients to add your email to contacts**
2. **Use a professional company email address** instead of personal Gmail
3. **Keep email content friendly and avoid spam words**

### Still Having Problems?
1. **Check the Email Reports** section to see specific error messages
2. **Try the manual "Send Emails Now" feature** to test
3. **Make sure your customer birthdays are entered correctly** (month and day)