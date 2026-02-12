import { useEffect, useRef, useState } from "react"
//import { fetchMessages, sendMessage } from "../services/ChatApi.js"

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")
    const [user, setUser] = useState("")
    const socketRef = useRef(null)
  useEffect(() => {
  socketRef.current = new WebSocket(
    "ws://94.130.104.92:8083/fixauto-restapi/ws/chat/room_01"
  )

  socketRef.current.onmessage = (event) => {
    const message = JSON.parse(event.data)
    setMessages(prev => [...prev, message])
  }

  return () => {
    socketRef.current.close()
  }
}, [])

const handleSend = () => {
  const msg = {
    roomId: "room_01",
    sender: user,
    content: text,
    timestamp: new Date().toISOString()
  }
  if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    socketRef.current.send(JSON.stringify(msg))
  }
}
    return (
        <div>
            <div>
                {messages.map((m, i) => (
                    <div key={i}>
                        <b>{m.sender}:</b> {m.content}
                    </div>
                ))}
            </div>
            Sender: < input
                value={user}
                onChange={(e) => setUser(e.target.value)}
            /><br/>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    )
}