using System.IO;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Task2
{
    internal enum WriteMethods
    {
        Truncate,
        Overwrite,
        Append
    }

    internal class FileHandlers
    {
        public static string InvalidChars { get => "^[^*\\<>?!'\":@`|=]+$"; }
        public static bool CreateFile(string path)
        {
            if (File.Exists(path))
            {
                return false;
            }
            File.Create(path).Close();
            return true;
        }

        public static bool IsNameValid(string filename)
        {
            return Regex.IsMatch(filename, InvalidChars);
        }


        public static List<String> FileWithTxt(string path)
        {
            IEnumerable<string> files = Directory.EnumerateFiles(path);
            files = from file in files where file.EndsWith(".txt") select file;
            files = files.Select(file => file.Split('\\')[file.Split('\\').Length - 1]);
            return files.ToList();
        }

        public static string ReadFile(string path, string filename)
        {
            string realPath = Path.Combine(path, filename);
            StreamReader sr = new StreamReader(realPath);
            string fileData = sr.ReadToEnd();
            sr.Close();
            return fileData;
        }

        public static bool WriteFile(string path, string filename, string content, WriteMethods writeMethods)
        {
            string realpath = Path.Combine(path, filename);
            switch (writeMethods)
            {
                case WriteMethods.Overwrite:
                    StreamWriter sw = new StreamWriter(realpath);
                    sw.Write(content);
                    sw.Close();
                    return true;
                case WriteMethods.Append:
                    File.AppendAllText(realpath, content);
                    return true;
                case WriteMethods.Truncate:
                    FileStream fs = new FileStream(realpath, FileMode.Truncate, FileAccess.ReadWrite);
                    fs.Close();
                    return true;
                default:
                    return false;
            }
        }

        public static bool CopyFileToDest(string path, string filename, string destination)
        {
            int increments = 1;
            string sourcePath = Path.Combine(path, filename);
            string destPath = Path.Combine(destination, filename);
            while (File.Exists(destPath))
            {
                destPath = Path.Combine(destination, changeFileName(Path.GetFileName(destPath)));
                increments++;
            }
            File.Copy(sourcePath, destPath);
            return true;

            // Local Function
            string changeFileName(string fileName)
            {
                string[] fileOnlyName = filename.Split('.');
                fileOnlyName[0] = fileOnlyName[0] + $" ({increments})";
                return String.Join(".", fileOnlyName);
            }
        }

        public static bool MoveFileToDest(string path, string filename, string destination)
        {
            try
            {
                string srcPath = Path.Combine(path, filename);
                if (Directory.Exists(destination))
                {
                    string destPath = Path.Combine(destination, filename);
                    File.Move(srcPath, destPath);
                    return true;
                }
                return false;
            }
            catch (IOException ioex)
            {
                return false;
            }
        }

        public static bool DeleteFile(string path, string filename)
        {
            string realPath = Path.Combine(path, filename);
            if (File.Exists(realPath))
            {
                File.Delete(realPath);
                return true;
            }
            return false;
        }

        public static bool RenameFile(string path, string filename, string newFileName)
        {
            string realPath = Path.Combine(path, filename);
            string newPath = Path.Combine(path, newFileName + ".txt");
            if (!File.Exists(newPath) && File.Exists(realPath))
            {
                FileInfo fi = new FileInfo(realPath);
                fi.MoveTo(newPath);
                return true;
            }
            return false;
        }

        public static bool RefetchFiles(string path, out List<string> files)
        {
            string prettyFolderPath = Utilities.PrettyFolder(path);
            files = FileWithTxt(path);
            if (files.Count == 0)
            {
                Utilities.PrintBeautifulMessage($"\nThere are No Files in {prettyFolderPath}\nCreate the Files First.", MessageType.Info);
                return true;
            }
            return false;
        }

        public static bool CreateDirectory(string path)
        {
            try
            {
                Directory.CreateDirectory(path);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
