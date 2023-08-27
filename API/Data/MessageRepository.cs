using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Helpers;
using DatingApp_6.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace DatingApp_6.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
          return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            /*  class 185.- aca validamos con switch 
             *  si coantiner = 'Inbox'  -> devolvemos el punto de consulta donde el nombre del destinatario es igual al nombre del param de entrada 
             *  Si container = 'Outbox' ->  devolveremos donde el nombre del remitente es igual a nombre del param. Porque se trata de mensajes enviados desde ese usuario.
                Sino (por default)_=>   -> se devolveran los mensajes no leidos */
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
                 _=> query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null),
            };
            /* obtenemos la consulta depende de lo que el contenedor tenga, lo mandamos al MessageDto para devolverlo
             * como una lista paginada */
            var mensajes = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            if (mensajes != null)
            {
                return await PagedList<MessageDto>
            .CreateAsync(mensajes, messageParams.PageNumber, messageParams.PageSize);
            }
            return null;
        
        }


        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            /* class 186 obtenemos la lista de los mensajes no leidos  */
            var mensajes = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(
                    m => m.RecipientUsername == currentUserName && m.SenderUsername == recipientUserName
                    || m.SenderUsername.Equals(currentUserName) && m.RecipientUsername.Equals(recipientUserName)
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();
            // asegurarnos que es el nombre del destinatario para el que estamos buscando estos mensajes porque es
            // el detinatario el que va a leerlos.Y ese es el mensaje que quiero marcar como fecha de lectura.

            var unreadMessages = mensajes.Where(m => m.DateRead == null && m.RecipientUsername == currentUserName).ToList();

            if (unreadMessages.Any())
            {
                foreach (var item in unreadMessages)
                {
                    item.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<IEnumerable<MessageDto>>(mensajes);
        }

        //public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        //{

        //    var mensajes = await _context.Messages
        //        .Include(u => u.Sender).ThenInclude(p => p.Photos)
        //        .Include(u => u.Recipient).ThenInclude(p => p.Photos)
        //        //.Where(
        //        //    m => m.RecipientUsername == currentUserName && m.SenderUsername == recipientUserName
        //        //    || m.SenderUsername.Equals(currentUserName) && m.RecipientUsername.Equals(recipientUserName)
        //        //)
        //        .OrderBy(m => m.MessageSent)
        //        .ToListAsync();
        //    await _context.SaveChangesAsync();

        //    if (mensajes != null)
        //    {


        //        return  _mapper.Map<IEnumerable<MessageDto>>(mensajes);

        //    }
        //    return null;

        //}

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 1;
        }
    }
}
