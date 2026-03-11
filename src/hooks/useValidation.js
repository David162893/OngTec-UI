import { useState, useEffect } from "react"

export default function useValidation(value, type) {
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[0-9]{7,15}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  }

  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (!value) {
      setIsValid(true) // vacío no marca error
    } else if (patterns[type]) {
      setIsValid(patterns[type].test(value))
    }
  }, [value, type])

  return isValid
}