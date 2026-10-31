# Day 2: HTTP Cheatsheet

## โครงสร้าง Request / Response

```
POST /appointments HTTP/1.1                ← method  path  version
Host: localhost:3000                       ┐
Content-Type: application/json             │ headers
Authorization: Bearer eyJhbGciOi...        ┘
                                           ← บรรทัดว่าง
{"patientId": 1, "doctorId": 2,            ← body
 "startAt": "2026-11-20T09:00:00+07:00"}
```

```
HTTP/1.1 201 Created                       ← version  status code  reason
Content-Type: application/json; charset=utf-8
Location: /appointments/7

{"id": 7, "patientId": 1, "doctorId": 2, "startAt": "...", "status": "booked"}
```

---

## Methods

| Method | ใช้ทำอะไร | ตัวอย่างในระบบคลินิก | Safe | Idempotent | มี body |
|---|---|---|---|---|---|
| **GET** | อ่านข้อมูล | `GET /appointments?date=2026-11-20&doctorId=2` | ✅ | ✅ | ❌ |
| **POST** | สร้างใหม่ / สั่งงาน | `POST /appointments` | ❌ | ❌ | ✅ |
| **PUT** | แทนที่ทั้ง resource | `PUT /patients/3` (ส่งข้อมูลครบทุก field) | ❌ | ✅ | ✅ |
| **PATCH** | แก้บาง field | `PATCH /appointments/7` `{"status": "cancelled"}` | ❌ | ไม่รับประกัน | ✅ |
| **DELETE** | ลบ | `DELETE /appointments/7` | ❌ | ✅ | ปกติไม่มี |

- **Safe** = ไม่เปลี่ยนข้อมูลบน server
- **Idempotent** = ยิงซ้ำกี่ครั้ง ผลกับข้อมูลเท่ากับยิงครั้งเดียว
  เช่น `DELETE /appointments/7` สองครั้ง → นัดที่ 7 ก็ถูกลบอยู่ดี (ครั้งที่สองอาจได้ 404 แต่ข้อมูลไม่เปลี่ยน)
  แต่ `POST /appointments` สองครั้ง → ได้นัดใหม่ 2 อัน
- **PUT vs PATCH:** PUT ส่งทั้งก้อน field ที่ไม่ได้ส่งถือว่าหายไป ส่วน PATCH ส่งเฉพาะ field ที่จะแก้

---

## Status codes

### 2xx สำเร็จ
| Code | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| **200 OK** | สำเร็จและมีข้อมูลตอบกลับ | GET รายการนัด, PATCH แล้วส่งข้อมูลใหม่กลับ |
| **201 Created** | สร้าง resource ใหม่สำเร็จ ควรมี header `Location` | POST จองนัด |
| **204 No Content** | สำเร็จแต่ไม่มี body | DELETE นัด |

### 3xx Redirect
| Code | ใช้เมื่อ |
|---|---|
| **301 Moved Permanently** | ย้าย URL ถาวร |
| **304 Not Modified** | ข้อมูลไม่เปลี่ยน ให้ใช้ cache เดิม (ใช้กับ `ETag` / `If-None-Match`) |

### 4xx ฝั่ง client ผิด
| Code | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| **400 Bad Request** | request ผิดรูปแบบ | JSON พัง, ขาด field ที่บังคับ, `page=abc` |
| **401 Unauthorized** | ไม่รู้ว่าเป็นใคร | ไม่ส่ง token, token หมดอายุ, รหัสผ่านผิด |
| **403 Forbidden** | รู้ว่าเป็นใคร แต่ไม่มีสิทธิ์ | staff พยายามลบข้อมูลหมอ |
| **404 Not Found** | หา resource ไม่เจอ | `GET /appointments/999` |
| **405 Method Not Allowed** | path มีอยู่แต่ไม่รองรับ method นี้ | `DELETE /auth/login` |
| **409 Conflict** | ขัดกับสถานะปัจจุบันของข้อมูล | จองช่วงเวลาที่มีคนจองแล้ว, สมัครด้วย email ซ้ำ |
| **422 Unprocessable Content** | รูปแบบถูก แต่ข้อมูลผิดเงื่อนไขทางธุรกิจ | จองนัดย้อนหลัง, เวลาจบก่อนเวลาเริ่ม |
| **429 Too Many Requests** | ยิงถี่เกิน rate limit | login ผิดติดกัน 10 ครั้งใน 1 นาที |

### 5xx ฝั่ง server ผิด
| Code | ใช้เมื่อ |
|---|---|
| **500 Internal Server Error** | bug หรือ error ที่ไม่ได้คาดไว้ **ห้ามส่ง stack trace ให้ client** |
| **502 Bad Gateway** | proxy/load balancer ได้คำตอบผิดปกติจาก server ข้างหลัง |
| **503 Service Unavailable** | server ไม่พร้อม (ปิดปรับปรุง, DB ล่ม) |
| **504 Gateway Timeout** | server ข้างหลังตอบช้าเกินไป |

