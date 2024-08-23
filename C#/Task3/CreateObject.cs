using System.Collections;
using System.Reflection;
using System.Text.Json.Nodes;

namespace Task3
{
    internal class CreateObject
    {
        public T ParseJSON<T>(string json)
        {
            JsonObject? jsonObj = JsonObject.Parse(json).AsObject();
            return (T)ParseObject(jsonObj, typeof(T));
        }

        private object? ParseObject(JsonObject? jsonObj, Type type)
        {
            Dictionary<string, JsonNode> jsonDict = new Dictionary<string, JsonNode>();
            foreach (KeyValuePair<string, JsonNode> js in jsonObj)
            {
                jsonDict.Add(js.Key.ToLower(), js.Value);
            }
            object? instance = BindProperties(jsonDict, type);
            return instance;
        }

        private void IterateOverDictionary(dynamic data)
        {
            foreach (var da in data)
            {
                Console.WriteLine(da.Key + " = " + da.Value);
            }
        }

        private void IterateOverList(dynamic data)
        {
            foreach (var da in data)
            {
                Console.WriteLine(da);
            }
        }

        private object? BindProperties(Dictionary<string, JsonNode> jsonDict, Type type)
        {
            object? instance = Activator.CreateInstance(type);
            PropertyInfo[] propInfo = type.GetProperties();

            foreach (PropertyInfo property in propInfo)
            {
                string propName = property.Name.ToLower();
                if (jsonDict.ContainsKey(propName))
                {
                    Type currentType = jsonDict[propName].GetType();
                    if (currentType == typeof(JsonArray))
                    {
                        property.SetValue(instance, ParseJsonArray(jsonDict[propName].AsArray(), property.PropertyType));
                    }
                    else if (currentType == typeof(JsonObject))
                    {
                        property.SetValue(instance, ParseObject(jsonDict[propName].AsObject(), property.PropertyType));
                    }
                    else
                    {
                        Type settingType = property.PropertyType;
                        property.SetValue(instance, Convert.ChangeType(jsonDict[propName].ToString(), settingType));
                    }
                }
            }
            return instance;
        }

        private object ParseJsonArray(JsonArray jsArray, Type type)
        {
            Type? innerType = type.GetGenericArguments()[0];
            IList? element = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(innerType));
            PropertyInfo[] innerProp = innerType.GetProperties();
            foreach (JsonNode jsnodes in jsArray)
            {
                if (jsnodes.GetType() == typeof(JsonObject))
                {
                    element.Add(ParseObject(jsnodes.AsObject(), innerType));
                }
            }
            return element;
        }


        static void Main(string[] args)
        {
            string jsonpath = "C:\\Users\\PrathameshDhande\\OneDrive - Systenics Solutions LLP\\Documents\\Training\\C#\\Task3\\Students.json";
            string json = File.ReadAllText(jsonpath);
            CreateObject cobj = new CreateObject();
            var m = cobj.ParseJSON<StudentsList>(json);
            Console.WriteLine(cobj.ParseJSON<StudentsList>(json));
        }
    }

  /*  class Employee
    {
        public int Id { get; set; }
        public string firstname { get; set; }
        public string work { get; set; }
    }*/

  /*  class EmployeeJson
    {
        public Employee employee { get; set; }

        public string Manager { get; set; }
    }
*/
}
