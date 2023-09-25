namespace DatingApp_6.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnLineUser
            = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;
            lock (OnLineUser)
            {
                if (OnLineUser.ContainsKey(username))
                {
                    OnLineUser[username].Add(connectionId);
                }
                else
                {
                    OnLineUser.Add(username, new List<string> { connectionId});
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;
            lock (OnLineUser)
            {
                if (!OnLineUser.ContainsKey(username)) return Task.FromResult(isOffline);
                
                OnLineUser[(username)].Remove(connectionId);

                if (OnLineUser[username].Count == 0)
                {
                    OnLineUser.Remove(username);
                    isOffline = true;
                }            
            }
            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] usuariosEnLinea;

            lock(OnLineUser)
            {
                usuariosEnLinea = OnLineUser.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }
            return Task.FromResult(usuariosEnLinea);
        }

        public static Task<List<string>> getConnectionsForUser(string username)
        {
            List<string> connectionIds;

            lock (OnLineUser)
            {
                connectionIds = OnLineUser.GetValueOrDefault(username);

            }
            return Task.FromResult(connectionIds);
        }
    }
}
