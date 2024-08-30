import { db } from "./firebasemodule.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const CallGPT = async ({
  prompt,
  pastchatlog,
  user_name,
  input_persona,
  input_learning_obejctive,
}) => {
  const persona = input_persona;
  const learning_obejctive = input_learning_obejctive;

  const docRef = doc(db, user_name + "Advanced", "Info");
  const docSnap = await getDoc(docRef);

  const user_data = {
    name: user_name,
    interest: "",
    knowledge: "",
    // evaluation: quiz,
  };

  const input = prompt;

  const chatlog =
    "이전대화: \n" + pastchatlog.map((obj) => JSON.stringify(obj)).join("\n");

  const init_prompt1 = `너는 지금부터 ${persona}이야. 내가 묻는 질문들에 ${persona}이라고 생각하고 대답해줘. 말투는 ${persona}이 살았던 시대의 ${persona}이 할법한 말투로 해줘. 계속 그 말투를 유지해줘 그리고 반드시 한국말로만 대답해줘. 상대방이 반말을 한다면 예의를 갖추라고 하며 ${persona}의 시대적 위치에서 일반인에게 대하는 말투로 해줘}`;
  const init_prompt2 = `${user_data.name}와 앞으로 대화를 할것이고, ${user_data.name}는 중학생이야. ${persona}의 목표는 나에게 ${learning_obejctive}에 대해 대화를 통해 ${user_data.name}에게 알려주는 거야. 모든 대화에서 목표를 반드시 기억해야해. 목표를 반드시 기억하되 말로 드러내지 말고 대화를 이어가면서 이 목표를 달성하기 위해 대화해줘. 질문들도 적극적으로 해줘. `;
  // const init_prompt2 = `${persona}의 목표는 나에게 ${learning_obejctive}에 대해 대화를 통해 알려주는 거야. 그리고 세부 학습 목표는 ${JSON.stringify(
  //   user_data.knowledge
  // )}에 들어있고 각각 목표 달성 여부가 표시되어 있어.모든 대화에서 목표들을 반드시 기억해야해. 목표들을 반드시 기억하되 말로 드러내지 말고 대화를 이어가면서 이 목표들을 달성하기 위해 대화해줘. ${JSON.stringify(
  //   user_data.knowledge
  // )}를 참고해서 얼마나 각각의 목표를 알고 있는지 파악하기 위해 질문들을 적극적으로 해줘
  // 그리고 ${chatlog}와 ${JSON.stringify(
  //   user_data.knowledge
  // )}를 참고해서 다음 학습목표를 잡고 이를 달성하기 위해 대화를 이어나가줘.`;
  const init_prompt3 = `역사적 사실을 알려줄 때는 반드시 출처가 있어서 검증된 정보만을 알려줘. 검증하고 있다는 것을 이야기하면 안돼.`;
  const init_prompt5 = `${chatlog}가 이전 대화록이야 이 이전 대화록을 반영하고 참고해서 이서 ${input}에 대한 답변을 해줘. 반드시 이전 대화록에서 진행했던 대화와 다른 대화를 해야해. 이미 아는 정보는 물어보면 안돼. `;
  const step1_prompt = `${user_data.name}에게 ${learning_obejctive}에 대해 달성하기 위해 대화를 진행해야하고, 주도적으로 대화를 이어나가줘. 역으로 질문을 하는 게 좋다고 판단이 되면 역으로 질문을 해주고, ${user_data.name}이 대답을 하면 그에 대한 답변을 해줘. ${persona}가 겪었던 역경 3가지를 현재 시대에서 SNS에 올라올법한 이목이 끌리는 제목을 붙여서 옵션으로 제시해줘. 현재 시대에서 중학생이 흥미로워할만한 이라는 말은 대화에서 드러내면 안돼. 그리고 선택지와 함꼐 그 이야기를 선택한 이유와 그 이유가 지금 가지고 있는 고민이나 상황과도 연결되어 있는지에 대해서도 물어봐줘.`;
  const step2_prompt = `이름은 이미 알고 있으니 물어보지마. 상대방의 이름은 ${user_data.name}이야. 대화를 하면서 자연스럽게 ${user_data.name}의 고민거리들에 대해 파악해. 적나라하게 물어보지 말고 자연스럽게 대화 중간 중간에 질문하면서 조금씩 알아가고, 그 고민거리들을 토대로 ${user_data.name}에게 ${learning_obejctive}에 대해 달성하기 위해 대화를 진행해야하고, 주도적으로 대화를 이어나가줘. 역으로 질문을 하는 게 좋다고 판단이 되면 역으로 질문을 해주고, ${user_data.name}이 대답을 하면 그에 대한 답변을 해줘. ${chatlog}을 통해 ${persona}가 겪었던 역경 3가지를 중 상대방이 선택한 주제로 대화를 이어나가줘. ${user_data.name}의 관심사에 비유해서 역경을 설명해줘. 관심사에 비유하기 어렵거나 상대방이 이해하지 못한다면,  현재 시대의 중학생이 일상 생활에서 겪을법한 일들로 비유해서 이야기해줘도 돼. 아니면 다른 관심사를 물어봐도 되고 그것에 맞춰서 대화를 이해시켜줘. 어떤 것이 더 적절한지 상황에 맞춰 판단해서 대화를 이끌어줘. 그 역경을 한번에 알려주지 말고 조금씩 알려주고 이해시켜줘. 대화의 중간에 역사적 연도, 지명, 실제 사람, 사건들을 계속 넣어서 이야기를 해줘. 말로 드러내지 말고 상대방이 얼마나 이해했는지 파악하기 위해 질문을 적극적으로 해줘.이해하지 못한다고 생각되면 계획을 바꿔서 다른 방법으로 설명해줘. `;
  // const init_prompt6 = `${chatlog}가 이전 대화록이야. 이걸 보고 ${JSON.stringify(
  //   user_data.knowledge
  // )}가 얼마나 달성되었지 확인해보고 같은 형식으로 JSON으로 달성 여부를 표시해줘.`;
  // const init_prompt7 = `${quiz}에 있는 질문들 중 값이 없는 질문들을 순서대로 물어봐줘.`;
  // const init_prompt8 = `${chatlog}가 이전 대화록이야. 이걸 보고 ${JSON.stringify(
  //   quiz
  // )}가 얼마나 잘 답변되었는지 확인해보고, 답변에 따른 학생의 이해 정도에 따라 상, 중, 하 값을 넣어서 같은 형식으로 JSON으로 달성 여부를 표시해줘.`;

  if (pastchatlog.length === 0) {
    const messages = [
      { role: "system", content: init_prompt1 },
      { role: "system", content: init_prompt2 },
      { role: "system", content: init_prompt3 },
      // { role: "system", content: init_prompt4 },
      { role: "system", content: init_prompt5 },
      { role: "system", content: step1_prompt },
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
  } else {
    const messages = [
      { role: "system", content: init_prompt1 },
      { role: "system", content: init_prompt2 },
      { role: "system", content: init_prompt3 },
      // { role: "system", content: init_prompt4 },
      { role: "system", content: init_prompt5 },
      { role: "system", content: step2_prompt },
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
  }

  // else {
  //   if (Object.values(learning_obejctive).every((value) => value === true)) {
  //     const messages = [
  //       { role: "system", content: init_prompt1 },
  //       { role: "system", content: init_prompt2 },
  //       { role: "system", content: init_prompt3 },
  //       { role: "system", content: init_prompt4 },
  //       { role: "system", content: init_prompt5 },
  //       { role: "system", content: init_prompt7 },
  //       {
  //         role: "system",
  //         content:
  //           user_data +
  //           "\n 위에 제공한 유저 정보와" +
  //           chatlog +
  //           "\n 이 이전 대화록에 이어서 " +
  //           input +
  //           "에 대한 답변을 해줘.",
  //       },
  //       { role: "user", content: input },
  //     ];

  //     const back_messages = [
  //       { role: "system", content: init_prompt1 },
  //       { role: "system", content: init_prompt2 },
  //       { role: "system", content: init_prompt3 },
  //       { role: "system", content: init_prompt4 },
  //       { role: "system", content: init_prompt5 },
  //       { role: "system", content: init_prompt8 },
  //     ];

  //     const back_response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-4o",
  //           messages: back_messages,
  //           response_format: { type: "json_object" },
  //           temperature: 0.9,
  //         }),
  //       }
  //     );

  //     const back_responseData = await back_response.json();

  //     const back_message = JSON.parse(
  //       back_responseData.choices[0].message.content
  //     );

  //     await updateDoc(docRef, {
  //       evaluation: back_message,
  //     });

  //     console.log(docSnap.data().knowledge);
  //     const response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-4o",
  //           messages: messages,
  //           temperature: 0.9,
  //         }),
  //       }
  //     );
  //     const responseData = await response.json();

  //     const message = responseData.choices[0].message.content;

  //     return message;
  //   } else {
  //     const back_messages = [
  //       { role: "system", content: init_prompt1 },
  //       { role: "system", content: init_prompt2 },
  //       { role: "system", content: init_prompt3 },
  //       { role: "system", content: init_prompt4 },
  //       { role: "system", content: init_prompt5 },
  //       { role: "system", content: init_prompt6 },
  //     ];

  //     const back_response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-4o",
  //           messages: back_messages,
  //           response_format: { type: "json_object" },
  //           temperature: 0.9,
  //         }),
  //       }
  //     );

  //     const back_responseData = await back_response.json();

  //     const back_message = JSON.parse(
  //       back_responseData.choices[0].message.content
  //     );

  //     await updateDoc(docRef, {
  //       knowledge: back_message,
  //     });

  //     console.log(docSnap.data().knowledge);

  //     const messages = [
  //       { role: "system", content: init_prompt1 },
  //       { role: "system", content: init_prompt2 },
  //       { role: "system", content: init_prompt3 },
  //       { role: "system", content: init_prompt4 },
  //       { role: "system", content: init_prompt5 },
  //       { role: "user", content: input },
  //     ];

  //     const response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-4o",
  //           messages: messages,
  //           temperature: 0.9,
  //         }),
  //       }
  //     );
  //     const responseData = await response.json();

  //     const message = responseData.choices[0].message.content;
  //     return message;
  //   }
  // }
};
