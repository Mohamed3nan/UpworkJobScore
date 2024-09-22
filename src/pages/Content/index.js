// import { printLine } from './modules/print';

// console.log('Content script works!');
// console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");

import { Arrive } from './modules/arrive';
import { helper } from './modules/helper';

console.log('Upwork Rating Extension, Content script running');

document.arrive(
    '[data-test="job-tile-list"] > section.air3-card-section, [data-test="JobsList"] > article.job-tile',
    function (elem) {
        console.log('Job tile created or found (elem)');
        MainFunc([elem]);
    }
);


function MainFunc(jobCards) {
    if (jobCards.length > 0) {
        jobCards.forEach((card, index) => {
            try {
                processJobCard(card);
            } catch (error) {
                console.error('Error processing job card:', error);
            }
        });
    }
}

function hideJobsUnderScore(card, score, threshold) {
    if (score < threshold) {
        // Check if the card is already collapsed to prevent redundant actions
        const isCollapsed = card.classList.contains('section-collapsed');
        if (!isCollapsed) {
            toggleJobDetails(card, true); // Collapse the job card
            console.log('Job card collapsed due to score:', score);
        }
    }
}

function processJobCard(card) {
    var exist = card.querySelector('.UpworkJobScore');
    if (exist) return;

    var scores = {
        proposal: getProposalScore(card),
        experienceLevel: getExperienceLevelScore(card),
        estimatedBudget: getEstimatedBudgetScore(card),
        estimatedTime: getEstimatedTimeScore(card),
        paymentStatus: getPaymentStatusScore(card),
        clientPaid: getClientPaidScore(card),
        clientRating: getClientRatingScore(card),
        jobPosting: getJobPostingScore(card),
        featured: getFeaturedScore(card),
        clientCountry: getClientCountryScore(card)
    };

    var totalScore = 0;
    var count = 0;

    // Calculate total score and count, properly handling negative values
    for (let score of Object.values(scores)) {
        if (score.value !== null) {
            totalScore += score.value;
            count++;
        }
    }

    if (count > 0) {
        var averageScore = (totalScore / count).toFixed(1);
        console.log('Total Score:', averageScore);

        createJobBadge(getBadgeClass(averageScore), card, averageScore,);

        // Add Expand Button
        addExpandButton(card);

        // Get the minimum score from storage and collapse jobs if necessary
        chrome.storage.sync.get(['minScore'], (result) => {
            if (result.minScore !== undefined) {
                const minScoreValue = parseFloat(result.minScore) || 0;
                hideJobsUnderScore(card, parseFloat(averageScore), minScoreValue);
            }
        });
    } else {
        console.warn('No valid scores found for this job card');
    }
}

function getProposalScore(card) {
    var proposals = card.querySelector('strong[data-test="proposals"], [data-test="proposals-tier"] > strong');
    if (!proposals) {
        console.log('Proposals element not found, excluding from score calculation');
        return { value: null };
    }
    var score = helper.getProposalScore(proposals.innerText.trim());
    console.log('ProposalScore', score);
    return { value: parseFloat(score) };
}

function getExperienceLevelScore(card) {
    var experienceLevel = card.querySelector('span[data-test="contractor-tier"], [data-test="experience-level"] > strong');
    if (!experienceLevel) {
        console.log('ExperienceLevel element not found, excluding from score calculation');
        return { value: null };
    }
    var score = helper.getExperienceLevelScore(experienceLevel.innerText.trim());
    console.log('ExperienceLevelScore', score);
    return { value: parseFloat(score) };
}

function getEstimatedBudgetScore(card) {
    var estimatedBudget = card.querySelector('[data-test="budget"]') || card.querySelector('[data-test="is-fixed-price"] > strong:nth-of-type(2)');
    if (!estimatedBudget) {
        console.log('Estimated Budget element not found, excluding from score calculation');
        return { value: null };
    }
    var score = helper.getEstimatedBudgetScore(estimatedBudget.innerText.trim());
    console.log('Estimated Budget Score:', score);
    return { value: parseFloat(score) };
}

function getEstimatedTimeScore(card) {
    var estimatedTime = card.querySelector('[data-test="duration"]') || card.querySelector('[data-test="duration-label"] > strong:nth-of-type(2)');
    if (!estimatedTime) {
        console.log('Estimated Time element not found, excluding from score calculation');
        return { value: null };
    }
    var score = helper.getEstimatedTimeScore(estimatedTime.innerText.trim());
    console.log('Estimated Time Score:', score);
    return { value: parseFloat(score) };
}


function getPaymentStatusScore(card) {
    var status = card.querySelector('[data-test="payment-verification-status"] > strong, [data-test="payment-verified"]');
    if (!status) return { value: null };
    var score = helper.getClientPaymentStatus(status.innerText.trim());
    console.log('PaymentStatusScore', score);
    return { value: parseFloat(score) };
}

function getClientPaidScore(card) {
    var paid = card.querySelector('[data-test="client-spendings"] > strong, [data-test="total-spent"]');
    if (!paid) return { value: null };
    var score = helper.getClientPaid(paid.innerText.trim());
    console.log('ClientPaidScore', score);
    return { value: parseFloat(score) };
}

