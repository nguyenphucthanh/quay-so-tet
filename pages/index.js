import React, { useState, useCallback, useEffect } from 'react'
import random from 'lodash/random'
import NumberBlock from "../components/NumberBlock";

const backgrounds = [
  '/bg-01.jpg',
  '/bg-02.jpg',
  '/bg-03.jpg'
]

export default function Home() {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(9999)
  const [number, setNumber] = useState('')
  const [history, setHistory] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // cached list
    const cached = localStorage.getItem('quay-so')
    if (cached) {
      setHistory(JSON.parse(cached))
    }

    // cached background
    const bg = localStorage.getItem('background')
    document.body.style.backgroundImage = `url(${bg || 'bg-01.jpg'})`

    // cached max
    const cachedMax = localStorage.getItem('max') || 9999
    setMaxNumber(cachedMax)

    const cachedMin = localStorage.getItem('min') || 1
    setMinNumber(cachedMin)
  }, [])

  useEffect(() => {
    localStorage.setItem('quay-so', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem('max', max)
  }, [max])

  useEffect(() => {
    localStorage.setItem('min', min)
  }, [min])

  const setPageBackground = useCallback((bg) => {
    localStorage.setItem('background', bg)
    document.body.style.backgroundImage = `url(${bg})`
  }, [])

  const start = useCallback(() => {
    if (min >= max || min < 1 || max < 1) {
      alert('Min và Max chưa hợp lệ! Min phải >= 1.')
      return
    }
    if ((max - min + 1) === history.length) {
      alert('Đã hết số để quay!')
      return
    }
    setIsRunning(true)
    window.quaySoInterval = setInterval(() => {
      const numb = randomNumber(min, max, history)
      setNumber(numb)
    }, 20)
  }, [min, max, history])

  const stop = useCallback(() => {
    clearInterval(window.quaySoInterval)
    delete window.quaySoInterval

    const numb = randomNumber(min, max, history)
    setNumber(numb)
    setIsRunning(false)

    const newHistory = [...history, numb]
    setHistory(newHistory)
  }, [min, max, history])

  const randomNumber = useCallback((min, max, history) => {
    const r = random(min, max)
    let randomStr = `${r}`
    const maxStringLength = `${max}`.length

    while(randomStr.length < maxStringLength) {
      randomStr = '0' + randomStr
    }

    if (history.includes(randomStr)) {
      return randomNumber(min, max, history)
    } else {
      return randomStr
    }
  })

  const setMinNumber = useCallback((value) => {
    if (value) {
      setMin(parseInt(value, 10))
    } else {
      setMin(0)
    }
  }, [])

  const setMaxNumber = useCallback((value) => {
    if (value) {
      setMax(parseInt(value, 10))
    } else {
      setMax(9999)
    }
  }, [])

  const deleteHistory = useCallback(() => {
    setHistory([])
  }, [])

  const customBackground = useCallback((event) => {
    const file = event.target.files[0]
    if (file.size > 2 * 1024 * 1024) {
      alert('Xin vui lòng chọn file <= 2MB')
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
      document.body.style.backgroundImage = `url(${fileReader.result})`
      setPageBackground(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }, [])

  return (
    <div className={'mx-auto flex flex-col min-h-screen'}>
      <main className={'flex-grow flex flex-col items-center pt-5 lg:pt-10 pl-5 pr-5'}>
        <div className={'font-serif text-center text-yellow-300 bg-red-500 bg-opacity-75 p-3 md:p-5 rounded-xl mb-10 lg:mb-10 text-xl backdrop shadow-xl'}>
          Bốn mùa Chúa đổ hồng ân<br/>
          Ngài gieo màu mỡ ngập tràn lối đi.
        </div>
        <div className={'p-5 lg:p-10 bg-white bg-opacity-75 rounded-3xl shadow-2xl mb-10 flex flex-col items-center backdrop'}>
          <h1 className={'font-sans font-black text-2xl md:text-5xl text-center text-red-600'}>
            QUAY SỐ MAY MẮN
          </h1>

          <NumberBlock
            number={number}
            init={max}
          />

          {
            !isRunning && <button
              className={'transition-all rounded-full p-2 pl-10 pr-10 text-3xl bg-yellow-300 text-red-600 shadow hover:shadow-lg'}
              onClick={start}
            >
              QUAY SỐ!
            </button>
          }
          {
            isRunning && <button
              className={'transition-all rounded-full p-2 pl-10 pr-10 text-3xl bg-red-600 text-yellow-300 shadow hover:shadow-lg'}
              onClick={stop}
            >
              NGỪNG!
            </button>
          }
        </div>

        <div className={'bg-white bg-opacity-30 md:fixed right-1.5 top-10 w-full md:w-auto bottom-10 rounded-xl p-3 flex flex-col backdrop shadow-2xl'}>
          <h3 className={'font-sans font-black text-xl text-center'}>Lịch sử</h3>
          <div className={'mt-10 mb-10 flex-grow overflow-auto flex flex-nowrap flex-row md:flex-col'}>
            {
              history.map(h => (
                <div className={'bg-white rounded-full text-center text-2xl font-mono shadow mb-1 p-1 pl-2 pr-2 mr-3 md:mr-0'}>
                  { h }
                </div>
              ))
            }
          </div>
          <button className={'transition-all rounded-full p-2 pl-4 pr-4 text-xl bg-red-600 text-yellow-300 shadow hover:shadow-lg'} onClick={deleteHistory}>
            Xóa hết
          </button>
        </div>
      </main>

      <img
        src={'/Hay_Hoc_Voi_Toi.png'}
        className={'fixed left-0 top-20 w-1/5 h-auto hidden md:block'}
        width={1571}
        height={1938}
      />

      <footer className={'flex justify-start items-center pb-3 overflow-auto pl-5 pr-5 mt-5'}>
        <div className={'p-2 lg:p-4 pl-4 pr-4 rounded-full bg-white bg-opacity-30 backdrop shadow-xl mr-5 whitespace-nowrap'}>
          <label htmlFor={'number'} className={'text-xl lg:text-3xl mr-5 text-white'}>Min</label>
          <input type={'number'}
                 id={'number'}
                 className={'rounded-full text-xl lg:text-3xl font-mono text-center p-2 pl-3 pr-3 w-40 shadow-inner border-2 border-red-300 ring-2 ring-red-100'}
                 value={min}
                 min={1}
                 max={max}
                 onChange={(e) => setMinNumber(e.target.value)}
          />
        </div>

        <div className={'p-2 lg:p-4 pl-4 pr-4 rounded-full bg-white bg-opacity-30 backdrop shadow-xl mr-5 whitespace-nowrap'}>
          <label htmlFor={'number'} className={'text-xl lg:text-3xl mr-5 text-white'}>Max</label>
          <input type={'number'}
                 id={'number'}
                 className={'rounded-full text-xl lg:text-3xl font-mono text-center p-2 pl-3 pr-3 w-40 shadow-inner border-2 border-red-300 ring-2 ring-red-100'}
                 value={max}
                 min={min}
                 max={999999}
                 onChange={(e) => setMaxNumber(e.target.value)}
          />
        </div>
        <div className={'flex items-center p-2 lg:p-4 pl-4 pr-4 rounded-full bg-white bg-opacity-30 backdrop shadow-xl mr-5 whitespace-nowrap'}>
          {
            backgrounds.map(bg => (
              <div
                key={bg}
                className={'rounded w-10 h-10 bg-cover ring-2 ring-white cursor-pointer m-1 lg:m-2'}
                style={{ backgroundImage: `url(${bg})` }}
                onClick={() => setPageBackground(bg)}
              />
            ))
          }
          <label className={'ml-5 text-white relative'}>
            Tải lên
            <input
              type={'file'}
              style={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}
              accept={'image/jpg'}
              onChange={customBackground}
            />
          </label>
        </div>
      </footer>
    </div>
  )
}
