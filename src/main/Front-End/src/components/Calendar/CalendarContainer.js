// src/components/CalendarContainer.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import EventModal from './EventModal';
import EditModal from './EditModal';
import EventList from './EventList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const StyledContainer = styled(motion.div)`
  padding: 20px;
  max-width: 1020px;
  max-height: 875px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 1020px;
  height: 875px;
`;

const BodyWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 954px;
`;

const CalendarStyles = styled.div`
  .custom-day-cell {
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }
  .custom-day-cell:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .sunday {
    color: red;
  }
  .saturday {
    color: blue;
  }
`;

// 작성자에 따라 랜덤한 색상을 생성하는 함수
const getColorByUsername = (username) => {
  if (!username) {
    // username이 undefined이거나 null인 경우 기본 색상 반환
    return 'hsl(0, 0%, 80%)'; // 기본 회색 색상
  }
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`; // 채도와 명도를 조절하여 밝은 색상으로 설정
  return color;
};

export default function CalendarContainer({ onBack }) {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/cal');
      setEvents(response.data);
    } catch (error) {
      console.error('이벤트 불러오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [isModalOpen, isEditModalOpen]);

  const handleSelect = (info) => {
    setSelectedRange({ start: info.startStr, end: info.endStr });
    setIsModalOpen(true);
  };

  const handleAddEvent = async ({ title, start, end, notificationTime }) => {
    try {
      const response = await axios.post('http://localhost:8083/api/cal', {
        title,
        start,
        end,
        notificationTime,
      });

      setEvents([...events, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('이벤트 추가 오류:', error);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.extendedProps.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      notificationTime: info.event.extendedProps.notificationTime,
      username: info.event.extendedProps.username,
    });
    setIsEditModalOpen(true);
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const response = await axios.put(
          `http://localhost:8083/api/cal/${updatedEvent.id}`,
          updatedEvent
      );
      setEvents(events.map((event) => (event.id === updatedEvent.id ? response.data : event)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('이벤트 수정 오류:', error);
    }
  };

  const handleDeleteEvent = async (eventToDelete) => {
    try {
      await axios.delete(`http://localhost:8083/api/cal/${eventToDelete.id}`);
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
    } catch (error) {
      console.error('이벤트 삭제 오류:', error);
    }
  };

  const calendarVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
  };

  const handleDayCellClassNames = (args) => {
    const date = args.date;
    const day = date.getDay();
    if (day === 0) return 'custom-day-cell sunday';
    if (day === 6) return 'custom-day-cell saturday';
    return 'custom-day-cell';
  };

  return (
      <BodyWrapper>
        <CalendarStyles>
          <Tabs>
            <TabList>
              <Tab>캘린더</Tab>
              <Tab>일정 목록</Tab>
            </TabList>

            <TabPanel>
              <StyledContainer
                  variants={calendarVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
              >
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={events.map(event => ({
                      ...event,
                      backgroundColor: getColorByUsername(event.username), // 이벤트 배경 색상을 username에 따라 설정
                      borderColor: getColorByUsername(event.username), // 이벤트 경계 색상 설정
                      extendedProps: {
                        id: event.id,
                        notificationTime: event.notificationTime,
                        username: event.username // 서버에서 받아온 작성자 필드
                      },
                    }))}
                    selectable={true}
                    select={handleSelect}
                    eventClick={handleEventClick}
                    editable={true}
                    dayCellClassNames={handleDayCellClassNames}
                />
              </StyledContainer>
            </TabPanel>

            <TabPanel>
              <EventList onDeleteEvent={handleDeleteEvent} />
            </TabPanel>
          </Tabs>

          <EventModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              onAddEvent={handleAddEvent}
              selectedRange={selectedRange}
          />

          <EditModal
              isOpen={isEditModalOpen}
              onRequestClose={() => setIsEditModalOpen(false)}
              event={selectedEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
          />
        </CalendarStyles>
      </BodyWrapper>
  );
}
