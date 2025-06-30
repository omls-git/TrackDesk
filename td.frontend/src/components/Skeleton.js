import React from 'react'

const Skeleton = ({masterData}) => {
  return (
    <div>
          <table className="table">
            <thead>
              <tr>
                {masterData[0]
                  ? Object.keys(masterData[0]).map((key, idx) => (
                      <th key={idx}>
                        <div className="bg-secondary bg-opacity-25 rounded" style={{ height: 16, width: 80 }} />
                      </th>
                    ))
                  : Array.from({ length: 6 }).map((_, idx) => (
                      <th key={idx}>
                        <div className="bg-secondary bg-opacity-25 rounded" style={{ height: 16, width: 80 }} />
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {(masterData[0]
                    ? Object.keys(masterData[0])
                    : Array.from({ length: 6 })
                  ).map((_, colIdx) => (
                    <td key={colIdx}>
                      <div className="bg-secondary bg-opacity-10 rounded" style={{ height: 18, width: '100%' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  )
}

export default Skeleton