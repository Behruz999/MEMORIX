import './root.css'
import { useState } from 'react';
import { generate } from 'random-words';

interface VerificationResult {
    index: number;
    data: string | number;
    userInput: string;
    isCorrect: boolean;
}

export const Root = () => {

    const [randomData, setRandomData] = useState<(string | number)[]>([]);
    const [userInput, setUserInput] = useState<string[]>([]);
    const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeWords, setIncludeWords] = useState(false);
    const [dataGenerated, setDataGenerated] = useState(false);
    const [challengeStarted, setChallengeStarted] = useState(false);
    const [dataLength, setDataLength] = useState(10);
    const [numberLimit, setNumberLimit] = useState(100);

    const generateData = () => {
        const generatedData = generateRandomData(dataLength);
        setRandomData(generatedData);
        setUserInput(Array(dataLength).fill(''));
        setVerificationResults([]);
        setShowResults(false);
        setChallengeStarted(false);
        setDataGenerated(true);
    };

    const generateRandomData = (length: number): (string | number)[] => {
        const generatedData: (string | number)[] = [];
        for (let i = 0; i < length; i++) {
            if (includeNumbers && includeWords) {
                if (Math.random() < 0.5) {
                    generatedData.push(Math.floor(Math.random() * numberLimit)); // Generate random number
                } else {
                    generatedData.push(randomWord()); // Generate random word
                }
            } else if (includeNumbers) {
                generatedData.push(Math.floor(Math.random() * numberLimit)); // Generate random number
            } else if (includeWords) {
                generatedData.push(randomWord()); // Generate random word
            }
        }
        return generatedData;
    };

    const randomWord = (): string => {
        const wordOrWords = generate(); // This will generate a single random word or an array of words
        if (Array.isArray(wordOrWords)) {
            // Select a random word from the array
            const randomIndex = Math.floor(Math.random() * wordOrWords.length);
            return wordOrWords[randomIndex];
        } else {
            // Return the single word directly
            return wordOrWords;
        }
    };

    const startChallenge = () => {
        setChallengeStarted(true);
        setDataGenerated(false);
    };

    const verifyChallenge = () => {
        const results: VerificationResult[] = userInput.map((input, index) => ({
            index,
            data: randomData[index],
            userInput: input,
            isCorrect: input === String(randomData[index]), // Ensure user input and random data are of the same type for comparison
        }));
        setVerificationResults(results);
        setShowResults(true);
    };

    const handleInputChange = (index: number, value: string) => {
        const updatedUserInput = [...userInput];
        updatedUserInput[index] = value;
        setUserInput(updatedUserInput);
    };

    const resetChallenge = () => {
        setRandomData([]);
        setUserInput([]);
        setVerificationResults([]);
        setShowResults(false);
        setChallengeStarted(false);
        setDataGenerated(false);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-8">MemoriX</h1>
                <div className="bg-white rounded shadow p-8 w-full max-w-md">
                    {!dataGenerated && !challengeStarted && !showResults && (
                        <>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={includeNumbers}
                                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                                    className="mr-2"
                                />
                                <label className="text-sm">Include Numbers</label>
                            </div>
                            {includeNumbers && (
                                <div className="mb-4">
                                    <label className="text-sm">Number Limit</label>
                                    <input
                                        type="number"
                                        value={numberLimit}
                                        onChange={(e) => setNumberLimit(Number(e.target.value))}
                                        className="border rounded p-2 w-full"
                                        min="1"
                                    />
                                </div>
                            )}
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={includeWords}
                                    onChange={(e) => setIncludeWords(e.target.checked)}
                                    className="mr-2"
                                />
                                <label className="text-sm">Include Words</label>
                            </div>
                            <div className="mb-4">
                                <label className="text-sm">Data Length</label>
                                <input
                                    type="number"
                                    value={dataLength}
                                    onChange={(e) => setDataLength(Number(e.target.value))}
                                    className="border rounded p-2 w-full"
                                    min="1"
                                />
                            </div>
                            <button onClick={generateData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full">Generate</button>
                        </>
                    )}

                    {dataGenerated && !challengeStarted && (
                        <>
                            <button onClick={generateData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full">Regenerate</button>
                            <div className="flex flex-col">
                                {randomData.length > 0 && randomData.map((item, index) => (
                                    <div key={index} className="border rounded p-2 mb-2">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <button onClick={startChallenge} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">Start Challenge</button>
                        </>
                    )}

                    {challengeStarted && !showResults && (
                        <>
                            <div className="flex flex-col">
                                {randomData.length > 0 && randomData.map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={userInput[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className="border rounded p-2 mb-2"
                                        placeholder={`Input ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button onClick={verifyChallenge} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">Verify</button>
                        </>
                    )}

                    {showResults && (
                        <>
                            <div className="mt-4">
                                <h2 className="text-lg font-bold mb-2">Verification Results</h2>
                                <ul>
                                    {verificationResults.map((result, index) => (
                                        <li key={index} className="mb-2">
                                            {result.isCorrect ? (
                                                <>
                                                    <span className="font-semibold"></span> {result.index + 1}{`)`} <span className="font-semibold">User Input:</span> {result.userInput}, <span className="font-semibold text-green-600">Correct: Yes</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-semibold"></span> {result.index + 1}{`)`} <span className="font-semibold">Expected:</span> {result.data}, <span className="font-semibold">User Input:</span> {result.userInput}, <span className="font-semibold text-red-600">Correct: No</span>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={resetChallenge} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">Restart</button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
