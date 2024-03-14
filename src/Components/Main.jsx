import React, { useEffect, useState, useRef } from 'react'
import { LuSendHorizonal } from "react-icons/lu";
import human from '../assets/human.png'
import bot from '../assets/bott.jpg'
import { Enter } from './Enter';


const API_KEY = import.meta.env.VITE_API_KEY;

const Main = () => {

    const endMsg = useRef(null);

    const[input,setInput]=useState("");
    const[allMessages, setAllMessages] = useState([]);
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        endMsg.current.scrollIntoView();
    },[allMessages])

    const handleSend = async () => {
        setLoading(true)
        const text = input;
        setInput('')

        let url = "https://api.openai.com/v1/chat/completions";
        let token = `Bearer ${API_KEY}`
        let model = 'gpt-3.5-turbo'

        let messagesToSend = [
            ...allMessages,{
                role: 'user',
                content: text
            }
        ]

        let res = await fetch(url, {
            method : 'POST',
            headers:{
                'Authorization' : token,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                model:model,
                messages : messagesToSend
            })
        })
        let resjson = await res.json()
        if(resjson){
            console.log(resjson)
            let newAllMessages = [
                ...messagesToSend,
                resjson.choices[0].message
            ]
            setAllMessages(newAllMessages)
            console.log(newAllMessages)
            
        }
        setLoading(false)
    }

    
    Enter(handleSend, 'Enter');
  return (
    <div className='main'>
        <div className="chatHeader">
            <h1 className='title'>Your Own AI</h1>
        </div>

        <div>
            {allMessages.length>0 
            ? 
            <div>
                <div className="scroll">
                {
                    loading === true ? <div className="loader"></div> : 
                    allMessages.map((item , index)=>{
                        return(
                            <div> 
                                <div key={index} className={item.role === 'user' ? "chat human" : "chat bot"}>
                                    <img className='chatimg' src={item.role === 'user' ? human : bot } alt="" />
                                    <p className="text">{item.content}</p>
                                </div>
                            </div>    
                        )
                    })
                }
                    <div ref={endMsg}/> 
                </div>    
            </div> 
            : 
            <div>
                <div className="chats">
                    {
                        loading === true ? <div className="loader"></div> :
                            <div className="chat bot default">
                                <img src={bot} alt="" className="chatimg" />
                                <h3 className='subtitle'>Hello, I am a language model AI assistant designed to help with a variety of tasks and provide information on a wide range of topics. I am here to assist you in any way I can, so please feel free to ask me any questions or give me any tasks you need help with.</h3>
                            </div>
                    }
                </div>
                <div ref={endMsg}/>
            </div>}
        </div>
        

        <div className="chatFooter">
            <div className="inp">
                <input type="text" placeholder='Ask something' value={input} onChange={(e)=>{setInput(e.target.value)}}/>
                <button className="send" onClick={handleSend}><LuSendHorizonal className='sendIcon'/></button>
            </div>
        </div>
    </div>
  )
}

export default Main