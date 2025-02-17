using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BibliotecaXPTO.Pages.User
{
    public class ObrasModel : PageModel
    {
        private readonly ILogger<ObrasModel> _logger;
        private readonly HttpClient _httpClient;

        public List<ObraDto> Obras { get; set; } = new List<ObraDto>();

        public ObrasModel(ILogger<ObrasModel> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
        }

        public async Task OnGetAsync()
        {
            try
            {
                string apiUrl = "http://localhost:5187/MostrarTodasObras";
                var response = await _httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    Obras = JsonSerializer.Deserialize<List<ObraDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<ObraDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao buscar obras: {ex.Message}");
            }
        }
    }

    public class ObraDto
    {
        public int ObraID { get; set; }
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public int? AnoPublicacao { get; set; }
        public string Genero { get; set; }
        public string Descricao { get; set; }
        public string? ImagemBase64 { get; set; }
    }
}
