using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using static EscolaXPTO_EF.Dto.Dtos;
using EscolaXPTO_EF;

namespace BibliotecaXPTO.Pages.User
{
    public class HistoricoModel : PageModel
    {
        private readonly EscolaEF _bibliotecaService;

        public List<HistoricoRequisicaoDTO> Historico { get; set; }

        public HistoricoModel(EscolaEF bibliotecaService)
        {
            _bibliotecaService = bibliotecaService;
        }

        public void OnGet()
        {
            try
            {
                int? userId = HttpContext.Session.GetInt32("userID");
                if (userId.HasValue && userId > 0)
                {
                    Historico = _bibliotecaService.ObterHistoricoRequisicoes(userId.Value.ToString());
                }
                else
                {
                    Historico = new List<HistoricoRequisicaoDTO>();
                    TempData["Erro"] = "Usuário não autenticado.";
                }
            }
            catch (Exception ex)
            {
                Historico = new List<HistoricoRequisicaoDTO>();
                TempData["Erro"] = $"Erro ao carregar histórico: {ex.Message}";
            }
        }
    }
}
