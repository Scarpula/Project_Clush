// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ListContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const EventItem = styled.div`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const EventTitle = styled.span`
    font-size: 16px;
    font-weight: 500;
`;

const EventDates = styled.span`
    color: #666;
`;

const EventList = ({ onDeleteEvent }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8083/api/cal', {
                    withCredentials: true,
                });
                setEvents(response.data);
            } catch (error) {
                console.error('이벤트 불러오기 오류:', error);
                alert('이벤트 불러오기 중 오류가 발생했습니다.');
            }
        };

        fetchEvents();
    }, []);

    // 이벤트 삭제 처리
    const handleDeleteEvent = async (event) => {
        try {
            await axios.delete(`http://localhost:8083/api/cal/${event.id}`, {
                withCredentials: true,
            });
            setEvents(events.filter((e) => e.id !== event.id)); // 삭제된 이벤트를 목록에서 제거
        } catch (error) {
            console.error('이벤트 삭제 오류:', error);
            alert('이벤트 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <ListContainer>
            <h2>일정 목록</h2>
            {events.length === 0 ? (
                <p>등록된 일정이 없습니다.</p>
            ) : (
                events.map((event) => (
                    <EventItem key={event.id}>
                        <div>
                            <EventTitle>{event.title}</EventTitle>
                            <EventDates>
                                {event.start.split('T')[0]} ~ {event.end.split('T')[0]}
                            </EventDates>
                        </div>
                        <div>
                            <button
                                onClick={() => handleDeleteEvent(event)}
                                style={{ color: 'red' }}
                            >
                                삭제
                            </button>
                        </div>
                    </EventItem>
                ))
            )}
        </ListContainer>
    );
};

export default EventList;
