<h2>$\huge{\rm{\color{	
#4682B4}ToDoList And Calendar App}}$</h2>

<p>$\huge{\rm{\color{#4682B4}목차}}$</p>

- [프로젝트 소개](#프로젝트-소개)
- [APP 설명](#APP-설명)
- [소스 빌드 및 실행 방법 메뉴얼](#소스-빌드)
- [주력으로 사용한 컴포넌트에 대한 설명](#설명)

<br/>
<br/>
<h3 id="프로젝트-소개">$\huge{\rm{\color{	
#4682B4}프로젝트-소개}}$</h3>
<br/>
- 내가 할일 을 저장하는 ToDoList 와 일정 관리 캘린더로 이용하는 Calendar-App 을 만들었습니다.
<br/>
<br/>
- ToDoList 와 Calendar 앱은 하나의 React.js 에서 진행하되 각 컴포넌트를 나눠서 버튼식으로 나눠서 진행하였습니다.
<br/>
<br/>


<p id="APP-설명">$\huge{\rm{\color{#4682B4}APP-설명}}$</p>

- **ToDoList**: ToDoList 는 @Mantine 라이브러리를 활용하여
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
요소들을 디자인 하였습니다.
또한 Framer-Motion 라이브러리를 활용하여 인터렉티브한 페이지로 제작하였습니다.
- **Calendar**: Calandar 앱은 가장 대표적인 @fullcalendar 라이브러리를 활용하여 캘린더 UI를 만들었습니다. 또한 TodoList와의 css 혼동을 피하기 위해 Styled-components 를 활용하여 css를 정의 하였고,
react-tab을 활용하여 일정목록과 일정공유 탭을 구현하였습니다. 그리고 마찬가지로 Framer-Motion을 활용하여 Animation을 첨가 하였습니다.
<br/>
<br/>
<br/>
<br/>
<p id="소스-빌드">$\huge{\rm{\color{#4682B4}소스-빌드-및-실행-방법-메뉴얼}}$</p>

인텔리제이 IDEA 에서 소스 빌드 해주시길 바랍니다.

```bash
git clone https://github.com/Scarpula/Project_Clush.git
# IntelliJ 내부 터미널에서 git Clone 받으시고
# application 실행이나, SpringBoot 서버 실행으로 실행하시면 됩니다.
```

이후 cd src/main/Front-End 에 들어가서 npm install 해주시고 
Spring 서버 키신 후에 npm start 하셔서 port번호 3000번에서 
로그인 하시고 진행 하시면 됩니다.

회원 가입은 진행하지 않기 때문에 테스트용 아이디 
# test1 , 12345
# test2 , 12345 
의 아이디를 이용하여 테스트 해주시면 감사하겠습니다.

※ 로그인을 하지 않고 실행 할 경우 403 에 걸릴 수 있습니다.※
※ 반드시 로그인 하시고 테스트 부탁드리겠습니다.※

# ToDoList
1. 일정을 추가해보세요
2. 다크모드 를 사용해보세요
3. 일정을 클릭해서 상세보기를 확인 해보세요
4. 삭제기능을 사용해보세요
5. 일정 공유하기 기능을 사용해보세요
   1. 사용자를 검색합니다. ex) test1 아이디로 로그인 했을 경우
   2. test2를 검색합니다.
   3. 하단에 공유를 원하는 작업을 선택합니다.
   4. 작업 공유를 하면 test2로 로그인 했을때 공유한 작업이 나옵니다.

# Calendar
1. day를 클릭하여 일정을 추가해보세요
2. day를 drag 해서 일정기간 설정하여 일정을 추가해보세요
3. 추가된 일정을 눌러서 일정을 수정해보세요
4. 공유된 일정의 경우 상대 user에게도 수정된 일정으로 바뀝니다.
5. 일정을 삭제해보세요
   1. 공유된 일정은 삭제버튼을 누를경우 403 이 나옵니다.
6. 일정 공유 기능을 사용해보세요
   1. 사용자를 검색합니다. ex) test1 아이디로 로그인 했을 경우
   2. test2를 검색합니다.
   3. 하단에 공유를 원하는 작업을 선택합니다.
   4. 작업 공유를 하면 test2로 로그인 했을때 공유한 작업이 나옵니다.

<br/>
<br/>
<br/>


<p id="설명">$\huge{\rm{\color{#4682B4}주력으로-사용한-컴포넌트에-대한-설명}}$</p>
<br/>

## 1. CalendarContainer 컴포넌트 설명

`CalendarContainer`는 일정 관리 및 공유를 위한 주요 컴포넌트로, FullCalendar를 사용하여 이벤트를 시각적으로 표시하고, 사용자 간의 일정 공유 기능을 제공합니다. 이 컴포넌트는 다양한 기능과 애니메이션 효과를 통해 사용자 경험을 강화하며, 일정 관리와 관련된 모든 주요 작업을 처리할 수 있도록 설계되었습니다.

### 주요 기능

1. **캘린더 보기 (`FullCalendar`)**
   - `FullCalendar` 라이브러리를 사용하여 월간, 주간, 일간의 일정 뷰를 제공합니다. 사용자는 일정을 시각적으로 확인하고 관리할 수 있습니다.
   - 각 일정은 소유자와 공유 여부에 따라 색상이 다르게 표시되어, 시각적 구분이 용이합니다.

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
   - 새로운 일정을 추가하거나, 기존 일정을 수정할 수 있습니다. `EventModal`과 `EditModal`을 통해 사용자는 간편하게 일정을 추가하고 변경할 수 있습니다.
   - 모달 창을 활용하여 일정 입력 폼을 제공하고, 서버와의 비동기 요청을 통해 일정을 관리합니다.

3. **일정 목록 조회 (`EventList`)**
   - `EventList` 컴포넌트를 통해 현재 등록된 일정을 목록 형태로 조회할 수 있으며, 목록에서 직접 일정을 삭제할 수 있습니다.

4. **일정 공유 기능**
   - 사용자가 다른 사용자와 일정을 공유할 수 있는 기능을 제공합니다. 일정 공유 시, 검색된 사용자와 선택된 일정이 매핑되어 서버에 요청이 전송됩니다.
   - 사용자는 검색 필드를 통해 특정 사용자를 검색하고, 공유할 일정을 선택한 후 "일정 공유하기" 버튼을 클릭하여 공유를 완료할 수 있습니다.

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

5. **탭 UI를 통한 편리한 사용자 인터페이스**
   - Mantine의 `Tabs` 컴포넌트를 활용하여 캘린더, 일정 목록, 일정 공유 등 주요 기능을 탭으로 구분하여 제공합니다.
   - 각 탭에 해당하는 내용이 애니메이션과 함께 전환되어 사용자 경험을 높입니다.

6. **스타일링 및 애니메이션 (`Framer Motion` & `styled-components`)**
   - `styled-components`와 `Framer Motion`을 사용하여 각종 스타일링과 애니메이션 효과를 적용합니다. 일정 선택 시 부드러운 전환과 클릭 시 확대 효과 등을 제공하여 인터페이스의 생동감을 더했습니다.

### 사용 이유 및 목적

- **효율적인 일정 관리**: `CalendarContainer`는 직관적인 UI와 다양한 기능을 통해 사용자가 일정을 쉽게 추가, 수정, 삭제할 수 있도록 지원합니다. 캘린더 형식의 뷰는 사용자가 일정을 한눈에 파악하고 관리할 수 있는 환경을 제공합니다.
- **협업과 일정 공유**: 사용자 간의 협업을 촉진하기 위해 일정 공유 기능을 포함하고 있습니다. 이를 통해 팀원 간의 일정 공유가 용이하며, 프로젝트 관리의 효율성을 높입니다.
- **사용자 경험 향상**: `Framer Motion`을 활용한 애니메이션 효과와 다양한 컴포넌트 라이브러리의 조합을 통해 사용자 인터페이스를 더 직관적이고 매력적으로 만듭니다.
- **유연한 데이터 처리**: 각 일정은 서버와의 비동기 통신을 통해 실시간으로 관리되며, 사용자 간의 데이터 공유와 업데이트가 원활하게 이루어집니다. 

이 컴포넌트는 전체 애플리케이션에서 핵심적인 일정 관리 기능을 수행하며, 사용자 친화적인 인터페이스를 제공하여 서비스의 가치를 높이는 데 기여합니다.


<br/>
<br/>
<br/>




