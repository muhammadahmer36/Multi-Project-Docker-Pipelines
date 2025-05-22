using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Pop3;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;

namespace EcotimeMobileAPI.CommonClasses.Email
{
    public class EmailService : IEmailService
    {
        #region Private Variables & Constructor

        private readonly IEmailConfiguration _emailConfiguration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IEmailConfiguration emailConfiguration, ILogger<EmailService> logger)
        {
            _emailConfiguration = emailConfiguration;
            _logger = logger;
        }

        #endregion

        #region Public Methods

        public void SendEmailToSupport(EmailMessage emailMessage)
        {
            emailMessage.ToAddresses.AddRange(_emailConfiguration.SupportEmailAddress.Split(',').Select(x => new EmailAddress { Address = x }));
            SendEmail(emailMessage);
        }

        public void SendEmail(EmailMessage emailMessage)
        {
            _logger.LogInformation("SendEmail() => Email configuration {@_emailConfiguration}", _emailConfiguration);

            emailMessage.FromAddresses.Add(new EmailAddress { Name = _emailConfiguration.SmtpFromName, Address = _emailConfiguration.SmtpFromAddress });

            MimeMessage message = BuildEmailMessage(emailMessage);
            _logger.LogInformation("SendEmail() => MimeMessage {@message}", message.ToString());

            using var emailClient = new SmtpClient();
            var secureSocketOptions = (SecureSocketOptions)_emailConfiguration.SmtpSecureSocketOption;

            emailClient.LocalDomain = _emailConfiguration.SmtpDomain;

            _logger.LogInformation(string.Format("SendEmail() => conneting email client with these settings {{ SmtpServer:{0}, SmtpPort: {1}, secureSocketOptions:{2} }}"
                , _emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, (int)secureSocketOptions));

            emailClient.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, secureSocketOptions);

            if (_emailConfiguration.IsAuthenticationRequired) emailClient.Authenticate(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
          
            emailClient.Send(message);

            emailClient.Disconnect(true);
            _logger.LogInformation("SendEmail() => disconnected, exexution completed for SendEmail();");
        }

        public async Task SendEmailAsynchronously(EmailMessage emailMessage)
        {
            try
            {
                _logger.LogInformation("SendEmailAsynchronously() => Email configuration {@_emailConfiguration}", _emailConfiguration);

                emailMessage.FromAddresses.Add(new EmailAddress { Name = _emailConfiguration.SmtpFromName, Address = _emailConfiguration.SmtpFromAddress });

                MimeMessage message = BuildEmailMessage(emailMessage);
                _logger.LogInformation("SendEmailAsynchronously() => MimeMessage {@message}", message.ToString());

                using (var emailClient = new SmtpClient())
                {
                    var secureSocketOptions = (SecureSocketOptions)_emailConfiguration.SmtpSecureSocketOption;
                    emailClient.LocalDomain = _emailConfiguration.SmtpDomain;

                    _logger.LogInformation("SendEmailAsynchronously() => connecting email client with these settings {{ SmtpServer:{0}, SmtpPort: {1}, SecureSocketOptions:{2} }}",
                        _emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, secureSocketOptions);

                    await emailClient.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, secureSocketOptions);

                    if (_emailConfiguration.IsAuthenticationRequired)
                    {
                        await emailClient.AuthenticateAsync(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
                    }

                    await emailClient.SendAsync(message);

                    await emailClient.DisconnectAsync(true);
                    _logger.LogInformation("SendEmailAsynchronously() => disconnected, execution completed for SendEmailAsynchronously()");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while sending the email.");
                throw; // Rethrow the exception to propagate it up the call stack
            }
        }

        public async Task SendEmailAsync(EmailMessage emailMessage)
        {
            MimeMessage message = BuildEmailMessage(emailMessage);

            using var emailClient = new SmtpClient();
            //emailClient.LocalDomain = _emailConfiguration.SmtpDomain;
            var secureSocketOptions = (SecureSocketOptions)_emailConfiguration.SmtpSecureSocketOption;
            await emailClient.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, secureSocketOptions).ConfigureAwait(false);
            //await emailClient.AuthenticateAsync(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
            await emailClient.SendAsync(message).ConfigureAwait(false);
            await emailClient.DisconnectAsync(true).ConfigureAwait(false);
        }

        public List<EmailMessage> ReceiveEmail(int maxCount = 10)
        {
            using var emailClient = new Pop3Client();
            emailClient.Connect(_emailConfiguration.PopServer, _emailConfiguration.PopPort, true);
            emailClient.AuthenticationMechanisms.Remove("XOAUTH2");
            emailClient.Authenticate(_emailConfiguration.PopUsername, _emailConfiguration.PopPassword);

            List<EmailMessage> emails = new List<EmailMessage>();
            for (int i = 0; i < emailClient.Count && i < maxCount; i++)
            {
                var message = emailClient.GetMessage(i);
                var emailMessage = new EmailMessage
                {
                    Content = !string.IsNullOrEmpty(message.HtmlBody) ? message.HtmlBody : message.TextBody,
                    Subject = message.Subject
                };
                emailMessage.ToAddresses.AddRange(message.To.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
                emailMessage.FromAddresses.AddRange(message.From.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
                emails.Add(emailMessage);
            }

            return emails;
        }

        #endregion

        #region Private Helper Methods

        private MimeMessage BuildEmailMessage(EmailMessage emailMessage)
        {
            MimeMessage message = new MimeMessage();
            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
            message.From.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = emailMessage.Content
            };

            return message;
        }

        #endregion
    }
}