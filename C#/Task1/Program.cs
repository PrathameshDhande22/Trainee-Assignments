using System;

namespace Task1
{
    internal class Program
    {
        // C# Task 1 Generics
        static void Main(string[] args)
        {
            //Console.WriteLine(Add<string>("prathamesh","hello"));
            Console.WriteLine(Add<string>("Prathamesh"," ", "Dhande"));
            Console.WriteLine(Add<int>(1, 2, 3, 4, 5));
            Console.WriteLine(Add<decimal>(1.23m, 54.33m, 98.1m));
            Console.WriteLine(Add<float>(1.1f, 1.2f, 1.4f));

            // Throws error
            //Console.WriteLine(Add<double>(1234d, 56d, 89d));
        }

        public static T Add<T>(params T[] values)
        {
            Type type = typeof(T);
            dynamic result = default(T);
            if (type == typeof(String) || type == typeof(int) || type == typeof(decimal) || type == typeof(float))
            {
                foreach (T val in values)
                {
                    result += val;
                }
            }
            else
            {
                throw new Exception($"Add<T>(T[] values) method doesn't support {type} Type");
            }
            return (T)result;
        }
    }


}
