import { useState, useCallback, useEffect } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom'; // BrowserRouter 추가
import AppHeader from './components/ToDoList/AppHeader';
import AppSelector from './components/ToDoList/AppSelector';
import TaskContainer from './components/ToDoList/TaskContainer';
import CalendarContainer from './components/Calendar/CalendarContainer';
import './App.css';

export default function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSliding, setIsSliding] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
      setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const handleSelectApp = useCallback((app) => {
    setSelectedApp(app);
  }, []);

  const handleTaskClick = (task) => {
    if (selectedTask && selectedTask.id === task.id) {
      setIsSliding(false);
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
      setIsSliding(true);
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsSliding(false);
  };

  const handleBackToAppSelection = () => {
    setSelectedApp(null);
    setSelectedTask(null);
    setIsSliding(false);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'auto';
  }, [selectedApp]);

  return (
      <Router> {/* Router로 전체 애플리케이션 감싸기 */}
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <AppHeader selectedApp={selectedApp} onBack={handleBackToAppSelection} />
            <AnimatePresence mode="wait">
              {!selectedApp && <AppSelector onSelectApp={handleSelectApp} />}
              {selectedApp === 'todo' && (
                  <TaskContainer
                      selectedTask={selectedTask}
                      isSliding={isSliding}
                      onTaskClick={handleTaskClick}
                      onNewTask={handleNewTask}
                  />
              )}
              {selectedApp === 'calendar' && (
                  <CalendarContainer onBack={handleBackToAppSelection} />
              )}
            </AnimatePresence>
          </MantineProvider>
        </ColorSchemeProvider>
      </Router>
  );
}
