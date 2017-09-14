using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Models;

namespace IdentityServerHost
{
    public class Config
    {
        public static IEnumerable<Client> Clients = new List<Client>
        {
            new Client
            {
                ClientId = "spa",
                AllowedGrantTypes = GrantTypes.Implicit,
                AllowAccessTokensViaBrowser = true,
                RedirectUris = {
                    "http://localhost:5000/callback.html",
                    "http://localhost:5000/popup.html",
                    "http://localhost:5000/silent.html"
                },
                PostLogoutRedirectUris = { "http://localhost:5000/index.html" },
                AllowedScopes = { "openid", "profile", "email", "api1" },
                AllowedCorsOrigins = { "http://localhost:5000" }
            },
        };

        public static IEnumerable<IdentityResource> IdentityResources = new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
        };

        public static IEnumerable<ApiResource> Apis = new List<ApiResource>
        {
            new ApiResource("api1", "My API 1")
        };
    }
}
