using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
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
                AllowedGrantTypes = GrantTypes.Code,
                RequireClientSecret = false,
                RequirePkce = true,
                RequireConsent = false,
                RedirectUris = {
                    "http://localhost:5000/callback.html",
                    "http://localhost:5000/popup.html",
                    "http://localhost:5000/silent.html"
                },
                PostLogoutRedirectUris = { "http://localhost:5000/index.html" },
                AllowedScopes = { "openid", "profile", "email", IdentityServerConstants.LocalApi.ScopeName },
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
            // local API
            new ApiResource(IdentityServerConstants.LocalApi.ScopeName),
        };
    }
}
