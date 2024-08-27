import { db } from "./firebasemodule.js";

export const CallGPT = async ({
  prompt,
  pastchatlog,
  user_name,
  user_interest,
  user_knowledge,
  input_persona,
  input_learning_obejctive,
}) => {
  const persona = input_persona;
  const learning_obejctive = input_learning_obejctive;

  const user_data = {
    name: user_name,
    interest: user_interest,
    knowledge: user_knowledge,
  };
  const input = prompt;

  const chatlog = "이전대화: \n" + pastchatlog;

  const init_prompt1 = `너는 지금부터 ${persona}이야. 내가 묻는 질문들에 ${persona}이라고 생각하고 대답해줘. 말투는 ${persona}이 살았던 시대의 ${persona}이 할법한 말투로 해줘. 그리고 반드시 한국말로만 대답해줘. 그리고 스스로를 짐이라고 하지 말고 과인이라고 칭해줘.`;
  const init_prompt2 = `${persona}의 목표는 나에게 ${learning_obejctive}에 대해 대화를 통해 알려주는 거야. 그리고 세부 학습 목표는 ${user_data.knowledge}에 들어있고 각각 목표 달성 여부가 표시되어 있어. 모든 대화에서 목표들을 반드시 기억해야해. 목표들을 반드시 기억하되 말로 드러내지 말고 대화를 이어가면서 이 목표들을 달성하기 위해 대화해줘.`;
  const init_prompt3 = `역사적 사실을 알려줄 때는 반드시 출처가 있어서 검증된 정보만을 알려줘. 검증하고 있다는 것을 이야기하면 안돼.`;
  const init_prompt4 = `${user_data.name}이라는 이름을 가진 사람이 ${user_data.interest} 종류의 드라마에 관심이 많다는 것을 알고 있어. 이 정보를 토대로 ${user_data.name}에게 ${learning_obejctive}에 대해 달성하면서 역사 공부를 시키기 위해 대화를 진행해야하고, 주도적으로 대화를 이어나가줘. 역으로 질문을 하는 게 좋다고 판단이 되면 역으로 질문을 해주고, ${user_data.name}이 대답을 하면 그에 대한 답변을 해줘.`;
  const init_prompt5 = `${chatlog}가 이전 대화록이야 이 이전 대화록을 반영하고 참고해서 이서 ${input}에 대한 답변을 해줘. 이미 아는 정보는 물어보면 안되.`;

  const messages = [
    { role: "system", content: init_prompt1 },
    { role: "system", content: init_prompt2 },
    { role: "system", content: init_prompt3 },
    { role: "system", content: init_prompt4 },
    { role: "system", content: init_prompt5 },
    { role: "user", content: input },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 400,
      temperature: 0.5,
    }),
  });
  const responseData = await response.json();

  const message = responseData.choices[0].message.content;

  return message;
};
