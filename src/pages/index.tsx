import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import SocketIO from 'socket.io-client'

type Sensor = {
  duration: number

  temperature: number
}

/**
 * HomePage component.
 */
export const HomePage: React.FC = () => {
  const [io] = useState(() => SocketIO('http://localhost:3001'))
  const [data, setData] = useState<Sensor[]>([])

  useEffect(() => {
    io.on('history', (history: Sensor[]) => {
      console.log('history', history)
      setData(() => history)
    })

    io.on('sensor', (sensor: Sensor) => {
      console.log('sensor', sensor)
      setData((data) => [...data, sensor])
    })
  }, [])

  return (
    <>
      <h1>Nature Remo Mini sensors</h1>
      <div className="graph-container">
        <Line
          data={{
            labels: data.map(({ duration }) => duration),
            datasets: [
              {
                label: 'temperature',
                data: data.map(({ temperature }) => temperature),
                backgroundColor: '#ffaaaa',
              },
            ],
          }}
        />
      </div>

      <style jsx>{`
        .graph-container {
          width: 800px;
        }
      `}</style>
    </>
  )
}

export default HomePage
