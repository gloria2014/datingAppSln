﻿namespace DatingApp_6.Helpers
{
    public class LikesParams:PaginationParams
    {
        public int UserId { get; set; }
        public string Predicate { get; set; }
    }
}
