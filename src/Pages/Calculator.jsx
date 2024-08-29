import { useState, useEffect } from 'react';

const Calculator = () => {
    const [formula, setFormula] = useState('');
    const [inputValues, setInputValues] = useState([]);
    const [result, setResult] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            });
        } else {
            setLocation("Geolocation not supported.");
        }
    }, []);

    useEffect(() => {
        fetch("http://ip-api.com/json/")
            .then((response) => response.json())
            .then((data) => {
                setLocationInfo({
                    country: data.country,
                    region: data.regionName,
                    city: data.city,
                    district: data.district,
                    timezone: data.timezone,
                    isp: data.isp,
                });
            })
            .catch((error) => console.error("Error fetching location data:", error));
    }, []);

    const handleFormulaChange = (e) => {
        setFormula(e.target.value);
        setInputValues([]);
        setResult(null);
    };

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let calculationResult;

        switch (formula) {
            case 'mean':
                calculationResult = calculateMean(inputValues[0]);
                break;
            case 'groupedMean':
                const values = inputValues[0].split(',').map(Number);
                const frequencies = inputValues[1].split(',').map(Number);
                calculationResult = calculateGroupedMean(values, frequencies);
                break;
            case 'median':
                calculationResult = calculateMedian(inputValues[0]);
                break;
            case 'variance':
                calculationResult = calculateVariance(inputValues[0]);
                break;
            case 'mode':
                calculationResult = calculateMode(inputValues[0]);
                break;
            case 'range':
                calculationResult = calculateRange(inputValues[0]);
                break;
            case 'anova':
                const groups = inputValues.map(group => group.split(',').map(Number));
                calculationResult = calculateANOVA(groups);
                break;
            case 'chiTest':
                const observed = inputValues[0].split(',').map(Number);
                const expected = inputValues[1].split(',').map(Number);
                calculationResult = calculateChiSquareTest(observed, expected);
                break;
            case 'tTest':
                const sample1 = inputValues[0].split(',').map(Number);
                const sample2 = inputValues[1].split(',').map(Number);
                calculationResult = calculateTTest(sample1, sample2);
                break;
            default:
                calculationResult = 'Please select a valid formula';
        }

        setResult(calculationResult);
        console.log("User Location: ", location);
    };

    const calculateMean = (values) => {
        const nums = values.split(',').map(Number);
        const sum = nums.reduce((acc, curr) => acc + curr, 0);
        return (sum / nums.length).toFixed(2);
    };

    const calculateGroupedMean = (values, frequencies) => {
        if (values.length !== frequencies.length) {
            return 'Values and frequencies must have the same length.';
        }
        const sumProduct = values.reduce((acc, curr, index) => acc + curr * frequencies[index], 0);
        const sumFrequencies = frequencies.reduce((acc, curr) => acc + curr, 0);
        return (sumProduct / sumFrequencies).toFixed(2);
    };

    const calculateMedian = (values) => {
        const nums = values.split(',').map(Number);
        nums.sort((a, b) => a - b);
        const middle = Math.floor(nums.length / 2);
        if (nums.length % 2 === 0) {
            return ((nums[middle - 1] + nums[middle]) / 2).toFixed(2);
        }
        return nums[middle].toFixed(2);
    };

    const calculateVariance = (values) => {
        const nums = values.split(',').map(Number);
        const mean = calculateMean(values);
        const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / nums.length;
        return variance.toFixed(2);
    };

    const calculateMode = (values) => {
        const nums = values.split(',').map(Number);
        const freqMap = {};
        nums.forEach(value => {
            freqMap[value] = (freqMap[value] || 0) + 1;
        });
        const maxFreq = Math.max(...Object.values(freqMap));
        const modes = Object.keys(freqMap).filter(key => freqMap[key] === maxFreq);
        return modes.join(', ');
    };

    const calculateRange = (values) => {
        const nums = values.split(',').map(Number);
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        return (max - min).toFixed(2);
    };

    const calculateANOVA = (groups) => {
        const means = groups.map(group => group.reduce((a, b) => a + b, 0) / group.length);
        const overallMean = means.reduce((a, b) => a + b, 0) / means.length;

        let ssBetween = 0;
        groups.forEach(group => {
            ssBetween += group.length * Math.pow((group.reduce((a, b) => a + b, 0) / group.length) - overallMean, 2);
        });

        let ssWithin = 0;
        groups.forEach(group => {
            const mean = group.reduce((a, b) => a + b, 0) / group.length;
            ssWithin += group.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
        });

        const dfBetween = groups.length - 1;
        const dfWithin = groups.reduce((acc, group) => acc + group.length, 0) - groups.length;

        const msBetween = ssBetween / dfBetween;
        const msWithin = ssWithin / dfWithin;

        const fValue = msBetween / msWithin;
        return `F-Value: ${fValue.toFixed(2)}`;
    };

    const calculateChiSquareTest = (observed, expected) => {
        if (observed.length !== expected.length) {
            return 'Observed and expected frequencies must have the same length.';
        }
        let chiSquare = 0;
        for (let i = 0; i < observed.length; i++) {
            chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
        }
        return `Chi-Square Value: ${chiSquare.toFixed(2)}`;
    };

    const calculateTTest = (sample1, sample2) => {
        const mean1 = sample1.reduce((a, b) => a + b, 0) / sample1.length;
        const mean2 = sample2.reduce((a, b) => a + b, 0) / sample2.length;

        const variance1 = sample1.reduce((acc, val) => acc + Math.pow(val - mean1, 2), 0) / (sample1.length - 1);
        const variance2 = sample2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0) / (sample2.length - 1);

        const pooledVariance = (((sample1.length - 1) * variance1) + ((sample2.length - 1) * variance2)) / (sample1.length + sample2.length - 2);
        const tValue = (mean1 - mean2) / Math.sqrt(pooledVariance * (1 / sample1.length + 1 / sample2.length));

        return `T-Value: ${tValue.toFixed(2)}`;
    };

    const renderInputs = () => {
        switch (formula) {
            case 'mean':
            case 'median':
            case 'variance':
            case 'mode':
            case 'range':
                return (
                    <input
                        className='border rounded my-6 p-3'
                        type="text"
                        placeholder="Enter values separated by commas"
                        value={inputValues[0] || ''}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                    />
                );
            case 'groupedMean':
                return (
                    <>
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter values separated by commas"
                            value={inputValues[0] || ''}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                        />
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter frequencies separated by commas"
                            value={inputValues[1] || ''}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                        />
                    </>
                );
            case 'anova':
                return (
                    <>
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter group 1 values separated by commas"
                            value={inputValues[0] || ''}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                        />
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter group 2 values separated by commas"
                            value={inputValues[1] || ''}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                        />
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter group 3 values separated by commas"
                            value={inputValues[2] || ''}
                            onChange={(e) => handleInputChange(2, e.target.value)}
                        />
                    </>
                );
            case 'chiTest':
                return (
                    <>
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter observed values separated by commas"
                            value={inputValues[0] || ''}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                        />
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter expected values separated by commas"
                            value={inputValues[1] || ''}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                        />
                    </>
                );
            case 'tTest':
                return (
                    <>
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter sample 1 values separated by commas"
                            value={inputValues[0] || ''}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                        />
                        <input
                            className='border rounded my-6 p-3'
                            type="text"
                            placeholder="Enter sample 2 values separated by commas"
                            value={inputValues[1] || ''}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className='px-32 p-5'>
            <form onSubmit={handleSubmit}>
                <select name="formula" className='border text-lg mb-5 p-3 rounded-t' value={formula} onChange={handleFormulaChange}>
                    <option value="">Select formula</option>
                    <option value="mean">Mean</option>
                    <option value="groupedMean">Grouped Mean</option>
                    <option value="median">Median</option>
                    <option value="variance">Variance</option>
                    <option value="mode">Mode</option>
                    <option value="range">Range</option>
                    <option value="anova">ANOVA</option>
                    <option value="chiTest">Chi-Square Test</option>
                    <option value="tTest">T-Test</option>
                </select>
                {renderInputs()}
                <button type="submit" className='bg-green-800 p-2 text-lg rounded-2xl my-20 text-white md:w-1/2 mt-5 md:m-auto'>Calculate</button>

            </form>
            {result && <p>Result: {result}</p>}
            {location && (
                <div>
                    <h3>Your Location:</h3>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
            {locationInfo && (
                <div>
                    <h3>Additional Location Info:</h3>
                    <p>Country: {locationInfo.country}</p>
                    <p>Region: {locationInfo.region}</p>
                    <p>City: {locationInfo.city}</p>
                    <p>District: {locationInfo.district}</p>
                    <p>Timezone: {locationInfo.timezone}</p>
                    <p>ISP: {locationInfo.isp}</p>
                </div>
            )}
        </div>
    );
};

export default Calculator;
