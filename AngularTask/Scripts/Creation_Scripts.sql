/* Angular Assignment */

-- creating the database
create database angularTask
go

-- useing the Created the Database
use angularTask
go

-- creating the table for state
CREATE TABLE States (
    StateID INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing primary key
    StateName VARCHAR(50) NOT NULL
);
go

-- creating the table for city
CREATE TABLE Cities (
    CityID INT PRIMARY KEY IDENTITY(1,1),   -- Auto-incrementing primary key
    CityName VARCHAR(50) NOT NULL,
    StateID INT NOT NULL,                   -- Foreign key to States table
    FOREIGN KEY (StateID) REFERENCES States(StateID)
);
go

/* Creating the stored procedure for retreving the state and city */
create proc spGetCitiesState 
as
begin
	select s.StateName as State,c.CityName as City from states as s
	inner join Cities as c
	on s.StateID=c.StateID
	order by s.StateName,c.CityName
end
go


-- creating the table for the user
create table [Users](
	id int primary key identity(1,1),
	firstname nvarchar(100) not null,
	lastname nvarchar(100) not null,
	email nvarchar(max) not null,
	password nvarchar(max) not null,
	dateofbirth date not null,
	age int not null,
	gender nvarchar(80) not null,
	state nvarchar(max) not null,
	city nvarchar(max) not null,
	address nvarchar(max) not null,
	phoneno nvarchar(max) not null,
	profile nvarchar(max) not null,
	isdeleted bit not null default 0,
	deletedon datetime null,
	updatedon datetime null,
	createdon datetime not null default getdate()
)
go

-- creating the table for interests
create table Interests(
	id int primary key identity(1,1),
	interest nvarchar(60) not null
)
go

-- stored procedure for listing the interests
alter proc spGetInterests
as
begin
	select id as interestid,interest from Interests
end
go

-- the table to stored the multiple interests
create table interestsMapping(
	id int primary key identity(1,1),
	interestid int not null,
	userid int not null
)
go

-- altering the Interests Mapping Table to add the foreign key constraint into it.
alter table InterestsMapping
add constraint FK_InterestsMapping_interestid foreign key(interestid) references Interests(id)
go

alter table InterestsMapping
add constraint FK_InterestsMapping_userid foreign key(userid) references Users(id)
go

-- creating the table valued parameter for the interests
create type interests as table
(interestid int)
go

-- creating the stored procedure for adding the user into the database
create proc spAddUser
@interesttable interests readonly,
@FirstName NVARCHAR(100),
@LastName NVARCHAR(100),
@Email NVARCHAR(MAX),
@Password NVARCHAR(MAX),
@DateOfBirth DATE,
@Age INT,
@Gender NVARCHAR(80),
@State NVARCHAR(MAX),
@City NVARCHAR(MAX),
@Address NVARCHAR(MAX),
@PhoneNo NVARCHAR(MAX),
@Profile NVARCHAR(MAX),
@issuccess bit out
as
begin
	begin try
		begin transaction
			-- inserting the user into the database
			insert into Users 
				(firstname,lastname,email,password,dateofbirth,age,gender,state,city,address,phoneno,profile)
			values 
				(@FirstName,@LastName,@Email,@Password,@DateOfBirth,@Age,@Gender,@State,@city,@address,@PhoneNo,@Profile)

			declare @insertedid int
			-- getting the last inserted user id
			set @insertedid=SCOPE_IDENTITY()

			-- inserting his interests into the interests mapping table
			insert into interestsMapping(interestid,userid)
			select interestid,@insertedid from @interesttable

			set @issuccess=1
			commit transaction
	end try
	begin catch
		rollback transaction
		set @issuccess=0
	end catch
end
go


-- stored procedure to get the user by its id
create proc spGetUsers
@id int=0
as
begin
	select u.*,i.id as interestid,i.interest
	from Users as u
	join interestsMapping as im
	on im.userid=u.id
	join Interests as i
	on im.interestid=i.id
	where (@id=0 or u.id=@id) and u.isdeleted=0
	order by u.createdon desc
end
go

-- stored Procedure for deleting the user soft delete
create proc spDeleteUser
@id int,
@issuccess bit output
as
begin
	-- updating the user as isdeleted=1
	update Users set isdeleted=1,deletedon=getdate()
	where id=@id
	set @issuccess=1
end
go

-- stored procedure for updating the user
create proc spUpdateUser
@id int,
@interesttable interests readonly,
@FirstName NVARCHAR(100),
@LastName NVARCHAR(100),
@Email NVARCHAR(MAX),
@Password NVARCHAR(MAX),
@DateOfBirth DATE,
@Age INT,
@Gender NVARCHAR(80),
@State NVARCHAR(MAX),
@City NVARCHAR(MAX),
@Address NVARCHAR(MAX),
@PhoneNo NVARCHAR(MAX),
@Profile NVARCHAR(MAX),
@issuccess bit out
as
begin
	begin try
		begin transaction

			-- update the user in the table
			update Users 
			set firstname=@FirstName,
				lastname=@LastName,
				email=@Email,
				password=@Password,
				dateofbirth=@DateOfBirth,
				age=@Age,
				gender=@Gender,
				state=@State,
				city=@City,
				address=@Address,
				phoneno=@PhoneNo,
				profile=@Profile,
				updatedon=getdate()
			where id=@id

			-- delete the old records from the interests table
			delete from interestsMapping
			where userid=@id

			-- insert the latest interests
			insert into interestsMapping 
			select interestid,@id from @interesttable

			set @issuccess=1
		commit transaction

	end try
	begin catch
		rollback transaction
		set @issuccess=0
	end catch
end