import { useEffect, useState } from 'react'
import {CallGPT} from "./api/gpt"
import Userinput from './components/Userinput';
import styled from 'styled-components';
import {db} from './api/firebase'
import { collection, addDoc} from "firebase/firestore";

function App() {
  const [chatlog, setChatlog] = useState([]);
  const [data, setData] = useState("");
  
  const [user_name, setUserName] = useState("");
  const [user_interest, setUserInterest] = useState("");
  const [user_knowledge, setUserKnowledge] = useState("");
  const [user_name_flag, setUserNameFlag] = useState(false);

  const handleChat = (user1, user2, num) => {
    const chat = [
      {chat_number : num},
      { user: user_name, message: user1 },
      { user: "세종대왕", message: user2 },
    ];
    setChatlog(chatlog.concat(chat));
  };

  const [loading, setLoading] = useState(false);
  
  var chat_num = 1;

  const handleClickAPICall = async (userInput) => {
    try {
      setLoading(true);
      const message = await CallGPT({ prompt: userInput, pastchatlog: chatlog , user_name: user_name, user_interest: user_interest, user_knowledge: user_knowledge});
      handleChat(userInput, message);
      addDoc(collection(db, user_name+"Advanced"), {
        chat_number : (chatlog.length-1)/3 + 1,
        input: userInput,
        output: message,
      });
      chat_num +=1;
    } catch (error) {
      console.error(error);
    } finally { 
      setLoading(false);
    }
  };

  const handleSubmit = (userInput) => {
    console.log("user input", userInput);
    handleClickAPICall(userInput);
  };

  const handleUserNameInput = (e) => {
    setUserName(e.target.value);
  }

  const handleUserName = () => {
    if (user_name === "") {
      alert("이름을 입력해주세요");
      
    } else {
      setChatlog(chatlog.concat(user_name + "\n"));
      setUserNameFlag(true);
      addDoc(collection(db, user_name+"Advanced"), {
        name: user_name,
        interest: user_interest,
        knowledge: user_knowledge
      });
    }
  };


  const chatlogArray = chatlog.map((chat, index) => {
    return (
      <div key={index} style={{ textAlign: chat.user === user_name ? "left" : "right" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{chat.user}</div>
        <div style={{ background: chat.user === user_name ? "#e6e6e6" : "#f2f2f2", padding: "10px", borderRadius: "10px", display: "inline-block" }}>{chat.message}</div>
        <br />
      </div>
    );
  });
  return (
    <>
    <h1>Histochat</h1>
      {user_name_flag ? (
        <AppConatiner>
          <div className="chatlog-container" style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", maxHeight: "1000px", overflowY: "scroll" }}>
            <div className="chatlog">{chatlogArray}</div>  
          </div>
          <br/>
          <div className="input-container">
            <Userinput isloading={loading} onSubmit={handleSubmit}/>
          </div>
        </AppConatiner>
      ) : (
        <div>
          <h3>이름 관심있는 드라마 종류, 역사 지식을 얼마나 아는지를 입력해주세요</h3>
          <div>이름</div>
          <input type="text" value={user_name} onChange={handleUserNameInput}/>
          <br/>
          <br/>
          <div>
            <label htmlFor="interest">관심 있는 드라마 종류:</label>
            <select id="interest" value={user_interest} onChange={(e) => setUserInterest(e.target.value)}>
              <option value="">선택하세요</option>
              <option value="SF">SF</option>
              <option value="로맨스">로맨스</option>
              <option value="무협">무협</option>
              <option value="뮤지컬">뮤지컬</option>
              <option value="범죄">범죄</option>
              <option value="사극">사극</option>
              <option value="무협">무협</option>
              <option value="액션">액션</option>
              <option value="의학">의학</option>
              <option value="공포">공포</option>
            </select>
          </div>
          <br/>
          <div>
            <label htmlFor="knowledge">역사 지식 수준:</label>
            <select id="knowledge" value={user_knowledge} onChange={(e) => setUserKnowledge(e.target.value)}>
              <option value="">선택하세요</option>
              <option value="초보">초보</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
          </div>
          <br/>
          <button onClick={handleUserName}>입장</button>
        </div>
      )}
    </>
  )

}
export default App;

const AppConatiner = styled.div`
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width : 100%
  margin : 0 auto;
`;