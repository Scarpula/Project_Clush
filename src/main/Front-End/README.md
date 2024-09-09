# $\huge{\rm{\color{#FF33FF}ToDoList\ And\ Calendar\ App}}$

## $\huge{\rm{\color{#FF33FF}목차}}$
- [프로젝트 소개](#프로젝트-소개)
- [APP 설명](#app-설명)
- [소스 빌드 및 실행 방법 메뉴얼](#소스-빌드-및-실행-방법-메뉴얼)
- [주력으로 사용한 컴포넌트에 대한 설명](#주력으로-사용한-컴포넌트에-대한-설명)

## $\huge{\rm{\color{#FF33FF}프로젝트\ 소개}}$

- **ToDoList와 Calendar App**은 할 일을 저장하고 일정 관리를 돕는 웹 애플리케이션입니다.
- React.js로 개발되었으며, 각 기능은 별도의 컴포넌트로 분리되어 버튼을 통해 구분됩니다.

## $\huge{\rm{\color{#FF33FF}APP\ 설명}}$

### $\bf{\large{\color{#FF33FF}ToDoList}}$
- **디자인 라이브러리**: `@Mantine`을 활용하여 버튼, 컨테이너, 텍스트, 타이틀, 모달, 텍스트 입력, 그룹, 카드, 액션 아이콘, 선택 요소를 디자인했습니다.
- **애니메이션**: `Framer Motion`을 사용하여 인터랙티브한 페이지로 제작했습니다.

### $\bf{\large{\color{#FF33FF}Calendar}}$
- **캘린더 UI**: `@fullcalendar` 라이브러리를 사용하여 캘린더 UI를 구현했습니다.
- **CSS 관리**: `Styled-components`로 ToDoList와의 스타일 충돌을 방지했습니다.
- **탭 UI**: `react-tab`을 사용하여 일정 목록과 일정 공유 탭을 구현했습니다.
- **애니메이션**: `Framer Motion`을 이용하여 애니메이션 효과를 추가했습니다.

## $\huge{\rm{\color{#FF33FF}소스\ 빌드\ 및\ 실행\ 방법\ 메뉴얼}}$

..
git clone https://github.com/Scarpula/Project_Clush.git
# IntelliJ 내부 터미널에서 git Clone 받으시고
# application 실행이나, SpringBoot 서버 실행으로 실행하시면 됩니다.
..

1. **IDE**: IntelliJ IDEA에서 소스를 빌드해 주세요.
2. **프로젝트 디렉토리 이동**: `cd src/main/Front-End`
3. **패키지 설치**: `npm install`
4. **서버 실행**: Spring 서버를 실행한 후 `npm start`로 애플리케이션을 실행합니다. (포트: 3000번)
5. **로그인**: 아래의 테스트용 계정으로 로그인해 주세요.
    - ID: `test1`, PW: `12345`
    - ID: `test2`, PW: `12345`

> **Note**: 로그인하지 않으면 403 에러가 발생할 수 있습니다. 반드시 로그인 후 테스트 바랍니다.

### $\bf{\large{\color{#FF33FF}ToDoList\ 사용법}}$
1. 일정을 추가해보세요.
2. 다크모드를 사용해보세요.
3. 일정을 클릭해서 상세보기를 확인해보세요.
4. 삭제 기능을 사용해보세요.
5. 일정 공유 기능을 사용해보세요.
   - 사용자를 검색합니다. (ex. `test1`로 로그인 시 `test2` 검색)
   - 공유할 작업을 선택하고 공유를 완료합니다.

### $\bf{\large{\color{#FF33FF}Calendar\ 사용법}}$
1. Day를 클릭하여 일정을 추가해보세요.
2. Day를 드래그하여 일정 기간을 설정해보세요.
3. 추가된 일정을 눌러서 수정해보세요.
4. 공유된 일정은 상대 사용자에게도 반영됩니다.
5. 일정 삭제 기능을 사용해보세요.
   - 공유된 일정은 삭제 시 403 에러가 발생합니다.
6. 일정 공유 기능을 사용해보세요.

## $\huge{\rm{\color{#FF33FF}주력으로\ 사용한\ 컴포넌트에\ 대한\ 설명}}$

### $\bf{\large{\color{#FF33FF}CalendarContainer\ 컴포넌트\ 설명}}$

`CalendarContainer`는 일정 관리 및 공유를 위한 주요 컴포넌트로, `FullCalendar`를 사용하여 이벤트를 시각적으로 표시하고, 사용자 간의 일정 공유 기능을 제공합니다.

#### $\bf{\large{\color{#FF33FF}주요\ 기능}}$
1. **캘린더 보기 (`FullCalendar`)**
   - 월간, 주간, 일간 뷰 제공.
   - 일정 소유자 및 공유 여부에 따라 색상 구분.

```javascript
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events.map((event) => ({
    ...event,
    backgroundColor: event.shared ? getSharedEventColor() : getColorByUsername(event.username),
    borderColor: event.shared ? getSharedEventColor() : getColorByUsername(event.username),
    extendedProps: {
      id: event.id,
      notificationTime: event.notificationTime,
      username: event.username,
      shared: event.shared,
    },
  }))}
  selectable={true}
  select={handleSelect}
  eventClick={handleEventClick}
  editable={true}
  dayCellClassNames={handleDayCellClassNames}
/>
```

2. **일정 추가 및 수정 (`EventModal` & `EditModal`)**
   - 모달 창을 통해 일정 추가 및 수정 가능.
   - 서버와 비동기 요청을 통해 일정 관리.

3. **일정 목록 조회 (`EventList`)**
   - 현재 등록된 일정을 목록 형태로 조회 및 삭제 가능.

4. **일정 공유 기능**
   - 특정 사용자를 검색 후, 일정 공유 가능.

```javascript
const handleShareEvent = async () => {
  if (!selectedEventId || !foundUser) {
    alert('일정과 공유할 사용자를 선택하세요.');
    return;
  }

  try {
    await axios.post(`http://localhost:8083/api/share/calendar/${selectedEventId}/share?username=${foundUser.username}`);
    alert('일정이 성공적으로 공유되었습니다.');
  } catch (error) {
    console.error('일정 공유 오류:', error);
    alert('일정 공유에 실패했습니다.');
  }
};
```

5. **탭 UI (`Mantine`의 `Tabs`)**
   - 캘린더, 일정 목록, 일정 공유 등의 주요 기능을 탭으로 제공.

6. **스타일링 및 애니메이션 (`Framer Motion` & `styled-components`)**
   - 생동감 있는 UI를 위해 애니메이션과 다양한 스타일 적용.

#### $\bf{\large{\color{#FF33FF}사용\ 이유\ 및\ 목적}}$
- **효율적인 일정 관리**: 직관적인 UI로 일정을 쉽게 관리 가능.
- **협업과 일정 공유**: 사용자 간 일정 공유 기능으로 협업 강화.
- **사용자 경험 향상**: 애니메이션과 스타일링으로 매력적인 UI 제공.
- **유연한 데이터 처리**: 서버와 비동기 통신으로 실시간 일정 관리.

`CalendarContainer`는 사용자 친화적인 인터페이스를 제공하며, 일정 관리와 협업 기능을 통해 애플리케이션의 가치를 높입니다.
