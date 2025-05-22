using EcotimeMobileAPI.CommonClasses.BaseClasses;
using EcotimeMobileAPI.Libraries;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.CommonClasses.Repositories
{
    public class StoredProcRepository : IStoredProcRepository
    {
        private readonly BaseContext _dbContext;

        public StoredProcRepository(BaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public DbCommand GetStoredProcedure(string name, params (string, object)[] nameValueParams)
        {
            return _dbContext
                .LoadStoredProcedure(name)
                .WithSqlParams(nameValueParams);
        }

        public DbCommand GetStoredProcedure(string name)
        {
            return _dbContext.LoadStoredProcedure(name);
        }

        public DbCommand GetTextCommand(string text)
        {
            return _dbContext.LoadText(text);
        }
    }

    public class StoredProcRepository<TEntity> : StoredProcRepository, IStoredProcRepository<TEntity> where TEntity : class
    {
        public StoredProcRepository(BaseContext dbContext) : base(dbContext)
        {
        }

        public IList<TEntity> ExecuteStoredProcedure(DbCommand command)
        {
            return command.ExecuteStoredProcedure<TEntity>();
        }

        public Task<IList<TEntity>> ExecuteStoredProcedureAsync(DbCommand command)
        {
            return command.ExecuteStoredProcedureAsync<TEntity>();
        }
    }
}