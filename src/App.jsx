import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [quizData, setQuizData] = useState([])
  const [msg, setMsg] = useState('')
  const [start, setStart] = useState(false)
  const [loading, setLoading] = useState('')
  const categorysRef = useRef()
  const modeRef = useRef()

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      setLoading('Loading...')

      let url = `https://opentdb.com/api.php?amount=1&category=${categorysRef.current.value}`
      if (modeRef.current.value != '') {
        url += `&type=${modeRef.current.value}`
      }
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.')
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
      }

      const data = await response.json()

      let options = []
      if (data.results[0].type == 'boolean') {
        options = ['True', 'False']
      } else {
        options = [...data.results[0].incorrect_answers.map(ans => decodeHTML(ans)), decodeHTML(data.results[0].correct_answer)]
        options = shuffleArray(options);
      }

      const quiz_data = {
        category: decodeHTML(data.results[0].category),
        question: decodeHTML(data.results[0].question),
        options: options,
        answer: decodeHTML(data.results[0].correct_answer)
      }

      setMsg('')
      setStart(true)

      setQuizData(quiz_data)
      setLoading('')
    }

    catch (error) {
      setLoading(`Error occured: ${error.message}`)
      console.error(error);
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

        <div className="wrapper">
          <select ref={modeRef}>
            <option value="">Any Type</option>
            <option value="multiple">Multiple Choices</option>
            <option value="boolean">True or False</option>
          </select>

          <select ref={categorysRef}>
            <option value="0">Any Category</option>
            <option value="9">General Knowledge</option>
            <option value="10">Entertainment: Books</option>
            <option value="11">Entertainment: Film</option>
            <option value="12">Entertainment: Music</option>
            <option value="13">Entertainment: Musicals & Theathers</option>
            <option value="14">Entertainment: Television</option>
            <option value="15">Entertainment: Video Games</option>
            <option value="16">Entertainment: Board Games</option>
            <option value="17">Science & Nature</option>
            <option value="18">Science: Computers</option>
            <option value="19">Science: Mathematics</option>
            <option value="20">Mythlogy</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
            <option value="24">Politics</option>
            <option value="25">Art</option>
            <option value="26">Celebrities</option>
            <option value="27">Animals</option>
            <option value="28">Vehicles</option>
            <option value="29">Entertainment: Comics</option>
            <option value="30">Science: Gadgets</option>
            <option value="31">Entertainment: Japanese Anime & Manga</option>
            <option value="32">Entertainment: Cartoon & Animations</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default App
