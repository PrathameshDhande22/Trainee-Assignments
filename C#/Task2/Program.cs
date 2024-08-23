using System;
using System.Collections.Generic;
using System.IO;


// Task 2 => File Operations
namespace Task2
{
    internal sealed class Program
    {
        static int choice = 0;
        static bool switchToMainLoop = false;
        static string[] mainChoices = Enum.GetNames(typeof(OperationSelection));
        static WriteMethods selectedWriteMethod;

        static void Main(string[] args)
        {
            while (choice != mainChoices.Length)
            {
                MainMenu();
            }
        }

        static void MainMenu()
        {
            switchToMainLoop = false;
            Utilities.PrintBeautifulMessage("========= FILE OPERATIONS MENU DRIVEN PROGRAM ============", MessageType.Warning);
            string invalidChoice = Utilities.MessageCreator("file operation", null, true, mainChoices);
            int.TryParse(Console.ReadLine(), out choice);
            switch ((OperationSelection)choice)
            {
                case OperationSelection.Create:
                    CreateFileMenu();
                    break;
                case OperationSelection.Read:
                    CommonMenu(OperationSelection.Read);
                    break;
                case OperationSelection.Write:
                    WriteFileMenu();
                    break;
                case OperationSelection.Copy:
                    CommonMenuFileMethod(PathHandlers.DefaultPath, (int)OperationSelection.Copy);
                    break;
                case OperationSelection.Move:
                    CommonMenuFileMethod(PathHandlers.DefaultPath, (int)OperationSelection.Move);
                    break;
                case OperationSelection.Delete:
                    CommonMenu(OperationSelection.Delete);
                    break;
                case OperationSelection.Rename:
                    CommonMenu(OperationSelection.Rename);
                    break;
                case OperationSelection.Exit:
                    Utilities.PrintBeautifulMessage("Exiting the Program......", MessageType.Success);
                    break;
                default:
                    Utilities.PrintBeautifulMessage(invalidChoice, MessageType.Error);
                    break;
            }
            Console.WriteLine();
        }

        static void CreateFileMenu()
        {
            bool toStopInnerLoop = false;
            int innerChoice = 0;
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator("Create File In", null, false, $"Default Directory - {Utilities.PrettyFolder(PathHandlers.DefaultPath)}", "Custom Directory", "Go Back");
                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        DirectoryMenu(PathHandlers.DefaultPath);
                        break;
                    case 2:
                        CustomDirectoryMenu(FolderMenu, (int)OperationSelection.Create);
                        break;
                    case 3:
                        toStopInnerLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
            }
        }


        static bool CustomDirectoryMenu(Func<string, int, bool> action, int no = 0)
        {
        againAsk:
            Console.Write("\nEnter Custom Directory (E.g. C:\\Documents\\Files) > ");
            string directoryPath = Console.ReadLine();
            if (Directory.Exists(directoryPath))
            {
                return action(directoryPath, no);
            }
            else
            {
                if (no == (int)OperationSelection.Create && !string.IsNullOrWhiteSpace(directoryPath))
                {
                    directoryPath = CreateDirectoryNotExist(directoryPath);
                    if (String.IsNullOrWhiteSpace(directoryPath)) return false;
                    no = (int)OperationSelection.Create == no ? 0 : (int)OperationSelection.Create;
                    return action(directoryPath, no);
                }
                else
                {
                    Utilities.PrintBeautifulMessage("The Directory you Entered Doesn't Exists !\nPlease Enter Correct Directory", MessageType.Error);
                    goto againAsk;
                }
            }
            return false;

        }

        static string CreateDirectoryNotExist(string directoryfullPath)
        {
            Utilities.PrintBeautifulMessage("The Directory you Entered Doesn't Exists !", MessageType.Error);
            while (true)
            {
                Console.Write("Do you want to Create the directory Enter yes or no > ");
                string confirm = Console.ReadLine();
                if (confirm.ToLower() == "yes" || confirm.ToLower() == "y")
                {
                    if (FileHandlers.CreateDirectory(directoryfullPath))
                    {
                        Utilities.PrintBeautifulMessage("The Directory is Created Successfully", MessageType.Success);
                        return directoryfullPath;
                    }
                    else
                    {
                        Utilities.PrintBeautifulMessage("Enter Correct Directory Path", MessageType.Error);
                    }
                }
                else if (confirm.ToLower() == "no" || confirm.ToLower() == "n")
                {
                    return null;
                }
                else
                {
                    Utilities.PrintBeautifulMessage("Enter Either Yes or No.", MessageType.Error);
                }
            }
        }

