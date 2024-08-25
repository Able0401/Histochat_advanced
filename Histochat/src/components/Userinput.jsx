import { Input, Button} from 'antd';
import { useState } from 'react';
const { TextArea } = Input;

const Userinput = ( { loading , onSubmit}) => {
  const [userInput, setUserInput] = useState("");
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  }
  const handleClick = () => {
    if (userInput === "") {
      alert("채팅을 입력해주세요");
    } else {
      setUserInput("");
      onSubmit(userInput);

    }
  }


  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextArea value={userInput} onChange={handleUserInput} placeholder='채팅을 입력해주세요'/>
      <Button style={{ height: '100%' }} loading={loading} onClick={handleClick} >전송</Button>
    </div>
  );
}

export default Userinput;