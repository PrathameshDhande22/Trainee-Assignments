using System.Configuration;
using System.IO;

namespace Task2
{
    internal class PathHandlers
    {
        public static readonly string DefaultPath = ConfigurationManager.AppSettings.Get("default_path");

        public static string ConcatOnDefaultPath(string path)
        {
            return Path.Combine(DefaultPath, path);
        }

        public static string GetParentDirectoryPath(string path)
        {
            return new DirectoryInfo(path).Parent.FullName;
        }

        public static string[] GetDirectoriesCount(string path, out int count)
        {
            string[] result = path.Split('\\');
            count = result.Length;
            return result;
        }
    }
}
