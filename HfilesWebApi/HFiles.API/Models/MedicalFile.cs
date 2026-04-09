public class MedicalFile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public string FilePath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public User User { get; set; }
}