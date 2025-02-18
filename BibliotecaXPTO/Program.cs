using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.Cookies;
using EscolaXPTO_EF;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication;


var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Adicionando a inje��o de depend�ncia para o EscolaEF
builder.Services.AddScoped<EscolaEF>(provider =>
    new EscolaEF(connectionString));  // Passando a string de conex�o diretamente

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/User/Login";  // P�gina de login
    });

builder.Services.AddAuthorization();

builder.Services.AddRazorPages();

// ?? Adiciona suporte a sess�o
builder.Services.AddSession();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Expira ap�s 30 minutos sem atividade
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ?? Necess�rio para acessar HttpContext dentro de Razor Pages
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

// ?? Ativa a sess�o na aplica��o
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
