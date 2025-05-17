'use client'
import { useState } from "react";
import { usePromptREQ } from "./api/REST/prompt_req";
import { toast } from "react-toastify";

export default function Home() {
  // ~ Hooks 
    const [Prompt, setPrompt] = useState('');
    const [chat, setChat] = useState<{ user: string; bot: string }[]>([]);
    const promptMutation = usePromptREQ();
    const { mutate: PutPrompt, isPending, isError, isSuccess } = promptMutation
  // ~ Hooks 
  // ~ Logics 
    const handleSend = () => {
      if (!Prompt.trim()) return;
      const userPrompt = Prompt;
      setChat([...chat, { user: userPrompt, bot: '' }]);
      setPrompt('');
      // * PutPrompt
        PutPrompt(userPrompt, {
          onSuccess: (data: any ) => {
            if (data.error) {
              toast.error(data.error);
              setChat(prev =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 ? { ...msg, bot: data.error } : msg
                )
              );
              return;
            } else {
              setChat(prev =>
                prev.map((msg, idx) =>
                  idx === prev.length - 1 ? { ...msg, bot: data.response } : msg
                )
              );
              toast.success("Prompt sent successfully");
            }
          },
          onError: (error : any) => {
            setChat(prev =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 ? { ...msg, bot: "Sorry, something went wrong." } : msg
              )
            );
            toast.error("some thing went wrong : " + error.message)
          }
        });
        if(isError){
          toast.error("Error occurred while sending prompt");
        }
      // * PutPrompt
    };
  // ~ Logics 
  return (
    <div className=" font-mono font-bold flex md:w-[80%] w-[95%] max-w-[1000px] mx-auto flex-col items-center gap-5 justify-center min-h-screen ">
      {/* Header */}
        <h1 className="text-3xl font-bold text-sky-400 mb-4">Amr`s Chatbot</h1>
      {/* Header */}
      {/* Chat messages Area */}
        <div className="h-[60vh] w-full overflow-y-auto p-6 flex flex-col gap-4 ">
          {chat.length === 0 && (
            <div className="text-gray-400 text-center my-auto"></div>
          )}
          {chat.map((msg, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="self-end bg-sky-500 text-white px-4 py-2 rounded-lg max-w-[80%] shadow">
                {msg.user}
              </div>
              {msg.bot && (
                <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-[80%] shadow">
                  {msg.bot}
                </div>
              )}
            </div>
          ))}
          {isPending && (
            <div className="self-start flex items-center gap-2 text-sky-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Thinking...</span>
            </div>
          )}
        </div>
      {/* Chat messages Area */}
      {/* messages Input Area */}
        <div className="relative flex w-full mt-4">
          <textarea
            className="p-3 rounded-lg w-full bg-stone-900 border border-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none min-h-[48px]"
            placeholder="How can I help you..."
            value={Prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={isPending}
          />
          <button
            className="bg-sky-500 cursor-pointer hover:bg-sky-600 border border-sky-500 duration-300 text-white p-2 rounded-lg absolute top-1/2 translate-y-[-50%] right-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={isPending || !Prompt.trim()}
            >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : 'Submit'}
          </button>
        </div>
      {/* messages Input Area */}
    </div>
  );
}
