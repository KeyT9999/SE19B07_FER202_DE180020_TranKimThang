/*
 * COMPONENT: LightSwitchComponents.jsx
 * MỤC ĐÍCH: Minh họa useState với boolean state và toggle logic
 * 
 * LUỒNG CHUẨN TOGGLE STATE:
 * 1. Khởi tạo boolean state (true/false)
 * 2. Tạo toggle function sử dụng ! operator
 * 3. Conditional rendering dựa trên state
 * 4. Dynamic styling dựa trên state
 */

// Import React và useState hook
import React, { useState } from 'react';
// Import Button component từ React Bootstrap
import Button from 'react-bootstrap/Button';

function LightSwitch() {
    /*
     * KHỞI TẠO BOOLEAN STATE:
     * - isLightOn: trạng thái đèn (true = bật, false = tắt)
     * - setIsLightOn: function để thay đổi trạng thái
     * - false: giá trị khởi tạo (đèn tắt)
     */
    const [isLightOn, setIsLightOn] = useState(false);  
    
    /*
     * TOGGLE FUNCTION:
     * Sử dụng ! operator để đảo ngược giá trị boolean
     * !true = false, !false = true
     */
    const toggleLight = () => setIsLightOn(!isLightOn);
    /*
     * STYLING OBJECT:
     * Object chứa các style chung cho button
     */
    const buttonStyle = {  
        margin: '5px',
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    };
    
    /*
     * RETURN JSX với CONDITIONAL RENDERING và DYNAMIC STYLING:
     */
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>     
            <h2>Công Tắc Đèn</h2>
            {/* 
             * CONDITIONAL RENDERING:
             * Sử dụng ternary operator (? :) để hiển thị text khác nhau
             * dựa trên giá trị isLightOn
             */}
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Đèn hiện đang: {isLightOn ? 'Bật' : 'Tắt'}  
            </p>
            {/* 
             * REACT BOOTSTRAP BUTTON với DYNAMIC STYLING:
             * - onClick: gọi toggleLight function
             * - background: thay đổi màu dựa trên isLightOn (red/green)
             * - Text: thay đổi dựa trên isLightOn
             */}
            <Button
                onClick={toggleLight}   
                style={{ 
                    ...buttonStyle,
                    background: isLightOn ? 'red' : 'green',  // Đỏ khi bật, xanh khi tắt
                    color: 'white'
                }}  
            >
                {isLightOn ? 'Tắt Đèn' : 'Bật Đèn'}  // Text thay đổi theo trạng thái
            </Button>   
        </div>
    );
}
export default LightSwitch;