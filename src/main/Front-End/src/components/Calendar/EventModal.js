// EventModal.js
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// 모달 스타일 정의
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

Modal.setAppElement('#root'); // 적절한 루트 요소 ID 설정

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

export default function EventModal({ isOpen, onRequestClose, onAddEvent, selectedRange }) {
    const [eventTitle, setEventTitle] = useState('');
    const [endDate, setEndDate] = useState(''); // 초기값을 빈 문자열로 설정
    const [notificationTime, setNotificationTime] = useState('09:00'); // 기본 알림 시간 설정

    // 모달이 열리고 selectedRange가 변경될 때 endDate 및 eventTitle 설정
    useEffect(() => {
        if (isOpen && selectedRange) {
            setEndDate(selectedRange.end); // 선택된 범위의 끝 날짜로 설정
            setEventTitle(''); // 날짜 클릭 시 제목 초기화
        }
    }, [isOpen, selectedRange]);

    const handleAddEvent = () => {
        if (eventTitle.trim() && endDate) {
            onAddEvent({
                title: eventTitle,
                start: selectedRange.start,
                end: endDate,
                notificationTime,
            });
            onRequestClose();
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
                        <h2>일정 추가</h2>
                        <Input
                            type="text"
                            placeholder="일정 제목을 입력하세요"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                        <p>시작 날짜: {selectedRange.start}</p>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="종료 날짜"
                        />
                        <Input
                            type="time"
                            value={notificationTime}
                            onChange={(e) => setNotificationTime(e.target.value)}
                            placeholder="알림 시간"
                        />
                        <ButtonWrapper>
                            <Button onClick={handleAddEvent}>추가</Button>
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
