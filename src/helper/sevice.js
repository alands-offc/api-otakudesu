const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');

async function fetchProxies() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/protocols/socks5/data.json');
    return response.data;
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

  // Select a random proxy from the list
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  const proxy = `socks5://${randomProxy.ip}:${randomProxy.port}`;

  console.log(`Using proxy: ${proxy}`);

  const agent = new SocksProxyAgent(proxy);

  try {
    const result = await axios.get(url, { 
      httpAgent: agent, 
      headers: {
        'Cookie': '_ga=GA1.2.1714932629.1729306364; _gid=GA1.2.94538758.1729306364; _gat=1; _ga_025LZFQCB2=GS1.2.1729306365.1.1.1729309347.0.0.0'
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
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(new Error(`Error: Status code ${response.status}`));
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