---

## คู่ที่สับสนบ่อย (ถามในสัมภาษณ์)

### 401 vs 403
| | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| ความหมายจริง | **ยังไม่ยืนยันตัวตน** (authentication) | **ยืนยันแล้วแต่ไม่มีสิทธิ์** (authorization) |
| ตัวอย่าง | ไม่มี JWT, JWT หมดอายุ | doctor เรียก API ที่ให้แค่ admin |
| login ใหม่แล้วหายไหม | ✅ อาจหาย | ❌ ไม่หาย ต้องเปลี่ยน role |

ชื่อ "Unauthorized" ทำให้งง แต่จริง ๆ หมายถึง "unauthenticated"

### 400 vs 422
| | 400 Bad Request | 422 Unprocessable Content |
|---|---|---|
| ปัญหาอยู่ที่ | **รูปแบบ** ของ request | **ความหมาย** ของข้อมูล |
| ตัวอย่าง | JSON พัง, `startAt: "abc"`, ขาด field | `startAt` เป็นวันที่ผ่านไปแล้ว |

ในทางปฏิบัติหลาย API ใช้ 400 กับ validation error ทั้งหมด
(NestJS `ValidationPipe` ค่าเริ่มต้นก็ตอบ 400) **สำคัญคือเลือกแบบเดียวแล้วใช้ให้สม่ำเสมอทั้งระบบ**

### 404 vs 403 เมื่อไม่มีสิทธิ์
ถ้าไม่อยากให้รู้ว่า resource มีอยู่จริง (เช่น ข้อมูลผู้ป่วยของคนอื่น) ตอบ **404** แทน 403 ได้ เพื่อไม่ให้เดา id ได้

### 409 vs 422
- **409** ชนกับข้อมูลที่มีอยู่แล้ว (ถ้าข้อมูลอื่นเปลี่ยน request เดิมอาจผ่าน) → จองช่วงเวลาซ้ำ
- **422** ข้อมูลผิดในตัวเอง (ส่งกี่ทีก็ไม่ผ่าน) → จองวันในอดีต

---

## Headers ที่ใช้บ่อย

| Header | ทิศทาง | ใช้ทำอะไร |
|---|---|---|
| `Content-Type` | ทั้งสองทาง | ชนิดของ body เช่น `application/json; charset=utf-8` (คั่นด้วย `;` ไม่ใช่ `,`) |
| `Accept` | request | client อยากได้ response ชนิดไหน |
| `Authorization` | request | `Bearer <JWT>` |
| `Location` | response | URL ของ resource ที่เพิ่งสร้าง (คู่กับ 201) |
| `Cache-Control` | response | กำหนดการ cache เช่น `no-store` สำหรับข้อมูลผู้ป่วย |
| `Set-Cookie` / `Cookie` | response / request | เก็บ refresh token แบบ `HttpOnly; Secure; SameSite` |
| `Access-Control-Allow-Origin` | response | CORS: อนุญาตให้ frontend โดเมนไหนเรียก API |
| `Retry-After` | response | บอกว่าต้องรอกี่วินาที (คู่กับ 429, 503) |
| `X-Request-Id` | ทั้งสองทาง | id สำหรับตาม log ของ request หนึ่ง ๆ |

---

## REST naming

| ✅ ดี | ❌ ไม่ดี | เหตุผล |
|---|---|---|
| `GET /appointments` | `GET /getAppointments` | method บอกการกระทำแล้ว path เป็นคำนาม |
| `POST /appointments` | `POST /appointments/create` | |
| `GET /appointments/7` | `GET /appointment?id=7` | ใช้พหูพจน์ และ id อยู่ใน path |
| `GET /doctors/2/appointments` | `GET /getDoctorAppointments?doctor=2` | resource ซ้อนกันแสดงความสัมพันธ์ |
| `GET /appointments?date=2026-11-20&page=2&limit=20` | `GET /appointments/date/2026-11-20/page/2` | filter, sort, page ใช้ query string |
| `POST /appointments/7/cancel` | — | action ที่ไม่ใช่ CRUD ใช้ POST + คำกริยาได้ (หรือ `PATCH` เปลี่ยน status) |

**หลัก:**
- path เป็นคำนามพหูพจน์ ตัวพิมพ์เล็ก คั่นด้วย `-` (`/medical-records`)
- ไม่ซ้อนเกิน 2 ชั้น
- response error ทุกตัวมีรูปแบบเดียวกัน เช่น
  ```json
  { "statusCode": 409, "error": "Conflict", "message": "Time slot already booked" }
  ```

---

## ทดสอบด้วย curl (Git Bash)

```bash
curl -i http://localhost:3000/appointments                      # -i ดู status + headers
curl -i -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientId":1,"doctorId":2,"startAt":"2026-11-20T09:00:00+07:00"}'
curl -i -X DELETE http://localhost:3000/appointments/7
curl -i http://localhost:3000/appointments -H "Authorization: Bearer <token>"
```
