# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-06-28

### Added
- Initial release of Portfolio Email Worker
- Support for Mailtrap email service (primary)
- Support for Resend email service
- Support for SendGrid email service  
- Support for Cloudflare Email Workers
- Professional HTML email templates
- CORS support for frontend integration
- Comprehensive error handling
- Input validation
- Beautiful email formatting with CSS styles
- Reply-to functionality
- Both HTML and plain text email support

### Features
- Multi-provider email service support
- Automatic fallback between providers
- Secure API key management via Cloudflare secrets
- Professional email templates
- Real-time logging and monitoring
- Easy deployment with Wrangler CLI

### Security
- API keys stored as Cloudflare Worker secrets
- Input validation and sanitization
- CORS properly configured
- Error messages don't expose sensitive data
