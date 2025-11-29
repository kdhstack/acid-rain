// src/components/InputArea.jsx

import React, {useState} from 'react';

// Game.jsx로부터 score와 onAnswerSubmit 함수를 prop으로 받음
const InputArea = ({score, onAnswerSubmit, disabled}) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지 
        
        // 입력 값이 비어있지 않고, 게임 오버가 아닌 상태에서만 처리
        if (inputValue.trim() !== '' && !disabled) {
            // 입력된 한국어 뜻을 부모 컴포넌트(Game.jsx)로 전달
            onAnswerSubmit(inputValue.trim());
            setInputValue(''); // 입력창 초기화
        }
    };

    return (
        <div style = {{padding: '20px', backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc'}}>
            <h3>Current Score: {score}</h3>
            <form onSubmit = {handleSubmit}>
                <input
                    type = "text"
                    value = {inputValue}
                    onChange={handleChange}
                    placeholder={disabled ? "Restart the game" : "Enter the Korean meaning of the word"}
                    style = {{width: '80%', padding: '10px', fontSize: '1em'}}
                    autoFocus // 게임 시작 시 바로 입력할 수 있도록 포커스 설정
                    disabled = {disabled}
                />
                <button
                    type = "submit"
                    style = {{padding: '10px', fontSize: '1em', marginLeft: '10px'}}
                    disabled = {disabled} // 게임 오버 시 버튼 비활성화
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default InputArea;