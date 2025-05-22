using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;

namespace EcotimeMobileAPI.CommonClasses.Repositories
{
    public interface IStoredProcRepository
    {
        DbCommand GetStoredProcedure(string name, params (string, object)[] nameValueParams);

        DbCommand GetStoredProcedure(string name);

        DbCommand GetTextCommand(string text);
    }

    public interface IStoredProcRepository<TStoredProcEntity> : IStoredProcRepository
    {
        IList<TStoredProcEntity> ExecuteStoredProcedure(DbCommand command);

        Task<IList<TStoredProcEntity>> ExecuteStoredProcedureAsync(DbCommand command);
    }
}