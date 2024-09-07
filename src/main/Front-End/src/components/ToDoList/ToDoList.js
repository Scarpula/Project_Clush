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
import axios from 'axios'; // axios 라이브러리 임포트

axios.defaults.withCredentials = true;

export default function ToDoList({ onTaskClick }) {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);
	const [currentTime, setCurrentTime] = useState(""); // 현재 시간 상태
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
	const [taskTime, setTaskTime] = useState(''); // State for selected time

	// 시간 목록 생성
	const timeOptions = Array.from({ length: 24 * 4 }, (_, index) => {
		const hour = Math.floor(index / 4)
			.toString()
			.padStart(2, '0');
		const minute = (index % 4) * 15
			.toString()
			.padStart(2, '0');
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
		updateClock(); // 초기 시간 설정
		return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
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
			await axios.delete(
				`http://localhost:8083/api/todos/${id}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			setTasks(tasks.filter(task => task.id !== id));
		} catch (error) {
			console.error('작업 삭제 오류:', error);
		}
	}

	// 작업 로드
	async function loadTasks() {
		try {
			const response = await axios.get(`http://localhost:8083/api/todos`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});
			console.log(response.data); // 불러온 데이터 확인
			setTasks(response.data);
		} catch (error) {
			console.error('작업 로드 오류:', error);
		}
	}



	useEffect(() => {
		loadTasks();
	}, []);

	// Task 애니메이션 설정
	const taskVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
		exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }, // 삭제 시 왼쪽으로 슬라이드
	};

	return (
		<Container size={550} my={40}>
			{/* 실시간 디지털 시계 */}
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
					})}>
					My Tasks
				</Title>
				<ActionIcon
					color={'blue'}
					onClick={() => toggleColorScheme()}
					size='lg'>
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
							className="card-hover" // 호버 애니메이션 클래스 추가
						>
							<Card
								withBorder
								mt={'sm'}
								onClick={() => onTaskClick(task)} // Task 클릭 시 이벤트 발생
							>
								<Group position={'apart'}>
									<Text weight={'bold'}>{task.title}</Text>
									<ActionIcon
										onClick={(e) => {
											e.stopPropagation(); // Prevent triggering onTaskClick
											deleteTask(task.id);
										}}
										color={'red'}
										variant={'transparent'}>
										<Trash/>
									</ActionIcon>
								</Group>
								<Text color={'dimmed'} size={'md'} mt={'sm'}>
									{task.summary ? task.summary : '일에 대한 요약이 없습니다'}
								</Text>
								<Text color={'dimmed'} size={'sm'} mt={'xs'}>
									{task.time ? `Time: ${task.time}` : '시간이 설정되지 않았습니다'}
								</Text>
								{/* username 표시 */}
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
			<Button
				onClick={() => {
					setOpened(true);
				}}
				fullWidth
				mt={'md'}>
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
				centered>
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
						variant={'subtle'}>
						취소
					</Button>
					<Button
						onClick={() => {
							createTask();
							setOpened(false);
						}}>
						작업 생성하기
					</Button>
				</Group>
			</Modal>
		</Container>
	);
}
