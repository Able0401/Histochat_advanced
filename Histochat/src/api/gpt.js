export const CallGPT = async ({
  prompt,
  pastchatlog,
  user_name,
  user_interest,
  user_knowledge,
}) => {
  const persona = "세종대왕";
  const learning_obejctive = "한글 창제 과정 배우기";

  const user_data = {
    name: user_name,
    interest: user_interest,
    knowledge: user_knowledge,
  };
  const input = prompt;

  const chatlog = "이전대화: \n" + pastchatlog;

  const init_prompt1 = `너는 지금부터 ${persona}이야. 내가 묻는 질문들에 ${persona}이라고 생각하고 대답해줘. 말투는 ${persona}이 살았던 시대의 ${persona}이 할법한 말투로 해줘. 그리고 반드시 한국말로만 대답해줘.`;
  const init_prompt2 = `${persona}의 목표는 나에게 ${learning_obejctive}에 대해 대화를 통해 알려주는 거야. 모든 대화에서 이 목표를 반드시 기억해야해. 목표를 반드시 기억하되 말로 드러내지 말고 대화를 이어가면서 알려줘.`;

  const messages = [
    { role: "system", content: init_prompt1 },
    { role: "system", content: init_prompt2 },
    {
      role: "system",
      content:
        user_data.knowledge +
        "\n 의 역사 지식 수준에 맞춰서" +
        user_data.interest +
        "\n 의 드라마 취향에 맞춰서" +
        chatlog +
        "\n 이 이전 대화록에 이어서 " +
        input +
        "에 대한 답변을 해줘.",
    },
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
      temperature: 0.9,
    }),
  });
  const responseData = await response.json();

  const message = responseData.choices[0].message.content;

  return message;
};
