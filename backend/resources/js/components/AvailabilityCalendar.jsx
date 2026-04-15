import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

const AvailabilityCalendar = ({ apartmentId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`/api/apartments/${apartmentId}/availability`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        if (apartmentId) {
            fetchAvailability();
        }
    }, [apartmentId]);

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Calendrier de disponibilité</h3>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
            />
        </div>
    );
};

export default AvailabilityCalendar;