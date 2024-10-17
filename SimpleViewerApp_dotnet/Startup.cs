using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        var clientID = Configuration["APS_CLIENT_ID"];
        var clientSecret = Configuration["APS_CLIENT_SECRET"];
        var bucket = Configuration["APS_BUCKET"]; // Optional
        if (string.IsNullOrEmpty(clientID) || string.IsNullOrEmpty(clientSecret))
        {
            throw new ApplicationException("Missing required environment variables APS_CLIENT_ID or APS_CLIENT_SECRET.");
        }
        services.AddSingleton<APS>(new APS(clientID, clientSecret, bucket));
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.WithOrigins("http://localhost:3000")  // Replace with the allowed domain(s)
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        app.UseDefaultFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors("AllowSpecificOrigin");
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}