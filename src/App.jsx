import { useState } from 'react'
import './App.css'

function App() {
  const [quizData, setQuizData] = useState([])
  const [msg, setMsg] = useState('')
  const [start, setStart] = useState(false)
  const [loading, setLoading] = useState('')

  const checkAnswer = (opt) => {
    if (opt != quizData.answer) {
      setMsg(`Wrong, the answer is: ${quizData.answer}`)
    }

    else {
      setMsg(`you are correct! the answer is: ${quizData.answer}`)
    }
  }

  // Fungsi untuk mengacak isi array (algoritma Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
  }
  function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const fetchData = async () => {
    try {
      setLoading('Loading...')
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
      const data = await response.json()

      const options = [...data.results[0].incorrect_answers.map(ans => decodeHTML(ans)), decodeHTML(data.results[0].correct_answer)]
      const shuffledAnswers = shuffleArray(options);

      const quiz_data = {
        category: decodeHTML(data.results[0].category),
        question: decodeHTML(data.results[0].question),
        options: shuffledAnswers,
        answer: decodeHTML(data.results[0].correct_answer)
      }

      setMsg('')
      setStart(true)

      setQuizData(quiz_data)
    }

    catch (error) {
      setLoading(`Error occured: ${error}`)
    }

    finally {
      setLoading('')
    }
  }

  return (
    <>
      <div className="field">
        <h1>🐾 PawUiz 🐾</h1>

        <p>{!start ? '' : (<><strong>Category</strong>: {quizData.category}</>)}</p>
        <p>{loading ? <>{loading}</> : <>{quizData.question}</>}</p>
        {msg && <h2>{msg}</h2>}

        <div className="options">
          {quizData.options && quizData.options.map((opt, index) => (
            <button
              key={index}
              onClick={msg === '' ? () => checkAnswer(opt) : undefined}
              disabled={msg !== ''}
            >
              {opt}
            </button>
          ))}
        </div>

        <button onClick={fetchData}>Paw🐾Uiz</button>
      </div>
    </>
  )
}

export default App
