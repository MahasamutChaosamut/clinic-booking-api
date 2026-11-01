  
  select * from patients p ;
  
  select * from patients p where p.birth_date >= '2001-01-01';
  
  select p.first_name ,p.last_name ,p.phone  from patients p;
  
  select p.last_name from patients p where p.last_name LIKE 'ส%';
  
  select * from patients p ORDER BY p.birth_date ASC limit 3;
  
  select * from patients p where p.phone is NULL;