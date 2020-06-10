```vb
DECLARE int salary,string type,string teacher
GET type,teacher
IF type=="专职教师"
CASE teacher OF
CASE 取值 "教授"
salary = 40
CASE 取值 "副教授"
salary = 35
CASE 取值 "讲师"
salary = 30
CASE 取值 "助教"
salary = 25
ENDCASE
ELSEIF type=="非专职教师"
CASE teacher OF
CASE 取值 "教授"
salary = 35
CASE 取值 "副教授"
salary = 30
CASE 取值 "讲师"
salary = 25
CASE 取值 "助教"
salary = 20
ENDCASE
ELSE
PUT "数据非法"
ENDIF
PUT type+"的"+teacher+"的课时费为每课时"+salary+"元"
```
