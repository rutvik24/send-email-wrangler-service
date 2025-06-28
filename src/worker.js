// Cloudflare Worker for handling contact form submissions
// Deploy this to Cloudflare Workers

export default {
  async fetch(request, env) {
    // Handle CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // In production, replace with your domain
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const { name, email, message } = await request.json();

      // Validate input
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing required fields",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Get recipient email from environment variable
      const recipientEmail = env.RECIPIENT_EMAIL || "your-email@example.com";
      const recipientName = env.RECIPIENT_NAME || "Portfolio Owner";

      // Option 1: Using Mailtrap API (recommended for testing and production)
      if (env.MAILTRAP_API_KEY) {
        const mailtrapResponse = await fetch("https://send.api.mailtrap.io/api/send", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${env.MAILTRAP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: {
              email: "portfolio@demomailtrap.com", // Use your verified domain or Mailtrap's demo domain
              name: "Portfolio Contact Form"
            },
            to: [
              {
                email: recipientEmail,
                name: recipientName
              }
            ],
            reply_to: {
              email: email,
              name: name
            },
            subject: `Portfolio Contact - Message from ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
                
                <div style="margin: 20px 0;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></p>
                </div>
                
                <div style="margin: 20px 0;">
                  <p><strong>Message:</strong></p>
                  <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="color: #666; font-size: 14px; text-align: center;">
                  <em>Sent from your portfolio contact form</em><br>
                  <small>Powered by Mailtrap & Cloudflare Workers</small>
                </p>
              </div>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from your portfolio contact form
            `.trim(),
          }),
        });

        if (!mailtrapResponse.ok) {
          const errorText = await mailtrapResponse.text();
          throw new Error(`Mailtrap API error: ${mailtrapResponse.status} - ${errorText}`);
        }
      }

      // Option 2: Using Resend API (alternative)
      else if (env.RESEND_API_KEY) {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "portfolio@yourdomain.com", // Must be from your verified domain
            to: [recipientEmail],
            reply_to: email,
            subject: `Portfolio Contact - Message from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <p><em>Sent from your portfolio contact form</em></p>
            `,
          }),
        });

        if (!resendResponse.ok) {
          throw new Error(`Resend API error: ${resendResponse.status}`);
        }
      }

      // Option 3: Using Cloudflare Email Workers (if you have email routing set up)
      else if (env.CLOUDFLARE_EMAIL_ENABLED) {
        // This would use Cloudflare's Email Workers feature
        // You need to set up email routing in your Cloudflare dashboard
        await env.EMAIL_SENDER.send({
          from: "portfolio@yourdomain.com",
          to: recipientEmail,
          subject: `Portfolio Contact - Message from ${name}`,
          content: `
            New Contact Form Submission
            
            Name: ${name}
            Email: ${email}
            
            Message:
            ${message}
            
            ---
            Sent from your portfolio contact form
          `,
        });
      }

      // Option 4: Using SendGrid (alternative)
      else if (env.SENDGRID_API_KEY) {
        const sendGridResponse = await fetch(
          "https://api.sendgrid.com/v3/mail/send",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [
                {
                  to: [{ email: recipientEmail }],
                  subject: `Portfolio Contact - Message from ${name}`,
                },
              ],
              from: { email: "portfolio@yourdomain.com" }, // Must be verified
              reply_to: { email: email },
              content: [
                {
                  type: "text/html",
                  value: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
                <hr>
                <p><em>Sent from your portfolio contact form</em></p>
              `,
                },
              ],
            }),
          }
        );

        if (!sendGridResponse.ok) {
          throw new Error(`SendGrid API error: ${sendGridResponse.status}`);
        }
      } else {
        throw new Error("No email service configured");
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error("Email sending error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send email",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
