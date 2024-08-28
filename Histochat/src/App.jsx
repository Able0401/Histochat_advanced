import { useState } from 'react'
import {CallGPT} from "./api/gpt"
import Userinput from './components/Userinput';
import styled from 'styled-components';
import {db} from './api/firebasemodule';
import {doc, addDoc, setDoc, collection } from "firebase/firestore";

function App() {
  const persona = "세종대왕";
  const learning_obejctive = "훈민정음 창제에 관해 배우기";
  var [specific_learning_objective, setSpecificLearningObjective] = useState({
    "훈민정음 창제의 배경 배우기": [false, ""],
    "훈민정음 창제의 목적 배우기": [false, ""],
    "훈민정음 창제의 의의와 이로 인한 생활의 변화 배우기.": [false, ""]
  });
  const quiz = {
    "훈민정음의 창제 이유와 의미가 무엇인가?": "",
    "훈민정음의 창제 목적은 무엇인가?": "",
    "훈민정음이 창제된 이후 백성의 삶이 어떻게 바뀌었나": "",
  };

  const [chatlog, setChatlog] = useState([]);
  
  const [user_name, setUserName] = useState("");
  const [user_interest, setUserInterest] = useState("");
  const [user_name_flag, setUserNameFlag] = useState(false);

  const handleChat = (message1, message2) => {
    const chat = [
      { user: user_name, message: message1 },
      { user: persona, message: message2 },
    ];
    setChatlog(chatlog.concat(chat));
  };

  const [loading, setLoading] = useState(false);
  
  const handleClickAPICall = async (userInput) => {
    try {
      setLoading(true);
      const message = await CallGPT({ prompt: userInput, pastchatlog: chatlog , user_name: user_name,input_persona : persona, input_learning_obejctive : learning_obejctive, quiz : quiz});
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
      setDoc(doc(db, user_name + "Advanced", "Info"), {
        name: user_name,
        interest: user_interest,
        knowledge: specific_learning_objective,
        evaluation : {}
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
        <div style={{ background: chat.user === user_name ? "#8D8C8C" : "#C3C1C1", color : chat.user === user_name ? "#FFFFFF" : "#000000"
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
          <h3>이름과 관심있는 분야를 입력해주세요</h3>
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