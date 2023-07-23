namespace DatingApp_6.Extensions
{
    public static class DateTimeExtensions
    {

        public static int CalculateAge(this DateTime bob)
        {
            var today = DateTime.Today;
            var age = today.Year - bob.Year;
            if (bob.Date > today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}
