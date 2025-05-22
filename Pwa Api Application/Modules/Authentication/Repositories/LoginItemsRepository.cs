using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Authentication.Contexts;

namespace EcotimeMobileAPI.Modules.Authentication.Repositories
{
    public class LoginItemsRepository : StoredProcRepository, ILoginItemsRepository
    {
        public LoginItemsRepository(LoginItemContext dbContext) : base(dbContext)
        {
        }
    }
}