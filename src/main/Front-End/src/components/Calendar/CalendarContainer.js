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
import { TextInput, Button, Group, Text, Card, Select } from '@mantine/core';

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

const TabContentContainer = styled(motion.div)`
  padding: 20px;
  max-width: 1020px;
  max-height: 875px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 1020px;
  height: 875px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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

const getColorByUsername = (username) => {
  if (!username) {
    return 'hsl(0, 0%, 80%)';
  }
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`;
  return color;
};

const getSharedEventColor = () => {
  return 'hsl(220, 80%, 75%)'; // 공유된 일정에 사용할 색상
};

export default function CalendarContainer({ onBack }) {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/share/calendars');
      console.log('Fetched Events:', response.data); // 전체 이벤트 데이터 확인

      // isShared 값 확인
      response.data.forEach(event => console.log('Fetched Event isShared:', event.isShared));

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
    const eventProps = info.event.extendedProps;
    const isShared = eventProps.shared ?? false; // shared 값을 사용

    console.log('isShared (from shared):', isShared); // 콘솔에 shared 값 출력

    setSelectedEvent({
      id: eventProps.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      notificationTime: eventProps.notificationTime,
      username: eventProps.username,
      isShared: isShared, // shared 값을 사용하여 설정
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

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/api/share/search?username=${searchUsername}`);
      setFoundUser(response.data);
    } catch (error) {
      console.error('사용자 검색 오류:', error);
      setFoundUser(null);
    }
  };

  const handleShareEvent = async () => {
    if (!selectedEventId || !foundUser) {
      alert('일정과 공유할 사용자를 선택하세요.');
      return;
    }

    try {
      await axios.post(`http://localhost:8083/api/share/calendar/${selectedEventId}/share?username=${foundUser.username}`);
      alert('일정이 성공적으로 공유되었습니다.');
      setSelectedEventId(null);
      setFoundUser(null);
      setSearchUsername('');
    } catch (error) {
      console.error('일정 공유 오류:', error);
      alert('일정 공유에 실패했습니다.');
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
            <Tab>일정 공유</Tab>
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
                events={events.map((event) => ({
                  ...event,
                  backgroundColor: event.shared ? getSharedEventColor() : getColorByUsername(event.username),
                  borderColor: event.shared ? getSharedEventColor() : getColorByUsername(event.username),
                  extendedProps: {
                    id: event.id,
                    notificationTime: event.notificationTime,
                    username: event.username,
                    shared: event.shared, // 서버에서 받은 shared 값을 포함
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
            <TabContentContainer
              variants={calendarVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EventList onDeleteEvent={handleDeleteEvent} />
            </TabContentContainer>
          </TabPanel>

          <TabPanel>
            <TabContentContainer
              variants={calendarVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Group position="center" direction="column">
                <TextInput
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="공유할 사용자의 이름을 입력하세요"
                  label="사용자 검색"
                />
                <Button onClick={handleSearchUser} mt="md">
                  사용자 검색
                </Button>

                {foundUser && (
                  <Card mt="md" shadow="sm">
                    <Text>사용자 이름: {foundUser.username}</Text>
                    <Text>일정 공유를 원하는 이벤트를 선택하세요:</Text>
                    <Select
                      data={events.map((event) => ({
                        value: event.id,
                        label: event.title,
                      }))}
                      placeholder="이벤트 선택"
                      value={selectedEventId}
                      onChange={setSelectedEventId}
                      mt="md"
                    />
                    <Button onClick={handleShareEvent} mt="md" color="green">
                      일정 공유하기
                    </Button>
                  </Card>
                )}
              </Group>
            </TabContentContainer>
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
