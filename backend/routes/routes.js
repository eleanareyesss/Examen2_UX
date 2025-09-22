const express = require('express');
const router = express.Router();
const { pool } = require('../db');  

router.get('/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

router.get('/tours', async (req, res) => {
  const limit = Number.isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit);
  const offset = Number.isNaN(parseInt(req.query.offset)) ? 0 : parseInt(req.query.offset);
  const sql = `select t.id, t.name, t.description, t.price, t.capacity from tourapp.tours t order by t.id LIMIT $1 OFFSET $2;`;
  try {
    const result = await pool.query(sql, [limit, offset]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tours', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tours/availability', async (_req, res) => {
  const sql = `with booked as (
      select ts.id as schedule_id, ts.tour_id, ts.schedule_time, ts.seats_available, coalesce(sum(r.seats_reserved), 0) as seats_reserved
      from tourapp.tour_schedules ts left join tourapp.reservations r on r.tour_schedule_id = ts.id
      group by ts.id, ts.tour_id, ts.schedule_time, ts.seats_available)
    select b.schedule_id, b.tour_id, t.name as tour_name, b.schedule_time, b.seats_available, (b.seats_available - b.seats_reserved) as seats_remaining
    from booked b join tourapp.tours t on t.id = b.tour_id
    where b.schedule_time > NOW() and (b.seats_available - b.seats_reserved) > 0 order by b.schedule_time asc;`;
  try {
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching available tours', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/tours/reserve', async (req, res) => {
  const personName = (req.query.personName || '').trim();
  const scheduleTime = (req.query.scheduleTime || '').trim();
  const tourId = parseInt(req.query.tourId);
  const seats = Number.isNaN(parseInt(req.query.seats)) ? 1 : parseInt(req.query.seats);

  if (!personName || !scheduleTime || Number.isNaN(tourId) || seats <= 0) {
    return res.status(400).json({ error: 'personName, scheduleTime, tourId y seats>0 son requeridos' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const qSchedule = `select ts.id, ts.seats_available from tourapp.tour_schedules ts
      where ts.tour_id = $1 AND ts.schedule_time = $2 for update;`;
    const schRes = await client.query(qSchedule, [tourId, scheduleTime]);
    if (schRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Horario no encontrado para ese tour y fecha/hora' });
    }
    const scheduleId = schRes.rows[0].id;
    const seatsAvailable = schRes.rows[0].seats_available;
    const qReserved = `select coalesce(sum(r.seats_reserved), 0) as seats_reserved
      from tourapp.reservations r
      where r.tour_schedule_id = $1 and r.status = 'CONFIRMED';`;
    const rsvRes = await client.query(qReserved, [scheduleId]);
    const seatsReserved = parseInt(rsvRes.rows[0].seats_reserved);
    const seatsRemaining = seatsAvailable - seatsReserved;
    if (seats > seatsRemaining) {
      await client.query('ROLLBACK');
      return res.status(409).json({error: 'No hay suficientes cupos', seatsRemaining});
    }
    const qInsert = `insert into tourapp.reservations (tour_schedule_id, person_name, seats_reserved, reserved_at, status)
      values ($1, $2, $3, NOW(), 'CONFIRMED') returning id;`;
    const insRes = await client.query(qInsert, [scheduleId, personName, seats]);
    await client.query('COMMIT');
    return res.json({ message: 'Reserva confirmada', reservationId: insRes.rows[0].id, scheduleId, seatsReserved: seats, });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating reservation', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally { client.release(); }
});

module.exports = router;