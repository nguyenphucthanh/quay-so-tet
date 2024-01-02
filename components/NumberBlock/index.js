import React, { useState, useEffect, useRef } from 'react'

export default function NumberBlock({ init, number }) {
  const [numberString, setNumberString] = useState(`${init}`)

  useEffect(() => {
    if (number) {
      setNumberString(number)
    }
  }, [number])

  return (
    <div className={'bg-white rounded-2xl flex items-center justify-center pl-3 pr-3 mt-5 mb-5 lg:mt-10 lg:mb-10'}>
      <div className={'text-red-600 font-mono text-6xl md:text-8xl lg:text-9xl'}>
        { numberString }
      </div>
    </div>
  )
}

NumberBlock.defaultProps = {
  number: '9999'
}
