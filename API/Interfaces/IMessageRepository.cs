using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Helpers;

namespace DatingApp_6.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientName);
        Task<bool> SaveAllAsync();
    }
}
