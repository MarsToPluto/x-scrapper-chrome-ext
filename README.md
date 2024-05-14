### x-scrapper-chrome-ext

#### Overview
x-scrapper-chrome-ext is a Chrome extension designed for web scraping tasks. It provides a convenient interface for extracting data from web pages and saving it for further analysis or processing. Whether you're a developer, researcher, or data enthusiast, this extension simplifies the process of gathering information from websites.


#### Installation
1. Clone or download the repository: [x-scrapper-chrome-ext](https://github.com/MarsToPluto/x-scrapper-chrome-ext).
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned/downloaded the extension.
5. The extension should now be installed and ready to use.
6. Navigate to the API folder, install MongoDB, and update the `mongoURI` variable in the `app.js` file. Start the server by running `node app.js` from inside that folder using the command prompt.

After starting the server, you'll see the following message on your API server:

```
************************************************
*        🚀 API Server is now running 🚀       *
************************************************
```
Now you're ready to start scraping!

#### Usage
1. Visit the webpage from which you want to scrape data, for example, `example.com/home`.
2. The extension will automatically scroll the page like a human, but at high speed. Check your MongoDB database for scraped data in the "X" collection.

Happy scraping! Let me know if you need further assistance.


#### Contribution
Contributions to x-scrapper-chrome-ext are welcome! If you have any ideas for improvements, feature requests, or bug reports, feel free to open an issue or submit a pull request on GitHub.

#### License
This project is licensed under the [MIT License](https://github.com/MarsToPluto/x-scrapper-chrome-ext/blob/main/LICENSE).

#### Contact
For any inquiries or support, please contact the project maintainer: [MarsToPluto](https://github.com/MarsToPluto).

---

Feel free to expand or modify this README to better suit your project's specifics!
