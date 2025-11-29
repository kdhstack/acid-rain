// src/Game.jsx

import React, {useState, useEffect, useRef} from 'react';
import WordItem from './WordItem';
import InputArea from './InputArea';
import { clear } from 'localforage';

// 사용할 가상의 단어 데이터
const WORD_LIST = [
    {english: 'aspiring', korean: '열망하는', speed: 1.5},
    {english: 'roll-out', korean: '발표', speed: 1.2},
];

const Game = () => {
    // 1. 상태 관리: 떨어지는 단어 목록
    const [words, setWords] = useState([]);
    // 2. 상태 관리: 현재 점수
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    
    const wordIdRef = useRef(0); // 단어의 고유 ID

    const GAME_HEIGHT = 600;
    const MAX_X_POS = 400;
    const MAX_WORD_COUNT = 5; // 화면에 동시에 존재할 수 있는 최대 단어 수
    const WORD_ITEM_HEIGHT = 30;

    // 새 단어 생성 함수
    const generateNewWord = () => {
        // 화면에 단어가 너무 많으면 생성하지 않음
        if (words.length >= MAX_WORD_COUNT) return;

        // 랜덤으로 단어 선택
        const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
        const randomWordData = WORD_LIST[randomIndex];

        // 새로운 단어 객체 생성
        const newWord = {
            id: ++wordIdRef.current,
            english: randomWordData.english,
            korean: randomWordData.korean,
            xPos: Math.random() * MAX_X_POS,
            yPos: -1 * WORD_ITEM_HEIGHT, // 화면 위에서 시작
            speed: randomWordData.speed,
        };

        // 단어 목록 상태 업데이트
        setWords(prevWords => [...prevWords, newWord])
    }

    // 단어 낙하 로직
    useEffect(() => {
        if (gameOver) return;

        const gameDropLoop = setInterval(() => {
            
            // 1. 단어 생성 로직 실행(일정 간격마다) - ex) 50ms마다 20% 확률로 새 단어 생성 시도
            if (Math.random() < 0.2) {
                generateNewWord();
            }

            setWords(prevWords =>
                prevWords.map(word => {
                    // yPos를 속도만큼 증가시켜 땅에 떨어지게 한다.
                    return {...word, yPos: word.yPos + word.speed};
                 })
            );
        }, 50); // 50ms마다 업데이트 = 초당 20프레임

        return () => clearInterval(gameDropLoop);
    }, [gameOver, words]); // words.length를 넣어 단어 생성 후 루프가 자연스럽게 재시작

    useEffect(() => {
        if (gameOver || words.length === 0) return;

        let checkLoop;

        checkLoop = setInterval(() => {
            const wordHitTheGround = words.some(word =>
                word.yPos >= GAME_HEIGHT - (WORD_ITEM_HEIGHT * 1.9)
            );

            if (wordHitTheGround) {
                setGameOver(true);
                clearInterval(checkLoop);
            }
        }, 50);

        return () => clearInterval(checkLoop);
    }, [gameOver, words]);

    const handleAnswerSubmit = (submittedAnswer) => {
        if (gameOver) return;

        // 제출된 답변과 일치하는 단어를 찾음
        const matchedWordIndex = words.findIndex(word => word.korean.toLowerCase() === submittedAnswer.toLowerCase());

        if (matchedWordIndex !== -1) {
            setScore(prevScore => prevScore + 10); // 정답 처리
            setWords(prevWords => prevWords.filter((_, index) => index !== matchedWordIndex)); // 맞힌 단어는 화면에서 제거
        }
    }

    return (
        <div style = {{position : 'relative', width: '500px', margin: '20px auto'}}>
            <h2>Acid Rain - Score: {score}</h2>
            
            {/* 게임 영역 */}
            <div style = {{
                position: 'relative',
                height: `${GAME_HEIGHT}px`,
                border: '2px solid grey',
                overflow: 'hidden',
                backgroundColor: '#e6f0ff'
            }}>
                {words.map(word => (
                    <WordItem key = {word.id} word = {word} yPos = {word.yPos} />
                ))}

                {/* 게임 오버 메시지 추가 */}
                {gameOver && (
                    <div style = {{ /* ... 메시지 스타일 ... */}}>
                        <h3>Game Over!</h3>
                        <p>Score: {score}</p>
                        <button onClick={() => window.location.reload()}>Play Again</button>
                    </div>
                )}
            </div>
            
            {/* 입력 영역 추가 */}
            <div style = {{position: 'relative', width: '100%'}}>
                <InputArea
                    score={score}
                    onAnswerSubmit={handleAnswerSubmit}
                    disabled={gameOver}
                />
            </div>
        </div>
    );
}

export default Game;