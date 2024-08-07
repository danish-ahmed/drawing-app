'use client'
import {
    ReactSketchCanvas,
    type ReactSketchCanvasRef,
  } from "react-sketch-canvas";
  import { useRef, useState } from "react";
//   import { FaPenAlt } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { SlActionUndo, SlActionRedo } from "react-icons/sl";
import { TbPencilMinus,TbPencilOff,TbEraser,TbEraserOff } from "react-icons/tb";
import { SliderPicker } from 'react-color';
import { OpenAI } from "openai";
import { useSession } from "next-auth/react" 
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'


// import { OpenAIStream } from "ai";

export default function Canvas() {
  const router = useRouter()
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [color, setColor] = useState("#000");
  const [loading, setLoading] = useState(false);
  // const [response, setResponse] = useState('');
  const { data: session } = useSession()
  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };
  const handleColorChange = (newColor:any) => {
    setColor(newColor.hex)
  }

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  const handleExportImage = async() => {
    const openAi = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,dangerouslyAllowBrowser: true });
    // setLoading(true)
    canvasRef.current?.exportImage('jpeg').then(async(image) => {
        const completion:any = await openAi.chat.completions.create({

          model: "gpt-4o-mini",
      
          messages: [
      
            {
      
              role: "user",
      
              content: [
      
                {
      
                  type: "text",
      
                  text: `You are an expert in Drawings. Rate the following drawing of a "smile" based on composition, use of color, and message. Give me a final score from 0 to 999, with leonardo da vinci's monalisa having a score of 999 and an empty white drawing with a score of 0. Your output should be in the following OBJECT Format. {"composition": response,"composition_score": score,"use_of_color": response,"use_of_color_score": score,"message": response,"message_score": score, "final_score": final_score}`,
      
                },
      
                {
      
                  type: "image_url",
      
                  image_url: {
      
                    url: `${image}`,
      
                  },
      
                },
      
              ],
      
            },
      
          ],
      
          // stream: true,
      
          max_tokens: 1000,
      
        });
        // for await (const chunk of completion) {
        //   setResponse(prevResponse => prevResponse + chunk.choices[0]?.delta?.content);
        // }
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: image,
            // aiResponse:"The image appears to be a simplistic sketch with a couple of key elements. On the left side, there’s a roundish shape representing a face, with basic features: two dots for eyes, a small line for a mouth, and an uneven outline, giving it a playful, child-like quality. Adjacent to the face, there are some abstract lines that form a larger, undefined shape, which adds a sense of spontaneity to the overall composition. Overall, the sketch conveys a whimsical tone, capturing the essence of a child's imaginative expression. Given its simplicity and the distinct lack of detail, I would rate this sketch ** Marks 100/100 **. It's charming in its own right but lacks complexity and refinement.", 
            aiResponse:  JSON.parse(completion.choices[0]?.message?.content), 
            email: session?.user?.email 
          })
        };
        // console.log(requestOptions)
        // setResponse(completion.choices[0]?.message?.content);
        const ajaxResponse:any = await fetch("api/images", requestOptions);
        const data = await ajaxResponse.json();
        // router.push('http://localhost:3000/dashboard/profile')
        if(data){
          return router.push('dashboard/profile')
        }
        // if(data){
        // }
        // stream the response  
      
        // return OpenAIStream(completion);
      
      })
  };
  
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-1 mt-2 mb-2">
        <div>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            disabled={!eraseMode}
            onClick={handlePenClick}
          >
              {eraseMode ? <TbPencilOff/> : <TbPencilMinus />}
          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            disabled={eraseMode}
            onClick={handleEraserClick}
          >
            {eraseMode ? <TbEraser/> : <TbEraserOff />}
          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleUndoClick}
          >
            <SlActionUndo />

          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleRedoClick}
          >
            <SlActionRedo />
          </button>
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleResetClick}
          >
            <LuTimerReset />
          </button>
        </div>
        <div>
          <SliderPicker
            color={ color }
            onChangeComplete={ handleColorChange }
          />
        </div>
        
        {/* <div className="vr" /> */}
        
      </div>
      <h1>Canvas</h1>
      <ReactSketchCanvas ref={canvasRef}  height="30rem" strokeColor={color}/>
      <div className="grid grid-cols-2 gap-1 mt-2 mb-2">
      <button
          className="rounded-md bg-black px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleExportImage}
          disabled={loading}
        >
        Get AI Feedback
      </button>
      </div>
    </div>
  );
}
