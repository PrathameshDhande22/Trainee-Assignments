using System.Configuration;
using System.Data.SqlClient;

namespace TaskAPI.Database
{
    public static class Connection
    {
        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["laptopdb"].ConnectionString;
            }
        }

        public static SqlConnection GetConn()
        {
            return new SqlConnection(ConnectionString);
        }
    }
}