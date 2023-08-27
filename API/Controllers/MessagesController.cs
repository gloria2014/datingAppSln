using AutoMapper;
using DatingApp_6.DTOs;
using DatingApp_6.Entities;
using DatingApp_6.Extensions;
using DatingApp_6.Helpers;
using DatingApp_6.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp_6.Controllers
{
    public class MessagesController  : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.RecipientUsername)
                return BadRequest("You can not send messages to  yourself");

            var sender = await _userRepository.GetUserByUserNameAsync(username);
            var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUsername);

            if (recipient == null)
                return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

             _messageRepository.AddMessage(message);
            if(await _messageRepository.SaveAllAsync())
            {
                return Ok(_mapper.Map<MessageDto>(message));
            }
            else
            {
               // return BadRequest("Ha susedido un error al guardar el mensaje");
                return Ok(_mapper.Map<MessageDto>(message));
            }
                
            
           
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUsers([FromQuery]MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var mensajes = await _messageRepository.GetMessageForUser(messageParams);

            Response.AddPaginationHeader(mensajes.CurrentPage
                ,mensajes.PageSize
                ,mensajes.TotalCount
               ,mensajes.TotalPages
                );
            return mensajes;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUserName = User.GetUsername();
            return Ok(await _messageRepository.GetMessageThread(currentUserName, username));
        }
    }
}
