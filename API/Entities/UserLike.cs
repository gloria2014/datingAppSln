namespace DatingApp_6.Entities
{
    /* calse 171 se crea esta entidad UserLike, la qcual se convertirá en tabla  */
    public class UserLike
    {
        public AppUser SourceUser { get; set; }
        public int SourceUserId { get; set; }

        public AppUser TargetUser { get; set; }
        //public AppUser LikedUser { get; set; }
        public int TargetUserId { get; set; }
       // public int LikedUserId { get; set; }
    }
}
