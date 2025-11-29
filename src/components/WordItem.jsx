// src/components/WordItem.jsx

import React from 'react';

const WordItem = ({word, yPos}) => {
    // 단어의 위치를 yPos 값에 따라 설정합니다.
    const itemStyle = {
        position: 'absolute',
        left: `${word.xPos}px`, // xPos: 단어가 옆으로 얼마나 떨어져 있는지
        top: `${yPos}px`, // yPos: 단어가 위에서 얼마나 떨어져 있는지 (낙하 효과)
        padding: '8px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #333',
        borderRadius: '5px',
        fontSize: '1.2em',
        zIndex: 10,
    };

    return (
        <div style = {itemStyle}>
            {word.english}
        </div>
    );
}

export default WordItem;