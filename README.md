<h2>$\huge{\rm{\color{	
#4682B4}ToDoList And Calendar App}}$</h2>
<br/>
<br/>
<br/>
<h3 id="프로젝트-소개">$\huge{\rm{\color{	
#4682B4}프로젝트 소개}}$</h3>
<br/>
___
<br/>
내가 할일 을 저장하는 ToDoList 와 일정 관리 캘린더로 이용하는 Calendar-App 을 만들었습니다.
<br/>
ToDoList 와 Calendar 앱은 하나의 리액트 앱에서 진행하되 각 컴포넌트를 나눠서 버튼식으로 나눠서 진행하였습니다.
<br/>
자세한 설명은 Front-End 폴더 안에 README에서 설명드리고 여기선 Back-End 에 대한 설명을 드리겠습니다.
<br/>
Back-End는 SpringBoot v3 을 이용하였습니다. 프레임워크 툴은 IntelliJ IDEA를 사용하였습니다.
<br/>

<p id="APP 설명">$\huge{\rm{\color{#4682B4}APP 설명}}$</p>

- **ToDoList**: ToDoList는 간단하게 제목, 작업 요약, 그리고 그 일을 해야할 시간을 넣었습니다. 그리고 컨트롤러에는 ToDo 생성, List불러오기, 삭제 API를 만들었습니다.
- **Calendar**: Calandar 앱은 일정추가 에 일정 제목, 시작하는 날짜 부터 끝나는 날짜까지 기간을 정할 수 있고, 알림을 띄울 수 있는 시간을 정할 수 있게 해두었습니다
<br/>
  또한 일정 수정 기능, 일정 목록을 한번에 볼수 있는 기능을 넣어 두었습니다. 
- **Share Controller**: 각 ToDoList와 Calendar 앱은 사용자들의 username을 검색하여 해당 사용자에게 본인이 공유하고 싶은 일정을 공유할 수 있습니다. 해당 기능은 DB의 Join 기능을 수행하여 처리 하였습니다.

  



