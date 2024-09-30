import React from 'react';
import { parse, differenceInMinutes } from 'date-fns';
const TimeTable = ({ entries }) => {

  const calculateFee = (timeIn, timeOut) => {
    if (!timeOut) return 'Chưa tính';
    const inDate =  parse(timeIn, 'HH:mm:ss dd/MM/yyyy', new Date());
    const outDate = parse(timeOut, 'HH:mm:ss dd/MM/yyyy', new Date());
    const diffInMinutes =  differenceInMinutes(outDate, inDate);
    console.log(inDate);
  const price = Math.ceil(diffInMinutes/60 * 50000); // 50.000 đồng mỗi giờ
  return price + ' VND';
  };
  return (
    <table border="1" style={{ width: '80%',margin:'40px 150px', textAlign: 'center'}}>
      <thead>
        <tr>
          <th>Biển số xe</th>
          <th>Thời gian vào</th>
          <th>Thời gian ra</th>
          <th>Phí đỗ xe</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={index}>
            <td>{entry.licensePlate}</td>
            <td>{entry.timeIn}</td>
            <td>{entry.timeOut || 'Chưa rời bãi'}</td>
            <td>
              {entry.timeOut
                ? `${calculateFee(entry.timeIn, entry.timeOut)}`
                : 'Chưa tính'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimeTable;
