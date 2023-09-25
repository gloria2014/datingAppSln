using DatingApp_6.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp_6.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _presenceTracker;

        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
        }
        public override async Task OnConnectedAsync()
        {
            var isOnline = await _presenceTracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            
            if(isOnline)
                await Clients.Others.SendAsync("UserIsOnline",Context.User.GetUsername());

            var currentUsers = await _presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers",currentUsers);

        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
          var isOffline =  await _presenceTracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
           
           if(isOffline) 
                 await Clients.Others.SendAsync("UserIsOffLine", Context.User.GetUsername());

            //var currentUsers = await _presenceTracker.GetOnlineUsers();
            //await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(ex);
        }


    }
}
