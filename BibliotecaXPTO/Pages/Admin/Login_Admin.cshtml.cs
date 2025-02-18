using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Threading.Tasks;
using EscolaXPTO_EF;

namespace BibliotecaXPTO.Pages.Admin
{
    public class Login_AdminModel : PageModel
    {
        [BindProperty]
        public string Username { get; set; }

        [BindProperty]
        public string Password { get; set; }

        private readonly EscolaEF _authService;

        public Login_AdminModel(EscolaEF authService)
        {
            _authService = authService;
        }

        public string ErrorMessage { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (_authService.AutenticarLeitor(Username, Password))
            {
                // Obter o UserID do usuário autenticado
                int userId = _authService.ObterUserIdPorUsername(Username);
                HttpContext.Session.SetInt32("userID", userId); // Armazena o ID como inteiro
                return Redirect("~/Severino/index.html");
            }
            ErrorMessage = "Usuário ou senha inválidos.";
            return Page();
        }
    }
}

