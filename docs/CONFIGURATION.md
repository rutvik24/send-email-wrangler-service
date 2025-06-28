## Email Service Configuration Examples

### Mailtrap Configuration

1. **Sign up at [mailtrap.io](https://mailtrap.io)**
2. **Get API Key**:
   - Navigate to Email API → Integration
   - Copy the API Token
3. **Set Environment Variables**:

   ```bash
   wrangler secret put MAILTRAP_API_KEY
   # Paste your API token when prompted

   wrangler secret put RECIPIENT_EMAIL
   # Enter your email address (e.g., rutviknabhoya2001@gmail.com)

   wrangler secret put RECIPIENT_NAME
   # Enter your name (e.g., Rutvik Nabhoya) - Optional
   ```

### Resend Configuration

1. **Sign up at [resend.com](https://resend.com)**
2. **Verify Domain** (optional for testing):
   - Go to Domains section
   - Add your domain and verify DNS records
3. **Get API Key**:
   - Go to API Keys section
   - Create a new API key
4. **Set Environment Variables**:
   ```bash
   wrangler secret put RESEND_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   wrangler secret put RECIPIENT_NAME
   ```

### SendGrid Configuration

1. **Sign up at [sendgrid.com](https://sendgrid.com)**
2. **Authenticate Sender**:
   - Go to Settings → Sender Authentication
   - Verify single sender or authenticate domain
3. **Create API Key**:
   - Go to Settings → API Keys
   - Create key with "Mail Send" permissions
4. **Set Environment Variables**:
   ```bash
   wrangler secret put SENDGRID_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   wrangler secret put RECIPIENT_NAME
   ```

### Custom Domain Setup

For production use, configure a custom domain in your email service:

#### Mailtrap Domain Setup

```javascript
from: {
  email: "portfolio@yourdomain.com",
  name: "Portfolio Contact Form"
}
```

#### Resend Domain Setup

```javascript
from: "portfolio@yourdomain.com";
```

#### SendGrid Domain Setup

```javascript
from: {
  email: "portfolio@yourdomain.com";
}
```

## Testing Your Setup

### 1. Test with curl

```bash
curl -X POST https://your-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the API"
  }'
```

### 2. Expected Response

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### 3. Check Email Delivery

- Check your email (configured via `RECIPIENT_EMAIL`)
- Check spam folder if not in inbox
- Verify sender authentication if emails are not being delivered

## Recipient Email Configuration

The worker now supports configurable recipient email addresses via Wrangler secrets:

### Required Configuration

```bash
# Set the email address that will receive contact form submissions
wrangler secret put RECIPIENT_EMAIL
# Example: rutviknabhoya2001@gmail.com

# Optionally set the recipient name for better email formatting
wrangler secret put RECIPIENT_NAME
# Example: Rutvik Nabhoya
```

### Benefits of Configurable Recipients

- ✅ **Reusable**: Same worker can be used for different projects
- ✅ **Secure**: Email addresses not hardcoded in the source code
- ✅ **Flexible**: Easy to change recipients without redeploying
- ✅ **Multi-environment**: Different recipients for staging/production

### Default Values

If not configured, the worker will use:

- **Default Email**: `your-email@example.com`
- **Default Name**: `Portfolio Owner`

### Example Setup for Your Portfolio

```bash
# Navigate to your worker directory
cd portfolio-email-worker

# Set your email configuration
wrangler secret put RECIPIENT_EMAIL
# Enter: example@gmail.com

wrangler secret put RECIPIENT_NAME
# Enter: Example User

# Deploy with new configuration
wrangler deploy
```

