# Day 1: Event Loop, Promise, async/await, Modules

## สรุปแบบสั้น (คำของผมเอง)

> Node.js รันโค้ด JS บน thread **1** ตัว
> แต่รับ request ได้เยอะ เพราะงานที่ต้องรอ เช่น **อ่าน database หรือไฟล์** จะถูกส่งไปให้ **OS / libuv** ทำ แทนที่จะยืนรอ
> พองานเสร็จ callback จะเข้า **คิว**
> แล้ว **event loop** จะหยิบมารันตอนที่ **call stack** ว่าง
> โดยจะทำ **microtask** (เช่น Promise) ก่อน แล้วค่อยทำ **macrotask** (เช่น setTimeout)

**เปรียบเทียบ:** ร้านอาหารที่มีพนักงานเสิร์ฟคนเดียว

| ร้านอาหาร | Node.js |
|---|---|
| พนักงานเสิร์ฟคนเดียว | JS thread / call stack (ทำได้ทีละอย่าง) |
| พ่อครัวในครัว | OS / libuv (ทำงานที่ต้องรอ) |
| รับออเดอร์แล้วส่งเข้าครัว ไม่ยืนรอ ไปรับโต๊ะอื่นต่อ | ส่ง I/O ให้ OS แล้วไปจัดการ request อื่น |
| อาหารเสร็จ → กดกริ่ง → รอในคิว | งานเสร็จ → callback เข้าคิว |
| พนักงานว่างค่อยไปหยิบจากคิว | event loop หยิบ callback มารันตอน call stack ว่าง |
| คิวด่วนต้องทำก่อนเสมอ | microtask รันก่อน macrotask |

**จุดที่เคยเข้าใจผิด:**
- งานที่ส่งไปให้ OS ทำ **ไม่ใช่ตัว request** แต่เป็นสิ่งที่ต้องรอระหว่างจัดการ request (query DB, อ่านไฟล์, เรียก API อื่น)
- callback **ไม่ได้ไปต่อที่บรรทัดถัดไป** แต่ไปรอในคิว ส่วนบรรทัดถัดไปรันต่อทันที
- คนหยิบ callback มารันคือ **event loop** ไม่ใช่ request
- microtask **ไม่ได้แปลว่าทำพร้อมกัน** แต่เป็นคิวด่วนที่ถูกเคลียร์ก่อน macrotask

## สรุป 1 นาที (ฉบับเต็ม สำหรับพูดตอนสัมภาษณ์)

> Node.js รันโค้ด JavaScript บน **thread เดียว** แต่รับ request ได้พร้อมกันจำนวนมาก
> เพราะงานที่ต้องรอ เช่น network, ไฟล์, database จะถูกส่งต่อให้ OS หรือ thread pool ของ libuv ทำแทน
> โดยไม่ต้องหยุดรอ พองานเสร็จ callback จะถูกใส่คิวไว้
>
> **Event loop** คือวงวนที่คอยดูว่า call stack ว่างหรือยัง ถ้าว่างก็หยิบ callback จากคิวมารันทีละตัว
>
> ลำดับคือ: โค้ด sync รันจนจบก่อน → แล้วเคลียร์ **microtask** ทั้งหมด (`process.nextTick`, `Promise.then`, ส่วนหลัง `await`)
> → แล้วค่อยไป **macrotask** ตามเฟสของ loop เช่น `setTimeout` (timers), I/O callback (poll), `setImmediate` (check)
> และหลัง macrotask แต่ละตัวก็จะเคลียร์ microtask อีกรอบ
>
> ข้อควรระวังคือ ถ้ามีงาน CPU หนัก ๆ แบบ sync เช่น loop ใหญ่ หรือ `bcrypt.hashSync` มันจะ **block event loop**
> ทำให้ทุก request ค้างทั้งระบบ วิธีเลี่ยงคือใช้ API แบบ async, แบ่งงานเป็นชิ้น หรือย้ายไป worker thread

---

## ภาพรวม

```
┌───────────────────────────┐
│        Call Stack         │  ← โค้ด JS รันที่นี่ (thread เดียว)
└────────────┬──────────────┘
             │ stack ว่างเมื่อไร
             ▼
┌───────────────────────────┐
│  Microtask queue          │  ← เคลียร์ให้หมดก่อนเสมอ
│  1. process.nextTick      │
│  2. Promise.then / await  │
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│  Event loop phases        │
│  timers   → setTimeout, setInterval
│  pending  → callback ของ I/O บางชนิด
│  poll     → รอและรัน I/O callback (network, fs)
│  check    → setImmediate
│  close    → 'close' event เช่น socket.on('close')
└───────────────────────────┘
```

