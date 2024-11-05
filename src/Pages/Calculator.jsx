import { useState, useEffect } from 'react';
import { jStat } from 'jstat';
const Calculator = () => {
    const [formula, setFormula] = useState('');
    const [inputValues, setInputValues] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [significanceLevel, setSignificanceLevel] = useState(0.05); // Default significance level
    const [threshold, setThreshold] = useState(3.0);
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
        setError(null);
    };

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
        setError(null); // Clear any existing errors when input changes
    };
    const handleSignificanceLevelChange = (e) => {
        setSignificanceLevel(parseFloat(e.target.value));
    };
    const handleThresholdChange = (e) => {
        setThreshold(parseFloat(e.target.value));
    };

    const validateInput = (input) => {
        if (!input || input.trim() === '') {
            return "Input cannot be empty.";
        }

        const values = input.split(',');

        for (let i = 0; i < values.length; i++) {
            if (values[i].trim() === '') {
                return "Input contains empty values or double commas.";
            }
            if (isNaN(values[i])) {
                return "All inputs must be numbers.";
            }
        }
        return null; // No error
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let validationError = null;

        switch (formula) {
            case 'mean':
            case 'median':
            case 'variancePopulation':
            case 'varianceSample':
            case 'mode':
            case 'range':
                validationError = validateInput(inputValues[0]);
                break;
            case 'groupedMean':
            case 'chiTest':
            case 'tTest':
                validationError = validateInput(inputValues[0]) || validateInput(inputValues[1]);
                break;
            case 'anova':
                for (let i = 0; i < inputValues.length; i++) {
                    validationError = validateInput(inputValues[i]);
                    if (validationError) break;
                }
                break;
            default:
                validationError = "Please select a valid formula.";
        }

        if (validationError) {
            setError(validationError);
            setResult(null);
            return;
        }

        setError(null); // Clear previous errors
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
            case 'varianceSample':
                calculationResult = calculateSampleVariance(inputValues[0]);
                break;
            case 'variancePopulation':
                calculationResult = calculatePopulationVariance(inputValues[0]);
                break;
            case 'mode':
                calculationResult = calculateMode(inputValues[0]);
                break;
            case 'range':
                calculationResult = calculateRange(inputValues[0]);
                break;
            case 'anova':
                const groups = inputValues.map(group => group.split(',').map(Number));
                calculationResult = calculateANOVA(groups, significanceLevel);
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

    const calculateSampleVariance = (values) => {
        const nums = values.split(',').map(Number);
        const mean = nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
        const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / (nums.length - 1);
        return `Sample Variance: ${variance.toFixed(2)}`;
    };

    // Population Variance Calculation
    const calculatePopulationVariance = (values) => {
        const nums = values.split(',').map(Number);
        const mean = nums.reduce((acc, curr) => acc + curr, 0) / nums.length;
        const variance = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / nums.length;
        return `Population Variance: ${variance.toFixed(2)}`;
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

    const calculateANOVA = (groups, significanceLevel) => {
        // Calculate means for each group
        const means = groups.map(group => group.reduce((a, b) => a + b, 0) / group.length);
        const overallMean = means.reduce((a, b) => a + b, 0) / means.length;

        // Step 1: Calculate Sum of Squares Between Groups (SSB)
        let ssBetween = 0;
        groups.forEach(group => {
            const groupMean = group.reduce((a, b) => a + b, 0) / group.length;
            ssBetween += group.length * Math.pow((groupMean - overallMean), 2);
        });

        // Step 2: Calculate Sum of Squares Within Groups (SSW)
        let ssWithin = 0;
        groups.forEach(group => {
            const mean = group.reduce((a, b) => a + b, 0) / group.length;
            ssWithin += group.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
        });

        // Degrees of freedom
        const dfBetween = groups.length - 1; // Between groups degrees of freedom
        const dfWithin = groups.reduce((acc, group) => acc + group.length, 0) - groups.length; // Within groups degrees of freedom

        // Mean Squares
        const msBetween = ssBetween / dfBetween; // Mean Square Between
        const msWithin = ssWithin / dfWithin; // Mean Square Within

        // F-value
        const fValue = msBetween / msWithin;

        // P-value calculation using jStat
        const calculatePValue = (fValue, dfBetween, dfWithin) => {
            return 1 - jStat.centralF.cdf(fValue, dfBetween, dfWithin);
        };

        const pValue = calculatePValue(fValue, dfBetween, dfWithin);

        // Determine significance
        const isSignificant = pValue < significanceLevel;

        return `F-Value: ${fValue.toFixed(2)}, p-Value: ${pValue.toFixed(4)}, Significance: ${isSignificant ? `Yes (p < ${significanceLevel})` : `No (p > ${significanceLevel})`}`;
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

        const se = Math.sqrt(variance1 / sample1.length + variance2 / sample2.length);

        const tValue = (mean1 - mean2) / se;
        return `T-Value: ${tValue.toFixed(2)}`;
    };

    const renderInputs = () => {
        switch (formula) {
            case 'mean':
            case 'median':
            case 'variance':
            case 'mode':
            case 'variancePopulation':
            case 'varianceSample':
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
                        <p>Input Significance Level</p>
                        <input
                            className='border rounded my-6 p-3'
                            type="number"
                            placeholder="Enter significance level (e.g., 0.05)"
                            value={significanceLevel}
                            onChange={handleSignificanceLevelChange}
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
                <select name="formula" className='border text-lg p-3 rounded-t mb-5' value={formula} onChange={handleFormulaChange}>
                    <option value="">Select formula</option>
                    <option value="mean">Mean</option>
                    <option value="groupedMean">Grouped Mean</option>
                    <option value="median">Median</option>
                    <option value="variancePopulation">Variance (Population)</option>
                    <option value="varianceSample">Sample Variance</option>
                    <option value="mode">Mode</option>
                    <option value="range">Range</option>
                    <option value="anova">ANOVA</option>
                    <option value="chiTest">Chi-Square Test</option>
                    <option value="tTest">T-Test</option>
                </select>
                {renderInputs()}
                <button type="submit" className='bg-green-800 p-2 text-lg rounded-2xl my-20 text-white md:w-1/2 md:m-auto'>Calculate</button>

            </form>
            {error && <p className="error">{error}</p>}
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
