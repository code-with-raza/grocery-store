export async function sendEmail({ to, subject, html }) {
  if (process.env.EMAIL_TRANSPORT === "console") {
    console.info(`[local email] To: ${to}\nSubject: ${subject}\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`);
    return;
  }
  const from = process.env.EMAIL_FROM || "Good Basket <onboarding@resend.dev>";
  if (!process.env.RESEND_API_KEY) {
    const error = new Error("Email service is not configured");
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.message || "Email delivery failed. Check your Resend sender domain and API key.");
    error.code = "EMAIL_DELIVERY_FAILED";
    throw error;
  }
}
