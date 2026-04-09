using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HFiles.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FileController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file, string fileName, string fileType)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (file == null) return BadRequest("File required");

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var ext = Path.GetExtension(file.FileName).ToLower();

            if (!allowed.Contains(ext))
                return BadRequest("Invalid file type");

            var uploads = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploads))
                Directory.CreateDirectory(uploads);

            var fileNameUnique = Guid.NewGuid() + ext;
            var fullPath = Path.Combine(uploads, fileNameUnique);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var relativePath = "/uploads/" + fileNameUnique;

            var record = new MedicalFile
            {
                UserId = int.Parse(userId),
                FileName = fileName,
                FileType = fileType,
                FilePath = relativePath
            };

            _context.MedicalFiles.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                record.Id,
                record.FileName,
                record.FileType,
                FileUrl = $"{Request.Scheme}://{Request.Host}{record.FilePath}"
            });
        }

        [HttpGet]
        public IActionResult GetFiles()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (userId == null) return Unauthorized();

            var files = _context.MedicalFiles
                .Where(x => x.UserId == int.Parse(userId))
                .ToList();

            return Ok(files);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var file = _context.MedicalFiles.Find(id);
            if (file == null) return NotFound();

            var fullPath = Path.Combine(_env.WebRootPath, file.FilePath.TrimStart('/'));

            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);

            _context.MedicalFiles.Remove(file);
            _context.SaveChanges();

            return Ok();
        }
    }
}