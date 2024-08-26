import { Input, Button} from 'antd';
import { useState } from 'react';
const { TextArea } = Input;

const Userinput = ( { loading , onSubmit}) => {
  const [userInput, setUserInput] = useState("");
  const handleUserInput = (e) => {
    if (e.target.value.trim() === "") {
      setUserInput("");
    } else {
      setUserInput(e.target.value);
    }
  }
  const handleClick = () => {
    if (userInput.trim() === "") {
      alert("채팅을 입력해주세요");
    } else {
      setUserInput("");
      onSubmit(userInput);
    }
  }

  const handleEnter = (e) => {
    if (e.nativeEvent.isComposing) {
      return;
    } else {
      if (e.key === 'Enter')  {
        handleClick();
      }
    }
    
  }


  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextArea value={userInput} onChange={
        handleUserInput} placeholder='채팅을 입력해주세요' onKeyDown={handleEnter}/>
      <Button style={{ height: '100%' }} loading={loading} onClick={handleClick} >전송</Button>
    </div>
  );
}

export default Userinput;