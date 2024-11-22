namespace TaskAPI.Models
{
    public class Message
    {
        public string message { get; set; }

        public dynamic result { get; set; } = "";

        public dynamic errors { get; set; } = "";

    }
}