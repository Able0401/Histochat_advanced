import { useState } from 'react'
import {CallGPT} from "./api/gpt"
import Userinput from './components/Userinput';
import styled from 'styled-components';
import {db} from './api/firebasemodule';
import {doc, addDoc, setDoc, collection } from "firebase/firestore";

function App() {
  const persona = "나폴레옹";
  // const learning_obejctive = `${persona}에게 개혁을 추진하면서 했던 선택들과 그 과정에서 고민했던 것들을 듣고 이유 알아보기`;
  const learning_obejctive = `${persona}겪었던 역경과 그 어려움 속에서 왜 이런 선택을 했고 무슨 생각으로 했으며, 그 결과는 무엇이었는지, 그걸 어떻게 극복했는지 이해해보자.`;
  // var [specific_learning_objective, setSpecificLearningObjective] = useState({
  //   "나폴레옹이 살던 시대 배경을 배우기": [false, ""],
  //   "나폴레옹의 성격을 배우기": [false, ""],
  //   //".": [false, ""]
  // });
  // const quiz = {
  //   "훈민정음의 창제 이유와 의미가 무엇인가?": "",
  //   "훈민정음의 창제 목적은 무엇인가?": "",
  //   "훈민정음이 창제된 이후 백성의 삶이 어떻게 바뀌었나": "",
  // };

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
      const message = await CallGPT({ prompt: userInput, pastchatlog: chatlog , user_name: user_name,input_persona : persona, input_learning_obejctive : learning_obejctive});
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
        knowledge: "",
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
        <br />
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{chat.user}</div>
        <div style={{ background: chat.user === user_name ? "#8D8C8C" : "#E8E8E8", color : chat.user === user_name ? "#FFFFFF" : "#000000"
           ,padding: "10px", borderRadius: "10px", display: "inline-block", whiteSpace: "pre-line"}}>{chat.message}</div>
        <br />
      </div>
    );
  });
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    {user_name_flag ? (
        <AppConatiner>
        <div className="chatlog-container" style={{ borderRadius: "5px", padding: "10px", width : "600px", overflowY: "scroll" }}>
          <div className="chatlog">{chatlogArray}</div>  
        </div>
        <br/>
        <div className="input-container" style={{width : "620px"}}>
          <Userinput isloading={loading} onSubmit={handleSubmit} />
        </div>
      </AppConatiner>
      ) : (
        <div>
          <h3>이름을 입력해주세요</h3>
          <input type="text" value={user_name} onChange={handleUserNameInput}/>
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