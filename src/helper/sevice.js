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

  // Ambil proxy acak dari daftar
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
  const proxy = randomProxy.proxy;

  console.log(`Using proxy: ${proxy}`);

  const agent = new SocksProxyAgent(proxy);

  try {
    const result = await axios.get(url, { httpAgent: agent });
    return result
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Ganti dengan URL target yang ingin diakses
const Service = {
    fetchService: async (url, res) => {
        try {
            const response = await fetchDataUsingProxy(url)
            return new Promise((resolve, reject) => {
                if (response.status === 200) resolve(response)
                reject(response)
            })
        } catch (error) {
            res.json({
                status: false,
                code: 404,
                message: "Bad Request",
                error
            })
            throw error
        }
    }
}

module.exports = Service
