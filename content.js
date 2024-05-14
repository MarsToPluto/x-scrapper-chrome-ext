// Array to store the unique visible elements
const visibleElements = [];
const visibleElementHashes = [];
let AUTO_SCROLL = true
const ENDPOINT = `http://localhost:3000/api/data`
let lastAPIHittedAt = null
function removeAllContent() {
    document.body.innerHTML = ''; // Remove all existing content from the body
}

function appendWarningTimer() {
    const warningTimer = document.createElement('div'); // Create a new div element
    warningTimer.textContent = `This page will reload in 5 seconds because Twitter API limits have been reached.`;
    let secondsLeft = 30; // Initial value for the timer

    // Apply CSS styles directly using JavaScript
    warningTimer.style.position = 'fixed';
    warningTimer.style.top = '20px';
    warningTimer.style.left = '50%';
    warningTimer.style.transform = 'translateX(-50%)';
    warningTimer.style.padding = '10px';
    warningTimer.style.backgroundColor = '#ffcccc';
    warningTimer.style.color = '#ff0000';
    warningTimer.style.border = '2px solid #ff0000';
    warningTimer.style.borderRadius = '5px';
    warningTimer.style.fontFamily = 'Arial, sans-serif';
    warningTimer.style.fontSize = '16px';
    warningTimer.style.fontWeight = 'bold';

    // Update the timer every second
    const countdownInterval = setInterval(() => {
        warningTimer.textContent = `This page will reload in ${secondsLeft} seconds because Twitter API limits have been reached.`;

        // If the countdown is complete, reload the page
        if (secondsLeft < 0) {
            clearInterval(countdownInterval); // Clear the interval
            window.location.reload(); // Reload the page
        }
        secondsLeft--; // Decrement seconds left
    }, 1000);

    document.body.appendChild(warningTimer); // Append the warning timer to the body
}
function reloadPage() {
    const oneMinuteAgo = Date.now() - (60 * 1000)
    if ((lastAPIHittedAt && lastAPIHittedAt < oneMinuteAgo)) {
        AUTO_SCROLL=false
        removeAllContent()
        appendWarningTimer();
    }
}
async function sendDataToServer(dataToSend)
{
    try
    {
        const lastAPIHittedAt = Date.now();
        const response = await fetch(ENDPOINT,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        if (!response.ok)
        {
          return console.log('Data failed to insert!!!!!!!!!!!!!!!');
        }
        const responseData = await response.json();
        console.log('Data inserted successfully');
    }
    catch (error)
    {
        console.log('Error:', error.message);
    }
}
// Call the function to send data
function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function autoScroll()
{
    // Calculate the amount to scroll
    const scrollAmount = getRandomInt(50, 1666); // Adjust the range as needed
    // Scroll the page
    isTwitterDomain(window.location.href) && window.scrollBy(0, scrollAmount);
    // Calculate a random delay before the next scroll
    const delay = getRandomInt(100, 1000); // Adjust the range as needed
    // Schedule the next scroll
    setTimeout(autoScroll, delay);
}
// Start the auto-scrolling process
// Function to check if the provided SVG element exists within a div
function isVerified(divElement)
{
    // Create a temporary SVG element with the same attributes as the provided SVG
    return divElement?.querySelector(`svg[aria-label="Verified account"]`) !== null
}

function extractTweetInfo(arr)
{
    try
    {
        let tweetInfo = {};
        if (arr.length < 4 || arr[2] !== "status" || isNaN(arr[3]))
        {
            return null;
        }
        const username = arr[1];
        if (!username.match(/^[a-zA-Z0-9_]*$/))
        {
            return null;
        }
        tweetInfo.username = username;
        tweetInfo.tweetId = arr[3];
        return tweetInfo;
    }
    catch (e)
    {
        console.log(e);
    }
}

function getTweetStats(divElement)
{
    try
    {
        const infos = [...divElement.querySelectorAll('div[role="group"]>div')].map(e => e.textContent || null)
        if (infos.length)
        {
            return {
                replies: infos[0] || null,
                retweets: infos[1] || null,
                likes: infos[2] || null,
                impressions: infos[3] || null
            }
        }
    }
    catch (e)
    {
        console.log(e);
    }
    return {
        replies: null,
        retweets: null,
        likes: null,
        impressions: null
    }
}

function extractTweetData(divElement)
{
    try
    {
        const name = divElement.querySelector('div>a>div>div>span>span')?.textContent || null;
        const userName = divElement.querySelector('span[class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3"]')?.textContent || null;
        const tweet = divElement.querySelector('[data-testid="tweet"]') || null;
        const tweetText = tweet?.querySelector('[data-testid="tweetText"]')?.textContent || null;
        const impressions = divElement.querySelector('div[class="css-175oi2r"]>div>div>a')?.textContent || null
        const rawLink = [...divElement.querySelectorAll('div[class="css-175oi2r"]>div>div>a')]
        let stress = rawLink.map(e => e?.href || null)
        const avatar = divElement.querySelector('div[data-testid="Tweet-User-Avatar"] img')?.src || null
        if (stress?.length)
        {
            // console.log({stress});
            stress = stress.filter(e => e && e.includes('/analytics')).map(e =>
            {
                if (e)
                {
                    const splitted = e.split('/')
                    if (splitted && splitted[splitted.length - 1] === 'analytics')
                    {
                        return {
                            rawLink: e,
                            tweetID: splitted[splitted?.length - 2],
                            username: splitted[3],
                            visitLink: e.replace("/analytics", ""),
                            avatar
                        }
                    }
                }
                return {}
            }).filter(e => e)[0];
        }
        // console.log('========================================');
        const timestamp = tweet?.querySelector('[datetime]')?.getAttribute('datetime');
        const image = tweet?.querySelector('[data-testid="tweetPhoto"]') ? tweet?.querySelector('[data-testid="tweetPhoto"]')?.getAttribute('src') : null;
        const postImages = [...divElement.querySelectorAll('div>div>div>div>img')].map(e=>e.src).filter(e=>e)
        return {
            name,
            tweetText,
            extras: stress,
            timestamp,
            image,
            isVerified: isVerified(divElement),
            stats: getTweetStats(divElement),
            postImages
        }
    }
    catch (e)
    {
        // statements
        console.log(e, divElement);
    }
    return {};
}
// Function to generate a hash of an element's attributes
async function generateHash(elem)
{
    const attributes = elem.attributes;
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(attributes)));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
// Function to check if an element is currently visible on the screen
function isElementVisible(elem)
{
    const rect = elem.getBoundingClientRect();
    return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
// Function to handle the scroll event
async function handleScroll()
{
    try
    {
        // Select all the specific elements you want to check
        const elements = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
        // Iterate over the selected elements
        for (const elem of elements)
        {
            if (isElementVisible(elem) && !visibleElements.includes(elem))
            {
                // Push the hash of the element into the array
                visibleElements.push(elem);
                const extracted = extractTweetData(elem)
                if (extracted?.tweetText && extracted?.extras?.tweetID) {
                  
                  sendDataToServer(extracted);
                  return console.log(
                  {
                      tweet: extracted,
                      isVerified: isVerified(elem)
                  });
                }
                console.log({message:"TweetID not found",extracted});
            }
        }
    }
    catch (error)
    {
        console.error('Error handling scroll:', error);
    }
}

function isTwitterDomain(url)
{
    return url.includes("twitter.com");
}
window.addEventListener('scroll', handleScroll);
if (isTwitterDomain(window.location.href))
{
    AUTO_SCROLL && autoScroll(); // Call autoScroll() if on twitter.com
    setInterval(reloadPage, 60000);//if theres no scrapping from last min then reload the page/// for stuck and also stop the scrolling
}
