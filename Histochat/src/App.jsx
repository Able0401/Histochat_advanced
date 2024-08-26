import { useState } from 'react'
import {CallGPT} from "./api/gpt"
import Userinput from './components/Userinput';
import styled from 'styled-components';
import {db} from './api/firebase'
import { collection, addDoc} from "firebase/firestore";

function App() {
  const [chatlog, setChatlog] = useState([]);
  
  const [user_name, setUserName] = useState("");
  const [user_interest, setUserInterest] = useState("");
  const [user_knowledge, setUserKnowledge] = useState("");
  const [user_name_flag, setUserNameFlag] = useState(false);

  const handleChat = (message1, message2) => {
    const chat = [
      { user: user_name, message: message1 },
      { user: "세종대왕", message: message2 },
    ];
    setChatlog(chatlog.concat(chat));
  };

  const [loading, setLoading] = useState(false);
  
  const handleClickAPICall = async (userInput) => {
    try {
      setLoading(true);
      const message = await CallGPT({ prompt: userInput, pastchatlog: chatlog , user_name: user_name, user_interest: user_interest, user_knowledge: user_knowledge});
      if (chatlog.length === 0) {
        handleChat("", message);
      } else {
        handleChat(userInput, message);
        addDoc(collection(db, user_name+"Advanced"), {
        chat_number : (chatlog.length)/2,
        input: userInput,
        output: message,
      });
      }
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
      setUserNameFlag(true);
      addDoc(collection(db, user_name+"Advanced"), {
        name: user_name,
        interest: user_interest,
        knowledge: user_knowledge
      });
      handleClickAPICall("안녕하세요");
    }
  };


  const chatlogArray = chatlog.map((chat, index) => {
    if (chat.message === "") {
      return null;
    }
    return (
      <div key={index} style={{ textAlign: chat.user === user_name ? "right" : "left", marginRight: "20px"}}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{chat.user}</div>
        <div style={{ background: chat.user === user_name ? "#C3C1C1" : "#8D8C8C", color : chat.user === user_name ? "#FFFFFF" : "#000000"
           ,padding: "10px", borderRadius: "10px", display: "inline-block", whiteSpace: "pre-line"}}>{chat.message}</div>
        <br />
      </div>
    );
  });
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    {user_name_flag ? (
        <AppConatiner>
        <h1>Histochat</h1>
        <div className="chatlog-container" style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px", width : "600px", maxHeight: "1000px", overflowY: "scroll" }}>
          <div className="chatlog">{chatlogArray}</div>  
        </div>
        <br/>
        <div className="input-container" style={{width : "620px"}}>
          <Userinput isloading={loading} onSubmit={handleSubmit} />
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
    </div>
  )

}
export default App;

const AppConatiner = styled.div`
  padding: 20px 20px 20px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 800px;
  width : 100%
  margin : 0 auto;
`;