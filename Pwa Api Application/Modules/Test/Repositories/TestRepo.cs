using EcotimeMobileAPI.CommonClasses.BaseClasses;
using EcotimeMobileAPI.CommonClasses.Repositories;
using EcotimeMobileAPI.Modules.Balances.Contexts;
using EcotimeMobileAPI.Modules.Balances.Repositories;
using EcotimeMobileAPI.Modules.Test.Contexts;

namespace EcotimeMobileAPI.Modules.Test.Repositories
{
    public class TestRepo : StoredProcRepository, ITestRepo
    {
        public TestRepo(TestContext dbContext) : base(dbContext)
        {
        }

        //repository related code should be in its implementatation call because it is a data logic (how data will work, or how to get data)
        //it will be abstract for controller that from where data is coming, or how data is coming etc
        public string DummyEndPoint()
        {
            return "Hello World";
        }
    }
}

