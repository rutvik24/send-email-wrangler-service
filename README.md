# Portfolio Email Worker

A Cloudflare Worker that handles contact form submissions for portfolio websites with support for multiple email service providers.

## 🚀 Features

- **Multiple Email Providers**: Supports Mailtrap, Resend, SendGrid, and Cloudflare Email Workers
- **Professional Templates**: Beautiful HTML email templates
- **CORS Support**: Ready for frontend integration
- **Error Handling**: Comprehensive error handling and logging
- **Free Hosting**: Deploy on Cloudflare's free tier
- **Scalable**: Handles high traffic automatically

## 📧 Supported Email Services

1. **Mailtrap** (Recommended)
   - Free tier: 1,000 emails/month
   - Great for testing and production
   - Email analytics and deliverability insights

2. **Resend**
   - Free tier: 3,000 emails/month
   - Simple API and great deliverability

3. **SendGrid**
   - Free tier: 100 emails/day
   - Enterprise-grade email delivery

4. **Cloudflare Email Workers**
   - Advanced option for custom domains

## 🛠️ Quick Setup

### 1. Prerequisites

- [Cloudflare account](https://cloudflare.com)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### 2. Installation

```bash
# Clone or download this repository
cd portfolio-email-worker

# Install dependencies
npm install

# Login to Cloudflare
wrangler login
```

### 3. Choose Your Email Service

#### Option A: Mailtrap (Recommended)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Go to Email API → Integration
3. Copy your API Token
4. Set the secrets:
   ```bash
   wrangler secret put MAILTRAP_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   wrangler secret put RECIPIENT_NAME
   ```

#### Option B: Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Set the secrets:
   ```bash
   wrangler secret put RESEND_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   wrangler secret put RECIPIENT_NAME
   ```

#### Option C: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with Mail Send permissions
3. Set the secrets:
   ```bash
   wrangler secret put SENDGRID_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   wrangler secret put RECIPIENT_NAME
   ```

### 4. Deploy

```bash
wrangler deploy
```

After deployment, you'll get a URL like:
`https://portfolio-contact-api.your-subdomain.workers.dev`

### 5. Frontend Integration

Update your frontend contact form to send POST requests to your worker URL:

```javascript
const handleSubmit = async (formData) => {
  const response = await fetch('https://portfolio-contact-api.your-subdomain.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Email sent successfully!');
  } else {
    console.error('Failed to send email:', result.error);
  }
};
```

## 📋 API Reference

### POST /

Send a contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "message": "Hello, I'd like to get in touch!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description"
}
```

## 🔧 Configuration

### Environment Variables

Set these using `wrangler secret put`:

**Email Service API Keys:**
- `MAILTRAP_API_KEY`: Your Mailtrap API token
- `RESEND_API_KEY`: Your Resend API key
- `SENDGRID_API_KEY`: Your SendGrid API key

**Email Configuration:**
- `RECIPIENT_EMAIL`: The email address that will receive contact form submissions
- `RECIPIENT_NAME`: (Optional) The name of the recipient

### Customization

1. **Change recipient email**: Set via Wrangler secrets:
   ```bash
   wrangler secret put RECIPIENT_EMAIL
   # Enter your email when prompted
   
   wrangler secret put RECIPIENT_NAME  
   # Enter your name when prompted (optional)
   ```
2. **Update sender domain**: Modify the `from` field in `src/worker.js` for your verified domain
3. **Customize email template**: Edit the HTML template in the worker code
4. **Add rate limiting**: Implement rate limiting logic if needed

## 🚀 Development

### Local Development

```bash
# Start local development server
npm run dev
```

### View Logs

```bash
# Monitor worker logs in real-time
npm run tail
```

### Deploy

```bash
# Deploy to production
npm run deploy
```

## 📊 Cost Breakdown

- **Cloudflare Workers**: Free tier (100,000 requests/day)
- **Mailtrap**: Free tier (1,000 emails/month)
- **Resend**: Free tier (3,000 emails/month)
- **SendGrid**: Free tier (100 emails/day)

## 🔒 Security

- API keys are stored securely as Cloudflare secrets
- CORS is properly configured
- Input validation prevents malicious requests
- Error messages don't expose sensitive information

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your frontend domain is allowed in CORS headers
2. **Email Not Received**: Check spam folder and verify sender authentication
3. **Worker Not Found**: Verify deployment was successful
4. **API Key Errors**: Ensure secrets are set correctly

### Debug Commands

```bash
# Check deployment status
wrangler list

# View real-time logs
wrangler tail

# Test locally
wrangler dev

# Check secrets
wrangler secret list
```

### Test Your Worker

```bash
curl -X POST https://your-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## 📝 License

MIT License - feel free to use this in your own projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:

1. Check the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
2. Review your email service provider's documentation
3. Check the worker logs with `wrangler tail`
4. Open an issue in this repository

---

**Built with ❤️ using Cloudflare Workers**
