import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-toastify"

const promptREQ = async (prompt: string): Promise<string> => {
  // const res = await axios.post(`${process.env.BACK_END_URL}/agent`, { prompt });
  const res = await axios.post(`http://localhost:5000/agent`, { prompt });
  return res.data ;
}
export const usePromptREQ = ()  => {
  return useMutation({
    mutationFn: promptREQ ,
    onSuccess: (data: any) => {
      toast.success("Success: " + data)
    },
    onError: (error) => {
      toast.error("Error: " + error)
    }
  })
}