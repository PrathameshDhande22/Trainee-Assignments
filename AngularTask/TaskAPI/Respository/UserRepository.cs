using System.Collections.Generic;
using System.Data.SqlClient;
using TaskAPI.Database;
using Dapper;
using TaskAPI.Models;
using System.Data;
using System.Linq;
using System;

namespace TaskAPI.Respository
{
    public static class UserRepository
    {

        /// <summary>
        /// Getting the State and Cities from the Database and returing it in the form of Dictionary
        /// </summary>
        /// <returns><see cref="Dictionary{String, List{String}}"/> Dictionary of key as state and list of city for related key.</returns>
        public static Dictionary<string, List<string>> GetStateCities()
        {
            try
            {
                using (SqlConnection conn = Connection.GetConn())
                {
                    Dictionary<string, List<string>> dictofstatecity = conn.Query<StateCity>("spGetCitiesState", commandType: CommandType.StoredProcedure).GroupBy(e => e.State).ToDictionary(
                        group => group.Key,
                        group => group.Select(sc => sc.City).ToList());

                    return dictofstatecity;

                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// The List of Interest from the database
        /// </summary>
        /// <returns><see cref="List{Interests}"/> List of Interests Class</returns>
        public static List<Interests> GetInterests()
        {
            try
            {
                using (SqlConnection conn = Connection.GetConn())
                {
                    return conn.Query<Interests>("spGetInterests", commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception)
            {
                return new List<Interests>();
            }
        }


        /// <summary>
        /// Adds or Updates the User into the Database using Dapper Call.<br></br>
        /// For Adding the user into the database use the <paramref name="procedurename"/> as <code>"spAddUser"</code>
        /// For Updating the User use the <paramref name="procedurename"/> as <code>"spUpdateUser"</code>
        /// </summary>
        /// <param name="user">The Model of the User Mapped with its properties</param>
        /// <returns><see langword="true"/> if the Insertion is successful otherwise <see langword="false"/>.</returns>
        public static bool AddUpdateUser(User user,string procedurename)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();

                if (procedurename.Equals("spUpdateUser"))
                {
                    parameters.Add("@id", user.Id, DbType.Int32);
                }
                parameters.Add("@interesttable", ToDataTable(user.InterestsId).AsTableValuedParameter("interests"), DbType.Object);
                parameters.Add("@FirstName", user.FirstName, DbType.String);
                parameters.Add("@LastName", user.LastName, DbType.String);
                parameters.Add("@Email", user.Email, DbType.String);
                parameters.Add("@Password", user.Password, DbType.String);
                parameters.Add("@DateOfBirth", user.DateOfBirth, DbType.DateTime);
                parameters.Add("@Age", user.Age, DbType.Int32);
                parameters.Add("@Gender", user.Gender, DbType.String);
                parameters.Add("@State", user.State, DbType.String);
                parameters.Add("@City", user.City, DbType.String);
                parameters.Add("@Address", user.Address, DbType.String);
                parameters.Add("@PhoneNo", user.PhoneNo, DbType.String);
                parameters.Add("@Profile", user.Profile, DbType.String);
                parameters.Add("@issuccess", dbType: DbType.Int32, direction: ParameterDirection.Output);

                using (SqlConnection conn = Connection.GetConn())
                {
                    conn.Open();

                    int rowsaffected = conn.Execute(procedurename, parameters, commandType: CommandType.StoredProcedure);
                    return parameters.Get<int>("@issuccess") == 1;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Converts the Array of InterestsId into the Datatable, to be used as table valued parameter to inserting into the database
        /// </summary>
        /// <param name="interestsid"> <see cref="int[]"/> Of Interests Id to be inserted</param>
        /// <returns>Datatable with one Column as Interestid</returns>
        private static DataTable ToDataTable(int[] interestsid)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("interestid"));

            //Adding the rows into the datatable
            foreach (int id in interestsid)
            {
                dt.Rows.Add(id);
            }
            return dt;
        }

        /// <summary>
        /// To get the List of users present in the database or to get the Single <see cref="User"/> by its ID.
        /// </summary>
        /// <param name="userid">to get the Data of the User of the passed id</param>
        /// <returns><see cref="List{User}"/> List of the Users.</returns>
        public static List<User> GetUsers(int userid = 0)
        {
            try
            {
                Dictionary<int, User> userDictionary = new Dictionary<int, User>();

                using (SqlConnection conn = Connection.GetConn())
                {
                    List<User> users = conn.Query<User, Interests, User>("spGetUsers", (user, interest) =>
                    {
                        if (!userDictionary.TryGetValue(user.Id, out var currentUser))
                        {
                            currentUser = user;
                            userDictionary.Add(currentUser.Id, currentUser);
                        }

                        if (interest != null)
                        {
                            currentUser.Interests.Add(interest);
                        }

                        return currentUser;
                    }, new { id = userid }, splitOn: "interestid").Distinct().ToList();

                    return users;
                }
            }
            catch (Exception)
            {
                return new List<User>();
            }
        }

        /// <summary>
        /// Deletes the User from the database
        /// </summary>
        /// <param name="userid">To Delete The User</param>
        /// <returns><see langword="true"/> if the user is deleted successfully otherwise <see langword="false"/></returns>
        public static bool DeleteUser(int userid)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@id", userid, DbType.Int32);
                parameters.Add("@issuccess", 0, DbType.Int32, ParameterDirection.Output);

                using (SqlConnection conn = Connection.GetConn())
                {
                    int rowsaffected = conn.Execute("spDeleteUser",parameters, commandType: CommandType.StoredProcedure);
                    return parameters.Get<int>("@issuccess") == 1 && rowsaffected == 1;

                }
            }
            catch (Exception)
            {
                return false;
            }
        }


    }
}