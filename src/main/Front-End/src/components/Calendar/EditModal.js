// src/components/EditModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const StyledModal = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  outline: none;
`;

Modal.setAppElement('#root');

const Button = styled(motion.button)`
  padding: 10px 15px;
  margin-top: 10px;
  margin-right: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonWrapper = styled(motion.div)`
  display: flex;
  justify-content: space-around;
`;

const Input = styled(motion.input)`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
`;

export default function EditModal({ isOpen, onRequestClose, event, onEditEvent, onDeleteEvent }) {
  const [eventTitle, setEventTitle] = useState(event?.title || '');
  const [notificationTime, setNotificationTime] = useState(event?.notificationTime || '09:00');

  useEffect(() => {
    if (isOpen && event) {
      setEventTitle(event.title || '');
      setNotificationTime(event.notificationTime || '09:00');
    }
  }, [isOpen, event]);

  const handleEditEvent = async () => {
    if (!event?.id) {
      console.error('이벤트 ID가 없습니다.');
      alert('이벤트 ID를 찾을 수 없습니다.');
      return;
    }

    const updatedEvent = {
      ...event,
      title: eventTitle,
      notificationTime,
    };

    try {
      const response = await axios.put(
          `http://localhost:8083/api/cal/${event.id}`,
          updatedEvent,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
      );
      onEditEvent(response.data);
      onRequestClose();
    } catch (error) {
      console.error('이벤트 수정 오류:', error);
      alert('이벤트 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteEvent = async () => {
    if (!event?.id) {
      console.error('이벤트 ID가 없습니다.');
      alert('이벤트 ID를 찾을 수 없습니다.');
      return;
    }

    if (window.confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) {
      try {
        await axios.delete(`http://localhost:8083/api/cal/${event.id}`, {
          withCredentials: true,
        });
        onDeleteEvent(event);
        onRequestClose();
      } catch (error) {
        console.error('이벤트 삭제 오류:', error);
        alert('이벤트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            content: {
              position: 'relative',
              border: 'none',
              background: 'transparent',
              overflow: 'visible',
              padding: 0,
              inset: 'auto',
            },
          }}
      >
        <AnimatePresence>
          {isOpen && (
              <StyledModal
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <h2>일정 수정</h2>
                <Input
                    type="text"
                    placeholder="일정 제목을 수정하세요"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                />
                <p>기간: {event.start.split('T')[0]} ~ {event.end.split('T')[0]}</p>
                <Input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    placeholder="알림 시간"
                />
                <ButtonWrapper>
                  <Button onClick={handleEditEvent}>수정</Button>
                  <Button onClick={handleDeleteEvent} style={{ backgroundColor: '#dc3545' }}>
                    삭제
                  </Button>
                  <Button onClick={onRequestClose} style={{ backgroundColor: '#6c757d' }}>
                    취소
                  </Button>
                </ButtonWrapper>
              </StyledModal>
          )}
        </AnimatePresence>
      </Modal>
  );
}
