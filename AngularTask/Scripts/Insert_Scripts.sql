/* Inserting the data for the state and city */

INSERT INTO States (StateName) VALUES
('Maharashtra'),
('Karnataka'),
('Tamil Nadu'),
('Uttar Pradesh'),
('Rajasthan'),
('Gujarat'),
('West Bengal'),
('Punjab'),
('Bihar'),
('Madhya Pradesh');
go

INSERT INTO Cities (CityName, StateID) VALUES
-- Maharashtra
('Mumbai', 1),
('Pune', 1),
('Nagpur', 1),
('Nashik', 1),

-- Karnataka
('Bengaluru', 2),
('Mysuru', 2),
('Mangaluru', 2),
('Hubballi', 2),

-- Tamil Nadu
('Chennai', 3),
('Coimbatore', 3),
('Madurai', 3),
('Tiruchirappalli', 3),

-- Uttar Pradesh
('Lucknow', 4),
('Kanpur', 4),
('Varanasi', 4),
('Agra', 4),

-- Rajasthan
('Jaipur', 5),
('Jodhpur', 5),
('Udaipur', 5),
('Kota', 5),

-- Gujarat
('Ahmedabad', 6),
('Surat', 6),
('Vadodara', 6),
('Rajkot', 6),

-- West Bengal
('Kolkata', 7),
('Asansol', 7),
('Siliguri', 7),
('Durgapur', 7),

-- Punjab
('Chandigarh', 8),
('Amritsar', 8),
('Ludhiana', 8),
('Patiala', 8),

-- Bihar
('Patna', 9),
('Gaya', 9),
('Bhagalpur', 9),
('Muzaffarpur', 9),

-- Madhya Pradesh
('Bhopal', 10),
('Indore', 10),
('Gwalior', 10),
('Jabalpur', 10);
go

-- inserting the data into the interests
INSERT INTO Interests (interest) VALUES 
('Traveling'),
('Photography'),
('Cooking'),
('Reading'),
('Gardening'),
('Fitness and Exercise'),
('Music'),
('Painting'),
('Technology and Gadgets'),
('Coding'),
('Volunteering');
go
