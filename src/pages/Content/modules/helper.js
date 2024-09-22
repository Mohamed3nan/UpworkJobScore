import countries from 'world-countries';

export const helper = {

    getClientPaymentStatus: (job) => {
        if (job.includes('Payment verified')) {
            return 10;
        } else {
            return -10;
        }
    },
    getProposalScore: (proposal) => {
        const lowerProposal = proposal.toLowerCase().trim();

        const scoreMap = {
            'less than 5': 10,
            '5 to 10': 9,
            '10 to 15': 8,
            '15 to 20': 7,
            '20 to 50': 5,
            '50+': 2
        };

        return scoreMap[lowerProposal];
    },

    getExperienceLevelScore: (experience) => {
        const lowerExperience = experience.toLowerCase().trim();

        const scoreMap = {
            'expert': 10,
            'intermediate': 7.5,
            'entry level': 5
        };

        return scoreMap[lowerExperience];
    },

    getEstimatedBudgetScore: (budgetString) => {
        try {
            // Extract the numeric part from the string
            const match = budgetString.match(/\$?([\d,]+(?:\.\d{2})?)/);
            if (!match) {
                console.log(`Unable to parse budget: ${budgetString}`);
                return 0;
            }

            // Convert the matched string to a number
            const amount = parseFloat(match[1].replace(/,/g, ''));

            // Early return for invalid or negative amounts
            if (isNaN(amount) || amount < 0) {
                console.log(`Invalid budget amount: ${budgetString}`);
                return 0;
            }

            // Define budget categories and their corresponding scores
            const categories = [
                { threshold: 25, score: 1 },    // $0 - $25
                { threshold: 50, score: 3 },    // $26 - $50
                { threshold: 100, score: 5 },   // $51 - $100
                { threshold: 500, score: 7 },   // $101 - $500
                { threshold: 1000, score: 9 },  // $501 - $1,000
                { threshold: Infinity, score: 10 } // $1001+ (Infinity represents amounts greater than $1000)
            ];

            // Find and return the appropriate score
            return categories.find(category => amount <= category.threshold).score;

        } catch (error) {
            console.error(`Error processing estimated budget: ${budgetString}`, error);
            return 0; // Return 0 or another default value for error cases
        }
    },


    getEstimatedTimeScore: (timeString) => {
        const lowerTimeString = timeString.toLowerCase().trim();

        let durationScore = 0;
        let hoursScore = 0;

        // Check for duration
        if (lowerTimeString.includes('less than 1 month')) durationScore = 0;
        else if (lowerTimeString.includes('1 to 3 months')) durationScore = 1;
        else if (lowerTimeString.includes('3 to 6 months')) durationScore = 2;
        else if (lowerTimeString.includes('more than 6 months')) durationScore = 3;

        // Check for hours
        if (lowerTimeString.includes('less than 30 hrs/week')) hoursScore = 1;
        else if (lowerTimeString.includes('30+ hrs/week')) hoursScore = 2;
        else if (lowerTimeString.includes('not sure')) hoursScore = 0;
        else if (lowerTimeString.includes('hours to be determined')) hoursScore = 0;

        // Combine scores and normalize to 0-10 scale
        const totalScore = ((durationScore + hoursScore) / 7) * 10;

        return Math.min(10, Math.max(0, totalScore));
    },


    getClientRating: (rating) => {
        const parsedRating = parseFloat(rating);
        if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
            return (parsedRating * 2);
        }
        console.log(`Invalid rating: ${rating}`);
        return 0;
    },

    getClientPaid: (paid) => {
        try {
            paid = paid.replace(/[+$]/g, '').toLowerCase();
            let amount = parseFloat(paid);

            if (paid.includes('k')) amount *= 1000;
            if (paid.includes('m')) amount *= 1000000;


            if (amount === 0) return - 5; // Special case for \$0
            const thresholds = [0, 500, 1000, 2500, 5000, 10000, 50000, 100000, 500000, 1000000];
            const index = thresholds.findIndex(threshold => amount < threshold);
            return index === -1 ? thresholds.length : index;
        } catch (error) {
            console.error(`Error processing paid amount: ${paid}`, error);
            return 0;
        }
    },


    getJobPostingTime: (time) => {
        // Normalize the input
        time = time.toLowerCase().trim();

        // Handle special cases
        const specialCases = {
            'yesterday': 2,
            'last week': 0,
            '2 weeks ago': 0,
            'last month': 0,
            '2 months ago': 0,
            'last quarter': 0,
            '2 quarters ago': 0,
            '3 quarters ago': 0,
            'last year': 0,
            '2 years ago': 0,
        };

        if (time in specialCases) {
            return specialCases[time];
        }

        // Handle "X seconds/minutes/hours/days/months ago" format
        const timeMatch = time.match(/(\d+)\s*(second|minute|hour|day|month|year)s?\s*ago/);
        if (timeMatch) {
            let [, value, unit] = timeMatch;
            value = parseInt(value);

            const unitMultipliers = {
                second: 1,
                minute: 60,
                hour: 3600,
                day: 86400,
                month: 2592000,
                year: 31536000
            };

            const seconds = value * (unitMultipliers[unit] || 0);

            if (seconds < 900) return 10; // Less than 15 minutes ago
            if (seconds < 1800) return 9; // Less than 30 minutes ago
            if (seconds < 3600) return 8; // Less than an hour ago
            if (seconds < 7200) return 7; // Less than 2 hours ago
            if (seconds < 14400) return 6; // Less than 4 hours ago
            if (seconds < 21600) return 5; // Less than 6 hours ago
            if (seconds < 43200) return 4; // Less than 12 hours ago
            if (seconds < 86400) return 3; // Less than a day ago
            // return 0; // More than a day ago
        }

        console.log(`Unrecognized time format: ${time}`);
        return 0; // Default score for unrecognized formats
    },


    getClientCountryScore: function (countryName) {
        const lowerCountryName = countryName.toLowerCase().trim();

        const country = countries.find(c =>
            c.name.common.toLowerCase() === lowerCountryName ||
            c.cca3.toLowerCase() === lowerCountryName
        );

        let region = country ? country.region : 'Other';

        // Special cases handling
        const specialCases = {
            'palestinian territories': 'Asia',
            'palestine': 'Asia'
        };

        if (specialCases[lowerCountryName]) {
            region = specialCases[lowerCountryName];
            console.log(`Special case: ${countryName} mapped to ${region}`);
        }

        console.log('Region:', region);

        const regionScores = {
            'Americas': 8,
            'Europe': 10,
            'Oceania': 10,
            'Asia': 6,
            'Africa': 5,
            'Other': 5
        };

        return regionScores[region] || regionScores['Other'];
    },


};
