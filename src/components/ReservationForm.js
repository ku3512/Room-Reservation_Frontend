import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationForm.css';

const ReservationForm = () => {
    const [roomType, setRoomType] = useState('');
    const [message, setMessage] = useState('');
    const [availability, setAvailability] = useState({});

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reservation/availability');
                setAvailability(response.data);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };

        fetchAvailability();
    }, []);

    const handleReservation = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/reservation/reserve', { roomType });
            setMessage(response.data.message);
            setAvailability(response.data.availability);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
                setAvailability(error.response.data.availability);
            } else {
                setMessage("An error occurred while making the reservation.");
                setAvailability({});
            }
        }
    };

    return (
        <div className="container">
            <label>
                Please enter the type of room you want to reserve:
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    <option value="" disabled>Select room type</option>
                    <option value="Normal Room">Normal Room</option>
                    <option value="Oxygen Room">Oxygen Room</option>
                    <option value="ICU">ICU</option>
                </select>
            </label>
            <button onClick={handleReservation}>Reserve Room</button>
            <p>{message}</p>
            <div className="availability">
                <h3>Remaining Availability:</h3>
                <p>Normal Rooms: {availability.normalRooms}</p>
                <p>Oxygen Rooms: {availability.oxygenRooms}</p>
                <p>ICU Rooms: {availability.icuRooms}</p>
            </div>
        </div>
    );
};

export default ReservationForm;
