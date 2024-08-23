using System;
using System.Text;


namespace Task2
{
    internal class Utilities
    {
        public static string MessageCreator(string mainOption, string extraMessagePrint, bool isMain, params string[] options)
        {
            if (string.IsNullOrWhiteSpace(mainOption) || options.Length == 0)
            {
                throw new ArgumentException("Please Give Proper Options or Main option");
            }
            if (!isMain)
            {
                PrintBeautifulMessage($"\n****** {mainOption} ******", MessageType.Warning);
            }
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < options.Length; i++)
            {
                sb.Append($"{i + 1}. " + options[i] + "\n");
            }

            sb.Append($"Enter the Choice Between [1-{options.Length}] > ");
            if (!string.IsNullOrWhiteSpace(extraMessagePrint))
            {
                Console.WriteLine(extraMessagePrint);
            }
            Console.Write(sb.ToString());
            return $"Invalid Choice !\nEnter Correct Choice Between [1-{options.Length}]";
        }

        public static string PrettyFolder(string path)
        {
            return String.Join(" > ", path.Split(new char[] { '\\' }));
        }

        public static void PrintBeautifulMessage(string message, MessageType type)
        {
            Console.ForegroundColor = (ConsoleColor)type;
            Console.WriteLine(message);
            Console.ForegroundColor = ConsoleColor.Green;
        }

        public static string GetNameofOperation(OperationSelection selection)
        {
            return Enum.GetName(typeof(OperationSelection), selection);
        }
    }

    internal enum MessageType
    {
        Success = ConsoleColor.Yellow,
        Default = ConsoleColor.Green,
        Error = ConsoleColor.Red,
        Warning = ConsoleColor.Cyan,
        Info = ConsoleColor.White
    }

    internal enum OperationSelection : int
    {
        Create = 1,
        Read = 2,
        Write = 3,
        Copy = 4,
        Move = 5,
        Delete = 6,
        Rename = 7,
        Exit = 8
    }
}
