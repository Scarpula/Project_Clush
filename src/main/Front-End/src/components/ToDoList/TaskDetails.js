// components/TaskDetails.js
import { Title, Text, Button, useMantineTheme } from '@mantine/core';
import { motion } from 'framer-motion';

export default function TaskDetails({ task, onClose }) {
  const theme = useMantineTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="details-container"
      style={{
        backgroundColor: '#f25262b', // 지정된 배경색
        color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : '#000',
        boxShadow: theme.colorScheme === 'dark' ? '0px 4px 15px rgba(0, 0, 0, 0.5)' : '2px 0 5px rgba(0, 0, 0, 0.1)',
        zIndex: 10, // 버튼 클릭 가능하게 설정
      }}
    >
      <Title order={4}>Task Details</Title>
      <Text mt="md">
        <strong>Title:</strong> {task.title}
      </Text>
      <Text mt="sm">
        <strong>Summary:</strong> {task.summary}
      </Text>
      <Text mt="sm">
        <strong>Time:</strong> {task.time || 'Not set'}
      </Text>
      <Button mt="md" variant="subtle" onClick={onClose}>
        닫기
      </Button>
    </motion.div>
  );
}
