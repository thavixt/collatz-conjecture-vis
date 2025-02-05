import { useCallback, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCollatzSeries, getStoppingTimeOfSeries, getTotalStoppingTimeOfSeries } from './collatz';
import './App.css'
import { DEFAULT_ANIMATION_DURATION_MS, DEFAULT_OCCURENCE_MAP, DEFAULT_INCREMENT_VALUE, DEFAULT_SEED, getStoredAnimationActive, MAX_INCREMENT_VALUE, MAX_SEED, setStoredIncrementBy, setStoredSeed, DEFAULT_TIMER_DURATION_MS, setStoredAnimationActive } from './utils';
import { CustomTooltip, CustomScatterTooltip, CustomTotalScatterTooltip } from './Tooltips';

export default function App() {
  const [seedNumber, setSeedNumber] = useState(DEFAULT_SEED);
  const [animate, setAnimate] = useState(getStoredAnimationActive());
  const [encounteredSeedNumbers, setEncounteredSeedNumbers] = useState(new Set<number>());

  const [series, setSeries] = useState([{ name: 0, value: 0 }]);
  const [peak, setPeak] = useState(0);
  const [average, setAverage] = useState(0);
  const [logSeries, setLogSeries] = useState([{ name: 0, value: 0 }]);
  const [logAverage, setLogAverage] = useState(0);

  const [stoppingTimes, setStoppingTimes] = useState<{ seed: number, stoppingTime: number }[]>([]);
  const [totalStoppingTimes, setTotalStoppingTimes] = useState<{ seed: number, totalStoppingTime: number }[]>([]);
  const [countByLeadingDigit, setCountByLeadingDigit] = useState(DEFAULT_OCCURENCE_MAP);

  const [incrementBy, setIncrementBy] = useState(DEFAULT_INCREMENT_VALUE);
  const [timer, setTimer] = useState(0);

  const automate = useCallback(() => {
    setTimer(setInterval(() => {
      setSeedNumber(n => n + incrementBy);
    }, DEFAULT_TIMER_DURATION_MS));
  }, [incrementBy]);
  const stopAutomation = useCallback(() => {
    clearInterval(timer);
    setTimer(0);
  }, [timer]);

  const resetCurrent = useCallback(() => {
    setSeedNumber(1);
    setIncrementBy(1);
    setStoredSeed(1);
    setStoredIncrementBy(1);
  }, []);

  const reset = useCallback(() => {
    setEncounteredSeedNumbers(new Set());
    setStoppingTimes([]);
    setTotalStoppingTimes([]);
    setCountByLeadingDigit(DEFAULT_OCCURENCE_MAP);
    resetCurrent();
  }, [resetCurrent]);

  useEffect(() => {
    if (!seedNumber) {
      resetCurrent();
      return;
    }

    setStoredSeed(seedNumber);

    const collatzSeries = getCollatzSeries(seedNumber);
    setSeries(collatzSeries.map((value, index) => ({ name: index, value })));
    setPeak(Math.max(...collatzSeries));
    setAverage(+(collatzSeries.reduce((prev, cur) => prev + cur, 0) / collatzSeries.length).toPrecision(4));
    setLogSeries(collatzSeries.map((value, index) => ({ name: index, value: Math.log(value) })));
    setLogAverage(logSeries.reduce((prev, cur) => prev + cur.value, 0) / logSeries.length);

    if (stoppingTimes.findIndex(v => v.seed === seedNumber) === -1) {
      setStoppingTimes(prev => [
        ...prev,
        // ...prev.slice(-100),
        { seed: seedNumber, stoppingTime: getStoppingTimeOfSeries(collatzSeries) }
      ]);
    }
    
    if (totalStoppingTimes.findIndex(v => v.seed === seedNumber) === -1) {
      setTotalStoppingTimes(prev => [
        ...prev,
        // ...prev.slice(-100),
        { seed: seedNumber, totalStoppingTime: getTotalStoppingTimeOfSeries(collatzSeries) }
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
                <label htmlFor="seed">Seed:</label>
                <input
                  className="w-32 p-2 rounded-lg text-center"
                  min={0}
                  max={999999999}
                  onChange={(e) => {
                    if (e.target.value) {
                      const n = Math.min(parseInt(e.target.value), MAX_SEED);
                      setSeedNumber(n);
                      setStoredSeed(n);
                    }
                  }}
                  id='seed'
                  type="number"
                  value={seedNumber}
                  disabled={!!timer}
                />
                <button className='bg-gray-700' type="button" onClick={reset} disabled={!!timer}>Reset</button>
                <div className='flex justify-center space-x-2'>
                  <label htmlFor="animate">Animate:</label>
                  <input className='p-2' type="checkbox" id="animate" onChange={e => {
                    const checked = e.target.checked;
                    setAnimate(checked);
                    setStoredAnimationActive(checked);
                  }} defaultChecked={animate} />
                </div>
                <span className='text-gray-500'>Tested {encounteredSeedNumbers.size} number(s)</span>
              </div>
              <div className='flex space-x-4 items-center justify-center'>
                <button className='bg-green-700' type="button" onClick={automate} disabled={!!timer}>Auto inc.</button>
                <button className='bg-red-700' type="button" onClick={stopAutomation} disabled={!timer}>Stop</button>
                <label htmlFor="incrementBy">Increment by:</label>
                <input
                  id='incrementBy'
                  className="w-24 p-2 rounded-lg text-center"
                  min={1}
                  max={10000}
                  onChange={(e) => {
                    if (e.target.value) {
                      const n = Math.min(parseInt(e.target.value), MAX_INCREMENT_VALUE);
                      setIncrementBy(n);
                      setStoredIncrementBy(n);
                    }
                  }}
                  type="number"
                  value={incrementBy}
                  disabled={!!timer}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='width-container w-full h-[500px] grid grid-cols-2 grid-rows-3 gap-4'>
          <div className='size-full flex flex-col space-y-2'>
            <p className='text-gray-400'>Collatz series of {seedNumber}</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={600}
                height={300}
                data={series}
              >
                <XAxis dataKey="name" minTickGap={25} />
                <YAxis minTickGap={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey="value" type="linear" stroke="#aa4455" dot={false} animationDuration={DEFAULT_ANIMATION_DURATION_MS} isAnimationActive={animate} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='flex justify-center'>
            <div className='size-full grid grid-cols-2 grid-rows-5 w-80 border border-gray-600 rounded-md p-2 shadow-lg shadow-gray-800'>
              <div>Seed number:</div>
              <div><code>{seedNumber}</code></div>
              <div>Peak (max) value:</div>
              <div><code>{peak}</code></div>
              <div>Average value:</div>
              <div><code>{average}</code></div>
              <div title='The smallest i such that aˇi < aˇ0 is called the stopping time of n'>Stopping time:</div>
              <div><code>{stoppingTimes.length ? stoppingTimes[stoppingTimes.length - 1].stoppingTime : '-'}</code></div>
              <div title='The smallest k such that aˇk = 1 is called the total stopping time of n'>Total stopping time:</div>
              <div><code>{totalStoppingTimes.length ? totalStoppingTimes[totalStoppingTimes.length - 1].totalStoppingTime : '-'}</code></div>
            </div>
          </div>

          <div className='size-full flex flex-col space-y-2'>
            <p className='text-gray-400'>Logarithm of the series (log(n))</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={600}
                height={300}
                data={logSeries}
              >
                <XAxis dataKey="name" minTickGap={25} />
                <YAxis minTickGap={10} />
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey="value" type="linear" stroke="#aa4455" dot={false} animationDuration={DEFAULT_ANIMATION_DURATION_MS} isAnimationActive={animate} />
                <ReferenceLine
                  stroke="blue"
                  strokeDasharray="3 3"
                  segment={[{ x: 0, y: logSeries[0].value }, { x: logSeries.length - 1, y: logSeries[logSeries.length - 1].value }]}
                />
                <ReferenceLine y={logAverage} label="Average" stroke="orange" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='size-full flex flex-col space-y-2'>
            <p className='text-gray-400'>Stopping time by seed number (n<sub>i</sub>=n<sub>0</sub>, n reaches the seed number)</p>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                width={600}
                height={300}
              >
                <XAxis dataKey="seed" type="number" name="stature" />
                <YAxis dataKey="stoppingTime" type="number" name="weight" />
                <Scatter data={stoppingTimes} fill="#aa4455" shape="circle" animationDuration={DEFAULT_ANIMATION_DURATION_MS} isAnimationActive={animate} />
                <Tooltip content={<CustomScatterTooltip />} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className='size-full flex flex-col space-y-2'>
            <p className='text-gray-400'>Histogram of encountered numbers by leading digit</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={600} height={300} data={countByLeadingDigitData}>
                <XAxis dataKey="leading" />
                <YAxis />
                <Bar dataKey="count" fill="#aa4455" animationDuration={DEFAULT_ANIMATION_DURATION_MS} isAnimationActive={animate} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='size-full flex flex-col space-y-2'>
            <p className='text-gray-400'>Total stopping time by seed number (n<sub>i</sub>=1, n reaches 1)</p>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                width={600}
                height={300}
              >
                <XAxis dataKey="seed" type="number" name="stature" />
                <YAxis dataKey="totalStoppingTime" type="number" name="weight" />
                <Scatter data={totalStoppingTimes} fill="#aa4455" shape="circle" animationDuration={DEFAULT_ANIMATION_DURATION_MS} isAnimationActive={animate} />
                <Tooltip content={<CustomTotalScatterTooltip />} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <details>
          <summary>{series.length} elements in the Collatz series of {seedNumber}</summary>
          <code className="overflow-y-auto p-2">
            {'{ '}
            <span className="invertedText">{series[0].value}</span>
            {', '}
            {series.slice(1, -3).map((item) => item.value).join(', ')}
            {series.length > 4 && ', '}
            <span className="invertedText">{series.slice(-3)[0].value}</span>
            {', '}
            <span className="invertedText">{series.slice(-2)[0].value}</span>
            {', '}
            <span className="invertedText">{series.slice(-1)[0].value}</span>
            {' }'}
          </code>
        </details>
      </div>
    </div>
  )
}
