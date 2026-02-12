import { useState } from "react"

export default function CoudinaryUpload() {
    const [image, setImage] = useState(null)
    const handleUploadImage = async (e) => {

        const res = await fetch("http://localhost:8080/ongtec-api/api/generate-signature")
        const json = await res.json()
        
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append("file", file)
        formData.append("signature", json.signature)
        formData.append("api_key", json.apiKey)
        formData.append("timestamp", json.timestamp)

        const response = await fetch("https://api.cloudinary.com/v1_1/dqat5pmys/image/upload", {
            method: "POST",
            body: formData
        })
        const img = await response.json()
        setImage(img.secure_url)
    }
    return (
        <div>
            <input type="file" onChange={handleUploadImage} />
            {image ?
                <img src={image} alt="Uploaded" />
                : null}
        </div>
    )
}