import { useEffect, useState } from 'react';
import {
  Button, Card, CardContent, CardActions,
  Container, CssBaseline, Toolbar,
  Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';

import words from './words';

import './style.css'

const queueSize = 10
const hitsNeeded = 3


const chooseWords = (wordList: { word: string; artikel: string }[], count: number) => {
  const wordListSize = wordList.length;
  let chosen: number[] = [];
  if (count > wordListSize) { count = wordListSize; }
  for (let i = 0; i < count; i++) {
    let index = Math.floor(Math.random() * (wordListSize - i));
    for (let j = 0; j < chosen.length; j++) {
      if (index >= chosen[j]) { index += 1; }
    }
    chosen.push(index);
    chosen = chosen.sort((a, b) => a - b);
  }
  return chosen.map((i) => ({ ...wordList[i], hits: 0, misses: 0 }));
};

const ActionBlock = ({ gameFinished, word, handleAnswer, handleNewGame }: { gameFinished: boolean; word: string; handleAnswer: (answer: string) => void; handleNewGame: () => void }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    der: { color: 'blue' },
    das: { color: 'green' },
    die: { color: 'red' }
  }
  if (gameFinished) {
    return <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Sie machen das toll!</Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={handleNewGame}>Wieder spielen</Button>
      </CardActions>
    </Card>
  }
  return <Card variant="outlined">
    <CardContent>
      <Typography variant="h6">Für das Wort: {word}</Typography>
    </CardContent>
    <CardActions>
      {['der', 'die', 'das'].map(a => <Button variant="outlined" style={styles[a]} key={a} onClick={() => handleAnswer(a)}>{a}</Button>)}
    </CardActions>
  </Card>
}

const StatsBlock = ({ showStats, gameFinished, wordsQueue, prevWord, prevResult }: { showStats: boolean; gameFinished: boolean; wordsQueue: { word: string; hits: number; misses: number }[]; prevWord: string; prevResult: string }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    hit: { backgroundColor: 'lightgreen' },
    miss: { backgroundColor: '#FF474C' }
  }
  if (!gameFinished && !showStats) {
    return <Typography style={styles[prevResult]}>{prevWord}</Typography>
  }
  return <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Wort</TableCell>
          <TableCell>Richtig</TableCell>
          <TableCell>Falsch</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {wordsQueue.map(
          (word) => (
            <TableRow key={word.word} style={
              (!gameFinished && word.word === prevWord) ? styles[prevResult] : {}}
            >
              <TableCell>{word.word}</TableCell><TableCell>{word.hits}</TableCell><TableCell>{word.misses}</TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  </TableContainer>
}

const Game = () => {
  const [gameFinished, setGameFinished] = useState(false)
  const [currentWord, setCurrentWord] = useState(-1)
  const [wordsQueue, setWordsQueue] = useState<{ word: string; artikel: string; hits: number; misses: number }[]>([])
  const [prevWord, setPrevWord] = useState("")
  const [prevResult, setPrevResult] = useState("")
  const [showStats, setShowStats] = useState(false)

  const handleAnswer = (answer:string) => {
    let word = wordsQueue[currentWord]
    setPrevWord(word.word)
    if (answer === word.artikel) {
      word.hits += 1
      setPrevResult("hit")
    } else {
      word.misses += 1
      word.hits = 0
      setPrevResult("miss")
    }
    let newQueue = wordsQueue.slice()
    newQueue[currentWord] = word
    setWordsQueue(newQueue)
    const nextWords = wordsQueue.filter(w => (w.hits < hitsNeeded && w.word !== word.word))
    if (nextWords.length > 0) {
      const nextWordPreIndex = Math.floor(Math.random() * nextWords.length)
      const nextWord = nextWords[nextWordPreIndex].word
      const nextWordIndex = wordsQueue.findIndex(w => w.word === nextWord)
      setCurrentWord(nextWordIndex)
    } else {
      if (word.hits >= hitsNeeded) {
        setGameFinished(true)
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameFinished) {
      if (e.key === "1" || e.key === "ArrowLeft") {
        handleAnswer('der')
      }
      if (e.key === "2" || e.key === "ArrowUp") {
        handleAnswer('die')
      }
      if (e.key === "3" || e.key === "ArrowRight") {
        handleAnswer('das')
      }
      if (e.key === "ArrowDown") {
        handleNewGame()
      }
      if (e.key === " ") {
        setShowStats(prev => !prev)
      }
    } else {
      if (e.key === "ArrowDown") {
        handleNewGame()
      }
    }
  }

  const handleNewGame = () => {
    setCurrentWord(-1);
    setGameFinished(false);
    setWordsQueue([]);
    setPrevWord("")
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentWord, gameFinished]);

  if (!gameFinished && wordsQueue.length === 0) {
    const q = chooseWords(words, queueSize)
    setWordsQueue(q)
    setCurrentWord(Math.floor(Math.random() * q.length))
  }

  return (<Container>
    <CssBaseline />
    <Toolbar>
      <Typography variant="h4">Was ist der Artikel?</Typography>
    </Toolbar>
    <ActionBlock
      word={currentWord !== -1 ? wordsQueue[currentWord].word : ""}
      gameFinished={gameFinished}
      handleAnswer={handleAnswer}
      handleNewGame={handleNewGame}
    />
    <StatsBlock
      showStats={showStats}
      gameFinished={gameFinished}
      wordsQueue={wordsQueue}
      prevWord={prevWord}
      prevResult={prevResult}
    />
    <Typography variant='body2'>
      Tastatur: der - LINKS, die - AUF, das - RECHTS, neues Spiel - AB, Statistik anzeigen - LEERTASTE
    </Typography>
  </Container>);
}

const App = () => {
  return <Game />
};

export default App;
