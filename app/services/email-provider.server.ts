// TODO: Update the implementation to send an email once Mailgun is set up
export let sendEmail = async (email: string, subject: string, html: string) => {
  console.log('Sending email to: ' + email)
  console.log('Subject: ' + subject)
  console.log('HTML: ' + html)
  return true
}
