using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.CommonClasses.Email
{
    public interface IEmailService
    {
        void SendEmail(EmailMessage emailMessage);
        void SendEmailToSupport(EmailMessage emailMessage);
        Task SendEmailAsync(EmailMessage emailMessage);
        List<EmailMessage> ReceiveEmail(int maxCount = 10);
        Task SendEmailAsynchronously(EmailMessage emailMessage);

    }
}