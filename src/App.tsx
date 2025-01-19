import { PropsWithChildren, useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCollatzSeries, getNext } from './collatz';
import './App.css'

export default function App() {
  const [start, setStart] = useState(789456123);
  const [series, setSeries] = useState([{ name: 0, value: 0 }]);
  useEffect(() => {
    if (start <= 2) {
      setSeries([]);
    }
    const collatzSeries = getCollatzSeries(start);
    setSeries(collatzSeries.map((value, index) => ({ name: index, value })));
  }, [start]);

  return (
    <div className="flex flex-col space-y-8 max-w-screen-lg">
      <h2 className="font-bold text-6xl">Collatz conjecture visualization</h2>

      <div className='flex flex-col space-y-4 max-w-screen-md place-self-center'>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <a target="_blank" href="https://www.youtube.com/watch?v=094y1Z2wpJg">Inspired by: The Simplest Math Problem No One Can Solve - Collatz Conjecture</a>
            <p>Made by <a href="https://github.com/thavixt">thavixt@github</a></p>
          </div>
          <p>The <strong>3n+1</strong> problem is a simple algorithm: start with any number for <strong>n</strong>:</p>
          <div className="flex flex-col items-start place-self-center">
            <li>if <strong>n</strong> is even, divide it by 2.</li>
            <li>if <strong>n</strong> is odd, multiply it by 3 and add 1.</li>
            <li>repeat...</li>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <blockquote cite="https://en.wikipedia.org/wiki/Collatz_conjecture">
              <p>This process will eventually reach the number 1, regardless of which positive integer is chosen initially. That is, for each <code>n</code>, there is some <code>i</code> with <code>n<sub>i</sub> = 1</code>.</p>
            </blockquote>
            <p>— Lothar Collatz  <cite><a target="_blank" href="https://en.wikipedia.org/wiki/Lothar_Collatz">Wikipedia</a></cite></p>
          </div>
          <p>All starting integer values up to <code>2<sup>68</sup> ≈ 2.95*10<sup>20</sup></code> have so far been proven to obey the <a target="_blank" href="https://en.wikipedia.org/wiki/Collatz_conjecture">Collatz conjecture</a>.</p>
        </div>

        <hr />
        <div className="flex place-self-center space-x-2">
          <p>To create a line graph of the Collatz series, select a starting integer:</p>
          <input
            className="w-32 rounded-lg text-center"
            type="number"
            onChange={(e) => setStart(parseInt(e.target.value))}
            defaultValue={start}
            min={2}
          />
        </div>

        <div className='width-container w-full h-64'>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={600}
              height={300}
              data={series}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              {/* <CartesianGrid stroke="whitesmoke" strokeDasharray="1 10" /> */}
              <XAxis dataKey="name" minTickGap={25} />
              <YAxis minTickGap={10} />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="value" type="monotone" stroke="#aa4455" animationDuration={500} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <details>
          <summary>{series.length} elements</summary>
          <code className="overflow-y-auto p-2">
            {'{ '}
            <InvertedText>{series[0].value}</InvertedText>
            {', '}
            {series.slice(1, -1).map((item) => item.value).join(', ')}
            {series.length > 2 && ', '}
            <InvertedText>{series.slice(-1)[0].value}</InvertedText>
            {' }'}
          </code>
        </details>
      </div>
    </div>
  )
}

function InvertedText({ children }: PropsWithChildren<{}>) {
  return <strong className="border rounded-lg p-[1px] text-slate-700 bg-slate-100">{children}</strong>
}

const CustomTooltip = (payload: any) => {
  if (payload?.payload?.[0]) {
    const index = payload?.payload?.[0].payload.name;
    const value = payload?.payload?.[0].value;

    return (
      <div className="text-sm border-2 rounded-md p-2 bg-slate-300 text-gray-950 flex flex-col place-items-end">
        <p>x: {index}</p>
        {/* <p className="italic">Previous: <strong>{getPrevious(value)}</strong></p> */}
        <p className="font-bold" style={{ color: payload?.payload?.[0].stroke }}>y: {value}</p>
        <p className="italic">next y: {getNext(value)}</p>
      </div>
    );
  }

  return null;
};
