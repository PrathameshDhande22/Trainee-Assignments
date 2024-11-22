using System;
using System.IO;
using System.Linq;

namespace TaskAPI.Utils
{
    public static class Utilities
    {
        /// <summary>
        /// Used to Check if the String passed can be converted to array of <see cref="int[]"/> also returns the Converted Array through out.
        /// </summary>
        /// <param name="array">String to be converted to Array of <see cref="int[]"/></param>
        /// <param name="convertedarray">converts the <see langword="string"/> Array into the <see cref="int[]"/></param>
        /// <returns><see langword="true"/> if <paramref name="array"/> can be converted into <see cref="int[]"/></returns>
        public static bool IfInputisArray(string array, out int[] convertedarray)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(array) && (array.StartsWith("[") && array.EndsWith("]")))
                {
                    convertedarray = array.Trim('[', ']').Split(',').Select(int.Parse).ToArray();
                    return true;
                }
                convertedarray = new int[] { };
                return false;
            }
            catch (Exception)
            {
                convertedarray = new int[] { };
                return false;
            }
        }

        /// <summary>
        /// Saves the file into the Given Path. 
        /// </summary>
        /// <param name="buffers">Buffer of file to save</param>
        /// <param name="savePath">The Path where to save the File</param>
        /// <param name="filename">The Filename with its extension.</param>
        /// <returns><see langword="string"/> of the Saved File otherwise <see langword="null"/></returns>
        public static string SaveFile(byte[] buffers, string savePath, string filename)
        {
            try
            {
                string extension = Path.GetExtension(filename);
                string newFilename = Guid.NewGuid().ToString() + extension;
                string fullpath = Path.Combine(savePath, newFilename);
                File.WriteAllBytes(fullpath, buffers);
                return newFilename;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Checks the filename extension if its valid from the passed <paramref name="extensions"/> array
        /// </summary>
        /// <param name="filename"> to check the Validation</param>
        /// <param name="extensions"> Valid Extension starting with period(.)</param>
        /// <returns><see langword="true"/> if the Filename Extension is valid otherwise <see langword="false"/></returns>
        public static bool IsFileExtensionValid(string filename, params string[] extensions)
        {
            string extension = Path.GetExtension(filename);
            return extensions.Contains(extension);
        }

        /// <summary>
        /// Checks if the file is present into the System.
        /// </summary>
        /// <param name="filepath"> To Check the File</param>
        /// <returns><see langword="true"/> If the <paramref name="filepath"/> is Present otherwise <see langword="false"/></returns>
        public static bool IsFilePresent(string filepath)
        {
            return File.Exists(filepath);
        }

        /// <summary>
        /// Deletes the file from the given <paramref name="filepath"/>.
        /// </summary>
        /// <param name="filepath"> To be Deleted</param>
        /// <returns><see langword="true"/> if the File is Deleted otherwise <see langword="false"/></returns>
        public static bool DeleteFile(string filepath)
        {
            if (IsFilePresent(filepath))
            {
                File.Delete(filepath);
                return true;
            }
            return false;
        }
    }
}