        static void DirectoryMenu(string path)
        {
            int innerChoice = 0;
            bool toStopInnerLoop = false;
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator("Directory Options", $"Selected Folder - {Utilities.PrettyFolder(path)}\n", false, "Default Folder", "Custom Folder", "Go Back", "Main Menu");

                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        toStopInnerLoop = FolderMenu(path);
                        break;
                    case 2:
                        string folderEntered = String.Empty;
                        string customFolderPath = AskFolderNameTillCorrect(PathHandlers.GetParentDirectoryPath(PathHandlers.DefaultPath), out folderEntered);
                        if (customFolderPath == "g") return;
                        int counts = 0;
                        PathHandlers.GetDirectoriesCount(folderEntered, out counts);
                        toStopInnerLoop = FolderMenu(customFolderPath, counts - 1);
                        break;
                    case 3:
                        toStopInnerLoop = true;
                        break;
                    case 4:
                        toStopInnerLoop = true;
                        switchToMainLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
            }
        }

        static bool FolderMenu(string path, int goBackCount = 0)
        {
            int innerChoice = 0;
            bool toStopInnerLoop = false;
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator("Folder Options", $"Selected Folder: {Utilities.PrettyFolder(path)}\n", false, "Create File", "Create Folder", "Back", "Main Menu");
                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        toStopInnerLoop = AskFileNameTillCorrect(path);
                        break;
                    case 2:
                        string foldername = String.Empty;
                        string folderpath = AskFolderNameTillCorrect(path, out foldername);
                        if (folderpath != "g")
                        {
                            int counts = 0;
                            PathHandlers.GetDirectoriesCount(foldername, out counts);
                            goBackCount += counts;
                            path = folderpath;
                        }
                        break;
                    case 3:
                        if (goBackCount > 0)
                        {
                            path = PathHandlers.GetParentDirectoryPath(path);
                            goBackCount--;
                        }
                        else
                        {
                            toStopInnerLoop = true;
                        }
                        break;
                    case 4:
                        switchToMainLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
            }
            return true;
        }

        static bool AskFileNameTillCorrect(string path)
        {
            while (true)
            {
                Console.Write("\nEnter File Name without File Extension > ");
                string filename = Console.ReadLine();

                if (FileHandlers.IsNameValid(filename))
                {
                    filename += ".txt";
                    string realPath = Path.Combine(path, filename);
                    if (!File.Exists(realPath))
                    {
                        FileHandlers.CreateFile(realPath);
                        Utilities.PrintBeautifulMessage($"File Created Successfully in\n{Utilities.PrettyFolder(realPath)}", MessageType.Success);
                        return true;
                    }
                    else
                    {
                        Utilities.PrintBeautifulMessage("File Already Exists !\nPlease Enter other File Name.", MessageType.Error);
                    }
                }
                else
                {
                    Utilities.PrintBeautifulMessage($"Enter Correct File Name\nIt Should Not Contain {FileHandlers.InvalidChars} Characters", MessageType.Error);
                }
            }
            return false;
        }

        static string AskFolderNameTillCorrect(string path, out string enteredpath)
        {
            while (true)
            {
                Console.Write("\nEnter Folder Name (E.g. Document\\Trial to create Nested Folder) or g to Go Back > ");
                string foldername = Console.ReadLine();
                if (foldername.ToLower() == "g")
                {
                    enteredpath = "g";
                    return "g";
                }
                else if (FileHandlers.IsNameValid(foldername))
                {
                    string realpath = Path.Combine(path, foldername);
                    if (!Directory.Exists(realpath))
                    {
                        Directory.CreateDirectory(realpath);
                        Utilities.PrintBeautifulMessage($"Folder Created Successfully in\n{Utilities.PrettyFolder(realpath)}", MessageType.Success);
                        enteredpath = foldername;
                        return realpath;
                    }
                    else
                    {
                        Utilities.PrintBeautifulMessage("Folder Already Exists !\nPlease Enter other Folder Name.", MessageType.Error);
                    }
                }
                else
                {
                    Utilities.PrintBeautifulMessage($"Enter Correct Folder Name\nIt Should Not Contain {FileHandlers.InvalidChars} Characters", MessageType.Error);
                }
            }
            return "";
        }

        static void CommonMenu(OperationSelection selection)
        {
            int innerChoice = 0;
            bool toStopInnerLoop = false;
            string mainTitle = Utilities.GetNameofOperation(selection);
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator($"{mainTitle} File", $"\nDefault Directory : {Utilities.PrettyFolder(PathHandlers.DefaultPath)}\n{mainTitle} File From =>\n", false, "Default Directory", "Custom Directory", "Main Menu");
                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        toStopInnerLoop = CommonMenuFileMethod(PathHandlers.DefaultPath, (int)selection);
                        break;
                    case 2:
                        toStopInnerLoop = CustomDirectoryMenu(CommonMenuFileMethod, (int)selection);
                        break;
                    case 3:
                        toStopInnerLoop = true;
                        switchToMainLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
            }
        }

        static bool CommonMenuFileMethod(string path, int operation)
        {
            bool toStopInnerLoop = false;
            int innerChoice = 0;
            string prettyFolderPath = Utilities.PrettyFolder(path);
            List<string> files = new List<string>();
            if (FileHandlers.RefetchFiles(path, out files)) return false;
            else
            {
                while (!toStopInnerLoop && !switchToMainLoop)
                {
                    string invalidMessage = Utilities.MessageCreator($"{Enum.GetName(typeof(OperationSelection), operation)} File", $"\nFiles in -> {prettyFolderPath}\n", false, files.ToArray());
                    Console.Write("Or Enter g to Go Back > ");
                    string userinput = Console.ReadLine();
                    if (userinput.ToLower() == "g")
                    {
                        return false;
                    }
                    int.TryParse(userinput, out innerChoice);
                    if (innerChoice <= files.Count && innerChoice > 0)
                    {
                        switch ((OperationSelection)operation)
                        {
                            case OperationSelection.Read:
                                toStopInnerLoop = ReadFile(path, files[innerChoice - 1]);
                                break;
                            case OperationSelection.Write:
                                toStopInnerLoop = WriteFile(path, files[innerChoice - 1]);
                                break;
                            case OperationSelection.Delete:
                                toStopInnerLoop = DeleteFile(path, files[innerChoice - 1]);
                                if (FileHandlers.RefetchFiles(path, out files)) return true;
                                break;
                            case OperationSelection.Rename:
                                toStopInnerLoop = RenameFile(path, files[innerChoice - 1]);
                                FileHandlers.RefetchFiles(path, out files);
                                break;
                            case OperationSelection.Copy:
                                DestinationMenu(path, files[innerChoice - 1]);
                                FileHandlers.RefetchFiles(path, out files);
                                break;
                            case OperationSelection.Move:
                                MoveFileMenu(path, files[innerChoice - 1]);
                                if (FileHandlers.RefetchFiles(path, out files)) return true;
                                break;
                        }
                    }
                    else
                    {
                        Utilities.PrintBeautifulMessage($"Invalid Choice !\nEnter Correct Choice Between [1-{files.Count}]", MessageType.Error);
                    }
                }
            }
            return true;
        }

        static bool AskAgainOptions(string title)
        {
            while (true)
            {
                Console.Write($"\nDo You Want {title} Files say y, Yes, or Y > ");
                string userChoice = Console.ReadLine();
                if (userChoice.ToLower() == "y" || userChoice.ToLower() == "yes")
                {
                    return false;
                }
                else if (userChoice.ToLower() == "n" || userChoice.ToLower() == "no")
                {
                    return true;
                }
                else
                {
                    Utilities.PrintBeautifulMessage("Invalid Choice !\nEnter either Yes or No", MessageType.Error);
                }
            }
        }

        static bool ReadFile(string path, string filename)
        {
            string filedata = FileHandlers.ReadFile(path, filename);
            if (filedata.Length == 0)
            {
                Utilities.PrintBeautifulMessage("File is Empty !", MessageType.Success);
            }
            else
            {
                Utilities.PrintBeautifulMessage(filedata, MessageType.Info);
            }
            return AskAgainOptions("to Read More");
        }

        static void WriteFileMenu()
        {
            bool toStopInnerLoop = false;
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator("Write File Options", "", false, "Truncate", "Overwrite", "Append", "Go Back");
                int innerChoice = 0;
                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        selectedWriteMethod = WriteMethods.Truncate;
                        break;
                    case 2:
                        selectedWriteMethod = WriteMethods.Overwrite;
                        break;
                    case 3:
                        selectedWriteMethod = WriteMethods.Append;
                        break;
                    case 4:
                        toStopInnerLoop = true;
                        switchToMainLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
                if (innerChoice <= 3 && innerChoice >= 1)
                {
                    CommonMenu(OperationSelection.Write);
                }
            }
        }


        static bool WriteFile(string path, string filename)
        {
            string filedata = string.Empty;
            if (selectedWriteMethod != WriteMethods.Truncate)
            {
                Console.WriteLine("Enter the File Data you Want to {0} > ", selectedWriteMethod);
                filedata = Console.ReadLine();
            }
            if (FileHandlers.WriteFile(path, filename, filedata, selectedWriteMethod))
            {
                Utilities.PrintBeautifulMessage($"File {selectedWriteMethod} Successfully. ", MessageType.Success);
            }
            return AskAgainOptions("to Write More");
        }

        static void DestinationMenu(string path, string filename)
        {
            string srcpath = Path.Combine(path, filename);
            int innerChoice = 0;
            bool toStopInnerLoop = false;
            while (!toStopInnerLoop && !switchToMainLoop)
            {
                string invalidMessage = Utilities.MessageCreator("Destination Path Options", $"\nSelected File => {srcpath}\n", false, "Copy in Same Path", "Custom Path", "Go Back", "Main Menu");
                int.TryParse(Console.ReadLine(), out innerChoice);
                switch (innerChoice)
                {
                    case 1:
                        FileHandlers.CopyFileToDest(path, filename, path);
                        Utilities.PrintBeautifulMessage("Files Successfully Copied", MessageType.Success);
                        return;
                        break;
                    case 2:
                        toStopInnerLoop = CustomDestinationPath(path, filename, "File Copied Successfully !", FileHandlers.CopyFileToDest);
                        break;
                    case 3:
                        return;
                    case 4:
                        switchToMainLoop = true;
                        break;
                    default:
                        Utilities.PrintBeautifulMessage(invalidMessage, MessageType.Error);
                        break;
                }
            }
        }

        static bool CustomDestinationPath(string path, string filename, string successMessage, Func<string, string, string, bool> moveorcopyaction)
        {
            while (true)
            {
                Console.Write("\nEnter the Destination Path > ");
                string destPath = Console.ReadLine();
                if (Directory.Exists(destPath))
                {
                    if (moveorcopyaction(path, filename, destPath))
                    {
                        Utilities.PrintBeautifulMessage(successMessage, MessageType.Success);
                        return true;
                    }
                    Utilities.PrintBeautifulMessage("File Already Exists in the Given Path\nGive Another Destination Path", MessageType.Error);
                }
                else
                {
                    Utilities.PrintBeautifulMessage("Path Doesn't Exists\nEnter Correct Path", MessageType.Error);
                }
            }
            return false;
        }

        static void MoveFileMenu(string path, string filename)
        {
            CustomDestinationPath(path, filename, "File Moved Successfully", FileHandlers.MoveFileToDest);
        }

        static bool DeleteFile(string path, string filename)
        {
            if (!AskAgainOptions("to Delete these"))
            {
                if (FileHandlers.DeleteFile(path, filename))
                {
                    Utilities.PrintBeautifulMessage("File Deleted Successfully !", MessageType.Success);
                    return false;
                }
                else
                {
                    Utilities.PrintBeautifulMessage("Failed To Delete File.", MessageType.Error);
                    return false;
                }
            }
            return false;
        }

        static bool RenameFile(string path, string filename)
        {
            while (true)
            {
                Utilities.PrintBeautifulMessage($"\nFile Selected => {Path.Combine(path, filename)}", MessageType.Warning);
                Console.Write("Enter the New Name of the File without Extension > ");
                string newfilename = Console.ReadLine();
                if (newfilename.ToLower() == "g") return false;
                if (!String.IsNullOrWhiteSpace(newfilename))
                {
                    if (FileHandlers.RenameFile(path, filename, newfilename))
                    {
                        Utilities.PrintBeautifulMessage("File Renamed Successfully !", MessageType.Success);
                        return false;
                    }
                    else
                    {
                        Utilities.PrintBeautifulMessage("File Already Exists !\nPlease Give Another Name Or Enter g to Go Back > ", MessageType.Error);
                    }
                }
                else
                {
                    Utilities.PrintBeautifulMessage("Please Give Correct Name Or Enter g to Go Back > ", MessageType.Error);
                }
            }
        }

    }






}
