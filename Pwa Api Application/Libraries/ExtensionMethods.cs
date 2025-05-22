using Dapper;
using System;
using System.Linq;
using System.Reflection;
using System.Data.Common;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using EcotimeMobileAPI.CommonClasses.BaseClasses;

namespace EcotimeMobileAPI.Libraries
{
    public static class ExtensionMethods
    {
        #region Extension Methods for Strings

        // Method to perform a case insensitive string replace
        public static string Replace(this string source, string oldString, string newString, StringComparison comp)
        {
            int index = source.IndexOf(oldString, comp);

            // Determine if we found a match
            bool MatchFound = index >= 0;

            if (MatchFound)
            {
                // Remove the old text
                source = source.Remove(index, oldString.Length);

                // Add the replacemenet text
                source = source.Insert(index, newString);
            }

            // recursively call for multiple instances of a match
            if (source.IndexOf(oldString, comp) != -1)
            {
                source = Replace(source, oldString, newString, comp);
            }

            return source;
        }

        #endregion

        #region Extension Methods for Stored Procedure Calls

        public static DbCommand LoadStoredProcedure(this BaseContext context, string storedProcName)
        {
            var cmd = context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = storedProcName;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            return cmd;
        }

        public static DbCommand WithSqlParams(this DbCommand cmd, params (string, object)[] nameValueParamPairs)
        {
            foreach (var pair in nameValueParamPairs)
            {
                var param = cmd.CreateParameter();
                param.ParameterName = pair.Item1;
                param.Value = pair.Item2 ?? DBNull.Value;
                cmd.Parameters.Add(param);
            }

            return cmd;
        }

        public static DbCommand LoadText(this BaseContext context, string text)
        {
            var cmd = context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = text;
            cmd.CommandType = System.Data.CommandType.Text;
            return cmd;
        }

        public static IList<T> ExecuteStoredProcedure<T>(this DbCommand command) where T : class
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                command.Connection.Open();
            try
            {
                using var reader = command.ExecuteReader();
                return reader.MapToList<T>();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static async Task<IList<T>> ExecuteStoredProcedureAsync<T>(this DbCommand command) where T : class
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                await command.Connection.OpenAsync();
            try
            {
                using var reader = command.ExecuteReader();
                return reader.MapToList<T>();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static int ExecuteStoredProcedureNonQuery(this DbCommand command)
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                command.Connection.Open();
            try
            {
                return command.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static async Task<int> ExecuteStoredProcedureNonQueryAsync(this DbCommand command)
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                await command.Connection.OpenAsync();
            try
            {
                return command.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static object ExecuteStoredProcedureScalar(this DbCommand command)
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                command.Connection.Open();
            try
            {
                return command.ExecuteScalar();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static async Task<object> ExecuteStoredProcedureScalarAsync(this DbCommand command)
        {
            if (command.Connection.State == System.Data.ConnectionState.Closed)
                await command.Connection.OpenAsync();
            try
            {
                return command.ExecuteScalar();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                command.Connection.Close();
            }
        }

        public static IList<T> MapToList<T>(this DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();

            var colMapping = dr.GetColumnSchema()
                .Where(x => props.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
                .ToDictionary(key => key.ColumnName.ToLower());

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        if (colMapping.ContainsKey(prop.Name.ToLower()))
                        {
                            var val = dr.GetValue(colMapping[prop.Name.ToLower()].ColumnOrdinal.Value);
                            prop.SetValue(obj, val == DBNull.Value ? null : val);
                        }
                    }
                    objList.Add(obj);
                }
            }

            dr.NextResult();

            return objList;
        }

        public static T MapToSingle<T>(this DbDataReader dr)
        {
            T obj = Activator.CreateInstance<T>();
            var props = typeof(T).GetRuntimeProperties();

            var colMapping = dr.GetColumnSchema()
                .Where(x => props.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
                .ToDictionary(key => key.ColumnName.ToLower());

            if (dr.Read())
            {
                foreach (var prop in props)
                {
                    if (colMapping.ContainsKey(prop.Name.ToLower()))
                    {
                        var val = dr.GetValue(colMapping[prop.Name.ToLower()].ColumnOrdinal.Value);
                        prop.SetValue(obj, val == DBNull.Value ? null : val);
                    }
                }
                dr.NextResult();
            }
            else
                return default;

            return obj;
        }

        public static T MapToSingle<T>(this SqlMapper.GridReader reader) 
        {
            try
            {
                return (!reader.IsConsumed) ? reader.Read<T>().FirstOrDefault() : default;
            }
            catch (Exception ex)
            { 
                return default;
            }
                
        }

        public static IList<T> MapToList<T>(this SqlMapper.GridReader reader) 
        {
            try
            {
                return (!reader.IsConsumed) ? reader.Read<T>().ToList() : Enumerable.Empty<T>() as IList<T>;
            }
            catch (Exception ex)
            {
                return Enumerable.Empty<T>() as IList<T>;
            }
        }

        #endregion
    }
}