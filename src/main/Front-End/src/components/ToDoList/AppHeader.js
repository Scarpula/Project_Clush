// AppHeader.js
import { useState, useEffect } from 'react';
import { ActionIcon, TextInput, Button, Group } from '@mantine/core';
import { ArrowLeft } from 'tabler-icons-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router v6 이상에서 페이지 이동을 위해 사용

export default function AppHeader({ selectedApp, onBack }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

    // 페이지 로드 시 세션 체크
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:8083/api/auth/session', {
                    withCredentials: true,
                });
                setLoggedInUser(response.data.username); // 세션에 저장된 유저 이름을 상태로 설정
            } catch (error) {
                console.log('세션이 만료되었거나 로그인되지 않았습니다.');
            }
        };

        checkSession();
    }, []);

    // 로그인 요청 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8083/api/auth/login',
                { username, password },
                { withCredentials: true } // 세션 쿠키를 위해 withCredentials 설정
            );
            alert(response.data); // 성공 메시지
            setLoggedInUser(username); // 로그인된 사용자 상태 업데이트
        } catch (error) {
            alert(error.response.data); // 실패 메시지
        }
    };

    // 로그아웃 요청 함수
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8083/api/auth/logout', {}, { withCredentials: true });
            setLoggedInUser(null);
            alert('로그아웃 성공');
            navigate('/'); // 로그아웃 후 첫 페이지로 이동
        } catch (error) {
            alert('로그아웃 실패');
        }
    };

    return (
        <Group position="apart" align="center" style={{ padding: '10px' }}>
            {selectedApp && (
                <ActionIcon
                    className="back-button"
                    onClick={onBack}
                    variant="outline"
                    color="blue"
                    size="lg"
                >
                    <ArrowLeft size={20} />
                </ActionIcon>
            )}

            {/* 로그인 UI */}
            {loggedInUser ? (
                <Group>
                    <span>{loggedInUser}님 환영합니다!</span>
                    <Button onClick={handleLogout} color="red">
                        로그아웃
                    </Button>
                </Group>
            ) : (
                <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
                    <TextInput
                        placeholder="test1,2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <TextInput
                        placeholder="12345"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Button type="submit" color="blue">
                        로그인
                    </Button>
                </form>
            )}
        </Group>
    );
}
