using EcotimeMobileAPI.CommonClasses.Repositories;

namespace EcotimeMobileAPI.Modules.Test.Repositories
{
    public interface ITestRepo : IStoredProcRepository
    {
        string DummyEndPoint();
    }
}
