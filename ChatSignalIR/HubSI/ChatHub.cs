using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;


namespace ChatSignal_IR.HubSI
{
    public class ChatHub : Hub
    {
        private static readonly Dictionary<string, string> userLookup = new();
        private string ENVIAMENSAJE = "SendMessage";
        private string REGISTRO = "Register";
        private string LISTAUSUARIOS = "UsersList";
        private string MENSAJE1 = "se ha conectado a la sala ";
        private string MENSAJE2 = "se ha desconectado de la sala";

        public async Task SendMessage(string usernName, string message)
        {
            await Clients.AllExcept(Context.ConnectionId).SendAsync(ENVIAMENSAJE, usernName, message, DateTime.Now);
        }

        public async Task Register(string useraName)
        {
            var currentId = Context.ConnectionId;
            if (!userLookup.ContainsKey(currentId))
            {
                userLookup.Add(currentId, useraName);
                await Clients.AllExcept(currentId).SendAsync(REGISTRO, useraName, MENSAJE1, userLookup);

            }

        }

        public async Task UsersList()
        {

            await Clients.All.SendAsync(LISTAUSUARIOS, userLookup);
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine("conectado");
            return base.OnConnectedAsync();
        }

        public async Task OnDisconectedAsync(Exception e)
        {
            Console.WriteLine($"Se ha desconectado el usuario {Context.ConnectionId}");
            string id = Context.ConnectionId;
            if (!userLookup.TryGetValue(id, out string username))
            {

                username = "[unknown]";
            }

            userLookup.Remove(id);
            await Clients.AllExcept(Context.ConnectionId).SendAsync(ENVIAMENSAJE, username, MENSAJE2, DateTime.Now);
            await base.OnDisconnectedAsync(e);
        }

    }
}
