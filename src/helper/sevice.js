const cloudscraper = require('cloudscraper');
const { SocksProxyAgent } = require('socks-proxy-agent');

async function fetchProxies() {
  try {
    const response = await cloudscraper.get('https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/protocols/socks5/data.json');
    return JSON.parse(response);
  } catch (error) {
    console.error('Error fetching proxy list:', error);
    return [];
  }
}

async function fetchDataUsingProxy(url) {
  const proxies = await fetchProxies();

  if (proxies.length === 0) {
    console.log('No proxies available.');
    return;
  }

  // Pick a random proxy from the list
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  const proxy = `socks5://${randomProxy.ip}:${randomProxy.port}`;

  console.log(`Using proxy: ${proxy}`);

  const agent = new SocksProxyAgent(proxy);

  try {
    const result = await cloudscraper.get({
      url,
      agent: agent,
      headers: {
        'Cookie': '_ga=GA1.2.1714932629.1729306364; _gid=GA1.2.94538758.1729306364',
      }
    });
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const Service = {
  fetchService: async (url, res) => {
    try {
      const response = await fetchDataUsingProxy(url);
      return new Promise((resolve, reject) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error('No response from server'));
        }
      });
    } catch (error) {
      res.json({
        status: false,
        code: 404,
        message: "Bad Request",
        error: error.message
      });
      throw error;
    }
  }
};

module.exports = Service;