**ใครทำงานที่ต้องรอแทน JS:**
- **Network I/O** (HTTP, TCP, DB connection) → OS จัดการเอง (epoll / kqueue / IOCP บน Windows)
- **fs, dns.lookup, crypto (pbkdf2, scrypt), zlib** → **libuv thread pool** (ค่าเริ่มต้น 4 threads)

---

## การทดลอง 1: เดาลำดับ (`order.js`)

```js
console.log('A sync start');
setTimeout(() => console.log('B timeout'), 0);
Promise.resolve().then(() => console.log('C promise'));
process.nextTick(() => console.log('D nextTick'));
(async () => {
  console.log('E async fn');
  await null;
  console.log('F after await');
})();
console.log('G sync end');
```

ผลที่ได้จริง (Node v24):

| CommonJS (`.js` ไม่มี `"type": "module"`) | ESM (`"type": "module"` หรือ `.mjs`) |
|---|---|
| A sync start | A sync start |
| E async fn | E async fn |
| G sync end | G sync end |
| **D nextTick** | C promise |
| C promise | F after await |
| F after await | **D nextTick** |
| B timeout | B timeout |

**อธิบาย:**
- `A`, `E`, `G` เป็นโค้ด sync ออกก่อนเสมอ
  `E` ออกทันทีเพราะโค้ดใน async function **ก่อนถึง `await` แรก** เป็น sync ธรรมดา
- `C` กับ `F` เป็น Promise microtask (`F` คือส่วนหลัง `await`)
- `D` เป็น `nextTick` ซึ่งปกติรันก่อน Promise
  **แต่ใน ESM** ตัว module ถูกรันอยู่ใน promise job อยู่แล้ว Promise microtask ที่ค้างอยู่จึงถูกเคลียร์ก่อน แล้วค่อยถึงคิว `nextTick`
- `B` เป็น macrotask (timers) ต้องรอให้ microtask หมดก่อน แม้จะตั้งเวลาไว้ 0ms

**สิ่งที่เหมือนกันทั้งสองแบบ:** sync → microtask → macrotask

> ⚠️ `setTimeout(fn, 0)` กับ `setImmediate(fn)` ถ้าเรียกจาก main module **ลำดับไม่แน่นอน**
> แต่ถ้าเรียกจากใน I/O callback `setImmediate` จะมาก่อนเสมอ (เพราะ check phase อยู่ถัดจาก poll)

---

## การทดลอง 2: Block event loop (`block.js`)

```js
setInterval(() => console.log('tick', Date.now() % 100000), 200);

setTimeout(() => {
  console.log('--- block start');
  const end = Date.now() + 2000;
  while (Date.now() < end) {} // งาน CPU หนักแบบ sync
  console.log('--- block end');
}, 1000);
```

ผล: `tick` หายไปประมาณ 2 วินาทีระหว่าง block ถ้าเป็น API จริง **ทุก request จะค้างไปด้วย**

**สิ่งที่ block event loop บ่อย ๆ:**
- `fs.readFileSync`, `bcrypt.hashSync`, `crypto.pbkdf2Sync` ใน request handler
- `JSON.parse` / `JSON.stringify` ข้อมูลขนาดใหญ่มาก
- regex ที่ backtrack หนัก (ReDoS)
- loop คำนวณขนาดใหญ่

**วิธีเลี่ยง:** ใช้ API แบบ async, ประมวลผลข้อมูลใหญ่ทีละส่วน (stream / pagination), ย้ายงาน CPU ไป `worker_threads` หรือ queue

---

## Promise และ async/await

**Promise** คือ object แทนค่าที่จะได้ในอนาคต มี 3 สถานะ: `pending` → `fulfilled` หรือ `rejected`

```js
// แบบ new Promise
const findPatient = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id < 0) reject(new Error(`Patient ${id} not found`));
      else resolve({ id, name: `Patient ${id}` });
    }, 300);
  });

// แบบ async/await (ผลเหมือนกัน อ่านง่ายกว่า)
const findPatientAsync = async (id) => {
  await sleep(300);
  if (id < 0) throw new Error(`Patient ${id} not found`); // throw = reject
  return { id, name: `Patient ${id}` };                   // return = resolve
};
```

### รอทีละตัว vs ทำพร้อมกัน

```js
// ทีละตัว ≈ 600ms — ใช้เมื่อตัวหลังต้องใช้ผลของตัวแรก
const a = await findPatient(1);
const b = await findPatient(2);

// พร้อมกัน ≈ 300ms — ใช้เมื่องานไม่ขึ้นต่อกัน
const [a, b] = await Promise.all([findPatient(1), findPatient(2)]);
```

