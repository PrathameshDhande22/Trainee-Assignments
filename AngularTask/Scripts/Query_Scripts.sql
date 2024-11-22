/* Query to get the states and city */
SELECT s.StateName, c.CityName
FROM States s
INNER JOIN Cities c ON s.StateID = c.StateID
ORDER BY s.StateName, c.CityName;

-- same using sp
exec spGetCitiesState

/* Query the interests */
select * from interests

-- same using sp
exec spGetInterests

-- inserting the user using the sp
declare @issuccess1 bit

declare @interests as interests
insert into @interests values (1),(2),(3),(4)
select * from @interests

EXEC [spAdduser]
    @interesttable=@interests,
    @FirstName = 'John',
    @LastName = 'Doe',
    @Email = 'johndoe@example.com',
    @Password = 'Password123!',
    @DateOfBirth = '1990-05-15',
    @Age = 33,
    @Gender = 'Male',
    @State = 'Maharashtra',
    @City = 'Mumbai',
    @Address = '123 Main St, Mumbai, Maharashtra, India',
    @PhoneNo = '+91-9876543210',
    @Profile = 'profile-image-url.jpg',
	@issuccess=@issuccess1 output
select @issuccess1 as success

-- listing the users present using select query
select * from users

-- listing his interests
select * from interestsmapping

-- listing the user with its interests
select u.*,i.id as interestid,i.interest from users as u
join interestsmapping as im
on u.id=im.userid
join Interests as i
on im.interestid=i.id

-- getting the user
exec spGetUsers 2

-- undelete the user
update Users set isdeleted=0
where id in (2,4,5,6,7)

-- delete the user
declare @issuccess bit
exec spDeleteUser 2,@issuccess output
select @issuccess as succedd

-- show the deleted users
select * from Users where isdeleted=1