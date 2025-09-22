import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTours } from '../features/toursSlice';
import { getTours } from '../api/axiosInstance.js';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import TourCard from './TourCard';

const Tours = () => {
  const dispatch = useDispatch();
  const tours = useSelector(state => state.tours.list);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try { setErr('');
        setLoading(true);
        const data = await getTours(10, 0);
        dispatch(setTours(data));
      } catch (e) { setErr('No se pudo cargar la lista de tours.'); } 
      finally { setLoading(false); } };
    load();
  }, [dispatch]);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Tours Disponibles</h2>
      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> 
          Cargando tours...
        </div>
      )}
      {err && <Alert variant="danger">{err}</Alert>}
      <Row>
        {tours.map(t => (
          <Col key={t.id} xs={12} md={6} lg={4}>
            <TourCard tour={t} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Tours;