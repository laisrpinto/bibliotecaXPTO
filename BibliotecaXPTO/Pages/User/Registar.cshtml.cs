using System.ComponentModel.DataAnnotations;
using EscolaXPTO_EF;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BibliotecaXPTO.Pages.User
{
    public class RegistarModel : PageModel
    {
        [BindProperty]
        [Required]
        public string Nome { get; set; }

        [BindProperty]
        [Required]
        [DataType(DataType.Date)]
        public DateOnly DataNascimento { get; set; }

        [BindProperty]
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [BindProperty]
        [Required]
        public string Telefone { get; set; }

        [BindProperty]
        [Required]
        public string Username { get; set; }

        [BindProperty]
        [Required]
        [DataType(DataType.Password)]
        public string PalavraPasse { get; set; }

        public string MensagemRetorno { get; set; }

        private readonly EscolaEF _bibliotecaService;

        public RegistarModel(EscolaEF bibliotecaService)
        {
            _bibliotecaService = bibliotecaService;
        }

        public void OnPost()
        {
            if (!ModelState.IsValid)
            {
                MensagemRetorno = "Preencha todos os campos corretamente.";
                return;
            }

            bool sucesso = _bibliotecaService.User_RegistrarNovoLeitor(Nome, DataNascimento, Email, Telefone, Username, PalavraPasse, out string mensagem);

            MensagemRetorno = "Registo efetuado. Faça login"; ;
        }
    }
}
