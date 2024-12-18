import { useState, useEffect, useContext } from 'react';
import { jStat } from 'jstat';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Calculator = () => {
    const navigate = useNavigate()
    const { user, API_URL, token } = useContext(AuthContext)

    const [formula, setFormula] = useState('');
    const [inputValues, setInputValues] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [ipAddress, setIpAddress] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [significanceLevel, setSignificanceLevel] = useState(0.05); // Default significance level
    const [threshold, setThreshold] = useState(3.0);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (!user || !user.token) {  // Redirect if no user or token
            navigate('/login');
        }
    }, [user]);

    const storeResultInApi = async () => {
        setSaveLoading(true)
        console.log('this is the token passed from AuthContext', token)
        try {
            const response = await fetch(`https://statcalculatorbackend.vercel.app/history`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    result: result,
                    name: formula,
                    location: `lat ${location.latitude} long ${location.longitude} `,
                    note: note,

                    values: inputValues
                })

            })
            if (!response.ok) {
                toast.error(`Failed to store result`)
                setSaveLoading(false)
                throw new Error(`Failed to store result: ${response.statusText}`);
            }

            const record = await response.json()
            console.log('record has been sucessfully recorded', record)
            toast('record has been sucessfully recorded')
            setSaveLoading(false)


        } catch (error) {
            console.log(error)
            toast(error)
            setSaveLoading(false)
        }
    }

    useEffect(() => {
        console.log('this is the url', API_URL)
    }, [API_URL])

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

    // useEffect(
    //     () => {
    //         const Locator = async () => {
    //             await fetch(`https://api.ipify.org?format=json`)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     // Display the IP address on the screen
    //                     const ipAddress = data.ip;
    //                     setIpAddress(ipAddress)
    //                 })
    //                 .catch(error => {
    //                     console.error("Error fetching IP address:", error);
    //                 });



    //             await fetch("https://tools.keycdn.com/geo.json")
    //                 .then((response) => response.json())
    //                 .then((data) => {
    //                     setLocationInfo({
    //                         ...locationInfo,
    //                         country: data.country_name,
    //                         region: data.region_name,
    //                         city: data.city,
    //                         district: data.district,
    //                         timezone: data.timezone,

    //                     });
    //                 })
    //                 .catch((error) => console.error("Error fetching location data:", error));
    //         }
    //     }, []);
    const handleNote = (e) => {
        setNote(e.target.value)
    }
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
            case 'chiTestObservedExpected':
                validationError = validateInput(inputValues[0]) || validateInput(inputValues[1]);
                break;
            case 'chiTestContingency':
                for (let i = 0; i < inputValues.length; i++) {
                    validationError = validateInput(inputValues[i]);
                    if (validationError) break;
                }
                break;
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
            case 'calculateStandardDeviation':
                calculationResult = calculateStandardDeviation(inputValues[0]);
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
            // case 'chiTest':
            //     const observed = inputValues[0].split(',').map(Number);
            //     const expected = inputValues[1].split(',').map(Number);
            //     calculationResult = calculateChiSquareTest(observed, expected, significanceLevel);
            //     break;
            case 'chiTestObservedExpected':
                const observed = inputValues[0].split(',').map(Number);
                const expected = inputValues[1].split(',').map(Number);
                calculationResult = calculateChiSquareTestObservedExpected(observed, expected);
                break;
            case 'chiTestContingency':
                const table = inputValues.map(row => row.split(',').map(Number));
                calculationResult = calculateChiSquareTestContingency(table, significanceLevel);

                break;
            case 'tTest':
                const sample1 = inputValues[0].split(',').map(Number);
                const sample2 = inputValues[1].split(',').map(Number);
                calculationResult = calculateTTest(sample1, sample2, significanceLevel);
                break;
            default:
                calculationResult = 'Please select a valid formula';
        }

        setResult(calculationResult);

        // Calling the function after setting the result

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
    const calculateStandardDeviation = (values) => {
        const numbers = values.split(',').map(Number);
        const mean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
        const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
        return Math.sqrt(variance);
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
        // Flatten all values from groups to calculate overall mean
        const allValues = groups.flat();
        const overallMean = allValues.reduce((a, b) => a + b, 0) / allValues.length;

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
        const dfBetween = groups.length - 1;
        const dfWithin = allValues.length - groups.length;

        // Mean Squares
        const msBetween = ssBetween / dfBetween;
        const msWithin = ssWithin / dfWithin;

        // F-value
        const fValue = msBetween / msWithin;

        // P-value calculation using jStat (assuming jStat is available)
        const calculatePValue = (fValue, dfBetween, dfWithin) => {
            return 1 - jStat.centralF.cdf(fValue, dfBetween, dfWithin);
        };

        const pValue = calculatePValue(fValue, dfBetween, dfWithin);

        // Determine significance
        const isSignificant = pValue < significanceLevel;

        return `F-Value: ${fValue.toFixed(2)}, p-Value: ${pValue.toFixed(4)}, Significance: ${isSignificant ? `Yes (p < ${significanceLevel})` : `No (p > ${significanceLevel})`}`;
    };

    // const calculateChiSquareTest = (observed, expected, significanceLevel) => {
    //     if (observed.length !== expected.length) {
    //         return 'Observed and expected frequencies must have the same length.';
    //     }

    //     let chiSquare = 0;
    //     for (let i = 0; i < observed.length; i++) {
    //         chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
    //     }

    //     const df = observed.length - 1; // Degrees of freedom
    //     const criticalValue = jStat.chisquare.inv(1 - significanceLevel, df); // Critical value

    //     return `Chi-Square Value: ${chiSquare.toFixed(2)}, Critical Value: ${criticalValue.toFixed(2)}, 
    //             Significance: ${chiSquare > criticalValue ? 'Yes (Significant)' : 'No (Not Significant)'}`;
    // };

    const calculateChiSquareTestObservedExpected = (observed, expected) => {
        if (observed.length !== expected.length) {
            return 'Observed and expected frequencies must have the same length.';
        }
        let chiSquare = 0;
        for (let i = 0; i < observed.length; i++) {
            chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
        }
        return `Chi-Square Value: ${chiSquare.toFixed(2)}`;
    };
    const calculateChiSquareTestContingency = (table, significanceLevel) => {
        // Validate input
        if (!Array.isArray(table) || table.length === 0 || !Array.isArray(table[0])) {
            throw new Error("Invalid table: Must be a non-empty 2D array.");
        }
        if (significanceLevel <= 0 || significanceLevel >= 1) {
            throw new Error("Invalid significance level: Must be between 0 and 1.");
        }

        const rowTotals = getRowTotals(table);
        const colTotals = getColumnTotals(table);
        const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

        const chiSquare = calculateChiSquareStatistic(table, rowTotals, colTotals, grandTotal);
        const degreesOfFreedom = calculateDegreesOfFreedom(table);
        const pValue = 1 - jStat.chisquare.cdf(chiSquare, degreesOfFreedom);
        const criticalValue = jStat.chisquare.inv(1 - significanceLevel, degreesOfFreedom);
        const isSignificant = pValue < significanceLevel;

        return formatResults(chiSquare, degreesOfFreedom, pValue, criticalValue, significanceLevel, isSignificant);
    };

    // Helper function to calculate row totals
    const getRowTotals = (table) => {
        return table.map(row => row.reduce((a, b) => a + b, 0));
    };

    // Helper function to calculate column totals
    const getColumnTotals = (table) => {
        return table[0].map((_, colIndex) => table.reduce((sum, row) => sum + row[colIndex], 0));
    };

    // Helper function to calculate the chi-square statistic
    const calculateChiSquareStatistic = (table, rowTotals, colTotals, grandTotal) => {
        let chiSquare = 0;
        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].length; j++) {
                const expected = (rowTotals[i] * colTotals[j]) / grandTotal;
                chiSquare += Math.pow(table[i][j] - expected, 2) / expected;
            }
        }
        return chiSquare;
    };

    // Helper function to calculate degrees of freedom
    const calculateDegreesOfFreedom = (table) => {
        return (table.length - 1) * (table[0].length - 1);
    };

    // Helper function to format results for output
    const formatResults = (chiSquare, degreesOfFreedom, pValue, criticalValue, significanceLevel, isSignificant) => {
        return `Chi-Square Value: ${chiSquare.toFixed(2)}, Degrees of Freedom: ${degreesOfFreedom}, ` +
            `p-Value: ${pValue.toFixed(4)}, Critical Value: ${criticalValue.toFixed(2)}, ` +
            `Significance: ${isSignificant ? `Yes (p < ${significanceLevel})` : `No (p > ${significanceLevel})`}`;
    };

    const calculateTTest = (sample1, sample2, significanceLevel = 0.05) => {
        const n1 = sample1.length;
        const n2 = sample2.length;

        // Calculate means
        const mean1 = sample1.reduce((a, b) => a + b, 0) / n1;
        const mean2 = sample2.reduce((a, b) => a + b, 0) / n2;

        // Calculate variances
        const variance1 = sample1.reduce((acc, val) => acc + Math.pow(val - mean1, 2), 0) / (n1 - 1);
        const variance2 = sample2.reduce((acc, val) => acc + Math.pow(val - mean2, 2), 0) / (n2 - 1);

        // Calculate standard error
        const se = Math.sqrt(variance1 / n1 + variance2 / n2);

        // Calculate T-value
        const tValue = (mean1 - mean2) / se;

        // Degrees of Freedom
        const degreesOfFreedom = n1 + n2 - 2;

        // Calculate critical value for two-tailed test
        const criticalValue = jStat.studentt.inv(1 - significanceLevel / 2, degreesOfFreedom);

        // Calculate p-value
        const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tValue), degreesOfFreedom)); // two-tailed

        // Determine significance
        const isSignificant = pValue < significanceLevel;

        return `T-Value: ${tValue.toFixed(2)}, Degrees of Freedom: ${degreesOfFreedom}, ` +
            `Critical Value: ±${criticalValue.toFixed(2)}, p-Value: ${pValue.toFixed(4)}, ` +
            `Significance: ${isSignificant ? 'Yes (p < ' + significanceLevel + ')' : 'No (p > ' + significanceLevel + ')'}`;
    };

    const renderInputs = () => {
        switch (formula) {
            case 'mean':
            case 'median':
            case 'variance':
            case 'mode':
            case 'variancePopulation':
            case 'varianceSample':
            case 'calculateStandardDeviation':
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
            case 'chiTestObservedExpected':

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
            case 'chiTestContingency':
                return (
                    <>
                        <p>Enter each row in the contingency table as comma-separated values:</p>
                        {[...Array(3)].map((_, index) => (
                            <input
                                key={index}
                                className='border rounded my-6 p-3'
                                type="text"
                                placeholder={`Enter row ${index + 1}`}
                                value={inputValues[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        ))}
                        <p>Input Significance Level:</p>
                        <input
                            className='border rounded my-6 p-3'
                            type="number"
                            placeholder="Enter significance level (e.g., 0.05)"
                            value={significanceLevel}
                            onChange={handleSignificanceLevelChange}
                        />
                    </>

                );
            case 'tTest':
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
                        <input
                            className='border rounded my-6 p-3'
                            type="number"
                            placeholder="Enter significance level (e.g., 0.05)"
                            value={significanceLevel || ''}
                            onChange={(e) => handleSignificanceLevelChange(e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                        />
                    </>
                );

            default:
                return null;
        }
    };



    return (
        <div className='md:px-32 p-5 flex flex-col'>
            <form onSubmit={handleSubmit} className='flex flex-col w-100 gap-5'>
                <select name="formula" className='border text-lg p-3 rounded-t mb-5' value={formula} onChange={handleFormulaChange}>
                    <option value="">Select formula</option>
                    <option value="mean">Mean</option>
                    <option value="groupedMean">Grouped Mean</option>
                    <option value="median">Median</option>
                    <option value="variancePopulation">Variance (Population)</option>
                    <option value="varianceSample"> Variance (Sample)</option>
                    <option value="calculateStandardDeviation">Standard Deviation</option>
                    <option value="mode">Mode</option>
                    <option value="range">Range</option>
                    <option value="anova">ANOVA (one way)</option>
                    <option value="chiTestObservedExpected">Chi-Square Test (Observed/Expected)</option>
                    <option value="chiTestContingency">Chi-Square Test (contingency)</option>
                    <option value="tTest">T-Test</option>
                </select>
                {renderInputs()}
                <textarea name="note" onChange={handleNote} id="note" placeholder='note relating to Statistical calculation done' className='border border-black p-3 rounded'></textarea>
                <button type="submit" className='bg-green-800 hover:bg-blue-700 w-9/12 p-3  text-lg rounded-2xl mb-10 text-white'>Calculate</button>
            </form>
            {error && <p className="error">{error}</p>}
            {result && <p className='font-bold text-2xl text-blue-800'>Result: {result}</p>}
            {result && (<button onClick={() => { storeResultInApi() }} className='text-white bg-green-600 w-8/12 px-10 py-3'>
                {saveLoading ? 'LOADING' : '  SAVE RECORD'}
            </button>)}
            {location && (
                <div>
                    <h3>Your Location:</h3>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
            {/* {locationInfo && (
                <div>
                    <h3>Additional Location Info:</h3>
                    <p>Country: {locationInfo.country}</p>
                    <p>Region: {locationInfo.region}</p>
                    <p>City: {locationInfo.city}</p>
                    <p>District: {locationInfo.district}</p>
                    <p>Timezone: {locationInfo.timezone}</p>

                </div>
            )} */}
        </div>
    );
};

export default Calculator;
