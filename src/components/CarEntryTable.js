// components/CarEntryTable.js
import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import axios from 'axios';
import TimeTable from'./TimeTable';
import './carentrytable.css'
const CarEntryTable = () => {
  const [entries, setEntries] = useState([]);
  const [licensePlate, setLicensePlate] = useState(''); // Biển số xe
  const [exitLicensePlate, setExitLicensePlate] = useState(''); // Biển số xe ra

  const handleCapture = async (imageBlob) => {
    const timeIn=new Date().toLocaleString('vi-VN',{ hour12: false ,  timeZone: 'Asia/Ho_Chi_Minh'})
    const formData = new FormData();
    formData.append('licensePlate', licensePlate);
    formData.append('timeIn', timeIn);
    formData.append('image', imageBlob); // Đưa ảnh vào form

    try {
      const response = await axios.post('http://localhost:5000/entries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newEntry = response.data.entry;
      setEntries([...entries, newEntry]);

      alert('Xe vào bãi thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };
  const handleExit = async () => {
    const timeOut=new Date().toLocaleString('vi-VN',{ hour12: false ,  timeZone: 'Asia/Ho_Chi_Minh'})
    try {
      const response = await axios.put('http://localhost:5000/entries/exit', {
        licensePlate: exitLicensePlate,
        timeOut:timeOut
      });

      if (response.data.success) {
        alert(`Xe có biển số ${exitLicensePlate} đã rời bãi`);
        const updatedEntry = response.data.entry;
        setEntries(entries.map(entry => 
          entry.licensePlate === exitLicensePlate ? updatedEntry : entry
        ));
      } else {
        alert('Không tìm thấy xe với biển số này!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thời gian ra:', error);
    }
  };

  return (
    <div>
    <div className='flex-container'>
      <div className="table-container">
      <table border='1'>
        <thead>
        <tr>
            <th colSpan={3}>Xe vào</th>
          
          </tr>
          <tr>
            <th>Biển số xe</th>
            <th>Webcam</th>
            <th>Ảnh đã chụp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="Nhập biển số xe"
              />
            </td>
            <td>
              <WebcamCapture onCapture={handleCapture} />
            </td>
            <td>
              {entries.map((entry, index) => (
                <img key={index} src={`http://localhost:5000${entry.imagePath}`} alt="Chụp lại" />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <hr/>
      </div>
      <div className="table-container">
      <table border="1">
        <thead>
        <tr>
            <th colSpan={3}>Xe ra</th>
          
          </tr>
          <tr>
            <th>Biển số xe</th>
            <th>Webcam</th>
            <th>Ảnh đã chụp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
      <td>
      <input
        type="text"
        value={exitLicensePlate}
        onChange={(e) => setExitLicensePlate(e.target.value)}
        placeholder="Nhập biển số xe ra"
      />
      <button onClick={handleExit}>Xe ra</button>
      </td>
      <td>
              {/* <WebcamCapture /> */}
            </td>
            <td>
              {/* {entries.map((entry, index) => (
                <img key={index} src={`http://localhost:5000${entry.imagePath}`} alt="Chụp lại" /> */}
              {/* ))} */}
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      </div>
      </div>
      <div style={{display:'inline',textAlign:"center",paddingLeft:"100px"}}>
    
           <h3>Thông tin vào/ra và tính tiền</h3>
          <TimeTable entries={entries} />
        
   
    </div>
    </div>
    
  );
};

export default CarEntryTable;
