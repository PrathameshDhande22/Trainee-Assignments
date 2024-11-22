-- dropping the interest id column from the user database
alter table users
drop constraint FK_Users_InterestID

alter table Users
drop column interestid

-- dropping the spAdduser
drop proc spAddUser

-- dropping the constraint of Interests Mapping
alter table InterestsMapping
drop constraint FK_InterestsMapping_interestid

alter table InterestsMapping
drop constraint FK_InterestsMapping_userid

-- dropping the user table 
drop table Users

-- clearing the data of the interests mapping
truncate table InterestsMapping

-- drop the database
drop database angulartask