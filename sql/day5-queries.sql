SELECT p.first_name AS patient, d.first_name AS doctor, a.appointment_at
FROM appointments a                        
JOIN patients p ON p.id = a.patient_id     
JOIN doctors  d ON d.id = a.doctor_id            

select p.first_name,d.first_name,a.appointment_at  from appointments a 

join patients p on a.patient_id = p.id 
join doctors d  on a.doctor_id = d.id 
where a.appointment_at >= '2026-11-03' and a.appointment_at < '2026-11-04'
order by a.appointment_at asc

select p.first_name, p.last_name , a.appointment_at from patients p  
left join appointments a  on p.id   =  a.patient_id 

select p.first_name, p.last_name , a.appointment_at from patients p
left join appointments a on p.id = a.patient_id
where a.appointment_at is  null

select d.first_name , d.last_name , a.appointment_at  from doctors d 
left join appointments a on d.id = a.doctor_id 
where a.appointment_at is null

select d.id ,d.first_name,d.last_name,count(a.id) from appointments a 
right join doctors d on a.doctor_id = d.id 
group by d.id 

select d.specialty,count(a.id)  from doctors d
left join appointments a on  d.id = a.doctor_id 
group by d.specialty 

select p.id ,p.first_name ,p.last_name ,count(a.id)  from appointments a 
join patients p on a.patient_id = p.id 
group by p.id 
having count(a.id) >= 2

select d.id,d.first_name  ,count(a.status) from doctors d 
left join appointments a on a.doctor_id = d.id 
where a.status = 'completed'
group by d.id 

SELECT a.id, p.first_name, a.appointment_at
FROM appointments a
JOIN patients p ON p.id = a.patient_id
WHERE p.birth_date = ( select MIN(p2.birth_date ) from patients p2 )

select p.id,p.first_name from patients p
where p.id in (select a.patient_id   from appointments a where a.status = 'completed' )

select p.id , p.first_name  from patients p 
where not exists(
	select 1 from appointments a where a.patient_id  = p.id   
)

select p.id,p.first_name , MAX(a.appointment_at ) from patients p
left join appointments a on p.id = a.patient_id 
group by p.id 

SELECT AVG(total)
FROM (
  SELECT doctor_id, COUNT(*) AS total
  FROM appointments
  GROUP BY doctor_id
) AS t

SELECT doctor_id, COUNT(*) AS total
FROM appointments
GROUP BY doctor_id
HAVING COUNT(*) > (SELECT AVG(total)
FROM (
  SELECT doctor_id, COUNT(*) AS total
  FROM appointments
  GROUP BY doctor_id
) AS t)





