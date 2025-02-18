using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using EscolaXPTO_EF;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Adicionando a injeção de dependência para o EscolaEF
builder.Services.AddScoped<EscolaEF>(provider =>
    new EscolaEF(connectionString));  // Passando a string de conexão diretamente

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/User/Login";  // Página de login
    });

builder.Services.AddAuthorization();

builder.Services.AddRazorPages();

// ?? Adiciona suporte a sessão
builder.Services.AddSession();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Expira após 30 minutos sem atividade
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ?? Necessário para acessar HttpContext dentro de Razor Pages
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// ?? Ativa a sessão na aplicação
app.UseSession();

app.UseAuthorization();

app.MapRazorPages();

app.Run();

app.MapPost("/User/Logout", async context =>
{
    context.Session.Clear();
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    context.Response.StatusCode = StatusCodes.Status200OK;
});
