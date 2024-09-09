<h2>$\huge{\rm{\color{	
#4682B4}ToDoList And Calendar App}}$</h2>

<p>$\huge{\rm{\color{#4682B4}목차}}$</p>

- [프로젝트 소개](#프로젝트-소개)
- [APP 설명](#APP-설명)
- [소스 빌드 및 실행 방법 메뉴얼](#소스-빌드)

<br/>
<br/>
<h3 id="프로젝트-소개">$\huge{\rm{\color{	
#4682B4}프로젝트 소개}}$</h3>
<br/>
- 내가 할일 을 저장하는 ToDoList 와 일정 관리 캘린더로 이용하는 Calendar-App 을 만들었습니다.
<br/>
<br/>
- ToDoList 와 Calendar 앱은 하나의 리액트 앱에서 진행하되 각 컴포넌트를 나눠서 버튼식으로 나눠서 진행하였습니다.
<br/>
<br/>
- 자세한 설명은 Front-End 폴더 안에 README에서 설명드리고 여기선 Back-End 에 대한 설명을 드리겠습니다.
<br/>
<br/>
- Back-End는 SpringBoot v3 을 이용하였습니다. 프레임워크 툴은 IntelliJ IDEA를 사용하였습니다.
<br/>
<br/>

<br/>
<br/>

<p id="APP-설명">$\huge{\rm{\color{#4682B4}APP 설명}}$</p>

- **ToDoList**: ToDoList는 간단하게 제목, 작업 요약, 그리고 그 일을 해야할 시간을 넣었습니다. 그리고 컨트롤러에는 ToDo 생성, List불러오기, 삭제 API를 만들었습니다.
- **Calendar**: Calandar 앱은 일정추가 에 일정 제목, 시작하는 날짜 부터 끝나는 날짜까지 기간을 정할 수 있고, 알림을 띄울 수 있는 시간을 정할 수 있게 해두었습니다
  또한 일정 수정 기능, 일정 목록을 한번에 볼수 있는 기능을 넣어 두었습니다. 
- **Share Controller**: 각 ToDoList와 Calendar 앱은 사용자들의 username을 검색하여 해당 사용자에게 본인이 공유하고 싶은 일정을 공유할 수 있습니다. 해당 기능은 DB의 Join 기능을 수행하여 처리 하였습니다.
<br/>
<br/>
<br/>
<br/>
<p id="소스-빌드">$\huge{\rm{\color{#4682B4}소스 빌드 및 실행 방법 메뉴얼}}$</p>

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
2. 일정을 클릭해서 상세보기를 확인 해보세요
3. 삭제기능을 사용해보세요
4. 일정 공유하기 기능을 사용해보세요
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
# ERD Diagram

![ERD Diagram](src/main/resources/static/images/ERD_Diagram.png)

  