function getClientRatingScore(card) {
    var rating = card.querySelector("[data-test='js-feedback'], [data-test='total-feedback']");
    if (!rating) return { value: null };
    var score = helper.getClientRating(rating.innerText.replace('Rating is ', '').replace(' out of 5.', '').trim());
    console.log('ClientRatingScore', score);
    return { value: parseFloat(score) };
}

function getJobPostingScore(card) {
    var postingTime = card.querySelector('[data-test="posted-on"], [data-test="job-pubilshed-date"]');
    if (!postingTime) return { value: null };
    var timeText = postingTime.innerText.trim().replace(/^Posted\s*/i, '');
    var score = helper.getJobPostingTime(timeText);
    console.log('JobPostingScore', score);
    return { value: parseFloat(score) };
}

function getFeaturedScore(card) {
    var featuredBadge = card.querySelector('[data-test="featured-badge"]');
    var score;
    if (featuredBadge) {
        score = 10;
        console.log('Job is featured', score);
        return { value: parseFloat(score) }; // You can adjust this value based on how much weight you want to give to featured jobs
    } else {
        console.log('Job is not featured, excluding from score calculation');
        return { value: null };
    }
}


function getClientCountryScore(card) {
    var countryElement = card.querySelector('[data-test="client-country"]') || card.querySelector('[data-test="location"]');
    if (!countryElement) {
        console.log('Client country element not found, excluding from score calculation');
        return { value: null };
    }

    var countryName = countryElement.innerText.trim();
    var score = helper.getClientCountryScore(countryName);

    console.log('Client Country:', countryName);
    console.log('ClientCountryScore:', score);

    return { value: parseFloat(score) };
}



function getBadgeClass(score) {
    if (score >= 7.0) return 'badge-green';
    if (score >= 5.0 && score < 7.0) return 'badge-light-green';
    if (score >= 3.0 && score < 5.0) return 'badge-yellow';
    if (score < 3.0) return 'badge-red';
    return 'badge-default';
}

function createJobBadge(className, card, score) {
    console.log(card?.querySelector('.job-tile-title')?.innerText);

    const targetDiv = card.querySelector('[class="job-tile-actions"], [data-test="JobTileActions"]');
    const div = document.createElement('div');
    div.className = 'UpworkJobScore';

    div.innerHTML = `<h3 class="${className}">${score}</h3>`;

    if (targetDiv) {
        targetDiv.insertBefore(div, targetDiv.firstChild);
    } else {
        card.appendChild(div);
    }
}

// Function to add the expand/collapse button
function addExpandButton(card) {
    // Check if the expand button already exists to prevent duplicates
    if (card.querySelector('[data-test="collapse-toggle"]')) {
        return; // Button already exists
    }

    const expandButtonHTML = `
        <button type="button" aria-expanded="true" data-test="collapse-toggle" class="air3-collapse-toggle" style="border: 0;background: none;">
            <div class="air3-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" role="img">
                    <path vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6 15l6-5 6 5"></path>
                </svg>
            </div>
        </button>
    `;

    const targetDiv = card.querySelector('[class="job-tile-actions"], [data-test="JobTileActions"]');
    if (targetDiv) {
        targetDiv.insertAdjacentHTML('beforeend', expandButtonHTML);
    } else {
        // If the target div is not found, append the button to the card
        card.insertAdjacentHTML('beforeend', expandButtonHTML);
    }

    // Add event listener to the newly added expand button
    const expandButton = card.querySelector('[data-test="collapse-toggle"]');
    if (expandButton) {
        expandButton.addEventListener('click', () => {
            const isExpanded = expandButton.getAttribute('aria-expanded') === 'true';
            expandButton.setAttribute('aria-expanded', !isExpanded);
            toggleJobDetails(card, isExpanded);
        });
    }

    // Since default is open, no need to hide sections initially
}

// Function to toggle job details visibility
function toggleJobDetails(section, collapse) {
    console.log(`Toggling job details. Collapse: ${collapse}`);

    // Select all direct child divs of the section
    const childDivs = Array.from(section.children);

    childDivs.forEach((div, index) => {
        if (index > 0) { // Keep the first div visible
            div.style.display = collapse ? 'none' : 'block';
            console.log(`Div ${index} display set to ${collapse ? 'none' : 'block'}`);
        }
    });

    // Rotate the expand/collapse icon for visual indication
    const expandButtonIcon = section.querySelector('[data-test="collapse-toggle"] .air3-icon');
    if (expandButtonIcon) {
        expandButtonIcon.style.transform = collapse ? 'rotate(180deg)' : 'rotate(0deg)';
        expandButtonIcon.style.transition = 'transform 0.3s ease';
        console.log('Icon rotated:', collapse ? '180deg' : '0deg');
    }

    // Toggle a CSS class to reflect the collapsed state
    if (collapse) {
        section.classList.add('section-collapsed');
    } else {
        section.classList.remove('section-collapsed');
    }

    console.log(collapse ? 'Job card collapsed' : 'Job card expanded');
}