> ⚠️ `await` ใน `for` loop จะรอทีละรอบ ถ้าแต่ละรอบไม่ขึ้นต่อกัน ให้ใช้ `Promise.all(items.map(...))` แทน

### Promise combinators

| ฟังก์ชัน | ผลเมื่อสำเร็จ | ถ้ามีตัวใด reject |
|---|---|---|
| `Promise.all` | array ของผลทุกตัว | reject ทันทีด้วย error ตัวแรก |
| `Promise.allSettled` | array ของ `{ status, value \| reason }` ทุกตัว | ไม่ reject เลย |
| `Promise.race` | ผลของตัวที่จบก่อน (สำเร็จหรือพังก็ได้) | ถ้าตัวที่จบก่อนพัง ก็ reject |
| `Promise.any` | ผลของตัวแรกที่สำเร็จ | reject เมื่อพังทุกตัว (`AggregateError`) |

```js
const results = await Promise.allSettled([findPatient(1), findPatient(-1), findPatient(3)]);
const found = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
```

### Error handling

```js
try {
  await findPatient(-1);
} catch (err) {
  console.log('caught:', err.message);
}
```

> ⚠️ Promise ที่ reject แล้วไม่มีใคร `catch` → `unhandledRejection` → ตั้งแต่ Node 15 **process จะตาย**

---

## Modules

| | CommonJS | ES Modules (ESM) |
|---|---|---|
| import | `const x = require('./x')` | `import x from './x.js'` |
| export | `module.exports = x` | `export default x` / `export const y` |
| โหลด | sync, ตอนรันถึงบรรทัดนั้น | วิเคราะห์ก่อนรัน, รองรับ top-level `await` |
| นามสกุลไฟล์ใน path | ไม่ต้องใส่ก็ได้ | **ต้องใส่** `.js` |
| ตัดสินจาก | `.cjs` หรือ ไม่มี `"type"` | `.mjs` หรือ `"type": "module"` ใน package.json |

NestJS เขียนด้วย TypeScript `import/export` แต่ค่าเริ่มต้นจะ compile ออกมาเป็น CommonJS

## npm

| คำสั่ง / ไฟล์ | ใช้ทำอะไร |
|---|---|
| `npm init -y` | สร้าง `package.json` |
| `npm install express` | ลงเป็น `dependencies` (ใช้ตอนรันจริง) |
| `npm install -D nodemon` | ลงเป็น `devDependencies` (ใช้ตอนพัฒนา, test, build) |
| `npm ci` | ลงตาม `package-lock.json` เป๊ะ ๆ ใช้ใน CI / Docker |
| `npm run <script>` | รันคำสั่งใน `"scripts"` |
| `npx <tool>` | รัน CLI โดยไม่ต้องลง global |
| `package-lock.json` | ล็อก version ของทุก dependency ให้ทุกเครื่องได้ของเหมือนกัน **ต้อง commit** |
| `^5.3.0` | ยอมรับ 5.x.x ที่ ≥ 5.3.0 (minor + patch) |
| `~5.3.0` | ยอมรับ 5.3.x เท่านั้น (patch) |

---

## คำถามสัมภาษณ์ที่ควรตอบได้

1. **Node เป็น single thread จริงไหม?**
   โค้ด JS รันบน thread เดียว แต่ตัว Node มี thread อื่นด้วย (libuv thread pool, V8 GC) และใช้ `worker_threads` สร้างเพิ่มได้
2. **ทำไม `setTimeout(fn, 0)` ถึงรันหลัง `Promise.then`?**
   Promise เป็น microtask ถูกเคลียร์ทันทีหลังโค้ด sync จบ ส่วน `setTimeout` เป็น macrotask ต้องรอถึง timers phase
3. **`process.nextTick` กับ `setImmediate` ต่างกันยังไง?**
   `nextTick` รันทันทีหลังงานปัจจุบัน (ก่อน Promise ใน CommonJS) ส่วน `setImmediate` รันใน check phase ของรอบ loop
   ชื่อกลับด้านกับความหมาย: nextTick เร็วกว่า immediate
4. **ถ้ามี request หนึ่งคำนวณหนัก 5 วินาที จะเกิดอะไร?**
   Request อื่นทั้งหมดค้าง 5 วินาที เพราะ event loop ถูก block แก้ด้วย worker thread หรือ job queue
5. **`await` ใน loop ช้าเพราะอะไร?**
   แต่ละรอบรอให้รอบก่อนเสร็จก่อน ถ้าไม่ขึ้นต่อกันให้ใช้ `Promise.all`
