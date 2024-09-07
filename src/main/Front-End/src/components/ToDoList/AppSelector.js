import { Button, Group, Card, Title } from '@mantine/core';
import { motion } from 'framer-motion';

export default function AppSelector({ onSelectApp }) {
  const cardVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
        layout
        className="title"
        style={{ willChange: 'opacity, transform' }}
      >
        <Title align="center" mb={20}>
          Select an App
        </Title>
      </motion.div>
      <Group className="group">
        {['todo', 'calendar'].map((app) => (
          <motion.div
            key={app}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            style={{ willChange: 'opacity, transform' }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Button
                onClick={() => onSelectApp(app)}
                fullWidth
                variant="outline"
              >
                {app === 'todo' ? 'To-Do List' : 'Calendar App'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </Group>
    </div>
  );
}
