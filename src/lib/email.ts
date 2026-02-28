import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPurchaseConfirmation(to: string, skillName: string, installCommand: string) {
  try {
    await resend.emails.send({
      from: 'Helm Market <deliveries@helmmarket.com>',
      to,
      subject: `Your skill is ready — ${installCommand}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="color: #6366f1;">Helm Market</h1>
          <p>Thank you for your purchase of <strong>${skillName}</strong>.</p>
          <p>You can now install this skill using the Helm CLI:</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; font-family: monospace;">
            <code>${installCommand}</code>
          </div>
          <p style="margin-top: 20px;">Manage your skills in your <a href="https://helmmarket.com/dashboard">dashboard</a>.</p>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send purchase confirmation email:', error)
  }
}

export async function sendDeveloperRevenueAlert(to: string, skillName: string, amountEuros: string) {
  try {
    await resend.emails.send({
      from: 'Helm Market <payouts@helmmarket.com>',
      to,
      subject: `You earned €${amountEuros} from ${skillName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="color: #6366f1;">New Sale!</h1>
          <p>Great news! A user just purchased your skill <strong>${skillName}</strong>.</p>
          <p>You earned <strong>€${amountEuros}</strong> (your 70% share).</p>
          <p style="margin-top: 20px;">Track your earnings in the <a href="https://helmmarket.com/dashboard/revenue">revenue dashboard</a>.</p>
        </div>
      `
    })
  } catch (error) {
    console.error('Failed to send developer revenue alert email:', error)
  }
}
