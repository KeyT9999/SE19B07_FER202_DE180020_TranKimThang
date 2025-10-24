import React from 'react';

import { useParams } from 'react-router-dom';


function UserProfile() {

// Lấy giá trị của tham số 'id' từ đường dẫn /users/:id

const { id } = useParams();


return (

<div>

<h2>Hồ sơ Người dùng</h2>

<p>ID người dùng hiện tại là: <strong>{id}</strong></p>

{/* Thực hiện fetch dữ liệu user từ backend dựa trên id này */}

</div>

);

}


export default UserProfile