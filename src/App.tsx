import { useCallback, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { getCollatzSeries, getNext } from './collatz';
import './App.css'
import { ANIMATION_DURATION_MS, DEFAULT_COUNT_MAP, DEFAULT_SEED, TIMER_DURATION_MS } from './utils';


export default function App() {
  const [seedNumber, setSeedNumber] = useState(DEFAULT_SEED);
  const [encounteredSeedNumbers, setEncounteredSeedNumbers] = useState(new Set<number>());

  const [series, setSeries] = useState([{ name: 0, value: 0 }]);
  const [logSeries, setLogSeries] = useState([{ name: 0, value: 0 }]);
  const [logAverage, setLogAverage] = useState(0);

  const [lengthBySeed, setLengthBySeed] = useState<{ seed: number, length: number }[]>([]);
  const [countByLeadingDigit, setCountByLeadingDigit] = useState(DEFAULT_COUNT_MAP);

  const [timer, setTimer] = useState(0);

  const automate = useCallback(() => {
    setTimer(setInterval(() => {
      setSeedNumber(n => n + 1);
    }, TIMER_DURATION_MS));
  }, []);
  const stopAutomation = useCallback(() => {
    clearInterval(timer);
    setTimer(0);
  }, [timer]);

  useEffect(() => {
    if (!seedNumber) {
      setSeries([]);
      setLogSeries([]);
      setLogAverage(0);
      setLengthBySeed([]);
      return;
    }

    const collatzSeries = getCollatzSeries(seedNumber);
    setSeries(collatzSeries.map((value, index) => ({ name: index, value })));

    setLogSeries(collatzSeries.map((value, index) => ({ name: index, value: Math.log(value) })));
    const average = logSeries.reduce((prev, cur) => prev + cur.value, 0) / logSeries.length;
    setLogAverage(average);

    if (lengthBySeed.findIndex(v => v.length === series.length) === -1) {
      setLengthBySeed(prev => [
        ...prev,
        { seed: seedNumber, length: series.length }
      ]);
    }

    if (!encounteredSeedNumbers.has(seedNumber)) {
      setEncounteredSeedNumbers(prev => {
        const values = prev.values();
        return new Set([...values, seedNumber]);
      });

      setCountByLeadingDigit(p => {
        const nextMap = new Map(p.entries());
        collatzSeries.forEach(v => {
          const leading = +v.toString()[0];
          nextMap.set(leading, (nextMap.get(leading) ?? 0) + 1);
        })
        return nextMap;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedNumber]);

  const countByLeadingDigitData = Array.from(countByLeadingDigit.entries()).map(([leading, count]) => ({
    leading,
    count,
  }));

  return (
    <div className="flex flex-col space-y-8 max-w-screen-xl text-sm">
      <h2 className="font-bold text-6xl">Collatz conjecture visualization</h2>

      <div className='flex flex-col space-y-4 max-w-screen-lg place-self-center'>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <a target="_blank" href="https://www.youtube.com/watch?v=094y1Z2wpJg">Inspired by: The Simplest Math Problem No One Can Solve - Collatz Conjecture</a>
              <p>Made by <a href="https://github.com/thavixt">thavixt@github</a></p>
            </div>
            <p>The <strong>3n+1</strong> problem is a simple algorithm: start with any number for <strong>n</strong>:</p>
            <div className="flex flex-col items-start place-self-center">
              <li>if <strong>n</strong> is even, divide it by 2.</li>
              <li>if <strong>n</strong> is odd, multiply it by 3 and add 1.</li>
              <li>repeat... <i>until reaching the 4-2-1 loop</i></li>
            </div>
            <p>All starting integer values up to <code>2<sup>68</sup> ≈ 2.95*10<sup>20</sup></code> have so far been proven to obey the <a target="_blank" href="https://en.wikipedia.org/wiki/Collatz_conjecture">Collatz conjecture</a>.</p>
          </div>

          <div className="flex flex-col place-self-center space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <blockquote cite="https://en.wikipedia.org/wiki/Collatz_conjecture">
                <p>This process will eventually reach the number 1, regardless of which positive integer is chosen initially. That is, for each <code>n</code>, there is some <code>i</code> with <code>n<sub>i</sub> = 1</code>.</p>
              </blockquote>
              <p>— Lothar Collatz  <cite><a target="_blank" href="https://en.wikipedia.org/wiki/Lothar_Collatz">Wikipedia</a></cite></p>
            </div>
            <div className='flex flex-col space-y-2 items-center'>
              <p>To create some infographics of the Collatz series, select a seed number:</p>
              <div className="flex items-center space-x-2">
                <input
                  className="w-32 p-2 rounded-lg text-center"
                  min={1}
                  max={999999999}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSeedNumber(parseInt(e.target.value))
                    }
                  }}
                  type="number"
                  value={seedNumber}
                  disabled={!!timer}
                />
                <span className='text-gray-500'>tested {encounteredSeedNumbers.size} number(s)</span>
              </div>
              <div className='flex space-x-4 items-center justify-center'>
                <button className='bg-indigo-700' type="button" onClick={automate} disabled={!!timer}>Auto increment</button>
                <button className='bg-red-700' type="button" onClick={stopAutomation} disabled={!timer}>Stop</button>
              </div>
            </div>
          </div>
        </div>

        <div className='width-container w-full h-[500px] grid grid-cols-2 grid-rows-2'>
          <div className='size-full'>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={600}
                height={300}
                data={series}
              >
                <XAxis dataKey="name" minTickGap={25}>
                  <Label value={`Collatz series of ${seedNumber}`} offset={200} position="top" />
                </XAxis>
                <YAxis minTickGap={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey="value" type="monotone" stroke="#aa4455" animationDuration={ANIMATION_DURATION_MS} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='size-full'>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={600}
                height={300}
                data={logSeries}
              >
                <XAxis dataKey="name" minTickGap={25}>
                  <Label value="Logarithm of the series" offset={200} position="top" />
                </XAxis>
                <YAxis minTickGap={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey="value" type="monotone" stroke="#aa4455" animationDuration={ANIMATION_DURATION_MS} dot={false} />
                <ReferenceLine
                  label="Descent"
                  stroke="blue"
                  strokeDasharray="3 3"
                  segment={[{ x: 0, y: logSeries[0].value }, { x: logSeries.length - 1, y: logSeries[logSeries.length - 1].value }]}
                />
                <ReferenceLine y={logAverage} label="Average" stroke="green" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='size-full'>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                width={600}
                height={300}
                data={logSeries}
              >
                <XAxis dataKey="seed" type="number" name="stature">
                  <Label value="Series length first reached by seed number" offset={200} position="top" />
                </XAxis>
                <YAxis dataKey="length" type="number" name="weight" />
                <Scatter data={lengthBySeed} fill="#aa4455" shape="circle" animationDuration={ANIMATION_DURATION_MS} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className='size-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={600} height={300} data={countByLeadingDigitData}>
                <XAxis dataKey="leading">
                  <Label value="Histogram of encountered numbers by leading digit" offset={200} position="top" />
                </XAxis>
                <YAxis />
                <Bar dataKey="count" fill="#aa4455" animationDuration={ANIMATION_DURATION_MS} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <details>
          <summary>{series.length} elements</summary>
          <code className="overflow-y-auto p-2">
            {'{ '}
            <span className="invertedText">{series[0].value}</span>
            {', '}
            {series.slice(1, -1).map((item) => item.value).join(', ')}
            {series.length > 2 && ', '}
            <span className="invertedText">{series.slice(-1)[0].value}</span>
            {' }'}
          </code>
        </details>
      </div>
    </div>
  )
}

const CustomTooltip = (payload: TooltipProps<number, number>) => {
  if (payload?.payload?.[0]) {
    const index = payload?.payload?.[0].payload.name;
    const value = payload?.payload?.[0].value;
    return (
      <div className="text-sm border-2 rounded-md p-2 bg-slate-300 text-gray-950 flex flex-col place-items-end">
        <p>x: {index}</p>
        {/* <p className="italic">Previous: <strong>{getPrevious(value)}</strong></p> */}
        <p className="font-bold" style={{ color: payload?.payload?.[0].stroke }}>y: {value}</p>
        <p className="italic">next y: {value ? getNext(value) : '-'}</p>
      </div>
    );
  }
  return null;
};
