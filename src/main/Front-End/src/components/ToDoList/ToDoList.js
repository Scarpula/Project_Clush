// ToDoList.js
import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Select,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function ToDoList({ onTaskClick }) {
	const [tasks, setTasks] = useState([]);
	const [sharedTasks, setSharedTasks] = useState([]); // 공유받은 작업 상태
	const [opened, setOpened] = useState(false);
	const [currentTime, setCurrentTime] = useState('');
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = (value) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');
	const [taskTime, setTaskTime] = useState('');
	const [searchUsername, setSearchUsername] = useState('');
	const [foundUser, setFoundUser] = useState(null);
	const [selectedTaskId, setSelectedTaskId] = useState(null);

	// 시간 목록 생성
	const timeOptions = Array.from({ length: 24 * 4 }, (_, index) => {
		const hour = Math.floor(index / 4).toString().padStart(2, '0');
		const minute = ((index % 4) * 15).toString().padStart(2, '0');
		return { value: `${hour}:${minute}`, label: `${hour}:${minute}` };
	});

	// 실시간 시계 업데이트 함수
	useEffect(() => {
		const updateClock = () => {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			setCurrentTime(`${hours}:${minutes}:${seconds}`);
		};

		const timer = setInterval(updateClock, 1000);
		updateClock();
		return () => clearInterval(timer);
	}, []);

	// 작업 생성
	async function createTask() {
		const newTask = {
			title: taskTitle.current.value,
			summary: taskSummary.current.value,
			time: taskTime,
		};

		try {
			const response = await axios.post(
				`http://localhost:8083/api/todos`,
				newTask,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			setTasks([...tasks, response.data]);
		} catch (error) {
			console.error('작업 생성 오류:', error);
		}
	}

	// 작업 삭제
	async function deleteTask(id) {
		try {
			await axios.delete(`http://localhost:8083/api/todos/${id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});
			setTasks(tasks.filter((task) => task.id !== id));
		} catch (error) {
			console.error('작업 삭제 오류:', error);
		}
	}

	// 작업 로드
	async function loadTasks() {
		try {
			// 자신의 작업 불러오기
			const response = await axios.get(`http://localhost:8083/api/todos`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});
			setTasks(response.data);

			// 공유받은 작업 불러오기
			const sharedResponse = await axios.get(`http://localhost:8083/api/share/todos`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});

			// 공유받은 작업만 필터링 (로그인한 사용자의 작업 제외)
			const filteredSharedTasks = sharedResponse.data.filter(
				(task) => task.username !== response.data.username
			);

			setSharedTasks(filteredSharedTasks);
		} catch (error) {
			console.error('작업 로드 오류:', error);
		}
	}

	useEffect(() => {
		loadTasks();
	}, []);

	// 사용자 검색
	const handleSearchUser = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8083/api/share/search?username=${searchUsername}`
			);
			setFoundUser(response.data);
		} catch (error) {
			console.error('사용자 검색 오류:', error);
			setFoundUser(null);
		}
	};

	// 작업 공유
	const handleShareTask = async () => {
		if (!selectedTaskId || !foundUser) {
			alert('작업과 공유할 사용자를 선택하세요.');
			return;
		}

		try {
			await axios.post(
				`http://localhost:8083/api/share/todo/${selectedTaskId}/share?username=${foundUser.username}`
			);
			alert('작업이 성공적으로 공유되었습니다.');
			setSelectedTaskId(null);
			setFoundUser(null);
			setSearchUsername('');
		} catch (error) {
			console.error('작업 공유 오류:', error);
			alert('작업 공유에 실패했습니다.');
		}
	};

	// Task 애니메이션 설정
	const taskVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
		exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
	};

	return (
		<Container size={550} my={40}>
			<Group position="center" mb="xs">
				<Text size="xl" weight={700}>
					{currentTime}
				</Text>
			</Group>

			<Group position={'apart'}>
				<Title
					sx={(theme) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					My Tasks
				</Title>
				<ActionIcon color={'blue'} onClick={() => toggleColorScheme()} size="lg">
					{colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
				</ActionIcon>
			</Group>
			<AnimatePresence>
				{tasks.length > 0 ? (
					tasks.map((task) => (
						<motion.div
							key={task.id}
							variants={taskVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							layout
							className="card-hover"
						>
							<Card
								withBorder
								mt={'sm'}
								onClick={() => onTaskClick(task)}
							>
								<Group position={'apart'}>
									<Text weight={'bold'}>{task.title}</Text>
									<ActionIcon
										onClick={(e) => {
											e.stopPropagation();
											deleteTask(task.id);
										}}
										color={'red'}
										variant={'transparent'}
									>
										<Trash />
									</ActionIcon>
								</Group>
								<Text color={'dimmed'} size={'md'} mt={'sm'}>
									{task.summary ? task.summary : '일에 대한 요약이 없습니다'}
								</Text>
								<Text color={'dimmed'} size={'sm'} mt={'xs'}>
									{task.time ? `Time: ${task.time}` : '시간이 설정되지 않았습니다'}
								</Text>
								<Text color={'dimmed'} size={'xs'} align="right" mt={'xs'}>
									{task.username ? `작성자: ${task.username}` : '작성자 정보 없음'}
								</Text>
							</Card>
						</motion.div>
					))
				) : (
					<Text size={'lg'} mt={'md'} color={'dimmed'}>
						해야할 일이 없습니다.
						</Text>
				)}
			</AnimatePresence>

			{/* 공유받은 작업 목록 */}
			<Title order={3} mt="lg">
				공유받은 작업
			</Title>
			<AnimatePresence>
				{sharedTasks.length > 0 ? (
					sharedTasks.map((task) => (
						<motion.div
							key={task.id}
							variants={taskVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							layout
							className="card-hover"
						>
							<Card withBorder mt={'sm'}>
								<Group position={'apart'}>
									<Text weight={'bold'}>{task.title}</Text>
								</Group>
								<Text color={'dimmed'} size={'md'} mt={'sm'}>
									{task.summary ? task.summary : '일에 대한 요약이 없습니다'}
								</Text>
								<Text color={'dimmed'} size={'sm'} mt={'xs'}>
									{task.time ? `Time: ${task.time}` : '시간이 설정되지 않았습니다'}
								</Text>
								<Text color={'dimmed'} size={'xs'} align="right" mt={'xs'}>
									{task.username ? `작성자: ${task.username}` : '작성자 정보 없음'}
								</Text>
							</Card>
						</motion.div>
					))
				) : (
					<Text size={'lg'} mt={'md'} color={'dimmed'}>
						공유받은 작업이 없습니다.
					</Text>
				)}
			</AnimatePresence>

			<Button
				onClick={() => {
					setOpened(true);
				}}
				fullWidth
				mt={'md'}
			>
				New Task
			</Button>

			{/* 작업 추가 모달 */}
			<Modal
				opened={opened}
				size={'md'}
				title={'New Task'}
				withCloseButton={false}
				onClose={() => {
					setOpened(false);
				}}
				centered
			>
				<TextInput
					mt={'md'}
					ref={taskTitle}
					placeholder={'작업 제목'}
					required
					label={'제목'}
				/>
				<TextInput
					ref={taskSummary}
					mt={'md'}
					placeholder={'작업 요약'}
					label={'요약'}
				/>
				<Select
					mt={'md'}
					label="Time"
					placeholder="Select time"
					data={timeOptions}
					value={taskTime}
					onChange={setTaskTime}
				/>
				<Group mt={'md'} position={'apart'}>
					<Button
						onClick={() => {
							setOpened(false);
						}}
						variant={'subtle'}
					>
						취소
					</Button>
					<Button
						onClick={() => {
							createTask();
							setOpened(false);
						}}
					>
						작업 생성하기
					</Button>
				</Group>
			</Modal>

			{/* 작업 공유 UI */}
			<Group position="center" direction="column" style={{ marginTop: '20px' }}>
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
						<Text>공유를 원하는 작업을 선택하세요:</Text>
						<Select
							data={tasks.map((task) => ({ value: task.id, label: task.title }))}
							placeholder="작업 선택"
							value={selectedTaskId}
							onChange={setSelectedTaskId}
							mt="md"
						/>
						<Button onClick={handleShareTask} mt="md" color="green">
							작업 공유하기
						</Button>
					</Card>
				)}
			</Group>
		</Container>
	);
}
