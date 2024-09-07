// components/TaskContainer.js
import { motion } from 'framer-motion';
import ToDoList from './ToDoList'; // 기존 ToDoList 컴포넌트 사용
import TaskDetails from './TaskDetails'; // 새로운 TaskDetails 컴포넌트

export default function TaskContainer({ selectedTask, isSliding, onTaskClick, onNewTask }) {
  const slideVariants = {
    initial: { x: 0 },
    slide: { x: 450, transition: { duration: 0.5 } },
  };

  const appVariants = {
    initial: { y: 800, opacity: 0 },
    animate: {
      y: 100,
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 20 },
    },
    exit: { opacity: 0, y: 400, transition: { duration: 0.5 } },
  };

  return (
    <>
      {isSliding && selectedTask && <TaskDetails task={selectedTask} onClose={() => onNewTask()} />}
      <motion.div
        key="todo"
        variants={isSliding ? slideVariants : appVariants}
        initial="initial"
        animate={isSliding ? 'slide' : 'animate'}
        exit="exit"
        layout
        className="todo-container"
        style={{ willChange: 'opacity, transform' }}
      >
        <ToDoList onTaskClick={onTaskClick} />
      </motion.div>
    </>
  );
}
