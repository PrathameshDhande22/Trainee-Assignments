using Newtonsoft.Json;
using JSONSer = System.Text.Json.JsonSerializer;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using System.Text.Json.Nodes;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using Task3;
class Program
{
    static string jsonPath = "C:\\Users\\PrathameshDhande\\OneDrive - Systenics Solutions LLP\\Documents\\Training\\C#\\Task3\\Students.json";
    static void Main(string[] args)
    {
        //SerializeObjects();
        //UsingDeserializer();
        //UsingNewtonSoft();
        //UsingJArray();  => failed
        //UsingJsonValue();
        //UseCustom(); //=> not working
        //ReadJson readjson = new ReadJson();

    }

    private static T JsonDeserializer<T>(string jsonString)
    {
        T deserializedUser = default(T);
        var ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
        var ser = new DataContractJsonSerializer(typeof(T));
        deserializedUser = (T)ser.ReadObject(ms);// as T;
        ms.Close();
        return deserializedUser;
    }

    public static void UseCustom()
    {
        StudentsList lists = JsonDeserializer<StudentsList>(File.ReadAllText(jsonPath));

    }

    static void UsingDeserializer()
    {
        StreamReader sr = new StreamReader(jsonPath);
        StudentsList? students = JSONSer.Deserialize<StudentsList>(sr.ReadToEnd(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
        sr.Close();
        Console.WriteLine(students);
    }

    static void UsingNewtonSoft()
    {
        StudentsList? stlist = JsonConvert.DeserializeObject<StudentsList>(File.ReadAllText(jsonPath));
        Console.WriteLine(stlist);
    }

    static void UsingJArray()
    {
        JArray? jsonfile = JArray.Parse(File.ReadAllText(jsonPath));
        foreach (var data in jsonfile)
        {
            Console.WriteLine(data.ToObject<Student>());
        }
    }

    static void UsingJsonValue()
    {
        JsonNode? jt = JsonValue.Parse(File.ReadAllText(jsonPath));
        JsonObject jobject = jt.AsObject();

        List<Student> stlist = new List<Student>();
        foreach (JsonNode ojb in jobject["Students"].AsArray())
        {
            Type? t = Type.GetType("Student");
            object? st = Activator.CreateInstance(t);
            List<PropertyInfo> pi = t.GetProperties().ToList();

            foreach (PropertyInfo pi2 in pi)
            {
                Type propertyType = pi2.PropertyType;
                if (propertyType == typeof(string))
                {
                    string value = (string)ojb[pi2.Name] ?? (string)ojb[pi2.Name.ToLower()];
                    pi2.SetValue(st, value);
                }
                else if (propertyType == typeof(int))
                {
                    int? val = (int)ojb[pi2.Name] == 0 ? (int)ojb[pi2.Name.ToLower()] : (int)ojb[pi2.Name];
                    pi2.SetValue(st, val);
                }
                else if (propertyType == typeof(Address))
                {
                    Type? t1 = propertyType;
                    JsonObject addressjson = ojb["Address"].AsObject();
                    object? address = Activator.CreateInstance(t1);
                    List<PropertyInfo> addressProp = t1.GetProperties().ToList();
                    foreach (PropertyInfo add in addressProp)
                    {
                        if (add.PropertyType == typeof(string))
                        {
                            string value = (string)addressjson[add.Name] ?? (string)addressjson[add.Name.ToLower()];
                            add.SetValue(address, value);
                        }
                        else if (add.PropertyType == typeof(int))
                        {
                            int? val = (int)addressjson[add.Name] == 0 ? (int)addressjson[add.Name.ToLower()] : (int)addressjson[add.Name];
                            add.SetValue(address, val);
                        }
                    }
                    pi2.SetValue(st, address);
                }
            }
            stlist.Add(st as Student);
        }
        StudentsList slist = new StudentsList() { Students = stlist };
        Console.WriteLine(slist);

    }

    static void SerializeObjects()
    {
        Address add = new Address()
        {
            City = "London",
            PinCode = 401202,
            Street = "Marcus London"
        };
        Student st = new Student()
        {
            Address = add,
            Branch = "Mechanical",
            LastName = "maria",
            Id = 110,
            FirstName = "lavender"
        };
        Console.WriteLine(JSONSer.Serialize(st));

    }
}

class StudentsList
{
    public List<Student>? Students { get; set; }
    public string newJoinee { get; set; }

    public override string ToString()
    {
        foreach (Student st in Students)
        {
            Console.WriteLine(st);
        }
        return "";
    }
}
class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Address? Address { get; set; }
    public string Branch { get; set; }

    public Student()
    {
        Id = 0;
        FirstName = "notdefined";
        LastName = "notdefined";
        Address = new Address();
        Branch = "notdefined";
    }

    public override string ToString()
    {
        return $"Student( Id = {Id},FirstName = {FirstName},LastName = {LastName},Address = {Address},Branch = {Branch})\n";
    }
}
class Address
{
    public string? City { get; set; }
    public string? Street { get; set; }
    public int PinCode { get; set; }

    public Address()
    {
        City = "notdefined";
        Street = "notdefined";
        PinCode = 0;
    }

    public override string ToString()
    {
        return $"Address( City = {City},Street = {Street},PinCode = {PinCode})";
    }
}