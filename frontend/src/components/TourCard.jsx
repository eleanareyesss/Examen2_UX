import React, { useState } from 'react';
import { Card, Button, Collapse, Spinner, Alert, Form } from 'react-bootstrap';
import { getAvailability, reserveTour } from '../api/axiosInstance';

const TourCard = ({ tour }) => {
  const [open, setOpen] = useState(false);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState('');
  const [personName, setPersonName] = useState('');
  const [resLoading, setResLoading] = useState(false);
  const [resMsg, setResMsg] = useState('');

  const loadAvailability = async () => {
    try {
      setError('');
      setResMsg('');
      setLoadingAvail(true);
      const data = await getAvailability();
      const filtered = data.filter(d => d.tour_id === tour.id);
      setAvailability(filtered);
    } catch (e) {
      setError('No se pudo cargar la disponibilidad.');
    } finally {
      setLoadingAvail(false);
    }
  };

  const handleToggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && availability.length === 0) {
      await loadAvailability();
    }
  };

  const handleSelectSchedule = (sched) => {
    setSelectedScheduleId(sched.schedule_id);
    setSelectedScheduleTime(sched.schedule_time);
    setResMsg('');
  };

  const handleReserve = async () => {
    try {
      setError('');
      setResMsg('');
      if (!personName.trim() || !selectedScheduleId) {
        setError('Debes ingresar tu nombre y seleccionar un horario.');
        return;
        }
      setResLoading(true);
      const resp = await reserveTour({
        personName: personName.trim(),
        scheduleTime: selectedScheduleTime,
        tourId: tour.id,
        seats: 1,
      });
      setResMsg(`${resp.message}. Reserva #${resp.reservationId}`);
      await loadAvailability();
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        'No se pudo procesar la reserva. Intenta nuevamente.';
      setError(msg);
    } finally {
      setResLoading(false);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{tour.name}</Card.Title>
        <Card.Text className="text-muted">{tour.description}</Card.Text>
        <div className="d-flex gap-2">
          <Button 
          variant="primary" onClick={handleToggle}> 
          {open ? 'Ocultar disponibilidad' : 'Ver disponibilidad'}
          </Button>
        </div>
        <Collapse in={open}>
          <div>
            <hr />
            {loadingAvail && (
              <div className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" /> 
                Cargando disponibilidad...
              </div>
            )}

            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
            {resMsg && <Alert variant="success" className="mt-2">{resMsg}</Alert>}

            {!loadingAvail && availability.length === 0 && (
              <div className="text-muted">
                No hay horarios con cupo disponible.</div>
            )}

            {!loadingAvail && availability.length > 0 && (
              <>
                <Form>
                  {availability.map(s => (
                    <Form.Check
                      key={s.schedule_id}
                      type="radio"
                      name={`schedule-${tour.id}`}
                      id={`sch-${s.schedule_id}`}
                      className="mb-2"
                      label={`${new Date(s.schedule_time).toLocaleString()} — cupos: ${s.seats_remaining}`}
                      checked={selectedScheduleId === s.schedule_id}
                      onChange={() => handleSelectSchedule(s)}
                    />
                  ))}

                  <Form.Group className="mt-3">
                    <Form.Label>Tu nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej. María Pérez"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <Button
                      variant="success"
                      onClick={handleReserve}
                      disabled={resLoading}
                    >
                      {resLoading ? (
                        <>
                          <Spinner animation="border" size="sm" /> 
                          Reservando...
                        </>
                      ) : ( 'Reservar' )}
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default TourCard;