using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HFiles.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = _context.Users.Find(int.Parse(userId));
            return Ok(user);
        }
        [HttpPut]
        public IActionResult Update(UpdateUserDto updated)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = _context.Users.Find(int.Parse(userId));
            if (user == null) return NotFound();

            user.Email = updated.Email;
            user.Gender = updated.Gender;
            user.PhoneNumber = updated.PhoneNumber;

            _context.SaveChanges();

            return Ok(user);
        }
    }
}